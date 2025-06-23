import { Link } from "react-router";
import { useState } from "react";
import { auth, db } from "../../config/firebaseconfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
  import { ToastContainer, toast } from 'react-toastify'
function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: user.email,
        });
      }
      console.log("User created:", user);
      toast.success("Account created successfully!!",{
        positon:"top-center",
    },);
    } catch (error) {
        toast.error("Email already Registered!!",{
            positon:"bottom-center",
        },);
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Get started with your free account</p>

        <form onSubmit={handleSignUp} className="auth-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              className="form-input"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              className="form-input"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <small className="form-hint">
              Use 8 or more characters with a mix of letters, numbers & symbols
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
              className="form-input"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="terms-agreement">
            <input required type="checkbox" id="terms" className="checkbox" />
            <label htmlFor="terms" className="checkbox-label">
              I agree to the{" "}
              <a href="#" className="inline-link">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="inline-link">
                Privacy Policy
              </a>
            </label>
          </div>

          <button type="submit" className="auth-button">
            Create Account
          </button>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/" className="auth-link">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
        <ToastContainer />
    </div>
  );
}

export default SignUp;
