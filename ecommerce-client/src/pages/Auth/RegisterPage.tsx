import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function RegisterPage() {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister =
    async (e: React.FormEvent) => {

      e.preventDefault();

      try {

        await axiosInstance.post(
          "/Auth/register",
          {
            name,
            email,
            password
          }
        );

        toast.success(
          "Account created successfully"
        );

        navigate("/login");
      }
      catch {

        toast.error(
          "Registration failed"
        );

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
          Register
        </h1>

        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
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
            bg-green-600
            hover:bg-green-700
            py-3
            rounded
            "
          >
            Register
          </button>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400"
            >
              Login
            </Link>
          </p>
        </form>

      </div>

    </MainLayout>
  );
}

export default RegisterPage;