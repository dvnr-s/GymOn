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
 * GET /api/diet-plans/[id]
 * Get a specific diet plan
 */
export async function GET(
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

    const dietPlan = await DietPlan.findById(id).lean();

    if (!dietPlan) {
      return errorResponse('Diet plan not found', 404);
    }

    // Check ownership
    if (
      dietPlan.userId.toString() !== user._id.toString() &&
      user.role !== 'instructor'
    ) {
      return errorResponse('Unauthorized to view this diet plan', 403);
    }

    return successResponse({
      dietPlan,
    });
  } catch (error) {
    console.error('Get diet plan error:', error);
    return errorResponse('Failed to get diet plan', 500, error);
  }
}

/**
 * PUT /api/diet-plans/[id]
 * Update a diet plan
 */
export async function PUT(
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
    const {
      planType,
      name,
      description,
      dailyCalories,
      macroRatio,
      meals,
      tags,
      benefits,
      tips,
      isActive,
      startDate,
      endDate,
    } = body;

    // Validate macro ratio if provided
    if (macroRatio) {
      const totalMacro = macroRatio.protein + macroRatio.carbs + macroRatio.fat;
      if (totalMacro !== 100) {
        return errorResponse('Macro ratios must total 100%', 400);
      }
    }

    // Update fields
    if (planType !== undefined) dietPlan.planType = planType;
    if (name !== undefined) dietPlan.name = name;
    if (description !== undefined) dietPlan.description = description;
    if (dailyCalories !== undefined) dietPlan.dailyCalories = dailyCalories;
    if (macroRatio !== undefined) dietPlan.macroRatio = macroRatio;
    if (meals !== undefined) dietPlan.meals = meals;
    if (tags !== undefined) dietPlan.tags = tags;
    if (benefits !== undefined) dietPlan.benefits = benefits;
    if (tips !== undefined) dietPlan.tips = tips;
    if (isActive !== undefined) dietPlan.isActive = isActive;
    if (startDate !== undefined) dietPlan.startDate = new Date(startDate);
    if (endDate !== undefined) dietPlan.endDate = new Date(endDate);

    await dietPlan.save();

    return successResponse({
      message: 'Diet plan updated successfully',
      dietPlan,
    });
  } catch (error) {
    console.error('Update diet plan error:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      return errorResponse(error.message, 400);
    }

    return errorResponse('Failed to update diet plan', 500, error);
  }
}

/**
 * DELETE /api/diet-plans/[id]
 * Delete a diet plan
 */
export async function DELETE(
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
      return errorResponse('Unauthorized to delete this diet plan', 403);
    }

    await DietPlan.findByIdAndDelete(id);

    return successResponse({
      message: 'Diet plan deleted successfully',
    });
  } catch (error) {
    console.error('Delete diet plan error:', error);
    return errorResponse('Failed to delete diet plan', 500, error);
  }
}
