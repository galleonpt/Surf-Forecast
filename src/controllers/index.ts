import { CUSTOM_VALIDATION } from '@src/models/user';
import APIError, { ApiError } from '@src/util/errors/api-error';
import { Response } from 'express';
import mongoose from 'mongoose';

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(
    response: Response,
    error: mongoose.Error.ValidationError | Error
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);
      response.status(clientErrors.code).send(
        APIError.format({
          code: clientErrors.code,
          message: clientErrors.error,
        })
      );
    } else
      response.status(500).send(
        APIError.format({
          code: 500,
          message: 'Something went wrong',
        })
      );
  }

  private handleClientErrors(
    error: mongoose.Error.ValidationError
  ): { code: number; error: string } {
    const duplicatedKindErrors = Object.values(error.errors).filter(
      (err) => err.kind === CUSTOM_VALIDATION.DUPLICATED
    );

    if (duplicatedKindErrors.length) {
      return {
        code: 409,
        error: error.message,
      };
    } else {
      return {
        code: 422,
        error: error.message,
      };
    }
  }

  protected sendErrorResponse(
    response: Response,
    apiError: ApiError
  ): Response {
    return response.status(apiError.code).send(APIError.format(apiError));
  }
}
