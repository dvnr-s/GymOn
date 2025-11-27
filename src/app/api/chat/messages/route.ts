import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import ChatMessage from '@/models/ChatMessage';
import {
  authenticate,
  errorResponse,
  successResponse,
} from '@/middleware/auth';

/**
 * POST /api/chat/messages
 * Send a new message
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
    const { receiverId, message } = body;

    // Validate required fields
    if (!receiverId || !message) {
      return errorResponse('Receiver ID and message are required', 400);
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return errorResponse('Invalid receiver ID', 400);
    }

    // Create new message
    const chatMessage = new ChatMessage({
      senderId: user._id,
      receiverId: new mongoose.Types.ObjectId(receiverId),
      message: message.trim(),
      isRead: false,
    });

    await chatMessage.save();

    // Populate sender info
    await chatMessage.populate('senderId', 'username profile.name profile.avatarUrl');

    return successResponse(
      {
        message: 'Message sent successfully',
        chatMessage,
      },
      201
    );
  } catch (error) {
    console.error('Send message error:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      return errorResponse(error.message, 400);
    }

    return errorResponse('Failed to send message', 500, error);
  }
}

/**
 * GET /api/chat/messages
 * Get chat history between two users
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
    const otherUserId = searchParams.get('with');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!otherUserId) {
      return errorResponse('Partner user ID is required (use ?with=userId)', 400);
    }

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return errorResponse('Invalid partner user ID', 400);
    }

    const otherUserObjectId = new mongoose.Types.ObjectId(otherUserId);

    // Get messages between the two users
    const query = {
      $or: [
        { senderId: user._id, receiverId: otherUserObjectId },
        { senderId: otherUserObjectId, receiverId: user._id },
      ],
    };

    const total = await ChatMessage.countDocuments(query);

    const messages = await ChatMessage.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('senderId', 'username profile.name profile.avatarUrl')
      .populate('receiverId', 'username profile.name profile.avatarUrl')
      .lean();

    // Reverse to get chronological order
    messages.reverse();

    return successResponse({
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return errorResponse('Failed to get messages', 500, error);
  }
}
