import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userIP, setUserIP] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  // ✅ Get User IP Address
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await axios.get("https://api64.ipify.org?format=json");
        setUserIP(response.data.ip);
      } catch (error) {
        console.error("Failed to fetch IP:", error);
      }
    };
    fetchIP();
  }, []);

  // ✅ Handle User Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const authResponse = await axios.post("http://127.0.0.1:8000/auth/login", {
        username_or_email: usernameOrEmail,
        password: password,
      });

      const token = authResponse.data.access_token;
      localStorage.setItem("token", token);

      // ✅ Decode Token & Check Expiry
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        alert("Session expired, please login again.");
        return;
      }

      // ✅ Get Location Info from IP
      let city = "Unknown";
      let country = "Unknown";
      try {
        const locationResponse = await axios.get(`https://ipapi.co/${userIP}/json/`);
        city = locationResponse.data.city || "Unknown";
        country = locationResponse.data.country_name || "Unknown";
      } catch (error) {
        console.warn("Failed to fetch location data:", error);
      }

      // ✅ Get Device Info
      const deviceType = navigator.userAgent;

      // ✅ Log Login Activity
      await axios.post("http://127.0.0.1:8000/auth/log-login-activity", {
        username: authResponse.data.user.username,
        email: authResponse.data.user.email,
        ip: userIP,
        city,
        country,
        device_type: deviceType,
      });

      alert("Login successful!");
      navigate("/profile");
    } catch (error) {
      setError(error.response?.data?.detail || "Login failed. Please try again.");
    }
  };

  // ✅ Handle Forgot Password Request
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/forgot-password", {
        email: emailForReset,
      });

      setMessage(response.data.message || "Password reset email sent. Check your inbox.");
    } catch (error) {
      setError(error.response?.data?.detail || "Failed to send reset email. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">{isForgotPassword ? "Forgot Password" : "Login"}</h2>
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}

        {!isForgotPassword ? (
          // 🔹 Login Form
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username or Email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </form>
        ) : (
          // 🔹 Forgot Password Form
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={emailForReset}
              onChange={(e) => setEmailForReset(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send Reset Link
            </button>
          </form>
        )}

        {/* 🔹 Forgot Password Toggle */}
        <p className="text-center">
          {!isForgotPassword ? (
            <button
              onClick={() => setIsForgotPassword(true)}
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          ) : (
            <button
              onClick={() => setIsForgotPassword(false)}
              className="text-blue-600 hover:underline"
            >
              Back to Login
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;