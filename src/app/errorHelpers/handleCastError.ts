import mongoose from 'mongoose';
import {
  TErrorSources,
  TGenericErrorResponse,
} from '../interfaces/error.interface';

/**
 * Transforms a Mongoose CastError into a standardized error response format.
 */
const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 400;
  const message = `Invalid ${err.path}`;

  return {
    statusCode,
    message: message.charAt(0).toUpperCase() + message.slice(1),
    errorSources,
  };
};

export default handleCastError;
