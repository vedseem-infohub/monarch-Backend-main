import express from "express";
import { LogOut, Login, signUp, getMe, adminLogin, getAdminMe } from "../controllers/auth.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/register", signUp);
authRouter.post("/signin", Login);
authRouter.post("/login", Login);
authRouter.post("/admin-login", adminLogin);
authRouter.get("/admin-me", isAdmin, getAdminMe);
authRouter.get("/me", isAuth, getMe);
authRouter.get("/logout", LogOut);
authRouter.post("/logout", LogOut);

export default authRouter;
