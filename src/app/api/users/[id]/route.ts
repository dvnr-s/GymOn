import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import {
  authenticate,
  errorResponse,
  successResponse,
} from '@/middleware/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/users/[id]
 * Get user profile by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid user ID', 400);
    }

    await dbConnect();

    const user = await User.findById(id).lean();

    if (!user) {
      return errorResponse('User not found', 404);
    }

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
    console.error('Get user error:', error);
    return errorResponse('Failed to get user', 500, error);
  }
}

/**
 * PUT /api/users/[id]
 * Update user profile
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid user ID', 400);
    }

    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user: authUser } = authResult;

    // Users can only update their own profile (or instructors can update any)
    if (authUser._id.toString() !== id && authUser.role !== 'instructor') {
      return errorResponse('Unauthorized to update this profile', 403);
    }

    await dbConnect();

    const body = await request.json();
    const { username, email, profile, role } = body;

    // Build update object
    const updateData: Record<string, unknown> = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email.toLowerCase();
    if (profile) updateData.profile = profile;
    // Only instructors can change roles
    if (role && authUser.role === 'instructor') {
      updateData.role = role;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return errorResponse('User not found', 404);
    }

    return successResponse({
      message: 'User updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        profile: updatedUser.profile,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);

    // Handle duplicate key errors
    if (error instanceof Error && 'code' in error && (error as { code: number }).code === 11000) {
      return errorResponse('Username or email already exists', 409);
    }

    return errorResponse('Failed to update user', 500, error);
  }
}

/**
 * DELETE /api/users/[id]
 * Delete user account
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid user ID', 400);
    }

    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user: authUser } = authResult;

    // Users can only delete their own account (or instructors can delete any)
    if (authUser._id.toString() !== id && authUser.role !== 'instructor') {
      return errorResponse('Unauthorized to delete this account', 403);
    }

    await dbConnect();

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return errorResponse('User not found', 404);
    }

    // Clear token cookie if user deleted their own account
    const response = successResponse({
      message: 'User deleted successfully',
    });

    if (authUser._id.toString() === id) {
      response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Delete user error:', error);
    return errorResponse('Failed to delete user', 500, error);
  }
}
