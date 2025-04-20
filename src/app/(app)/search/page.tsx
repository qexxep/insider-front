import { SearchPage } from '@/views/search';

// In Next.js 15, we avoid accessing searchParams directly in server components
export default function Search() {
  return <SearchPage />;
}
