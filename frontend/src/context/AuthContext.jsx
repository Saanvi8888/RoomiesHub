import React, { createContext, useEffect, useState ,useContext} from 'react'
import API,{authAPI} from '../api/axios';
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [token,setToken] = useState(localStorage.getItem("token") || null)
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if(storedToken && storedUser){
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }

        setLoading(false)
    },[])

    const saveAuth = (newToken, newUser) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const signup = async(name,email,password) => {
        const {data} = await authAPI.register({name,email,password})
        saveAuth(data.token,data.user);
        return data;
    }

    const login = async(email,password) => {
        const  {data} = await authAPI.login({email,password});
        saveAuth(data.token,data.user)
        return data;
    }

    const googleLogin = async(googleToken) => {
        const {data} = await authAPI.googleLogin({token:googleToken});
        saveAuth(data.token,data.user);
        return data;
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
        value={{user,token,loading,signup,login,googleLogin,logout}}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
export default AuthContext
