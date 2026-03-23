import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AuthShell from "../../components/AuthShell";

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((current) => ({ ...current, [e.target.name]: e.target.value }));
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();

    if (user.password.length < 6) return setError("Password must be at least 6 characters");
    if (user.password !== user.passwordConfirm) return setError("Passwords do not match");

    setLoading(true);
    try {
      await axios.post("http://localhost:8070/api/auth/register", {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Create Account"
      title="Join Leaf Lanka"
      subtitle="Create a customer account to manage bookings and stay connected to your preferred vehicles."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>
            Sign in
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
          <label className="label">Full Name</label>
          <input className="input" name="name" placeholder="John Doe" value={user.name} onChange={handleChange} required />
        </div>

        <div>
          <label className="label">Email Address</label>
          <input className="input" name="email" type="email" placeholder="you@example.com" value={user.email} onChange={handleChange} required />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
          <div>
            <label className="label">Password</label>
            <input className="input" name="password" type="password" placeholder="Minimum 6 characters" value={user.password} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input className="input" name="passwordConfirm" type="password" placeholder="Re-enter password" value={user.passwordConfirm} onChange={handleChange} required />
          </div>
        </div>

        <button type="submit" className="btn btnPrimary" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </AuthShell>
  );
}

export default Register;
