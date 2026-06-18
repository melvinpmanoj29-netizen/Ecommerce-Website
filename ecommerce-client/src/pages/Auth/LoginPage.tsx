import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Button from "../../components/buttons/Button";
import { FaSignInAlt } from "react-icons/fa";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(false);
      const response = await axiosInstance.post("/Auth/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));

      toast.success("Login successful");
      navigate("/");
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[420px] mx-auto py-12 px-4">
        
        {/* Sign In Card */}
        <div className="bg-theme-card border border-theme rounded-md shadow-md p-6 md:p-8 transition-colors duration-200">
          
          {/* Logo Header */}
          <div className="text-center mb-6">
            <span className="text-3xl font-black tracking-tight italic font-outfit text-[#2874F0] dark:text-[#FFE500] select-none">
              ME10X<span className="text-[#FB641B]">LUXE</span>
            </span>
            <h2 className="text-lg font-bold text-theme-primary mt-3 font-outfit">
              Sign In to Your Account
            </h2>
            <p className="text-xs text-theme-muted mt-1">Get access to your Orders, Cart and Wishlist</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-theme-body"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="login-password" className="font-semibold text-xs text-theme-secondary uppercase">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#2874F0] dark:text-[#5897ff] hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-theme-body"
                />
              </div>
            </div>

            {/* Login button */}
            <Button
              type="submit"
              variant="accent"
              className="w-full py-3 mt-4 text-sm font-semibold uppercase tracking-wider"
              disabled={loading}
            >
              <FaSignInAlt />
              <span>{loading ? "Signing In..." : "Login"}</span>
            </Button>
          </form>

          {/* Bottom links */}
          <div className="mt-6 pt-5 border-t border-theme/60 text-center text-sm text-theme-secondary">
            New to ME10XLUXE?{" "}
            <Link
              to="/register"
              className="text-[#2874F0] dark:text-[#5897ff] font-bold hover:underline"
            >
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default LoginPage;