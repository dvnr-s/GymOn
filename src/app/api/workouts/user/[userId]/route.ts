import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import WorkoutPlan from '@/models/WorkoutPlan';
import {
  authenticate,
  errorResponse,
  successResponse,
} from '@/middleware/auth';

interface RouteParams {
  params: Promise<{ userId: string }>;
}

/**
 * GET /api/workouts/user/[userId]
 * Get workout plans for a specific user
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { userId } = await params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return errorResponse('Invalid user ID', 400);
    }

    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    // Users can only view their own data (or instructors can view any)
    if (user._id.toString() !== userId && user.role !== 'instructor') {
      return errorResponse('Unauthorized to view this data', 403);
    }

    await dbConnect();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const difficulty = searchParams.get('difficulty');

    // Build query
    const query: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(userId) };

    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const workoutPlans = await WorkoutPlan.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return successResponse({
      workoutPlans,
    });
  } catch (error) {
    console.error('Get user workout plans error:', error);
    return errorResponse('Failed to get workout plans', 500, error);
  }
}
