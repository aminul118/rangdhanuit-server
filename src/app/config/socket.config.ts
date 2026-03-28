import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import envVars from './env';
import { User } from '../modules/User/User.model';
import { Message } from '../modules/Message/Message.model';
import { Conversation } from '../modules/Conversation/Conversation.model';
import { NotificationService } from '../modules/Notification/Notification.service';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
    },
  });

  // Authentication Middleware — reads httpOnly cookie sent automatically via withCredentials
  io.use(async (socket, next) => {
    try {
      // 1. Try cookie header (httpOnly cookies are sent automatically by browser)
      let accessToken: string | undefined;
      const cookieHeader = socket.handshake.headers?.cookie || '';
      const cookieMatch = cookieHeader.match(/(?:^|;\s*)accessToken=([^;]+)/);
      if (cookieMatch) {
        accessToken = decodeURIComponent(cookieMatch[1]);
      }

      // 2. Fallback to auth.token (for non-browser clients)
      if (!accessToken) {
        const raw = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
        if (raw) {
          accessToken = raw.startsWith('Bearer ') ? raw.split(' ')[1] : raw;
        }
      }

      if (!accessToken) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decoded = jwt.verify(
        accessToken,
        envVars.JWT_ACCESS_SECRET as string,
      ) as JwtPayload;

      const user = await User.findOne({ email: decoded.email });

      if (!user || user.status === 'BLOCKED' || user.isDeleted) {
        return next(
          new Error('Authentication error: User not found or blocked'),
        );
      }

      socket.data.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      next();
    } catch (_error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user;

    // Join personal room
    socket.join(`user_${user.id}`);

    // Admins join a global admin room
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      socket.join('admin_room');
    }

    // Handle sending message
    socket.on(
      'send_message',
      async (data: { recipientId: string; content: string }) => {
        try {
          const { recipientId, content } = data;
          const senderId = user.id;

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

          // Increment unread count for recipient
          const currentUnread = conversation.unreadCount.get(recipientId) || 0;
          conversation.unreadCount.set(recipientId, currentUnread + 1);
          await conversation.save();

          // 4. Create Persistent Notification
          await NotificationService.createNotification({
            recipient: recipientId as any,
            sender: senderId as any,
            type: 'MESSAGE',
            content: content,
          });

          // 5. Emit message to recipient's room
          io.to(`user_${recipientId}`).emit('receive_message', {
            _id: message._id,
            conversationId: conversation._id,
            sender: senderId,
            content,
            createdAt: message.createdAt,
          });

          // 6. Emit notification to all admins if a user sent a message
          if (user.role === 'USER') {
            io.to('admin_room').emit('new_notification', {
              type: 'NEW_MESSAGE',
              from: user.email,
              message: content,
              senderId: senderId,
            });
          } else {
            // If admin sent message, notify user
            io.to(`user_${recipientId}`).emit('new_notification', {
              type: 'ADMIN_REPLY',
              message: 'You have a new message from Support',
              content: content,
              senderId: senderId,
            });
          }

          // Acknowledge to sender
          socket.emit('message_sent', message);
        } catch (_error) {
          socket.emit('error', { message: 'Failed to send message' });
        }
      },
    );
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
