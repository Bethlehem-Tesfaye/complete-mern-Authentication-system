import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodeMailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "missing details" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "user already exists" });
    }
    const hashedPassord = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassord });
    await user.save(); //new user saved to userModel and saved to DB

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      // maxAge:7 * 24 * 60 * 60 * 1000,//in ms
    });

    // if successfully register send email 

    // sending welcome email
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Welcome Email',
        text: `Welcome, Your account has beeen created with email id: ${email}`
    };

    await transporter.sendMail(mailOptions)

    return res.json({
      success: true,
      message: "registered",
      name: user.name,
      email: user.email,
      password: user.password,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "email and password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "invaild email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "invaild password" });
      
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      // maxAge:7 * 24 * 60 * 60 * 1000,//in ms
    });

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      // maxAge:7 * 24 * 60 * 60 * 1000,//in ms
    });

    return res.json({ success: true, message: "looged out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// vertificatio otp to users email
export const sendVerifyOtp = async (req, res)=>{
  try {
    const {userId} = req.body;

    const user = await userModel.findById(userId);

    if(user.isAccountVertified){
      return res.json({success:false, message:"account already vertified"})
    }

    const otp= String(Math.floor(100000 + Math.random()*900000)); //number from 100000, 900000


    user.vertifyOtp = otp;
    user.vertifyOtpExpireAt = Date.now()+24*60*60*1000;// one day later
    await user.save();

    // sending oyp email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: ' Account verification OTP',
      text: `Your OTP is: ${otp}. verify your account using this OTP`
  };

  await transporter.sendMail(mailOptions);

  return res.json({success:true, message:"verification OTP sent on Email"})

  } catch (error) {;
    res.json({success:false, message:error.message})
  }
}

export const verifyEmail=async (req, res)=>{
  const {userId, otp} = req.body;
  if(!userId || !otp){
    return res.json({success:false, message:"MIssing details"})
  }

  try {
    const user = await userModel.findById(userId);
    if(!user){{
      return res.json({success:false, message:"user not found"})
    }}

    if(user.vertifyOtp==='' || user.vertifyOtp!==otp){
      return res.json({success:false, message:"invaild otp"})
    }

    if(user.vertifyOtpExpireAt < Date.now()){
      return res.json({success:false, message:"otp is expired"})
    }

    user.isAccountVertified = true;
    user.vertifyOtp="";
    user.vertifyOtpExpireAt=0;
    await user.save();

    return res.json({success:true, message:"email verified successfully otp"})


  } catch (error) {
    res.json({ success: false, message: error.message });
  }

}

// to check if the user is authenticated 
export const isAuthenticated  = async (req,res)=>{
  try {
    return res.json({success:true})
  } catch (error) {
    res.json({success:false, message:error.message})
  }
}

// set password top
export const sendResetOtp = async (req,res)=>{
  const {email} = req.body;
  if(!email){
    return res.json({succes:false, message:"emial is required"})
  }
  try {
    const user = await userModel.findOne({email});
      if(!user){
        return res.json({succes:false, message:"user not found"});
      }

    const otp= String(Math.floor(100000 + Math.random()*900000)); //number from 100000, 900000


    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now()+50*60*1000;// 50 min
    await user.save();

    // sending otp email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Password Rest OTP',
      text: `Your OTP for resetting your password id ${otp}. Use this OTP tp proceed with resetting your password`
  };
  await transporter.sendMail(mailOptions);
  
    return res.json({success:true, message:"verification OTP sent on Email"})
    
  } catch (error) {
    res.json({succes:false, message:error.message})
    
  }
}

// reset password
export const resetPassword = async (req,res)=>{
  const {email, otp, newPassword} =req.body;

  if(!email || !otp || !newPassword){
    return res.json({success:false, message:"email. otp and new password are required "})
  }

  try {
    const user = await userModel.findOne({email});
    if(!user){
      return res.json({succes:false, message:"user not found"});
    }

    if(user.resetOtp==="" || user.resetOtp!== otp){
      return res.json({succes:false, message:"invalid OTP"});
    }
    if(user.resetOtpExpireAt< Date.now()){
      return res.json({succes:false, message:"OTP expired"});

    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp="";
    user.resetOtpExpireAt=0;

    await user.save()

    return res.json({succes:true, message:"Password has been reset successfully"})

  } catch (error) {
    res.json({succes:false, message:error.message})
    
  }
}