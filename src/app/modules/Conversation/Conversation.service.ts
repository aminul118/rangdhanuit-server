import { Conversation } from './Conversation.model';
import { Message } from '../Message/Message.model';
import { Types } from 'mongoose';

import { NotificationService } from '../Notification/Notification.service';

const getMyConversations = async (userId: string) => {
  const result = await Conversation.find({
    participants: { $in: [new Types.ObjectId(userId)] },
    isDeleted: false,
  })
    .populate('participants', 'name email picture role')
    .populate({
      path: 'lastMessage',
      select: 'content createdAt sender',
    })
    .sort({ updatedAt: -1 });

  return result;
};

const getConversationMessages = async (conversationId: string) => {
  const result = await Message.find({
    conversationId: new Types.ObjectId(conversationId),
    isDeleted: false,
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'name email picture');

  return result;
};

const sendMessage = async (senderId: string, recipientId: string, content: string) => {
  // 1. Find or create conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, recipientId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, recipientId],
    });
  }

  // 2. Create message
  const message = await Message.create({
    conversationId: conversation._id,
    sender: senderId,
    content,
  });

  // 3. Update conversation last message and unread count
  conversation.lastMessage = message._id;
  const currentUnread = conversation.unreadCount.get(recipientId) || 0;
  conversation.unreadCount.set(recipientId, currentUnread + 1);
  await conversation.save();

  // 4. Create Persistent Notification
  await NotificationService.createNotification({
    recipient: new Types.ObjectId(recipientId),
    sender: new Types.ObjectId(senderId),
    type: 'MESSAGE',
    content: content,
  });

  return message;
};

const markAsRead = async (conversationId: string, userId: string) => {
  const conversation = await Conversation.findById(conversationId);
  if (conversation) {
    conversation.unreadCount.set(userId, 0);
    await conversation.save();
  }
  
  await Message.updateMany(
    { conversationId: new Types.ObjectId(conversationId), sender: { $ne: new Types.ObjectId(userId) } },
    { isRead: true }
  );

  return conversation;
};

export const ConversationService = {
  getMyConversations,
  getConversationMessages,
  sendMessage,
  markAsRead,
};
