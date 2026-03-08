import express from 'express';
import { googleAuth, logout } from '../controllers/auth.controller.js';

const authRouter = express.Router();//sare fun auth router usme get ppst sab hota hai

authRouter.post("/google",googleAuth)
authRouter.get("/logout",logout)
export default authRouter;
//http :localhost:8000/api/auth/google --json name="Neeta" email="