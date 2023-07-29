import type { NextFunction, Request, Response } from "express";
import createError from "http-errors";
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

import prisma from "../services/prisma";

export const userController = {
    async index(req: Request, res: Response, next: NextFunction) {
        prisma.user
            .findMany({
                select: {
                    username: true,
                    firstName: true
                },
            })
            .then((users) =>
                res.json({
                    code: 1000,
                    status: "Success",
                    userData: users,
                })
            )
            .catch((error) => next(createError(400, error)));
    },

    async createUser(req: Request, res: Response, next: NextFunction) {
        const userData = req.body;
        bcrypt.hash(userData.password, 10, (err: any, hash: string) => {
            if (err) {
                res.status(500).json({
                    error: err,
                });
            } else {
                prisma.user
                    .create({
                        data: {
                            username: userData.username,
                            password: hash,
                            firstName: userData.firstName,
                        },
                    })
                    .then((user) =>
                        res.json({
                            code: 1000,
                            status: "User Added Successfully",
                        })
                    )
                    .catch((error) => next(createError(400, error)));
            }
        });
    },

    async loginUser(req: Request, res: Response, next: NextFunction) {
        const userData = req.body;

        prisma.user
            .findUniqueOrThrow({
                where: {
                    username: userData.username,
                },
            })
            .then((user) => {
                bcrypt.compare(
                    userData.password,
                    user.password,
                    (err: any, result: boolean) => {
                        if (err) {
                            next(createError(401, "Auth Failed"));
                        }

                        if (result) {
                            const token = jwt.sign(
                                {
                                    username: user.username,
                                    firstName: user.firstName,
                                },
                                process.env.JWT_SECRET,
                                { expiresIn: "1h" }
                            );
                            res.json({
                                code: 1000,
                                status: "Success",
                                userData: {
                                    username: user.username,
                                    firstName: user.firstName,
                                    token,
                                },
                            });
                        } else {
                            next(createError(401, "Auth Failed"));
                        }
                    }
                );
            })
            .catch((error) => next(createError(401, "Auth Failed")));
    },
};
