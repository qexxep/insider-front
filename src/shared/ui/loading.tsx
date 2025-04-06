import Image from 'next/image';

export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Image src="/icons/loading.svg" alt="loading" width={200} height={200} priority />
    </div>
  );
};
