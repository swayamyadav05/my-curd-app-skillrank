import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import PasswordInput from "./PasswordInput";
import { CiUser } from "react-icons/ci";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !password) {
      setError("Username and password are required.");
      return false;
    }
    setError(null);
    return true;
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
          body: JSON.stringify({ action: "login", username, password }),
        }
      );
      const data = await response.json();

      if (
        response.ok &&
        data.body &&
        JSON.parse(data.body).message === "Login successful !!"
      ) {
        onLogin();
        navigate("/home");
      } else {
        setError(data.error || "Login failed. Check credentials or try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-container">
        <h2>Login</h2>
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
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPassword={showPassword}
            togglePasswordVisibility={() => setShowPassword(!showPassword)}
            placeholder="Password"
            id="password"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p>
          Don't have an account? <a href="/signup">Sign up here</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
