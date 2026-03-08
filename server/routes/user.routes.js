import express from 'express';
import { getCurrentUser, updateCredits } from '../controllers/user.controller.js';
import isAuth from '../middlewares/isAuth.js';


const userRouter = express.Router();//sare fun auth router usme get ppst sab hota hai

userRouter.get("/me",isAuth,getCurrentUser)
userRouter.post("/update-credits", isAuth, updateCredits);

export default userRouter;