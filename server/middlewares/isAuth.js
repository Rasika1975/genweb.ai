
import jwt from "jsonwebtoken";
import user from "../models/user.models.js";
const isAuth = async (req,res,next) => {     //
try{
    const token = req.cookies.token;//client se aane wale request me cookies me token hota hai usko read karne ke liye ye code likha hai
    if(!token){
        return res.status(400).json({message:" token not found"})
    }
   const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await user.findById(decoded.id);
    next();
    //ye;//ye code isliye likha hai taki aage ke code me hum user ki information ko access kar sake
}
catch(error){
    return res.status(500).json({message:"invalid token"})
}
}
export default isAuth;

