import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DietPlan from '@/models/DietPlan';
import {
  authenticate,
  errorResponse,
  successResponse,
} from '@/middleware/auth';

/**
 * POST /api/diet-plans
 * Create a new diet plan
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
      planType,
      name,
      description,
      dailyCalories,
      macroRatio,
      meals,
      tags,
      benefits,
      tips,
      startDate,
      endDate,
    } = body;

    // Validate required fields
    if (!planType || !name || !dailyCalories || !macroRatio) {
      return errorResponse(
        'Plan type, name, daily calories, and macro ratio are required',
        400
      );
    }

    // Validate macro ratio totals 100%
    const totalMacro = macroRatio.protein + macroRatio.carbs + macroRatio.fat;
    if (totalMacro !== 100) {
      return errorResponse('Macro ratios must total 100%', 400);
    }

    // Create new diet plan
    const dietPlan = new DietPlan({
      userId: user._id,
      planType,
      name,
      description,
      dailyCalories,
      macroRatio,
      meals: meals || [],
      tags,
      benefits,
      tips,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      isActive: true,
    });

    await dietPlan.save();

    return successResponse(
      {
        message: 'Diet plan created successfully',
        dietPlan,
      },
      201
    );
  } catch (error) {
    console.error('Create diet plan error:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      return errorResponse(error.message, 400);
    }

    return errorResponse('Failed to create diet plan', 500, error);
  }
}

/**
 * GET /api/diet-plans
 * Get all diet plans for the authenticated user
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
    const planType = searchParams.get('planType');

    // Build query
    const query: Record<string, unknown> = { userId: user._id };

    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }

    if (planType) {
      query.planType = planType;
    }

    const dietPlans = await DietPlan.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return successResponse({
      dietPlans,
    });
  } catch (error) {
    console.error('Get diet plans error:', error);
    return errorResponse('Failed to get diet plans', 500, error);
  }
}
