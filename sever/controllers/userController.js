import userModel from "../models/userModel.js"

export const getUserDate  = async (req, res) => {
  try {
    const {userId} = req.body;

    const user = await userModel.findById(userId);
    if(!user){
        return res.json({succes:false, message:"user not found"});
    }
    return res.json({success:true,
        userData:{
            name:user.name,
            isAccountVertified:user.isAccountVertified
        }});
    }catch(error){
        return res.json({succes:false, message:error.message});
    }
}
