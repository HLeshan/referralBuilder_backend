import { Router } from "express";
import { userController } from "../controllers/user.controller";
import validateResource from "../middleware/validate-resource";
import { createUserSchema, loginUserSchema } from "../schema/user.schema";

const routes = Router();

routes.get("/", userController.index);

routes.post(
    "/create",
    validateResource(createUserSchema),
    userController.createUser
);

routes.post(
    "/login",
    validateResource(loginUserSchema),
    userController.loginUser
);

export default routes;
