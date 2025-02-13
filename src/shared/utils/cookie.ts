export const getClientCookie = (name: string): string | null => {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on the client-side.');
  }

  return (
    document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`))
      ?.split('=')[1] ?? null
  );
};

export const setClientCookie = (name: string, value: string, days: number = 1) => {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on the client-side.');
  }

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; samesite=Lax; secure=${process.env.NODE_ENV === 'production'}`;
};

export const removeClientCookie = (name: string) => {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on the client-side.');
  }

  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=Lax; secure=${process.env.NODE_ENV === 'production'}`;
};
