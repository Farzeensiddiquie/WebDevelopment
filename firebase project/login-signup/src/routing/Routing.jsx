import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/login/Login";
import SignUp from "../pages/signUp/SignUp";
import Home from "../pages/home/home";
import { auth } from "../config/firebaseconfig";
import PrivateRoute from "../config/auth";

function Routing() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  if (loading) {
    return <div className="loading-bar">
  <div className="loading-progress"></div>
</div>; 
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/home" replace /> : <Login />} 
      />
      <Route 
        path="/home" 
        element={
          <PrivateRoute user={user}>
            <Home />
          </PrivateRoute>
        } 
      />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default Routing;