import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { resetPassword } from "../../services/authService";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

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
        <div
          className="
          container-custom
          py-10
          max-w-md
          mx-auto
          text-center
          "
        >
          <h1 className="text-3xl font-bold mb-4 text-red-400">
            Invalid Reset Link
          </h1>
          <p className="text-gray-400 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="text-blue-400 hover:text-blue-300"
          >
            Request a new reset link →
          </Link>
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
          mb-2
          "
        >
          Reset Password
        </h1>

        <p className="text-gray-400 mb-6">
          Enter your new password below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
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
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
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
            disabled={loading}
            className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            py-3
            rounded
            disabled:opacity-50
            disabled:cursor-not-allowed
            "
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <p className="text-center mt-4">
            <Link
              to="/login"
              className="text-blue-400"
            >
              ← Back to Login
            </Link>
          </p>
        </form>
      </div>
    </MainLayout>
  );
}

export default ResetPasswordPage;
