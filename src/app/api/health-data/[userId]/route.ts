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
 * GET /api/health-data/[userId]
 * Get health history for a specific user
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    const query: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(userId) };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) (query.date as Record<string, Date>).$gte = new Date(startDate);
      if (endDate) (query.date as Record<string, Date>).$lte = new Date(endDate);
    }

    // Get total count
    const total = await HealthData.countDocuments(query);

    // Get health data with pagination
    const healthData = await HealthData.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return successResponse({
      healthData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get user health data error:', error);
    return errorResponse('Failed to get health data', 500, error);
  }
}
