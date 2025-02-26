import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from '@/shared/ui';

export function WritePostPage() {
  return (
    <div className="mx-auto w-[1200px] p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">글쓰기</h1>
        <div className="flex gap-2">
          <Button className="border border-[#636571] bg-white px-3 text-black hover:bg-gray-300">사진 등록</Button>
          <Button className="border border-[#636571] bg-white px-3 text-black hover:bg-gray-300">투표 추가</Button>
          <Button className="bg-[#d4d4d4] px-6 text-white hover:bg-[#242424]">게시물 등록</Button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {/* 게시판 선택 */}
        <Select>
          <SelectTrigger className="focus:ring-ring">
            <SelectValue placeholder="게시판을 선택해주세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="board1" className="text-md h-14">
              게시판1
            </SelectItem>
            <SelectItem value="board2" className="text-md h-14">
              게시판2
            </SelectItem>
            {/* 추가 게시판 옵션들 */}
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
          <div className="h-24 w-24 rounded-md bg-gray-400"></div>
          <div className="h-24 w-24 rounded-md bg-gray-400"></div>
          <div className="h-24 w-24 rounded-md bg-gray-400"></div>
          <div className="h-24 w-24 rounded-md bg-gray-400"></div>
          <div className="h-24 w-24 rounded-md bg-gray-400"></div>
          <div className="h-24 w-24 rounded-md bg-gray-400"></div>
          <div className="h-24 w-24 rounded-md bg-gray-400"></div>
          <div className="h-24 w-24 rounded-md bg-gray-400"></div>
          <div className="h-24 w-24 rounded-md bg-gray-400"></div>
          <div className="h-24 w-24 rounded-md bg-gray-400"></div>
        </div>
      </div>
    </div>
  );
}
