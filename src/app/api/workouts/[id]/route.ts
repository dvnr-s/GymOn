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
 * GET /api/workouts/[id]
 * Get a specific workout plan
 */
export async function GET(
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

    const workoutPlan = await WorkoutPlan.findById(id).lean();

    if (!workoutPlan) {
      return errorResponse('Workout plan not found', 404);
    }

    // Check ownership
    if (
      workoutPlan.userId.toString() !== user._id.toString() &&
      user.role !== 'instructor'
    ) {
      return errorResponse('Unauthorized to view this workout plan', 403);
    }

    return successResponse({
      workoutPlan,
    });
  } catch (error) {
    console.error('Get workout plan error:', error);
    return errorResponse('Failed to get workout plan', 500, error);
  }
}

/**
 * PUT /api/workouts/[id]
 * Update a workout plan
 */
export async function PUT(
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
    const {
      planName,
      description,
      exercises,
      targetMuscleGroups,
      difficulty,
      estimatedDuration,
      scheduledDays,
      isActive,
    } = body;

    // Validate exercises if provided
    if (exercises) {
      if (exercises.length === 0) {
        return errorResponse('At least one exercise is required', 400);
      }

      for (const exercise of exercises) {
        if (!exercise.name || !exercise.sets || !exercise.reps) {
          return errorResponse(
            'Each exercise must have name, sets, and reps',
            400
          );
        }
      }
    }

    // Update fields
    if (planName !== undefined) workoutPlan.planName = planName;
    if (description !== undefined) workoutPlan.description = description;
    if (exercises !== undefined) workoutPlan.exercises = exercises;
    if (targetMuscleGroups !== undefined)
      workoutPlan.targetMuscleGroups = targetMuscleGroups;
    if (difficulty !== undefined) workoutPlan.difficulty = difficulty;
    if (estimatedDuration !== undefined)
      workoutPlan.estimatedDuration = estimatedDuration;
    if (scheduledDays !== undefined) workoutPlan.scheduledDays = scheduledDays;
    if (isActive !== undefined) workoutPlan.isActive = isActive;

    await workoutPlan.save();

    return successResponse({
      message: 'Workout plan updated successfully',
      workoutPlan,
    });
  } catch (error) {
    console.error('Update workout plan error:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      return errorResponse(error.message, 400);
    }

    return errorResponse('Failed to update workout plan', 500, error);
  }
}

/**
 * DELETE /api/workouts/[id]
 * Delete a workout plan
 */
export async function DELETE(
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
      return errorResponse('Unauthorized to delete this workout plan', 403);
    }

    await WorkoutPlan.findByIdAndDelete(id);

    return successResponse({
      message: 'Workout plan deleted successfully',
    });
  } catch (error) {
    console.error('Delete workout plan error:', error);
    return errorResponse('Failed to delete workout plan', 500, error);
  }
}
