import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaHome } from "react-icons/fa";

axios.defaults.withCredentials = true;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);
  const { backendUrl } = useContext(AppContent);

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
        if (index === pasteArray.length - 1) inputRefs.current[index].focus();
      }
    });
    e.preventDefault();
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((el) => el.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmited(true);
  };

  const onSubmitPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, newPassword }
      );
      data.succes ? toast.success(data.message) : toast.error(data.message);
      if (data.succes) navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-red-200 to-yellow-200 px-4 sm:px-0">
      <FaHome
        className="absolute left-2 sm:left-20 top-5 w-10 h-10 text-red-400 cursor-pointer"
        onClick={() => navigate("/")}
        aria-label="Home"
      />

      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-black"
        >
          <h1 className="text-2xl font-semibold text-red-600 text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-red-400">
            Enter your registered email address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-yellow-100 focus-within:ring-2 focus-within:ring-red-300">
            <img src={assets.mail_icon} alt="mail icon" className="w-5 h-5" />
            <input
              type="email"
              placeholder="Enter email"
              className="bg-transparent outline-none text-black placeholder-red-300 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-yellow-300 via-red-300 to-yellow-300 text-black rounded-full font-semibold hover:brightness-105 transition duration-200">
            Submit
          </button>
        </form>
      )}

      {!isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-black"
        >
          <h1 className="text-2xl font-semibold text-red-600 text-center mb-4">
            Reset Password OTP
          </h1>
          <p className="text-center mb-6 text-red-400">
            Enter the 6-digit code sent to your email.
          </p>
          <div className="flex justify-between mb-8">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  required
                  className="w-12 h-12 bg-yellow-100 text-red-600 text-center text-xl rounded-md outline-none focus:ring-2 focus:ring-red-300"
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                />
              ))}
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-yellow-300 via-red-300 to-yellow-300 text-black rounded-full font-semibold hover:brightness-105 transition duration-200">
            Submit
          </button>
        </form>
      )}

      {isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitPassword}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-black"
        >
          <h1 className="text-2xl font-semibold text-red-600 text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-red-400">
            Enter your new password
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-yellow-100 focus-within:ring-2 focus-within:ring-red-300">
            <img src={assets.lock_icon} alt="lock icon" className="w-5 h-5" />
            <input
              type="password"
              placeholder="Enter password"
              className="bg-transparent outline-none text-black placeholder-red-300 w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-yellow-300 via-red-300 to-yellow-300 text-black rounded-full font-semibold hover:brightness-105 transition duration-200">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
