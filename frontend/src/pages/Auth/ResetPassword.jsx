import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import AuthShell from "../../components/AuthShell";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location.state?.email || "";
  const notice = location.state?.notice || "";
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("Email is required");
    if (!/^\d{6}$/.test(otp.trim())) return setError("Enter the 6-digit OTP");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirmPassword) return setError("Passwords do not match");

    setLoading(true);
    try {
      await axios.post("http://localhost:8070/api/auth/reset-password", {
        email: email.trim(),
        otp: otp.trim(),
        password,
        confirmPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthShell
        eyebrow="Password Updated"
        title="Password reset complete"
        subtitle="Your account is secure again. You’ll be redirected to the login page shortly."
        compact
        footer={
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>
            Go to login now
          </Link>
        }
      >
        <div
          style={{
            padding: "18px",
            borderRadius: "18px",
            background: "rgba(141, 187, 1, 0.1)",
            color: "var(--navy)",
            textAlign: "center",
            lineHeight: 1.7,
            fontWeight: 600,
          }}
        >
          Your new password has been saved successfully.
        </div>
      </AuthShell>
    );
  }

  return (
      <AuthShell
      eyebrow="Verify OTP"
      title="Enter OTP and new password"
      subtitle="Use the temporary OTP sent to your email address to reset your Leaf Lanka account password."
      compact
      footer={
        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>
          Back to login
        </Link>
      }
    >
      {notice ? (
        <div
          style={{
            marginBottom: "18px",
            padding: "14px 16px",
            borderRadius: "16px",
            border: "1px solid rgba(141, 187, 1, 0.22)",
            background: "rgba(141, 187, 1, 0.1)",
            color: "var(--navy)",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          {notice}
        </div>
      ) : null}

      {error ? (
        <div
          style={{
            marginBottom: "18px",
            padding: "14px 16px",
            borderRadius: "16px",
            border: "1px solid rgba(186, 94, 94, 0.18)",
            background: "rgba(255,255,255,0.92)",
            color: "var(--danger)",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "18px" }}>
        <div>
          <label className="label">Email Address</label>
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            required
          />
        </div>

        <div>
          <label className="label">Temporary OTP</label>
          <input
            className="input"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
            required
          />
        </div>

        <div>
          <label className="label">New Password</label>
          <input className="input" type="password" placeholder="Minimum 6 characters" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} required />
        </div>

        <div>
          <label className="label">Confirm Password</label>
          <input className="input" type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }} required />
        </div>

        <button type="submit" className="btn btnPrimary" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Saving password..." : "Verify OTP & Reset Password"}
        </button>
      </form>
    </AuthShell>
  );
}

export default ResetPassword;
