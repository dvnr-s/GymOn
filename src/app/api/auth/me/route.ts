import { NextRequest, NextResponse } from 'next/server';
import { authenticate, errorResponse, successResponse } from '@/middleware/auth';

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await authenticate(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    return successResponse({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return errorResponse('Failed to get user', 500, error);
  }
}
