import { Router } from "express";
import { referralController } from "../controllers/referral.controller";

const routes = Router();

routes.get("/:refId", referralController.getReferral);

export default routes;
