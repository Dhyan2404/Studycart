
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type AuthState = {
  message?: string | null;
};

export async function login(prevState: AuthState, formData: FormData) {
  const password = formData.get('password');
  // Hardcode the password to ensure it's reliable and not overridden by env variables.
  const adminPassword = 'Dhyan$1029';

  if (password === adminPassword) {
    cookies().set('auth_token', 'secret-admin-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    redirect('/admin/dashboard');
  }

  return {
    message: 'Invalid password.',
  };
}

export async function logout() {
  cookies().delete('auth_token');
  redirect('/admin/login');
}
