import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import { ConversationService } from './Conversation.service';
import httpStatus from 'http-status-codes';

const getMyConversations = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as JwtPayload).userId;
  const result = await ConversationService.getMyConversations(userId);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Conversations fetched successfully',
    data: result,
  });
});

const getConversationMessages = catchAsync(
  async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const result = await ConversationService.getConversationMessages(
      conversationId as string,
    );
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Messages fetched successfully',
      data: result,
    });
  },
);

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const userId = (req.user as JwtPayload).userId;
  const result = await ConversationService.markAsRead(
    conversationId as string,
    userId,
  );
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Conversation marked as read',
    data: result,
  });
});

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const senderId = (req.user as JwtPayload).userId;
  const { recipientId, content } = req.body;
  const result = await ConversationService.sendMessage(
    senderId,
    recipientId,
    content,
  );

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

export const ConversationController = {
  getMyConversations,
  getConversationMessages,
  sendMessage,
  markAsRead,
};
