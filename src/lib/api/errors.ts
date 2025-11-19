import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Standard API error response format
 */
export interface ApiError {
  error: string;
  message: string;
  details?: any;
  statusCode: number;
}

/**
 * API error class
 */
export class ApiException extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "ApiException";
  }
}

/**
 * Common API errors
 */
export const ApiErrors = {
  Unauthorized: () => new ApiException("Unauthorized", 401),
  Forbidden: (message = "Access forbidden") => new ApiException(message, 403),
  NotFound: (resource = "Resource") => new ApiException(`${resource} not found`, 404),
  BadRequest: (message = "Bad request") => new ApiException(message, 400),
  ValidationError: (details: any) => new ApiException("Validation failed", 400, details),
  LimitExceeded: (message: string) => new ApiException(message, 429),
  ServerError: (message = "Internal server error") => new ApiException(message, 500),
};

/**
 * Format Zod validation errors
 */
export function formatZodError(error: ZodError) {
  return error.issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
}

/**
 * Error handler wrapper for API routes
 */
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      const result = await handler(...args);
      return result as any;
    } catch (error) {
      console.error("API Error:", error);

      // Handle Zod validation errors
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: "Validation Error",
            message: "Invalid input data",
            details: formatZodError(error),
            statusCode: 400,
          } as ApiError,
          { status: 400 }
        );
      }

      // Handle custom API exceptions
      if (error instanceof ApiException) {
        return NextResponse.json(
          {
            error: error.name,
            message: error.message,
            details: error.details,
            statusCode: error.statusCode,
          } as ApiError,
          { status: error.statusCode }
        );
      }

      // Handle unknown errors
      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: error instanceof Error ? error.message : "An unexpected error occurred",
          statusCode: 500,
        } as ApiError,
        { status: 500 }
      );
    }
  };
}

/**
 * Success response helper
 */
export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Paginated response helper
 */
export function apiPaginated<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) {
  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
}
