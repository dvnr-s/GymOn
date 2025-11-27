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
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/workouts/[id]/complete
 * Mark a workout as completed (add a completed session)
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid workout plan ID', 400);
    }

    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    await dbConnect();

    const workoutPlan = await WorkoutPlan.findById(id);

    if (!workoutPlan) {
      return errorResponse('Workout plan not found', 404);
    }

    // Check ownership
    if (
      workoutPlan.userId.toString() !== user._id.toString() &&
      user.role !== 'instructor'
    ) {
      return errorResponse('Unauthorized to update this workout plan', 403);
    }

    const body = await request.json();
    const { duration, notes } = body;

    // Add completed session
    workoutPlan.completedSessions.push({
      date: new Date(),
      completed: true,
      duration,
      notes,
    });

    await workoutPlan.save();

    return successResponse({
      message: 'Workout marked as completed',
      completedSessions: workoutPlan.completedSessions.length,
      latestSession:
        workoutPlan.completedSessions[
          workoutPlan.completedSessions.length - 1
        ],
    });
  } catch (error) {
    console.error('Complete workout error:', error);
    return errorResponse('Failed to complete workout', 500, error);
  }
}
