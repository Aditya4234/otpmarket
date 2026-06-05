import { Response } from 'express';

export class ApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data?: unknown;
  errors?: unknown;
  meta?: Record<string, unknown>;

  constructor(
    statusCode: number,
    message: string,
    data?: unknown,
    errors?: unknown,
    meta?: Record<string, unknown>,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.data = data;
    this.errors = errors;
    this.meta = meta;
  }

  send(res: Response): void {
    res.status(this.statusCode).json(this);
  }
}

export class SuccessResponse extends ApiResponse {
  constructor(message: string, data?: unknown, meta?: Record<string, unknown>) {
    super(200, message, data, undefined, meta);
  }
}

export class CreatedResponse extends ApiResponse {
  constructor(message: string, data?: unknown) {
    super(201, message, data);
  }
}

export class ErrorResponse extends ApiResponse {
  constructor(statusCode: number, message: string, errors?: unknown) {
    super(statusCode, message, undefined, errors);
  }
}

export class BadRequestResponse extends ErrorResponse {
  constructor(message = 'Bad Request', errors?: unknown) {
    super(400, message, errors);
  }
}

export class UnauthorizedResponse extends ErrorResponse {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenResponse extends ErrorResponse {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundResponse extends ErrorResponse {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class ConflictResponse extends ErrorResponse {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}

export class TooManyRequestsResponse extends ErrorResponse {
  constructor(message = 'Too many requests') {
    super(429, message);
  }
}

export class InternalServerErrorResponse extends ErrorResponse {
  constructor(message = 'Internal Server Error') {
    super(500, message);
  }
}

export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
