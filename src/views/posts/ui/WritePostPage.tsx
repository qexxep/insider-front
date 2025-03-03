'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// 여기서 import 하는게 맞는 것인가..?
import type { CategoryItem } from '@/app/(app)/@sidebar/api/category';
import { useCategories } from '@/app/(app)/@sidebar/hooks/useCategories';
import { useToast } from '@/shared/hooks';
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from '@/shared/ui';

import { useWrite } from '../hooks/useWrite';
interface UploadedImage {
  url: string;
  file: File;
}

export function WritePostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // 클라이언트에서 이중으로 토큰 체크
  useEffect(() => {
    const token = document.cookie.match(/access_token=([^;]+)/);
    const showLoginRequired = searchParams.get('showLoginRequired') === 'true';

    if (!token || showLoginRequired) {
      toast({
        variant: 'destructive',
        title: '접근 제한',
        description: '로그인이 필요한 작업입니다.',
        duration: 2000,
      });

      if (!token) {
        router.push('/');
      }
    }
  }, [router, toast, searchParams]);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [postSeq, setPostSeq] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const { data, isLoading, error } = useCategories();
  const { createPostMutation, uploadFileMutation } = useWrite();

  // 모든 카테고리 그룹의 카테고리들을 하나의 배열로 평탄화
  const allCategories =
    data?.data?.reduce<CategoryItem[]>((acc, group) => {
      return [...acc, ...group.categoryList];
    }, []) || [];

  // 카테고리 선택시 최초 게시글 생성
  const handleCategorySelect = async (value: string) => {
    setSelectedCategory(value);

    if (!postSeq) {
      try {
        const result = await createPostMutation.mutateAsync({ categoryCd: value });
        if (result.status === 'SUCCESS') {
          setPostSeq(result.data.postSeq);
        }
      } catch (error) {
        console.error('게시글 생성 실패:', error);
        toast({
          variant: 'destructive',
          title: '게시글 생성 실패',
          description: '게시글을 생성하는데 실패했습니다. 다시 시도해주세요.',
          duration: 2000,
        });
      }
    }
  };

  // 파일 검증
  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast({
        variant: 'destructive',
        title: '파일 형식 오류',
        description: 'JPG, JPEG, PNG, GIF 형식의 이미지만 업로드 가능합니다.',
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        variant: 'destructive',
        title: '파일 크기 초과',
        description: '파일 크기는 10MB를 초과할 수 없습니다.',
      });
      return false;
    }

    return true;
  };

  // 파일 업로드 처리
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const file = files[0];
    console.log('Selected file:', file);
    console.log('File type:', file.type);
    console.log('File size:', file.size);

    if (!validateFile(file)) return;

    try {
      // FormData를 여기서 직접 생성
      const formData = new FormData();
      formData.append('request', JSON.stringify({ postSeq }));
      formData.append('file', file);
      // FileUploadRequest 타입에 맞게 데이터 전달
      const result = await uploadFileMutation.mutateAsync({
        postSeq,
        file,
      });

      if (result.status === 'SUCCESS') {
        setUploadedImages(prev => [
          ...prev,
          {
            url: result.data.url,
            file,
          },
        ]);
      }
    } catch (error) {
      console.error('업로드 실패:', error);
      toast({
        variant: 'destructive',
        title: '업로드 실패',
        description: '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
        duration: 2000,
      });
    }

    event.target.value = '';
  };

  return (
    <div className="mx-auto w-[1200px] p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">글쓰기</h1>
        <div className="flex gap-2">
          <Label
            className="text-md flex cursor-pointer items-center justify-center rounded-md border border-[#636571] bg-white px-3 py-2 font-medium text-black hover:bg-gray-300"
            role="button"
          >
            <span>사진 등록</span>
            <Input type="file" accept=".jpg,.jpeg,.png,.gif" onChange={handleFileUpload} className="hidden" />
          </Label>
          <Button className="border border-[#636571] bg-white px-3 text-black hover:bg-gray-300">투표 추가</Button>
          <Button className="bg-[#d4d4d4] px-6 text-white hover:bg-[#242424]">게시물 등록</Button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {/* 게시판 선택 */}
        <Select value={selectedCategory} onValueChange={handleCategorySelect}>
          <SelectTrigger className="focus:ring-ring">
            <SelectValue placeholder={isLoading ? '카테고리 로딩 중...' : '게시판을 선택해주세요'} />
          </SelectTrigger>
          <SelectContent>
            {error ? (
              <SelectItem value="error" disabled>
                카테고리를 불러오는 중 오류가 발생했습니다
              </SelectItem>
            ) : isLoading ? (
              <SelectItem value="loading" disabled>
                로딩 중...
              </SelectItem>
            ) : allCategories.length === 0 ? (
              <SelectItem value="empty" disabled>
                사용 가능한 카테고리가 없습니다
              </SelectItem>
            ) : (
              allCategories.map(category => (
                <SelectItem key={category.categoryCode} value={category.categoryCode} className="text-md h-14">
                  {category.categoryName}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {/* 제목 입력 */}
        <Input type="text" placeholder="제목을 입력해주세요" />

        {/* 내용과 태그 입력 */}
        <Card className="relative">
          <CardContent className="p-0">
            <Textarea
              placeholder="내용을 입력해주세요"
              className="min-h-[400px] resize-none border-0 p-4 focus-visible:ring-0"
            />
            <Separator className="mx-auto my-0 w-[95%]" />
            <div className="px-4 py-2">
              <Input
                type="text"
                placeholder="# 태그를 입력해주세요 (최대 5개)"
                className="border-0 focus-visible:ring-0"
              />
            </div>
          </CardContent>
        </Card>

        {/* 첨부한 이미지 미리보기 */}
        <div className="flex flex-wrap gap-3 rounded-md bg-gray-100 px-10 py-8">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative h-24 w-24">
              <Image src={image.url} alt={`업로드된 이미지 ${index + 1}`} fill className="rounded-md object-cover" />
              <Button
                onClick={() => {
                  setUploadedImages(prev => prev.filter((_, i) => i !== index));
                }}
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 p-0 text-white hover:bg-red-600"
              >
                ×
              </Button>
            </div>
          ))}
          {uploadedImages.length < 4 && (
            <label
              className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400"
              role="button"
            >
              <span>+</span>
              <Input type="file" accept=".jpg,.jpeg,.png,.gif" onChange={handleFileUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* 카테고리 로딩/에러 상태 표시 */}
        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4 text-red-600">
            카테고리를 불러오는 중 오류가 발생했습니다. 페이지를 새로고침 해주세요.
          </div>
        )}
      </div>
    </div>
  );
}
