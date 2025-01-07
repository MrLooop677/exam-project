import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { adminSchoolLogin, studentLogin } from "../api/adminApis";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../layout/footer";
import Header from "../layout/header";

// Define the schema using Zod
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const StudentLogin: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);

  // Extract role from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || "student"; // Default to "student" if role is not specified

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response =
        role === "Student"
          ? await studentLogin(data.username, data.password)
          : await adminSchoolLogin(data.username, data.password);
      console.log("Login successful:", response);
      if (role === "Student") {
        navigate("/assessments");
      } else {
        navigate("/students-files");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      setLoginError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="mt-5">
      <Header
        leftChildren={
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/about">Contact Us</a>
            </li>
          </ul>
        }
        rightChildren={
          <div
            className="
        flex
        gap-4
        "
          >
            <button
              className="login-btn"
              onClick={() => navigate("/pre-login")}
            >
              Login
            </button>

            <div className="header-circle"></div>
          </div>
        }
      />
      <div className="flex flex-col md:flex-row min-h-screen bg-white mt-10">
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            src="/assets/login/login-ill.svg"
            alt="Students"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          <h2 className="text-2xl font-semibold mb-4">Login as a {role}</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
            {/* Display login error message */}
            {loginError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {loginError}
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full h-[57px] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your username"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full h-[57px] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full h-[57px] text-[14px] font-bold bg-[#9A7ED9] text-white rounded-lg hover:bg-purple-700 transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentLogin;
