'use client';

import { UseQueryOptions } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useCategories } from '@/app/(app)/@sidebar/hooks/useCategories';
import { ApiResponse } from '@/shared/api/types';
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
import {
  postInvalidateQueries,
  useCreatePost,
  useDeleteFile,
  useGetPostDetail,
  useSavePost,
  useUploadFile,
} from '@/views/posts';

import type { CategoryItem, PostDetailResponse, SavePostRequest } from '../api/types';
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

const MAX_IMAGE_COUNT = 4;

const MAX_TAG_COUNT = 5;
const MAX_TAG_LENGTH = 10;

const MAX_VOTE_COUNT = 5;
const MIN_VOTE_COUNT = 2;

interface WritePostPageProps {
  mode?: 'edit' | 'create';
  initialPostId?: string;
  initialCategory?: string;
}

export function WritePostPage({ mode = 'create', initialPostId, initialCategory }: WritePostPageProps) {
  const router = useRouter();
  const { toast } = useToast();

  // searchParams 대신 props 사용
  const isEditMode = mode === 'edit' && Boolean(initialPostId);

  // 기존 데이터 불러오기
  const { data: postData } = useGetPostDetail({ postSeq: initialPostId || '' }, {
    enabled: isEditMode,
    staleTime: Infinity,
  } as UseQueryOptions<ApiResponse<PostDetailResponse>>);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [postSeq, setPostSeq] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { data, isLoading, error } = useCategories();

  const createPostMutation = useCreatePost({
    onError: () => {
      toast({
        variant: 'destructive',
        title: '게시글 생성 실패',
        description: '게시글을 생성하는데 실패했습니다. 다시 시도해주세요.',
        duration: 2000,
      });
    },
  });

  const uploadFileMutation = useUploadFile({
    onError: () => {
      toast({
        variant: 'destructive',
        title: '파일 업로드 실패',
        description: '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
        duration: 2000,
      });
    },
  });

  const deleteFileMutation = useDeleteFile({
    onError: () => {
      toast({
        variant: 'destructive',
        title: '파일 삭제 실패',
        description: '파일 삭제에 실패했습니다.',
        duration: 2000,
      });
    },
  });

  const savePostMutation = useSavePost({
    onError: () => {
      toast({
        variant: 'destructive',
        title: '게시글 저장 실패',
        description: '게시글을 저장하는데 실패했습니다. 다시 시도해주세요.',
        duration: 2000,
      });
    },
  });

  // 모든 카테고리 그룹의 카테고리들을 하나의 배열로 평탄화
  const allCategories =
    data?.data?.reduce<CategoryItem[]>((acc, group) => {
      return [...acc, ...group.categoryList];
    }, []) || [];

  // 초기 상태 설정을 위한 useEffect
  useEffect(() => {
    if (isEditMode && postData?.data) {
      const { voteInfo, fileList, ...post } = postData.data;

      // 기존 데이터로 상태 초기화
      setSelectedCategory(post.categoryCd);
      setTitle(post.postTitle);
      setContent(post.content);
      setPostSeq(post.postSeq);

      // TODO) 태그 설정 수정 요청 필요
      if (post.postTagList?.length > 0) {
        const processedTags = post.postTagList.map(tag => tag.replace('#', ''));
        setTags(processedTags);
      }

      // 이미지 설정
      if (fileList?.length > 0) {
        const images = fileList.map(file => ({
          url: `${process.env.NEXT_PUBLIC_BASE_URL!.replace('/api', '')}${file.fileUrl}`,
          fileSeq: file.fileSeq,
          file: new File([], file.fileName), // 파일 객체는 새로 생성
        }));
        setUploadedImages(images);
      }

      // 투표 정보 설정
      if (voteInfo && post.isVote) {
        setShowVoteForm(true);
        setVoteForm({
          title: voteInfo.voteTitle,
          options: voteInfo.voteItems.map((item, index) => ({
            id: index + 1,
            content: item.itemTitle,
          })),
        });
      }
    }
  }, [isEditMode, postData]);

  // 페이지 진입시 최초 게시글 생성
  const handleCategorySelect = async (value: string) => {
    setSelectedCategory(value);

    // 수정 모드이거나 이미 postSeq가 있으면 새 게시글을 생성하지 않음
    if (isEditMode || postSeq) return;

    try {
      // 최초 게시글 생성
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
  };

  useEffect(() => {
    if (initialCategory && !postSeq && !isEditMode) {
      handleCategorySelect(initialCategory);
    }
  }, []);

  // 파일 검증
  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast({
        variant: 'destructive',
        title: '파일 형식 오류',
        description: 'JPG, JPEG, PNG, GIF 형식의 이미지만 업로드 가능합니다.',
        duration: 2000,
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        variant: 'destructive',
        title: '파일 크기 초과',
        description: '파일 크기는 10MB를 초과할 수 없습니다.',
        duration: 2000,
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
    if (!validateFile(file)) return;

    try {
      // 수정 모드일 때는 initialPostId를 사용
      const currentPostSeq = isEditMode ? initialPostId : postSeq;
      // 게시글이 없는 경우 먼저 생성
      if (!currentPostSeq) {
        const postResult = await createPostMutation.mutateAsync({ categoryCd: selectedCategory });
        if (postResult.status === 'SUCCESS') {
          const newPostSeq = postResult.data.postSeq; // 임시 변수에 저장
          setPostSeq(newPostSeq);

          // 파일 업로드는 새로운 postSeq로 실행
          const result = await uploadFileMutation.mutateAsync({
            postSeq: newPostSeq, // 상태 대신 임시 변수 사용
            file,
          });

          if (result.status === 'SUCCESS') {
            const fullFileUrl = `${process.env.NEXT_PUBLIC_BASE_URL!.replace('/api', '')}${result.data.fileUrl}`;
            setUploadedImages(prev => [
              ...prev,
              {
                url: fullFileUrl,
                file,
                fileSeq: result.data.fileSeq,
              },
            ]);
          } else {
            throw new Error('파일 업로드 실패');
          }
          return; // 파일 업로드 완료 후 종료
        } else {
          throw new Error('게시글 생성 실패');
        }
      }

      const result = await uploadFileMutation.mutateAsync({
        postSeq: currentPostSeq,
        file,
      });

      if (result.status === 'SUCCESS') {
        if (!result.data) {
          throw new Error('파일 업로드 응답 구조 오류');
        }
        if (!result.data.fileUrl) {
          throw new Error('파일 URL 정보 없음');
        }

        const fullFileUrl = `${process.env.NEXT_PUBLIC_BASE_URL!.replace('/api', '')}${result.data.fileUrl}`;
        setUploadedImages(prev => [
          ...prev,
          {
            url: fullFileUrl,
            file,
            fileSeq: result.data.fileSeq,
          },
        ]);
      } else {
        throw new Error('파일 업로드 실패');
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
  const [showVoteForm, setShowVoteForm] = useState<boolean>(false);
  const [voteForm, setVoteForm] = useState<VoteForm>({
    title: '',
    options: [
      { id: 1, content: '' },
      { id: 2, content: '' },
    ],
  });

  const voteCount = voteForm?.options?.length;
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
    if (voteCount >= MAX_VOTE_COUNT) {
      toast({
        variant: 'destructive',
        title: '투표 옵션 제한',
        description: `투표 옵션은 최대 ${MAX_VOTE_COUNT}개까지만 추가할 수 있습니다.`,
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
    if (voteCount > MIN_VOTE_COUNT) {
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
      if (newTag.length > MAX_TAG_LENGTH) {
        toast({
          variant: 'destructive',
          title: '태그 길이 초과',
          description: '태그는 10자를 초과할 수 없습니다.',
          duration: 2000,
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
            duration: 2000,
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
    } else if (e.key === 'Backspace' && currentTag === '' && tags.length > 0) {
      // 입력값이 비어있고 Backspace를 눌렀을 때 마지막 태그 삭제
      setTags(prev => prev.slice(0, -1));
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
    if (!title.trim()) {
      toast({
        variant: 'destructive',
        title: '제목 입력 필요',
        description: '제목을 입력해주세요.',
        duration: 2000,
      });
      return;
    }

    if (!content.trim()) {
      toast({
        variant: 'destructive',
        title: '내용 입력 필요',
        description: '내용을 입력해주세요.',
        duration: 2000,
      });
      return;
    }

    try {
      // 수정 모드일 때는 initialPostId를 사용하고, 아닐 때만 새 게시글 생성
      let currentPostSeq = isEditMode ? initialPostId : postSeq;

      // 새 게시글 모드이고 아직 postSeq가 없는 경우에만 새 게시글 생성
      if (!currentPostSeq && !isEditMode) {
        const postResult = await createPostMutation.mutateAsync({ categoryCd: selectedCategory });
        if (postResult.status === 'SUCCESS') {
          currentPostSeq = postResult.data.postSeq;
          setPostSeq(currentPostSeq);
        } else {
          throw new Error('게시글 생성 실패');
        }
      }

      const savePostData: SavePostRequest = {
        postSeq: currentPostSeq!,
        postTitle: title.trim(),
        content: content.trim(),
        categoryCd: selectedCategory,
        postTagList: tags.length > 0 ? tags.map(tag => tag) : [],
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

        savePostData.voteTitle = voteForm.title.trim();
        savePostData.voteItems = voteForm.options.map(option => option.content.trim());
      }

      // 1. 게시물 저장
      await savePostMutation.mutateAsync(savePostData);

      // 2. 수정 모드에서 삭제된 이미지 처리
      if (isEditMode && postData?.data) {
        // 원본 게시물의 fileList 가져오기
        const originalFileList = postData.data.fileList || [];

        // 원본 게시물의 fileSeq 목록
        const originalFileSeqs = new Set(originalFileList.map(file => file.fileSeq));

        // 현재 UI에 표시된 이미지들의 fileSeq 목록
        const currentFileSeqs = new Set(uploadedImages.map(img => img.fileSeq));

        // 원본에는 있었지만 현재 UI에는 없는 이미지들 (삭제된 이미지들)
        const deletedFileSeqs = Array.from(originalFileSeqs).filter(fileSeq => !currentFileSeqs.has(fileSeq));

        // 삭제된 이미지들에 대해 삭제 요청
        const deletePromises = deletedFileSeqs.map(async fileSeq => {
          const deleteResult = await deleteFileMutation.mutateAsync({
            postSeq: currentPostSeq!,
            fileSeq: fileSeq as string,
          });

          if (deleteResult.status !== 'SUCCESS') {
            console.error('파일 삭제 실패:', fileSeq);
          }
          return deleteResult;
        });

        // 모든 파일 삭제 요청 완료 대기
        if (deletePromises.length > 0) {
          await Promise.all(deletePromises);
        }
      }

      // 성공 토스트 메시지 표시
      toast({
        title: '게시글 등록 성공',
        description: '게시글이 성공적으로 등록되었습니다.',
        duration: 2000,
      });

      setTimeout(() => {
        // 상세 페이지로 이동 (카테고리 코드와 게시글 번호 사용)
        if (isEditMode) {
          postInvalidateQueries.detail({ postSeq: currentPostSeq! });
        }
        router.push(`/posts/${selectedCategory}/${currentPostSeq}`);
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

  // 이미지 삭제 핸들러
  const handleImageRemove = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // 투표 폼 닫기 핸들러
  const handleVoteFormClose = () => {
    setShowVoteForm(false);
  };

  return (
    <div className="mx-auto w-[960px] p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isEditMode ? '글 수정하기' : '글쓰기'}</h1>
        <div className="flex gap-2">
          <Label
            className="text-md flex cursor-pointer items-center justify-center rounded-md border border-[#636571] bg-white px-3 py-2 font-medium text-black hover:bg-gray-600 hover:text-primary-foreground"
            role="button"
          >
            <span>사진 등록</span>
            <Input type="file" accept=".jpg,.jpeg,.png,.gif" onChange={handleFileUpload} className="hidden" />
          </Label>
          <Button
            className="border border-[#636571] bg-white px-3 text-black hover:bg-gray-600 hover:text-primary-foreground disabled:cursor-not-allowed disabled:border-none disabled:border-gray-400 disabled:bg-gray-200 disabled:text-white"
            onClick={() => setShowVoteForm(true)}
            disabled={showVoteForm}
          >
            투표 추가
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {/* 게시판 카테고리 선택 */}
        <CategorySelect
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          isLoading={isLoading}
          error={error}
          categories={allCategories}
        />

        {/* 제목 입력 */}
        <Input
          type="text"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border-gray-300 focus-visible:border-gray-300"
        />

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
                    className="ml-0 w-auto min-w-[100px] flex-1 border-0 focus-visible:ring-0"
                  />
                ) : (
                  <div
                    key={`${tag}-${index}`}
                    className="group relative flex items-center gap-1 rounded-md bg-gray-200 px-2 py-1"
                  >
                    <span
                      className="cursor-pointer text-sm text-gray-900 hover:text-gray-900"
                      onClick={() => handleTagEdit(index)}
                    >
                      #{tag}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation(); // 태그 클릭 이벤트와 겹치지 않도록
                        handleRemoveTag(index);
                      }}
                      className="invisible absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 text-white group-hover:visible"
                    >
                      <Icons.cancel width={12} height={12} />
                    </button>
                  </div>
                )
              )}
              {tags.length < MAX_TAG_COUNT && editingTagIndex === null && (
                <Input
                  type="text"
                  value={currentTag}
                  onChange={e => setCurrentTag(e.target.value.replace(/^#/, ''))}
                  onKeyDown={handleTagInput}
                  placeholder={
                    tags.length === 0
                      ? `# 태그를 입력해주세요 (최대 ${MAX_TAG_COUNT}개) / 입력 후 Enter`
                      : '새 태그 입력'
                  }
                  className="ml-0 w-auto flex-1 border-0 focus-visible:ring-0"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* 첨부한 이미지 미리보기 */}
        {uploadedImages.length > 0 && (
          <PostImagePreview
            uploadedImages={uploadedImages}
            onImageRemove={handleImageRemove}
            handleFileUpload={handleFileUpload}
          />
        )}

        {/* 투표 폼 */}
        {showVoteForm && (
          <PostVoteForm
            voteForm={voteForm}
            voteCount={voteCount}
            onClose={handleVoteFormClose}
            handleVoteTitleChange={handleVoteTitleChange}
            handleVoteOptionChange={handleVoteOptionChange}
            handleRemoveVoteOption={handleRemoveVoteOption}
            handleAddVoteOption={handleAddVoteOption}
          />
        )}
      </div>
      <div className="mt-10 flex justify-center">
        <Button
          className="w-60 bg-primary px-6 text-white transition-colors hover:bg-primary-700 disabled:bg-gray-400 disabled:text-primary-foreground"
          onClick={handleSubmitPost}
          disabled={savePostMutation.isPending || !postSeq || !title.trim() || !content.trim()}
        >
          {savePostMutation.isPending ? '등록 중...' : isEditMode ? '수정하기' : '게시물 등록'}
        </Button>
      </div>
    </div>
  );
}

interface PostImagePreviewProps {
  uploadedImages: UploadedImage[];
  onImageRemove: (index: number) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PostImagePreview = ({ uploadedImages, onImageRemove, handleFileUpload }: PostImagePreviewProps) => {
  return (
    <div className="flex flex-wrap gap-3 rounded-md bg-gray-100 px-10 py-8">
      {uploadedImages.map((image, index) => (
        <div key={index} className="relative h-24 w-24">
          <Image
            src={image.url}
            alt={`업로드된 이미지 ${index + 1}`}
            fill
            className="rounded-md border border-gray-400 object-cover"
          />
          <Button
            onClick={() => onImageRemove(index)}
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 p-0 text-white hover:bg-red-600"
          >
            <Icons.cancel width={24} height={24} />
          </Button>
        </div>
      ))}
      {uploadedImages.length < MAX_IMAGE_COUNT && (
        <label
          className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400"
          role="button"
        >
          <Icons.plus width={24} height={24} />
          <Input type="file" accept=".jpg,.jpeg,.png,.gif" onChange={handleFileUpload} className="hidden" />
        </label>
      )}
    </div>
  );
};

interface PostVoteFormProps {
  voteForm: VoteForm;
  voteCount: number;
  onClose: () => void;
  handleVoteTitleChange: (title: string) => void;
  handleVoteOptionChange: (optionId: number, value: string) => void;
  handleRemoveVoteOption: (optionId: number) => void;
  handleAddVoteOption: () => void;
}

const PostVoteForm = ({
  voteForm,
  voteCount,
  onClose,
  handleVoteTitleChange,
  handleVoteOptionChange,
  handleRemoveVoteOption,
  handleAddVoteOption,
}: PostVoteFormProps) => {
  // 옵션 내용만 삭제하는 함수 추가
  const handleClearOptionContent = (id: number) => {
    handleVoteOptionChange(id, '');
  };

  return (
    <Card className="mt-4 bg-gray-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">토론 투표 게시물 작성</CardTitle>
        <Button onClick={onClose} variant="ghost" className="h-8 w-8 rounded-full p-0">
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
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      value={option.content}
                      onChange={e => handleVoteOptionChange(option.id, e.target.value)}
                      placeholder={`항목 ${index + 1}`}
                      className="w-full pr-8"
                    />
                    {/* 기본 2개 옵션은 내용이 있을 때만, 3번째 이후 옵션은 항상 버튼 표시 */}
                    {(index < 2 ? option.content : true) && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={
                          () =>
                            index < 2
                              ? handleClearOptionContent(option.id) // 기본 2개 옵션은 내용만 삭제
                              : handleRemoveVoteOption(option.id) // 3번째 이후는 옵션 자체를 삭제
                        }
                        className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent"
                      >
                        <Icons.deleteOption className="h-4 w-4 text-gray-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 투표 옵션 추가 버튼 */}
          <Button
            onClick={handleAddVoteOption}
            variant="outline"
            className="mt-3 w-full border border-[#FF5C00] bg-[#FFF1EA] text-primary hover:bg-primary-700 hover:text-primary-foreground disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-400 disabled:text-primary-foreground"
            disabled={voteCount >= MAX_VOTE_COUNT}
          >
            <Icons.plus width={24} height={24} />
            투표 내용 옵션 추가 {voteCount}/{MAX_VOTE_COUNT}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
