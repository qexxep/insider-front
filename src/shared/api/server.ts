'use server';

import ky from 'ky-universal';
import { cookies } from 'next/headers';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const apiServer = ky.create({
  prefixUrl: baseUrl,
  hooks: {
    beforeRequest: [
      async request => {
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
  },
});
