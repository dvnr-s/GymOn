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
  params: Promise<{ userId: string }>;
}

/**
 * GET /api/diet-plans/user/[userId]
 * Get diet plans for a specific user
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
    const planType = searchParams.get('planType');

    // Build query
    const query: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(userId) };

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
    console.error('Get user diet plans error:', error);
    return errorResponse('Failed to get diet plans', 500, error);
  }
}
