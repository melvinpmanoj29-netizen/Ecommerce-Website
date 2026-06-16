import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { forgotPassword } from "../../services/authService";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent! Check your email.");
    } catch {
      toast.error("Something went wrong. Please try again.");
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
          Forgot Password
        </h1>

        <p className="text-gray-400 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {sent ? (
          <div className="bg-green-900/30 border border-green-600 rounded p-4 text-center">
            <p className="text-green-400 text-lg font-semibold mb-2">
              ✅ Reset Link Sent!
            </p>
            <p className="text-gray-300">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox (and spam folder).
            </p>
            <Link
              to="/login"
              className="
              inline-block
              mt-4
              text-blue-400
              hover:text-blue-300
              "
            >
              ← Back to Login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="email"
              placeholder="Enter your email"
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
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="text-center mt-4">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-blue-400"
              >
                Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </MainLayout>
  );
}

export default ForgotPasswordPage;
