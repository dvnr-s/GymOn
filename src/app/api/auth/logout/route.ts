import { NextResponse } from 'next/server';
import { successResponse } from '@/middleware/auth';

/**
 * POST /api/auth/logout
 * Logout user by clearing the token cookie
 */
export async function POST(): Promise<NextResponse> {
  const response = successResponse({
    message: 'Logged out successfully',
  });

  // Clear the token cookie
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Immediately expire
    path: '/',
  });

  return response;
}
