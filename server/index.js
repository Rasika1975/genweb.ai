import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import websiteRouter from './routes/website.routes.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());//json data ko read karne ke liye ye ek middelware hai jo request body me json data ko parse karta hai aur usse req.body me store karta hai
app.use(cookieParser());//ye middleware client se aane wale cookies ko parse karta hai aur unhe req.cookies me store karta hai
app.use(cors({
  origin: 'https://genweb-ai-1-cdrc.onrender.com',//ye use hota hai kuiki apna sever kisi frontend se request accept karega uska url dena hota hai
  credentials: true,// token not found error aata hai to isko true karna hota hai
}))
app.use("/api/auth",authRouter)

app.use("/api/user",userRouter)
app.use("/api/website",websiteRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDb();

});
