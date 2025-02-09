const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

export { getLocalStorage, removeLocalStorage, setLocalStorage };
