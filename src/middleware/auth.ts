import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User, { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'instructor';
}

export interface AuthenticatedRequest extends NextRequest {
  user?: IUser;
}

/**
 * Generates a JWT token for a user
 */
export function generateToken(user: IUser): string {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET!, { expiresIn: '7d' });
}

/**
 * Verifies a JWT token and returns the payload
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET!) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Extracts the token from the Authorization header or cookies
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Fall back to cookie
  const tokenCookie = request.cookies.get('token');
  return tokenCookie?.value || null;
}

/**
 * Authentication middleware - verifies JWT and attaches user to request
 * Returns null if authenticated, or an error response if not
 */
export async function authenticate(
  request: NextRequest
): Promise<{ user: IUser } | NextResponse> {
  const token = getTokenFromRequest(request);

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    return { user };
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

/**
 * Role-based authorization check
 */
export function requireRole(
  user: IUser,
  requiredRole: 'user' | 'instructor' | 'any'
): NextResponse | null {
  if (requiredRole === 'any') {
    return null;
  }

  if (user.role !== requiredRole) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Helper to wrap an API handler with authentication
 */
export function withAuth(
  handler: (
    request: NextRequest,
    user: IUser,
    context?: { params: Record<string, string> }
  ) => Promise<NextResponse>,
  requiredRole: 'user' | 'instructor' | 'any' = 'any'
) {
  return async (
    request: NextRequest,
    context?: { params: Record<string, string> }
  ): Promise<NextResponse> => {
    const authResult = await authenticate(request);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    const roleError = requireRole(user, requiredRole);
    if (roleError) {
      return roleError;
    }

    return handler(request, user, context);
  };
}

/**
 * Standard error response format
 */
export function errorResponse(
  message: string,
  status: number = 500,
  details?: unknown
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      ...(process.env.NODE_ENV === 'development' && details
        ? { details: String(details) }
        : {}),
    },
    { status }
  );
}

/**
 * Standard success response format
 */
export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json(data, { status });
}
