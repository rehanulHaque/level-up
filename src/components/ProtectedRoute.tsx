import { onAuthStateChanged } from "firebase/auth";
import { ReactNode, useEffect, useState } from "react";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode}) => {
    const [user, setUser] = useState("")
    const getUser = async() =>{
        const player = await onAuthStateChanged(auth, (user) => {
            setUser(user?.displayName || "")
        })
        player()
    }
    useEffect(() =>{
        getUser()
    }, [getUser])
    console.log(user)
    if(user == ""){
        return <Navigate to={'/login'}/>
    }
    return children
};

export default ProtectedRoute;
