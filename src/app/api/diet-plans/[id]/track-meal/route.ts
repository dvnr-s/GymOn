import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import DietPlan from '@/models/DietPlan';
import {
  authenticate,
  errorResponse,
  successResponse,
} from '@/middleware/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/diet-plans/[id]/track-meal
 * Track meal completion status
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid diet plan ID', 400);
    }

    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    await dbConnect();

    const dietPlan = await DietPlan.findById(id);

    if (!dietPlan) {
      return errorResponse('Diet plan not found', 404);
    }

    // Check ownership
    if (
      dietPlan.userId.toString() !== user._id.toString() &&
      user.role !== 'instructor'
    ) {
      return errorResponse('Unauthorized to update this diet plan', 403);
    }

    const body = await request.json();
    const { mealIndex, completed } = body;

    // Validate meal index
    if (mealIndex === undefined || typeof mealIndex !== 'number') {
      return errorResponse('Meal index is required', 400);
    }

    if (mealIndex < 0 || mealIndex >= dietPlan.meals.length) {
      return errorResponse('Invalid meal index', 400);
    }

    // Update meal completion status
    dietPlan.meals[mealIndex].completed = completed !== false;

    await dietPlan.save();

    return successResponse({
      message: 'Meal tracking updated successfully',
      meal: dietPlan.meals[mealIndex],
      completedMeals: dietPlan.meals.filter((m) => m.completed).length,
      totalMeals: dietPlan.meals.length,
    });
  } catch (error) {
    console.error('Track meal error:', error);
    return errorResponse('Failed to track meal', 500, error);
  }
}
