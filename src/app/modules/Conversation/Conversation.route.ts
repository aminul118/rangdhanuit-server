import express from 'express';
import auth from '../../middlewares/auth';
import { ConversationController } from './Conversation.controller';

const router = express.Router();

router.get('/my-conversations', auth('ADMIN', 'USER', 'SUPER_ADMIN'), ConversationController.getMyConversations);
router.get('/:conversationId/messages', auth('ADMIN', 'USER', 'SUPER_ADMIN'), ConversationController.getConversationMessages);
router.post('/send-message', auth('ADMIN', 'USER', 'SUPER_ADMIN'), ConversationController.sendMessage);
router.patch('/:conversationId/read', auth('ADMIN', 'USER', 'SUPER_ADMIN'), ConversationController.markAsRead);

export const ConversationRoutes = router;
