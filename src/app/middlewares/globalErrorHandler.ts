import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import envVars from '../config/env';
import AppError from '../errorHelpers/AppError';
import handleCastError from '../errorHelpers/handleCastError';
import handleDuplicateError from '../errorHelpers/handleDuplicateError';
import handleValidationError from '../errorHelpers/handleValidationError';
import handleZodError from '../errorHelpers/handleZodError';
import { TErrorSources } from '../interfaces/error.interface';

/**
 * Global Error Handler Middleware
 * Handles various error types and formats them into a standardized API response.
 * Sanitizes sensitive error information in production environments.
 */
export const globalErrorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next,
) => {
  // Default values
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  // Return the error response
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // Provide stack trace and raw error object only in development
    err: envVars.NODE_ENV === 'development' ? err : undefined,
    stack: envVars.NODE_ENV === 'development' ? err?.stack : undefined,
  });
};
