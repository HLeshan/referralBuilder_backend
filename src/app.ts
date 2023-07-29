import express from "express";
import { referralRoutes, userRoutes } from "./routes";
import checkAuth from "./middleware/check-auth";

import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

class App {
    public server;

    constructor() {
        this.server = express();

        this.middleware();
        this.routes();
    }

    middleware() {
        this.server.use(express.json());
    }

    routes() {
        this.server.use("/api/users", userRoutes);
        this.server.use("/api/referrals", checkAuth, referralRoutes);

        this.server.use((req: Request, res: Response, next: NextFunction) => {
            const error: any = new Error("Not Found");
            error.status = 404;
            next(error);
        });

        this.server.use(
            (error: any, req: Request, res: Response, next: NextFunction) => {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    let message = "Bad Request";
                    switch (error.code) {
                        case "P2025":
                            message = "Item Not found";
                            break;

                        default:
                            break;
                    }

                    res.status(400);
                    res.json({
                        status: error.code,
                        message: message,
                    });
                } else if (
                    error instanceof Prisma.PrismaClientValidationError
                ) {
                    res.status(400);
                    res.json({
                        status: 400,
                        message: "Bad Request",
                    });
                } else {
                    res.status(error.status || 500);
                    res.json({
                        status: error.status || 500,
                        message: error.message,
                    });
                }
            }
        );
    }
}

export default new App().server;
