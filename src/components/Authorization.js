import React, { useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import Unauthorized from "../components/Unauthorized";
// import { useAuth } from "../provider/AuthProvider";



const Authorization = ({ user, permissions }) => {


    // const { user } = useAuth();
    // const location = useLocation();
    // if (user.username) {
    const userpermission = user.permissions;
    console.log("userpermission", userpermission);
    console.log("permissions", permissions);
    const isAllowed = permissions.some((allowed) => userpermission.includes(allowed));
    console.log("isAllowed", isAllowed);
    return isAllowed ? <Outlet /> : <Unauthorized />;
    // }
    // return <Navigate to="/login" state={{ path: location.pathname }} replace />;
};
export default Authorization;