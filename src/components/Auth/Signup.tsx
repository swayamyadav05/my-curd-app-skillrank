import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput";
import "./Auth.css";
import { CiUser, CiMail } from "react-icons/ci";

interface SignupProps {
  onSignup: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateForm = () => {
    setError(null);
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const checkPasswordStrength = (password: string) => {
    if (password.length < 6) setPasswordStrength("weak");
    else if (password.length < 10) setPasswordStrength("moderate");
    else setPasswordStrength("strong");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(
        "https://qublrgg2p0.execute-api.us-east-1.amazonaws.com/default/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "signup", username, email, password }),
        }
      );
      const data = await response.json();

      if (
        response.ok &&
        data.body &&
        JSON.parse(data.body).message === "Signup successful !!"
      ) {
        onSignup();
        navigate("/home");
      } else {
        setError(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-container">
        <h2>Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              aria-label="Username"
              className={error ? "input-error" : ""}
            />
            <CiUser className="input-icon" />
          </div>
          <div className="input-container">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email"
              className={error ? "input-error" : ""}
            />
            <CiMail className="input-icon" />
          </div>
          <PasswordInput
            value={password}
            onChange={handlePasswordChange}
            showPassword={showPassword}
            togglePasswordVisibility={() => setShowPassword(!showPassword)}
            placeholder="Password"
            id="password"
          />
          {passwordStrength && (
            <p className={`password-strength ${passwordStrength}`}>
              Password strength: {passwordStrength}
            </p>
          )}
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPassword={showConfirmPassword}
            togglePasswordVisibility={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            placeholder="Confirm Password"
            id="confirmPassword"
          />
          <button type="submit" className="login-button">
            Sign Up
          </button>
        </form>
        <p>
          Already have an account? <a href="/login">Log in here</a>.
        </p>
      </div>
    </div>
  );
};

export default Signup;
