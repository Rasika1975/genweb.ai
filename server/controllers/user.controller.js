
import { generateResponse } from "../config/openRouter.js"
import User from "../models/user.models.js";

export const getCurrentUser = async (req,res)=> {
try{
   if(!req.user){
    return res.json({user:null})
   }
    return res.json(req.user)
}
catch(error){
    return res.status(500).json({message:`get current user error ${error}`})
}
}

export const updateCredits = async (req, res) => {
    try {
        const { credits } = req.body;
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.credits = (user.credits || 0) + Number(credits);
        await user.save();

        return res.json({ success: true, message: "Credits updated successfully", user });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Update credits error ${error}` });
    }
};
