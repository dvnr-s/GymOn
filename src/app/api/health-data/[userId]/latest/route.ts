import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import HealthData from '@/models/HealthData';
import {
  authenticate,
  errorResponse,
  successResponse,
} from '@/middleware/auth';

interface RouteParams {
  params: Promise<{ userId: string }>;
}

/**
 * GET /api/health-data/[userId]/latest
 * Get the latest health metrics for a user
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

    // Get the most recent health data entry
    const latestHealthData = await HealthData.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ date: -1 })
      .lean();

    if (!latestHealthData) {
      return errorResponse('No health data found for this user', 404);
    }

    return successResponse({
      healthData: latestHealthData,
    });
  } catch (error) {
    console.error('Get latest health data error:', error);
    return errorResponse('Failed to get latest health data', 500, error);
  }
}
