'use client';

const getLocalStorage = (key: string) => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const setLocalStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};

const removeLocalStorage = (key: string) => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

export { getLocalStorage, removeLocalStorage, setLocalStorage };
