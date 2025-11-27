import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import WorkoutPlan from '@/models/WorkoutPlan';
import {
  authenticate,
  errorResponse,
  successResponse,
} from '@/middleware/auth';

/**
 * POST /api/workouts
 * Create a new workout plan
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    await dbConnect();

    const body = await request.json();
    const {
      planName,
      description,
      exercises,
      targetMuscleGroups,
      difficulty,
      estimatedDuration,
      scheduledDays,
    } = body;

    // Validate required fields
    if (!planName || !exercises || exercises.length === 0) {
      return errorResponse(
        'Plan name and at least one exercise are required',
        400
      );
    }

    // Validate exercises structure
    for (const exercise of exercises) {
      if (!exercise.name || !exercise.sets || !exercise.reps) {
        return errorResponse(
          'Each exercise must have name, sets, and reps',
          400
        );
      }
    }

    // Create new workout plan
    const workoutPlan = new WorkoutPlan({
      userId: user._id,
      planName,
      description,
      exercises,
      targetMuscleGroups,
      difficulty: difficulty || 'intermediate',
      estimatedDuration,
      scheduledDays,
      completedSessions: [],
      isActive: true,
    });

    await workoutPlan.save();

    return successResponse(
      {
        message: 'Workout plan created successfully',
        workoutPlan,
      },
      201
    );
  } catch (error) {
    console.error('Create workout plan error:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      return errorResponse(error.message, 400);
    }

    return errorResponse('Failed to create workout plan', 500, error);
  }
}

/**
 * GET /api/workouts
 * Get all workout plans for the authenticated user
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    await dbConnect();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const difficulty = searchParams.get('difficulty');

    // Build query
    const query: Record<string, unknown> = { userId: user._id };

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
    console.error('Get workout plans error:', error);
    return errorResponse('Failed to get workout plans', 500, error);
  }
}
