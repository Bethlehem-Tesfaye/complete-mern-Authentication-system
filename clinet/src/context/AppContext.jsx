import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();
axios.defaults.withCredentials = true;


export const AppContextProvider = (props) => {
  axios.defaults.withCredentials=true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsloggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const getAuthState = async ()=>{
    try {

        const {data} = await axios.get(backendUrl+"/api/auth/is-auth")
        if(data.success){
            setIsloggedin(true);
            getUserData();
        }
    } catch (error) {
        toast.error(error.message)
    }
  }

  const getUserData = async ()=>{
    try {
        const {data} = await axios.get(backendUrl+'/api/user/data')

        data.success? setUserData(data.userData):toast.error(data.message)
    } catch (error) {
        toast.error(error.message);
    }
  }
 
  useEffect(()=>{
    getAuthState();
  },[])  // so when ever we first loads we check the users authenetication states and get the user data  

  const value = {
    backendUrl,
    isLoggedin,
    setIsloggedin,
    userData,
    setUserData,
    getUserData
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};
