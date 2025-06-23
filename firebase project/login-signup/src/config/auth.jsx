import {Navigate } from "react-router-dom";

const PrivateRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
     return children;
};

export default PrivateRoute;