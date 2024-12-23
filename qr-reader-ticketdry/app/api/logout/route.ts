import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Clear the authToken cookie
  res.cookies.set('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: -1, // Setting maxAge to -1 expires the cookie
  });

  return res;
}
