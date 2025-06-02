import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const publicRouter = new express.Router();
publicRouter.post("/api/users", userController.register);
publicRouter.post("/api/users/login", userController.login);
publicRouter.get("/api/users", authMiddleware, userController.getUser);
publicRouter.get("/api/users/all",  userController.getAllUsers);

export { publicRouter };
