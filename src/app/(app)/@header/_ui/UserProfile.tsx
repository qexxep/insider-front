'use client';

import { Icons } from '@/shared/ui';

export default function UserProfile() {
  const handleLogout = () => {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.reload();
  };
  return (
    <button onClick={handleLogout}>
      <Icons.circleUser className="h-5 w-5" />
    </button>
  );
}
