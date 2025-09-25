import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const user = useSelector((state) => state.user.userDetails);
    const isLogged = useSelector((state) => state.user.isLogged);
    const location = useLocation();
    const isAuthenticated = (user && Object.keys(user).length > 0) || isLogged;

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    return children;
};

export default ProtectedRoute;
