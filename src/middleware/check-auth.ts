var jwt = require("jsonwebtoken");
import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

const checkAuth = function (req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        next(createHttpError(401, "Auth Failed"));
    }
};

export default checkAuth;
