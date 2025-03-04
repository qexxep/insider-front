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
  CardHeader,
  CardTitle,
  Icons,
  Input,
  Label,
  Separator,
  Textarea,
} from '@/shared/ui';

import { SavePostRequest, useWrite } from '../hooks/useWrite';
import { CategorySelect } from './CategorySelect';

interface UploadedImage {
  url: string;
  file: File;
  fileSeq: string;
}

// 투표 항목 인터페이스 추가
interface VoteOption {
  id: number;
  content: string;
}

interface VoteForm {
  title: string;
  options: VoteOption[];
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
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { data, isLoading, error } = useCategories();
  const { createPostMutation, uploadFileMutation, deleteFileMutation, savePostMutation } = useWrite();

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
      const result = await uploadFileMutation.mutateAsync({
        postSeq,
        file,
      });

      if (result.status === 'SUCCESS') {
        // /api를 제외한 URL 생성
        const fullFileUrl = `${process.env.NEXT_PUBLIC_BASE_URL!.replace('/api', '')}${result.data.fileUrl}`;

        setUploadedImages(prev => [
          ...prev,
          {
            url: fullFileUrl,
            file,
            fileSeq: result.data.fileSeq,
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

  // 투표 관련 상태 추가
  const [showVoteForm, setShowVoteForm] = useState(false);
  const [voteForm, setVoteForm] = useState<VoteForm>({
    title: '',
    options: [
      { id: 1, content: '' },
      { id: 2, content: '' },
    ],
  });

  const handleVoteOptionChange = (id: number, content: string) => {
    setVoteForm(prev => ({
      ...prev,
      options: prev.options.map(option => (option.id === id ? { ...option, content } : option)),
    }));
  };

  const handleVoteTitleChange = (title: string) => {
    setVoteForm(prev => ({
      ...prev,
      title,
    }));
  };

  const handleAddVoteOption = () => {
    if (voteForm.options.length >= 5) {
      toast({
        variant: 'destructive',
        title: '투표 옵션 제한',
        description: '투표 옵션은 최대 5개까지만 추가할 수 있습니다.',
        duration: 2000,
      });
      return;
    }

    const newId = Math.max(...voteForm.options.map(opt => opt.id)) + 1;
    setVoteForm(prev => ({
      ...prev,
      options: [...prev.options, { id: newId, content: '' }],
    }));
  };

  const handleRemoveVoteOption = (id: number) => {
    if (voteForm.options.length > 2) {
      setVoteForm(prev => ({
        ...prev,
        options: prev.options.filter(option => option.id !== id),
      }));
    }
  };

  // 태그 추가/수정 핸들러
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글 입력 중일 때는 처리하지 않음 (한글 입력시 Key Event 중복 발생)
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();

      const newTag = currentTag.trim();
      if (newTag.length > 10) {
        toast({
          variant: 'destructive',
          title: '태그 길이 초과',
          description: '태그는 10자를 초과할 수 없습니다.',
        });
        return;
      }

      // 수정 모드일 경우
      if (editingTagIndex !== null) {
        if (tags.some((tag, idx) => tag === newTag && idx !== editingTagIndex)) {
          toast({
            variant: 'destructive',
            title: '중복된 태그',
            description: '이미 존재하는 태그입니다.',
          });
          return;
        }

        setTags(prev => prev.map((tag, idx) => (idx === editingTagIndex ? newTag : tag)));
        setEditingTagIndex(null);
      }
      // 새 태그 추가
      else {
        if (tags.includes(newTag)) {
          toast({
            variant: 'destructive',
            title: '중복된 태그',
            description: '이미 존재하는 태그입니다.',
            duration: 2000,
          });
          return;
        }

        setTags(prev => [...prev, newTag]);
      }
      setCurrentTag('');
    } else if (e.key === 'Escape') {
      // ESC 키로 수정 모드 취소
      setEditingTagIndex(null);
      setCurrentTag('');
    }
  };

  // 태그 수정 시작
  const handleTagEdit = (index: number) => {
    setEditingTagIndex(index);
    setCurrentTag(tags[index]);
  };

  // 태그 삭제
  const handleRemoveTag = (index: number) => {
    setTags(prev => prev.filter((_, idx) => idx !== index));
    if (editingTagIndex === index) {
      setEditingTagIndex(null);
      setCurrentTag('');
    }
  };

  // 게시물 등록 핸들러
  const handleSubmitPost = async () => {
    if (!postSeq) {
      toast({
        variant: 'destructive',
        title: '게시판 선택 필요',
        description: '게시판을 선택해주세요.',
      });
      return;
    }

    if (!title.trim()) {
      toast({
        variant: 'destructive',
        title: '제목 입력 필요',
        description: '제목을 입력해주세요.',
      });
      return;
    }

    if (!content.trim()) {
      toast({
        variant: 'destructive',
        title: '내용 입력 필요',
        description: '내용을 입력해주세요.',
      });
      return;
    }

    try {
      const postData: SavePostRequest = {
        postSeq,
        postTitle: title.trim(),
        content: content.trim(),
        postTag: tags.length > 0 ? tags.map(tag => `#${tag}`).join('') : '',
        isVote: showVoteForm ? 1 : 0,
      };

      // 투표 폼이 있는 경우 투표 관련 데이터 추가
      if (showVoteForm) {
        if (!voteForm.title.trim()) {
          toast({
            variant: 'destructive',
            title: '투표 제목 입력 필요',
            description: '투표 제목을 입력해주세요.',
            duration: 2000,
          });
          return;
        }

        const hasEmptyOptions = voteForm.options.some(option => !option.content.trim());
        if (hasEmptyOptions) {
          toast({
            variant: 'destructive',
            title: '투표 항목 입력 필요',
            description: '모든 투표 항목을 입력해주세요.',
            duration: 2000,
          });
          return;
        }

        postData.voteTitle = voteForm.title.trim();
        postData.voteItems = voteForm.options.map(option => option.content.trim());
      }

      // 1. 게시물 저장
      await savePostMutation.mutateAsync(postData);

      // 2. 현재 업로드된 이미지들의 fileSeq 목록
      const currentFileSeqs = new Set(uploadedImages.map(img => img.fileSeq));

      // 3. 이전에 업로드됐지만 현재는 삭제된 이미지들의 fileSeq에 대해 삭제 요청
      const deletePromises = uploadedImages
        .filter(img => !currentFileSeqs.has(img.fileSeq))
        .map(img =>
          deleteFileMutation.mutateAsync({
            postSeq,
            fileSeq: img.fileSeq,
          })
        );

      // 4. 모든 파일 삭제 요청 완료 대기
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
      }

      // 성공 토스트 메시지 표시
      toast({
        title: '게시글 등록 성공',
        description: '게시글이 성공적으로 등록되었습니다.',
        duration: 1500,
      });

      setTimeout(() => {
        router.push(`/posts/${selectedCategory}`);
      }, 500);
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      // 실패 시 토스트 메시지
      toast({
        variant: 'destructive',
        title: '게시글 등록 실패',
        description: '게시글 등록에 실패했습니다. 다시 시도해주세요.',
        duration: 2000,
      });
    }
  };

  console.log(allCategories.map(category => category.categoryName).filter(name => name === selectedCategory));
  return (
    <div className="mx-auto w-[960px] p-6">
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
          <Button
            className="border border-[#636571] bg-white px-3 text-black hover:bg-gray-300 disabled:cursor-not-allowed disabled:border-none disabled:border-gray-400 disabled:bg-gray-200 disabled:text-white"
            onClick={() => setShowVoteForm(true)}
            disabled={showVoteForm}
          >
            투표 추가
          </Button>
          <Button
            className="bg-[#242424] px-6 text-white transition-colors hover:bg-[#3d3d3d] disabled:bg-[#d4d4d4]"
            onClick={handleSubmitPost}
            disabled={savePostMutation.isPending}
          >
            {savePostMutation.isPending ? '등록 중...' : '게시물 등록'}
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <CategorySelect
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          isLoading={isLoading}
          error={error}
          categories={allCategories}
        />

        {/* 제목 입력 */}
        <Input type="text" placeholder="제목을 입력해주세요" value={title} onChange={e => setTitle(e.target.value)} />

        {/* 내용과 태그 입력 */}
        <Card className="relative">
          <CardContent className="p-0">
            <Textarea
              placeholder="내용을 입력해주세요"
              className="min-h-[400px] resize-none border-0 p-4 focus-visible:ring-0"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <Separator className="mx-auto my-0 w-[95%]" />
            <div className="flex flex-wrap items-center gap-2 px-4 py-2">
              {tags.map((tag, index) =>
                editingTagIndex === index ? (
                  <Input
                    key={`editing-${tag}`}
                    type="text"
                    value={currentTag}
                    onChange={e => setCurrentTag(e.target.value.replace(/^#/, ''))}
                    onKeyDown={handleTagInput}
                    onBlur={() => {
                      setEditingTagIndex(null);
                      setCurrentTag('');
                    }}
                    autoFocus
                    className="!ml-0 !w-auto min-w-[100px] flex-1 border-0 focus-visible:ring-0"
                  />
                ) : (
                  <div
                    key={`${tag}-${index}`}
                    className="group flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1"
                  >
                    <span
                      className="cursor-pointer text-sm text-gray-700 hover:text-gray-900"
                      onClick={() => handleTagEdit(index)}
                    >
                      #{tag}
                    </span>
                    <Button
                      onClick={() => handleRemoveTag(index)}
                      variant="ghost"
                      className="h-4 w-4 rounded-full p-0 hover:bg-gray-200"
                    >
                      <Icons.cancel width={12} height={12} />
                    </Button>
                  </div>
                )
              )}
              {tags.length < 5 && editingTagIndex === null && (
                <Input
                  type="text"
                  value={currentTag}
                  onChange={e => setCurrentTag(e.target.value.replace(/^#/, ''))}
                  onKeyDown={handleTagInput}
                  placeholder={tags.length === 0 ? '# 태그를 입력해주세요 (최대 5개)' : '새 태그 입력'}
                  className="!ml-0 !w-auto flex-1 border-0 focus-visible:ring-0"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* 첨부한 이미지 미리보기 */}
        {uploadedImages.length > 0 && (
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
                  <Icons.cancel width={24} height={24} />
                </Button>
              </div>
            ))}
            {uploadedImages.length < 4 && (
              <label
                className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400"
                role="button"
              >
                <Icons.plus width={24} height={24} />
                <Input type="file" accept=".jpg,.jpeg,.png,.gif" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>
        )}

        {/* 투표 폼 */}
        {showVoteForm && (
          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-semibold">토론 투표 게시물 작성</CardTitle>
              <Button onClick={() => setShowVoteForm(false)} variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Icons.cancel width={24} height={24} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 투표 제목 입력 */}
                <div>
                  <Label htmlFor="vote-title" className="mb-2 hidden">
                    투표 제목
                  </Label>
                  <Input
                    id="vote-title"
                    type="text"
                    value={voteForm.title}
                    onChange={e => handleVoteTitleChange(e.target.value)}
                    placeholder="투표 제목을 입력해주세요"
                    className="w-full"
                  />
                </div>
                <Separator className="mx-auto my-0 w-full opacity-50" />
                {/* 투표 옵션들 */}
                <div>
                  <Label className="mb-2 hidden">투표 항목</Label>
                  <div className="space-y-3">
                    {voteForm.options.map((option, index) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <div className="flex-1">
                          <Input
                            type="text"
                            value={option.content}
                            onChange={e => handleVoteOptionChange(option.id, e.target.value)}
                            placeholder={`항목 ${index + 1}`}
                            className="w-full"
                          />
                        </div>
                        {voteForm.options.length > 2 && (
                          <Button
                            onClick={() => handleRemoveVoteOption(option.id)}
                            variant="ghost"
                            className="h-8 w-8 rounded-full p-0 hover:bg-gray-100"
                          >
                            <Icons.cancel width={24} height={24} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 투표 옵션 추가 버튼 */}
                <Button
                  onClick={handleAddVoteOption}
                  variant="outline"
                  className="mt-3 w-full border border-[#FF5C00] bg-[#FFF1EA] text-primary disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
                  disabled={voteForm.options.length >= 5}
                >
                  <Icons.plus width={24} height={24} />
                  투표 내용 옵션 추가 {voteForm.options.length}/5
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
