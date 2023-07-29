import axios from "axios";
import type { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import prisma from "../services/prisma";

export const referralController = {
    async index(req: Request, res: Response, next: NextFunction) {
        const options: any = {
            select: {
                firstName: true,
                lastName: true,
                email: true,
                mobile: true,
                id: true,
            },
            orderBy: {
                firstName: "asc",
            },
        };
        const countOptions: any = {};
        const perPage = Number(req.query.perPage || 10);
        const currentPage = Math.max(Number(req.query.page || 1), 1);

        if (req.query) {
            for (const [key, value] of Object.entries(req.query)) {
                if (key === "perPage") {
                    options.take = perPage;
                } else if (key === "page") {
                    options.skip = (currentPage - 1) * perPage;
                } else {
                    options.where = {
                        [key]: { contains: value },
                    };
                }
            }
            countOptions.where = options.where;
        }

        const referrals = await prisma.referral.findMany(options);
        const resultCount = await prisma.referral.count(countOptions);

        res.json({
            code: 1000,
            status: "Success",
            referralData: referrals,
            pagination: {
                totalResults: resultCount,
                page: currentPage,
                perPage: perPage,
            },
        });
    },

    async getReferral(req: Request, res: Response, next: NextFunction) {
        const refId = req.params.refId;
        prisma.referral
            .findUniqueOrThrow({
                where: {
                    id: refId,
                },
            })
            .then((referral) =>
                res.json({
                    code: 1000,
                    status: "Referral Retrieved Successfully",
                    referralData: referral,
                })
            )
            .catch((error) => next(createError(400, "Bad Request")));
    },

    async addReferral(req: Request, res: Response, next: NextFunction) {
        const referralData = req.body;
        prisma.referral
            .create({
                data: referralData,
            })
            .then(async (referral) => {
                const response = await axios.get(
                    `http://localhost:3000/api/unprotected/referrals/${referral.id}`
                );
                if (response.data.code === 1000) {
                    res.json({
                        code: 1000,
                        status: "Added Successfully",
                        referralData: response.data.referralData,
                    });
                } else {
                    return next(createError(400, "Request Failed"));
                }
            })
            .catch((error) => next(createError(400, "Bad Request")));
    },

    async updateReferral(req: Request, res: Response, next: NextFunction) {
        const refId = req.params.refId;
        const referralData = req.body;
        prisma.referral
            .update({
                where: {
                    id: refId,
                },
                data: referralData,
            })
            .then((referral) =>
                res.json({
                    code: 1000,
                    status: "Updated Successfully",
                    referralData: referral,
                })
            )
            .catch((error) => next(createError(400, "Bad Request")));
    },

    async deleteReferral(req: Request, res: Response, next: NextFunction) {
        const refId = req.params.refId;
        const referral = await prisma.referral
            .delete({
                where: {
                    id: refId,
                },
            })
            .then((referral) =>
                res.json({
                    code: 1000,
                    status: "Deleted Successfully",
                    referralData: referral,
                })
            )
            .catch((error) => next(createError(400, error)));
    },
};
