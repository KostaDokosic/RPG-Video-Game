import { validationResult, ValidationChain } from 'express-validator';
import { Request, Response } from 'express';

export function ValidateSchema(schema: ValidationChain[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (req: Request, res: Response) {
      Promise.all(schema.map((validator) => validator.run(req))).then(() => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            errors: errors.array({ onlyFirstError: true }),
          });
        }
        originalMethod.call(this, req, res);
      });
    };

    return descriptor;
  };
}
