import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

type ProtectRoutesProps = {
    children: React.ReactNode;
};

function ProtectRoutes({ children }: ProtectRoutesProps) {
    const { isLoggedIn } = useAuth();
    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    
    return <>{children}</>;
}

export default ProtectRoutes;