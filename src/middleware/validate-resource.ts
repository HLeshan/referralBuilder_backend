import createError from "http-errors";
import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod";

const validate =
    (schema: AnyZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (e: any) {
            return next(createError(400, e.errors[0].message));
        }
    };

export default validate;
