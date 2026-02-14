import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Terminal, Lock, User, ArrowRight } from "lucide-react";

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let result;
    if (isRegistering) {
      result = await register(username, password);
    } else {
      result = await login(username, password);
    }

    if (result.success) {
      navigate("/secure/blog/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center  bg-black text-white p-4 dm-sans">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-white">
            <Terminal size={32} className="text-white" />
            <span>Devtales</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-400 text-center mb-8 text-sm">
            {isRegistering
              ? "Enter your details to register as admin"
              : "Enter your credentials to access the dashboard"}
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
              <span>!</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-gray-400 text-sm font-medium mb-2 pl-1"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  id="username"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 text-white placeholder-gray-600 transition-all font-medium"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-400 text-sm font-medium mb-2 pl-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  id="password"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 text-white placeholder-gray-600 transition-all font-medium"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <span>{isRegistering ? "Sign Up" : "Sign In"}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-zinc-800">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
                setUsername("");
                setPassword("");
              }}
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              {isRegistering
                ? "Already have an account? Sign In"
                : "Need an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
