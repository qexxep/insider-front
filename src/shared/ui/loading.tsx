import Image from 'next/image';

export const LoadingSpinner = () => {
  return (
    <div className="flex h-full min-h-screen w-full flex-1 items-center justify-center pb-[25%] pr-[260px]">
      <Image src="/icons/loading.svg" alt="loading" width={200} height={200} priority />
    </div>
  );
};
