import express from "express";
import {
  loginUser,
  registerUser,
  verifyUser,
  getMe,
  logout,
} from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/register", registerUser);

router.get("/verify/:token", verifyUser);
router.post("/login", loginUser);

router.get("/me", isLoggedIn, getMe);
router.get("/logout", isLoggedIn, logout);

export default router;
