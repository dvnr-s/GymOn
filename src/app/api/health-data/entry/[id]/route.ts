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
  params: Promise<{ id: string }>;
}

/**
 * PUT /api/health-data/entry/[id]
 * Update a health data entry
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid health data ID', 400);
    }

    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    await dbConnect();

    // Find the health data entry
    const healthData = await HealthData.findById(id);

    if (!healthData) {
      return errorResponse('Health data not found', 404);
    }

    // Check ownership
    if (
      healthData.userId.toString() !== user._id.toString() &&
      user.role !== 'instructor'
    ) {
      return errorResponse('Unauthorized to update this data', 403);
    }

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

    // Update fields
    if (weight !== undefined) healthData.weight = weight;
    if (height !== undefined) healthData.height = height;
    if (bodyFat !== undefined) healthData.bodyFat = bodyFat;
    if (muscleMass !== undefined) healthData.muscleMass = muscleMass;
    if (dailyCalories !== undefined) healthData.dailyCalories = dailyCalories;
    if (dailyMacros !== undefined) healthData.dailyMacros = dailyMacros;
    if (date !== undefined) healthData.date = new Date(date);
    if (notes !== undefined) healthData.notes = notes;

    await healthData.save();

    return successResponse({
      message: 'Health data updated successfully',
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
        updatedAt: healthData.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update health data error:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      return errorResponse(error.message, 400);
    }

    return errorResponse('Failed to update health data', 500, error);
  }
}

/**
 * DELETE /api/health-data/entry/[id]
 * Delete a health data entry
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid health data ID', 400);
    }

    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    await dbConnect();

    // Find the health data entry
    const healthData = await HealthData.findById(id);

    if (!healthData) {
      return errorResponse('Health data not found', 404);
    }

    // Check ownership
    if (
      healthData.userId.toString() !== user._id.toString() &&
      user.role !== 'instructor'
    ) {
      return errorResponse('Unauthorized to delete this data', 403);
    }

    await HealthData.findByIdAndDelete(id);

    return successResponse({
      message: 'Health data deleted successfully',
    });
  } catch (error) {
    console.error('Delete health data error:', error);
    return errorResponse('Failed to delete health data', 500, error);
  }
}
