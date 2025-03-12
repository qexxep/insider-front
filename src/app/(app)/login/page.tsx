import { LoginPage } from '@/views/sign-in';

export default async function Home() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const initialRememberId = cookieStore.get('remember_id')?.value ?? null;

  return <LoginPage initialRememberId={initialRememberId} />;
}
