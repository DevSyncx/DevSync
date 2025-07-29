import { AppContext } from "@/Context/AppContext";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const [formMode, setFormMode] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { backendUrl, token, setToken, profileName, setProfileName } =
    useContext(AppContext);

  const toggleFormMode = () =>
    setFormMode((prev) => (prev === "Login" ? "Register" : "Login"));

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (formMode === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
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
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
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
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0eafc] to-[#cfdef3] dark:from-gray-900 dark:to-gray-800 px-4">
      <p className="my-10 text-4xl font-semibold text-center dark:text-white">
        Welcome to{" "}
        <span className="text-indigo-600 dark:text-indigo-400 text-5xl">
          Devsync
        </span>
      </p>
      <div className="bg-white dark:bg-gray-900 shadow-md dark:shadow-lg rounded-xl w-full max-w-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
          {formMode === "Login"
            ? "Login to your account"
            : "Create a new account"}
        </h2>

        <form onSubmit={submitHandler} className="space-y-4">
          {formMode === "Register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-3 cursor-pointer text-gray-500 dark:text-gray-400"
              >
                {showPassword ? "👁️" : "👁️"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-lg py-2 font-semibold transition"
          >
            {formMode === "Login" ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          {formMode === "Login" ? (
            <>
              New here?{" "}
              <span
                onClick={toggleFormMode}
                className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer"
              >
                Create an account
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={toggleFormMode}
                className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer"
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
