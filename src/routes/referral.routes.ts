import { Router } from "express";
import { referralController } from "../controllers/referral.controller";
import validateResource from "../middleware/validate-resource";
import { createReferralSchema } from "../schema/referral.schema";

const routes = Router();

routes.get("/search/", referralController.index);

routes.post(
    "/",
    validateResource(createReferralSchema),
    referralController.addReferral
);

routes.get("/:refId", referralController.getReferral);

routes.put(
    "/:refId",
    validateResource(createReferralSchema),
    referralController.updateReferral
);

routes.delete("/:refId", referralController.deleteReferral);

export default routes;
