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
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/chat/messages/[id]/read
 * Mark a message as read
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid message ID', 400);
    }

    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    await dbConnect();

    const chatMessage = await ChatMessage.findById(id);

    if (!chatMessage) {
      return errorResponse('Message not found', 404);
    }

    // Only the receiver can mark a message as read
    if (chatMessage.receiverId.toString() !== user._id.toString()) {
      return errorResponse('Unauthorized to mark this message as read', 403);
    }

    // Update message
    chatMessage.isRead = true;
    chatMessage.readAt = new Date();

    await chatMessage.save();

    return successResponse({
      message: 'Message marked as read',
      chatMessage: {
        id: chatMessage._id,
        isRead: chatMessage.isRead,
        readAt: chatMessage.readAt,
      },
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    return errorResponse('Failed to mark message as read', 500, error);
  }
}
