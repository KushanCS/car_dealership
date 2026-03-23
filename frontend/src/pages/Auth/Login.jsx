import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { setAuth } from "../../utils/auth";
import AuthShell from "../../components/AuthShell";

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((current) => ({ ...current, [e.target.name]: e.target.value }));
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:8070/api/auth/login", credentials);
      setAuth({
        token: res.data.token,
        role: res.data.user.role,
        user: res.data.user,
      });
      navigate("/vehicles");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Leaf Lanka"
      title="Welcome back"
      subtitle="Sign in to continue with bookings, inventory, and customer operations."
      compact
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: 700 }}>
            Create one
          </Link>
        </>
      }
    >
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

      <form onSubmit={submit} style={{ display: "grid", gap: "18px" }}>
        <div>
          <label className="label">Email Address</label>
          <input className="input" name="email" type="email" placeholder="you@example.com" value={credentials.email} onChange={handleChange} required />
        </div>

        <div>
          <label className="label">Password</label>
          <input className="input" name="password" type="password" placeholder="••••••••" value={credentials.password} onChange={handleChange} required />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link to="/forgot-password" style={{ color: "var(--primary)", fontWeight: 700, fontSize: "13px" }}>
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="btn btnPrimary" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </AuthShell>
  );
}

export default Login;
