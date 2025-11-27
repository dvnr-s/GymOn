import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HealthData from '@/models/HealthData';
import {
  authenticate,
  errorResponse,
  successResponse,
} from '@/middleware/auth';

/**
 * POST /api/health-data
 * Add new health metrics
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
      weight,
      height,
      bodyFat,
      muscleMass,
      dailyCalories,
      dailyMacros,
      date,
      notes,
    } = body;

    // Validate required fields
    if (!weight || !height) {
      return errorResponse('Weight and height are required', 400);
    }

    // Create new health data entry
    const healthData = new HealthData({
      userId: user._id,
      weight,
      height,
      bodyFat,
      muscleMass,
      dailyCalories,
      dailyMacros,
      date: date ? new Date(date) : new Date(),
      notes,
    });

    await healthData.save();

    return successResponse(
      {
        message: 'Health data added successfully',
        healthData: {
          id: healthData._id,
          userId: healthData.userId,
          weight: healthData.weight,
          height: healthData.height,
          bmi: healthData.bmi,
          bodyFat: healthData.bodyFat,
          muscleMass: healthData.muscleMass,
          dailyCalories: healthData.dailyCalories,
          dailyMacros: healthData.dailyMacros,
          date: healthData.date,
          notes: healthData.notes,
          createdAt: healthData.createdAt,
        },
      },
      201
    );
  } catch (error) {
    console.error('Add health data error:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      return errorResponse(error.message, 400);
    }

    return errorResponse('Failed to add health data', 500, error);
  }
}

/**
 * GET /api/health-data
 * Get all health data for the authenticated user
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    const query: Record<string, unknown> = { userId: user._id };

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
    console.error('Get health data error:', error);
    return errorResponse('Failed to get health data', 500, error);
  }
}
