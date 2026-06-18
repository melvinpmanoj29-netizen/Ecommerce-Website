import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { resetPassword } from "../../services/authService";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Button from "../../components/buttons/Button";
import { FaKey, FaArrowLeft } from "react-icons/fa";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token || !email) {
    return (
      <MainLayout>
        <div className="max-w-[420px] mx-auto py-12 px-4">
          <div className="bg-theme-card border border-theme rounded-md shadow-md p-6 text-center transition-colors duration-200">
            <h1 className="text-xl font-bold mb-3 text-red-500 font-outfit">
              Invalid Reset Link
            </h1>
            <p className="text-sm text-theme-muted mb-6">
              This password reset link is invalid, broken, or has expired.
            </p>
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2874F0] dark:text-[#5897ff] hover:underline"
            >
              <span>Request new link →</span>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email, token, newPassword);
      toast.success("Password reset successfully! Please log in.");
      navigate("/login");
    } catch {
      toast.error("Invalid or expired reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[420px] mx-auto py-12 px-4">
        
        {/* Reset Password Card */}
        <div className="bg-theme-card border border-theme rounded-md shadow-md p-6 md:p-8 transition-colors duration-200">
          
          {/* Logo Header */}
          <div className="text-center mb-6">
            <span className="text-3xl font-black tracking-tight italic font-outfit text-[#2874F0] dark:text-white select-none">
              ME10X<span className="text-[#FB641B]">LUXE</span>
            </span>
            <h2 className="text-lg font-bold text-theme-primary mt-3 font-outfit">
              Reset Password
            </h2>
            <p className="text-xs text-theme-muted mt-1">Configure your new account password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reset-pass" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                New Password
              </label>
              <input
                id="reset-pass"
                type="password"
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-theme-body"
              />
            </div>

            <div>
              <label htmlFor="reset-confirm" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                Confirm New Password
              </label>
              <input
                id="reset-confirm"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-theme-body"
              />
            </div>

            {/* Reset CTA */}
            <Button
              type="submit"
              variant="accent"
              className="w-full py-3 mt-4 text-sm font-semibold uppercase tracking-wider"
              disabled={loading}
            >
              <FaKey size={12} />
              <span>{loading ? "Resetting..." : "Update Password"}</span>
            </Button>

            <div className="text-center mt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#2874F0] dark:text-[#5897ff] font-bold hover:underline"
              >
                <FaArrowLeft size={10} />
                <span>Return to Login</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default ResetPasswordPage;
