import Image from 'next/image';

export default function Loading() {
  return (
    <div className="-mt-12 flex min-h-screen flex-1 items-center justify-center">
      <Image src="/icons/loading.svg" alt="loading" width={200} height={200} priority />
    </div>
  );
}
