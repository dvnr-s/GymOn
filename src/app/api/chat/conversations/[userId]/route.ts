import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import ChatMessage from '@/models/ChatMessage';
import {
  authenticate,
  errorResponse,
  successResponse,
} from '@/middleware/auth';

interface RouteParams {
  params: Promise<{ userId: string }>;
}

/**
 * GET /api/chat/conversations/[userId]
 * Get all conversations for a user
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

    // Users can only view their own conversations
    if (user._id.toString() !== userId) {
      return errorResponse('Unauthorized to view these conversations', 403);
    }

    await dbConnect();

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Aggregate to get unique conversations with last message and unread count
    const conversations = await ChatMessage.aggregate([
      {
        $match: {
          $or: [{ senderId: userObjectId }, { receiverId: userObjectId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', userObjectId] },
              '$receiverId',
              '$senderId',
            ],
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', userObjectId] },
                    { $eq: ['$isRead', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'partner',
        },
      },
      {
        $unwind: '$partner',
      },
      {
        $project: {
          partnerId: '$_id',
          partnerUsername: '$partner.username',
          partnerName: '$partner.profile.name',
          partnerAvatar: '$partner.profile.avatarUrl',
          lastMessage: {
            message: '$lastMessage.message',
            createdAt: '$lastMessage.createdAt',
            isRead: '$lastMessage.isRead',
            isSentByMe: { $eq: ['$lastMessage.senderId', userObjectId] },
          },
          unreadCount: 1,
        },
      },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
    ]);

    return successResponse({
      conversations,
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    return errorResponse('Failed to get conversations', 500, error);
  }
}
