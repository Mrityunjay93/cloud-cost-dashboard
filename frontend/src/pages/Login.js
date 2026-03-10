import React, { useState } from "react";
import API from "../services/api";
import { Navigate, useNavigate } from "react-router-dom";
import { getToken, setSession } from "../services/auth";

function Login() {

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const token = getToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const submitAuth = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const payload = isRegisterMode
        ? { name: name.trim(), email: email.trim(), password }
        : { email: email.trim(), password };

      const endpoint = isRegisterMode ? "/auth/register" : "/auth/login";
      const res = await API.post(endpoint, payload);

      setSession({
        token: res.data.token,
        user: res.data.user,
      });

      navigate("/dashboard");

    } catch (err) {
      const apiMessage = err.response?.data?.message || err.response?.data?.error;
      setErrorMessage(apiMessage || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegisterMode(prev => !prev);
    setErrorMessage("");
    setPassword("");
  };

  const formTitle = isRegisterMode ? "Create account" : "Login";
  const subtitle = isRegisterMode
    ? "Register to start tracking cloud charges."
    : "Sign in to track your cloud charges.";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{formTitle}</h2>
        <p className="auth-subtitle">{subtitle}</p>
        {isRegisterMode && (
          <input
            className="text-input"
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}
        <input
          className="text-input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />
        <input
          className="text-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />
        {errorMessage && <p className="form-error">{errorMessage}</p>}
        <button className="primary-btn" onClick={submitAuth} disabled={loading}>
          {loading ? "Please wait..." : formTitle}
        </button>
        <button className="text-btn" onClick={switchMode}>
          {isRegisterMode ? "Already have an account? Login" : "New user? Register"}
        </button>
      </div>
    </div>
  );

}

export default Login;
