import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken, errorResponse, successResponse } from '@/middleware/auth';

/**
 * POST /api/auth/login
 * User login with email and password
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return errorResponse('Email and password are required', 400);
    }

    // Find user by email and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return errorResponse('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = generateToken(user);

    // Create response
    const response = successResponse({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      token,
    });

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Login failed', 500, error);
  }
}
