import { AppContext } from "@/Context/AppContext";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const [formMode, setFormMode] = useState("Login"); // "Login" or "Register"
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { backendUrl, token, setToken, profileName, setProfileName } =
    useContext(AppContext);

  const toggleFormMode = () => {
    setFormMode((prev) => (prev === "Login" ? "Register" : "Login"));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(backendUrl);

    try {
      if (formMode === "Login") {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (data.success) {
          toast.success(data.message);
          setToken(data.token);
          localStorage.setItem("token", data.token);
          setProfileName(data.username);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          toast.success(data.message);
          setToken(data.token);
          localStorage.setItem("token", data.token);
          setProfileName(data.username);
        } else {
          toast.error(data.message);
        }
      }
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0eafc] to-[#cfdef3] px-4 shadow-2xl">
      <p className="my-10 text-4xl font-semibold text-center">
        Welcome to <span className="text-indigo-600 text-5xl">Devsync</span>
      </p>
      <div className="bg-white shadow-md rounded-xl w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {formMode === "Login"
            ? "Login to your account"
            : "Create a new account"}
        </h2>

        <form onSubmit={submitHandler} className="space-y-4">
          {/* Name Field (only for Register) */}
          {formMode === "Register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-3 cursor-pointer text-gray-500"
              >
                {showPassword ? "👁️" : "👁️"}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
          >
            {formMode === "Login" ? "Login" : "Register"}
          </button>
        </form>

        {/* Toggle between Login/Register */}
        <p className="text-center mt-4 text-sm text-gray-600">
          {formMode === "Login" ? (
            <>
              New here?{" "}
              <span
                onClick={toggleFormMode}
                className="text-blue-600 font-medium cursor-pointer"
              >
                Create an account
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={toggleFormMode}
                className="text-blue-600 font-medium cursor-pointer"
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default SignUp;
