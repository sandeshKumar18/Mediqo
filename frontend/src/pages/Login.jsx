import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Stethoscope } from "lucide-react";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // If already logged in, redirect to home
  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          password,
          email,
        });

        if (data.success) {
          toast.success("Account created! Please log in.");
          setName("");
          setEmail("");
          setPassword("");
          setState("Login"); 
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          password,
          email,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Login successful");
          navigate("/"); // redirect to home after login
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const isSignUp = state === "Sign Up";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-sm bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
            <Stethoscope size={20} className="text-indigo-600" />
          </div>

          <p className="text-xl font-semibold text-gray-900">
            {isSignUp ? "Create account" : "Welcome back"}
          </p>

          <p className="text-sm text-gray-400 mt-1">
            {isSignUp
              ? "Sign up to book your appointment"
              : "Log in to manage your appointments"}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmitHandler}
          className="px-6 pb-8 flex flex-col gap-4"
        >
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-gray-500">
                Password
              </label>
              {!isSignUp && (
                <span className="text-xs text-indigo-600 cursor-pointer hover:underline">
                  Forgot password?
                </span>
              )}
            </div>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-1 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] transition-all duration-150"
          >
            {isSignUp ? "Create account" : "Log in"}
          </button>

          <p className="text-center text-sm text-gray-400">
            {isSignUp ? "Already have an account?" : "New to Care Connect?"}
            <span
              onClick={() => {
                setState(isSignUp ? "Login" : "Sign Up");
                setName("");
                setEmail("");
                setPassword("");
              }}
              className="ml-1 text-indigo-600 font-medium cursor-pointer hover:underline"
            >
              {isSignUp ? "Log in" : "Sign up"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
