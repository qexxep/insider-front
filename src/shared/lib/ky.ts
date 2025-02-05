import ky, { type Options } from 'ky-universal';

export const createKyInstance = (options?: Options) => {
  return ky.create({
    ...options,
    hooks: {
      beforeRequest: [
        async request => {
          const token = localStorage.getItem('accessToken');
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        },
      ],
    },
  });
};
