import sendEmail from '../../utils/sendEmail';
import envVars from '../../config/env';
import { IContact } from './Contact.interface';

const createContactIntoDB = async (payload: IContact) => {
  // Send Email to Admin
  await sendEmail(
    envVars.SUPER_ADMIN.EMAIL as string,
    `New Contact Form Submission: ${payload.subject}`,
    'contactAdmin',
    {
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
    },
  );

  // Send Email to Client (Confirmation)
  await sendEmail(
    payload.email,
    'Thank you for contacting Rangdhanu IT!',
    'contactClient',
    {
      name: payload.name,
      subject: payload.subject,
      message: payload.message,
    },
  );
};

export const ContactService = {
  createContactIntoDB,
};
