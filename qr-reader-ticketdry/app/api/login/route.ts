import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/user`;

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    // Send request to your external API
    const response = await axios.post(`${API_URL}/login`, { username, password });
    const { token, organizerId, role } = response.data;

    // Create the response and set the token in cookies (server-side)
    const res = NextResponse.json({ success: true, organizerId, role });

    res.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 6, // 6 hours
    });

    return res;
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
  }
}
