import { Router } from "express";
import {
  changePassword,
  registerUser,
  userLogin,
  userLogout,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(userLogin);

// secured routes
router.route("/logout").post(verifyJWT, userLogout);
router.route("/change-password").post(verifyJWT, changePassword);

export default router;
