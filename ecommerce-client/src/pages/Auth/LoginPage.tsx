import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";


function LoginPage() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin =
    async (e: React.FormEvent) => {

      e.preventDefault();

      try {

        const response =
          await axiosInstance.post(
            "/Auth/login",
            {
              email,
              password
            }
          );

        localStorage.setItem(
          "token",
          response.data.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.data
          )
        );

        toast.success("Login successful");


        navigate("/");
      }
      catch {

        toast.error("Invalid credentials");
      }
    };

  return (
    <MainLayout>

      <div
        className="
        container-custom
        py-10
        max-w-md
        mx-auto
        "
      >
        <h1
          className="
          text-3xl
          font-bold
          mb-6
          "
        >
          Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="
            w-full
            p-3
            rounded
            bg-slate-800
            text-white
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="
            w-full
            p-3
            rounded
            bg-slate-800
            text-white
            "
          />

          <button
            type="submit"
            className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            py-3
            rounded
            "
          >
            Login
          </button>

          <div className="text-right -mt-2">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-400 hover:text-blue-400"
            >
              Forgot Password?
            </Link>
          </div>

          <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400"
          >
            Register
          </Link>
        </p>
          
        </form>

      </div>

    </MainLayout>
  );
}

export default LoginPage;