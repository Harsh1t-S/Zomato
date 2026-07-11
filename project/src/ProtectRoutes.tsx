import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, Role } from "./context/AuthContext";

type ProtectRoutesProps = {
    children: React.ReactNode;
    roles?: Role[]; // if provided, only these roles may access
};

function ProtectRoutes({ children, roles }: ProtectRoutesProps) {
    const { isLoggedIn, user } = useAuth();
    const location = useLocation();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (roles && user && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export default ProtectRoutes;
