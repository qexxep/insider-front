'use client';

const getLocalStorage = (key: string) => {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on the client-side.');
  }

  return localStorage.getItem(key);
};

const setLocalStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on the client-side.');
  }
  localStorage.setItem(key, value);
};

const removeLocalStorage = (key: string) => {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on the client-side.');
  }
  localStorage.removeItem(key);
};

export { getLocalStorage, removeLocalStorage, setLocalStorage };
