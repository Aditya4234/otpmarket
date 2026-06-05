import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validate(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => void;
export function validate(schemas: ValidationSchemas): (req: Request, res: Response, next: NextFunction) => void;

export function validate(schemaOrSchemas: ZodSchema | ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if ('parse' in schemaOrSchemas) {
      const result = schemaOrSchemas.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          statusCode: 400,
          errors: formatZodErrors(result.error),
        });
        return;
      }
      req.body = result.data;
    } else {
      const schemas = schemaOrSchemas as ValidationSchemas;
      const errors: Record<string, unknown> = {};

      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          errors.body = formatZodErrors(result.error);
        } else {
          req.body = result.data;
        }
      }

      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          errors.query = formatZodErrors(result.error);
        } else {
          req.query = result.data;
        }
      }

      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          errors.params = formatZodErrors(result.error);
        } else {
          req.params = result.data as Request['params'];
        }
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          statusCode: 400,
          errors,
        });
        return;
      }
    }

    next();
  };
}

function formatZodErrors(error: ZodError): Array<{ field: string; message: string }> {
  return error.errors.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }));
}
