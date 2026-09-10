import { Router } from "express";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  changeCurrentPassword,
} from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//secured routes

router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

export default router;
