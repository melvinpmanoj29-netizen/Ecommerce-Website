import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { forgotPassword } from "../../services/authService";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Button from "../../components/buttons/Button";
import { FaPaperPlane, FaArrowLeft } from "react-icons/fa";

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
      <div className="max-w-[420px] mx-auto py-12 px-4">
        
        {/* Forgot Password Card */}
        <div className="bg-theme-card border border-theme rounded-md shadow-md p-6 md:p-8 transition-colors duration-200">
          
          {/* Logo Header */}
          <div className="text-center mb-6">
            <span className="text-3xl font-black tracking-tight italic font-outfit text-[#2874F0] dark:text-white select-none">
              ME10X<span className="text-[#FB641B]">LUXE</span>
            </span>
            <h2 className="text-lg font-bold text-theme-primary mt-3 font-outfit">
              Forgot Password
            </h2>
            <p className="text-xs text-theme-muted mt-1">Provide email to retrieve your password</p>
          </div>

          {sent ? (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 text-center p-4 rounded-sm">
              <p className="text-green-700 dark:text-green-400 text-base font-bold mb-2">
                ✅ Verification Email Sent!
              </p>
              <p className="text-xs text-theme-secondary leading-relaxed">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-[#2874F0] dark:text-[#5897ff] hover:underline"
              >
                <FaArrowLeft size={10} />
                <span>Return to Login</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="mb-1 font-semibold text-xs text-theme-secondary uppercase">
                  Email Address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-theme-body"
                />
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                variant="accent"
                className="w-full py-3 mt-4 text-sm font-semibold uppercase tracking-wider"
                disabled={loading}
              >
                <FaPaperPlane size={12} />
                <span>{loading ? "Sending..." : "Send Reset Link"}</span>
              </Button>

              <div className="text-center mt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#2874F0] dark:text-[#5897ff] font-bold hover:underline"
                >
                  <FaArrowLeft size={10} />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </MainLayout>
  );
}

export default ForgotPasswordPage;
