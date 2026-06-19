import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Button from "../../components/buttons/Button";
import { FaUserPlus } from "react-icons/fa";
import GoogleButton from "../../components/auth/GoogleButton";

import { googleRegister } from "../../services/authService";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/Auth/register", {
        name,
        email,
        password
      });

      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleRegister = async (
  idToken: string
) => {
  try {
    const response =
      await googleRegister(idToken);

    localStorage.setItem(
      "token",
      response.data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.data)
    );

    toast.success(
      "Account created successfully"
    );

    navigate("/");
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ??
      "Email already exists. Please log in."
    );

    navigate("/login");
  }
};

  return (
    <MainLayout>
      <div className="max-w-[420px] mx-auto py-12 px-4">
        
        {/* Registration Card */}
        <div className="bg-theme-card border border-theme rounded-md shadow-md p-6 md:p-8 transition-colors duration-200">
          
          {/* Logo Header */}
          <div className="text-center mb-6">
            <span className="text-3xl font-black tracking-tight italic font-outfit text-[#2874F0] dark:text-[#FFE500] select-none">
              ME10X<span className="text-[#FB641B]">LUXE</span>
            </span>
            <h2 className="text-lg font-bold text-theme-primary mt-3 font-outfit">
              Create Your Account
            </h2>
            <p className="text-xs text-theme-muted mt-1">Join today to unlock exclusive member privileges</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="reg-name" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-theme-body"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-theme-body"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                placeholder="Choose password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-theme-body"
              />
            </div>

            {/* Register CTA */}
            <Button
              type="submit"
              variant="accent"
              className="w-full py-3 mt-4 text-sm font-semibold uppercase tracking-wider"
              disabled={loading}
            >
              <FaUserPlus />
              <span>{loading ? "Registering..." : "Sign Up"}</span>
            </Button>
            <div className="my-4 flex items-center">
            <div className="flex-1 border-t border-theme"></div>

            <span className="px-3 text-xs text-theme-muted">
              OR
            </span>

            <div className="flex-1 border-t border-theme"></div>
          </div>

          <div className="flex justify-center">
            <GoogleButton
              onSuccess={handleGoogleRegister}
            />
          </div>
          </form>

          {/* Bottom link */}
          <div className="mt-6 pt-5 border-t border-theme/60 text-center text-sm text-theme-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#2874F0] dark:text-[#5897ff] font-bold hover:underline"
            >
              Login here
            </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default RegisterPage;