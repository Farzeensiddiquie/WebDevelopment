import { Link } from "react-router";
import  { useState } from "react";
import { auth } from "../../config/firebaseconfig";
import { toast } from "react-toastify"
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer } from "react-toastify";
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async(e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "/home";
            toast.success("Login Successful", {
                position: "top-center",
            });
            console.log("User logged in Successfully" );
        } catch (error) {
            toast.error("Invalid email or password", {
                position: "top-center",
            });
            console.error("Error logging in:", error.message);
            
        }
       
    };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Please enter your credentials to login</p>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="form-input"
                onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="form-input"
                onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-button">
            Login
          </button>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Login;
