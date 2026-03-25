import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { clearAuth, getAuth } from "../utils/auth";
import { getTheme, toggleTheme } from "../utils/theme";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuthState] = useState(getAuth());
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    const refresh = () => setAuthState(getAuth());
    window.addEventListener("auth-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("auth-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const role = auth?.role;
  const isLogged = !!auth?.token;
  const isCustomer = isLogged && role === "user";
  const isStaff = isLogged && ["staff", "manager", "admin"].includes(role);
  const isManager = isLogged && ["manager", "admin"].includes(role);
  const isAdmin = isLogged && role === "admin";

  const isAdminPage =
    location.pathname.includes("/admin") ||
    location.pathname.includes("/appointments") ||
    location.pathname.includes("/leads") ||
    location.pathname.includes("/sales") ||
    location.pathname.includes("/documents") ||
    location.pathname.includes("/events");

  const links = useMemo(() => {
    const items = [{ to: "/", label: "Home" }];

    if (isCustomer) {
      items.push({ to: "/book-appointment", label: "Book Appointment" });
      items.push({ to: "/my-appointments", label: "My Appointments" });
    }

    if (isStaff) {
      items.push({ to: "/appointments", label: "Appointments" });
      items.push({ to: "/documents", label: "Documents" });
      items.push({ to: "/events", label: "Events" });
    }

    if (isManager) {
      items.push({ to: "/vehicles/add", label: "Add Vehicle" });
      items.push({ to: "/sales", label: "Sales" });
    }

    if (isAdmin) {
      items.push({ to: "/admin/dashboard", label: "Dashboard" });
      items.push({ to: "/admin/staff", label: "Staff" });
    }

    return items;
  }, [isAdmin, isCustomer, isManager, isStaff]);

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  const navLinkStyle = ({ isActive }) => ({
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: isActive ? 700 : 600,
    color: isActive ? "var(--text)" : "var(--text-muted)",
    textDecoration: "none",
    borderRadius: "999px",
    background: isActive ? "rgba(141, 187, 1, 0.12)" : "transparent",
    border: isActive ? "1px solid rgba(141, 187, 1, 0.18)" : "1px solid transparent",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  });

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "var(--surface-strong)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <img src="/logo.svg" alt="Leaf Lanka" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "12px" }} />
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em" }}>Leaf Lanka</div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Premium Cars
            </div>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, flexWrap: "wrap" }}>
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} style={navLinkStyle}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {!isAdminPage ? (
            <button
              onClick={() => setTheme(toggleTheme())}
              className="btn"
              style={{ width: "40px", height: "40px", padding: 0, borderRadius: "999px" }}
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          ) : null}

          {!isLogged ? (
            <>
              <Link to="/login" className="btn btnPrimary">
                Login
              </Link>
              <Link to="/register" className="btn">
                Register
              </Link>
            </>
          ) : (
            <>
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: "999px",
                  background: "rgba(141, 187, 1, 0.1)",
                  color: "var(--text)",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {role}
              </div>
              <button onClick={logout} className="btn" style={{ color: "var(--danger)", borderColor: "rgba(186, 94, 94, 0.25)" }}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
