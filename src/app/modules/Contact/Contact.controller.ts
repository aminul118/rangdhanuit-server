import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ContactService } from './Contact.service';

const createContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.createContactIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Contact message sent successfully',
    data: result,
  });
});

export const ContactController = {
  createContact,
};
