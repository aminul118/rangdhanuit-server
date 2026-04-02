import express from 'express';
import validateRequest from '@middleware/validateRequest';
import { ContactController } from './Contact.controller';
import { ContactValidation } from './Contact.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(ContactValidation.createContactValidationSchema),
  ContactController.createContact,
);

export const ContactRoutes = router;
