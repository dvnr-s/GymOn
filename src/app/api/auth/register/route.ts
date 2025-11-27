import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken, errorResponse, successResponse } from '@/middleware/auth';

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const body = await request.json();
    const { username, email, password, role = 'user', profile = {} } = body;

    // Validate required fields
    if (!username || !email || !password) {
      return errorResponse('Username, email, and password are required', 400);
    }

    // Validate password length
    if (password.length < 6) {
      return errorResponse('Password must be at least 6 characters', 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return errorResponse('Email already registered', 409);
      }
      return errorResponse('Username already taken', 409);
    }

    // Create new user
    const user = new User({
      username,
      email: email.toLowerCase(),
      password,
      role,
      profile: {
        name: profile.name || username,
        ...profile,
      },
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    // Create response with cookie
    const response = successResponse(
      {
        message: 'User registered successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
        token,
      },
      201
    );

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
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return errorResponse(error.message, 400);
    }

    return errorResponse('Registration failed', 500, error);
  }
}
