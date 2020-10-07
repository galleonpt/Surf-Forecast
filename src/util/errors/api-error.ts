import httpStatusCode from 'http-status-codes';

export interface ApiError {
  message: string;
  code: number;
  codeAsString?: string;
  description?: string;
  documentation?: string;
}

export interface ApiErrorResponse extends Omit<ApiError, 'codeAsString'> {
  error: string;
}

export default class APIError {
  public static format(error: ApiError): ApiErrorResponse {
    return {
      ...{
        message: error.message,
        code: error.code,
        error: error.codeAsString
          ? error.codeAsString
          : httpStatusCode.getStatusText(error.code),
      },
      ...(error.documentation && { documentation: error.documentation }),
      ...(error.description && { description: error.description }),
    };
  }
}
