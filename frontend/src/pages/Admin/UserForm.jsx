function roleMeta(role) {
  if (role === "manager") return { label: "Manager", badge: "badge badgeCyan" };
  if (role === "staff") return { label: "Staff", badge: "badge badgeOrange" };
  if (role === "user") return { label: "User", badge: "badge badgeGreen" };
  if (role === "admin") return { label: "Admin", badge: "badge badgePink" };
  return { label: role || "Unassigned", badge: "badge" };
}

function accountMeta(isDeleted) {
  return isDeleted ? { label: "Deactivated", badge: "badge badgePink" } : { label: "Active", badge: "badge badgeGreen" };
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="card cardPad" style={{ display: "grid", gap: "18px" }}>
      <div>
        <div className="sectionTitle">{title}</div>
        <div className="sub">{subtitle}</div>
      </div>
      {children}
    </div>
  );
}

function SummaryTile({ label, value, inverse = false }) {
  return (
    <div
      style={{
        border: inverse ? "1px solid rgba(255,255,255,0.16)" : "1px solid var(--border)",
        borderRadius: "16px",
        padding: "16px",
        background: inverse ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.72)",
        display: "grid",
        gap: "6px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: inverse ? "rgba(255,255,255,0.74)" : "var(--text-muted)",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "20px", fontWeight: 700, color: inverse ? "#fff" : "var(--text)" }}>{value}</div>
    </div>
  );
}

export default function UserForm({
  title,
  subtitle,
  modeLabel,
  form,
  onChange,
  onSubmit,
  saving,
  submitLabel,
  onCancel,
  showPassword = false,
  showActiveToggle = false,
  identity = {},
}) {
  const role = roleMeta(form.role);
  const account = accountMeta(form.isDeleted);

  return (
    <div className="page">
      <div className="pageHead">
        <div>
          <div className="pageTitle">{title}</div>
          <div className="pageSub">{subtitle}</div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "20px", maxWidth: "920px", margin: "0 auto" }}>
        <div
          className="card cardPad"
          style={{
            display: "grid",
            gap: "16px",
            background: "linear-gradient(135deg, rgba(12,58,87,0.96) 0%, rgba(17,73,109,0.95) 62%, rgba(141,187,1,0.92) 100%)",
            color: "#fff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.14em", opacity: 0.72 }}>{modeLabel}</div>
              <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.04em", marginTop: "8px" }}>
                {identity.name || form.name || "Team member"}
              </div>
              <div style={{ marginTop: "6px", opacity: 0.82 }}>{identity.email || form.email || "Email pending"}</div>
            </div>
            <span className={role.badge} style={{ background: "rgba(255,255,255,0.14)", color: "#fff", borderColor: "rgba(255,255,255,0.18)" }}>
              {role.label}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
            <SummaryTile label="Role" value={role.label} inverse />
            <SummaryTile label="Account" value={account.label} inverse />
            <SummaryTile label="Email" value={identity.email || form.email || "Pending"} inverse />
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: "20px" }}>
          <SectionCard title="Identity" subtitle="Keep user details clean so permissions and team ownership stay easy to manage.">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <div>
                <label className="label">Full Name</label>
                <input className="input" name="name" value={form.name || ""} onChange={onChange} placeholder="Full name" required />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input className="input" type="email" name="email" value={form.email || ""} onChange={onChange} placeholder="name@company.com" required />
              </div>
              {showPassword && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <label className="label">Password</label>
                  <input className="input" type="password" name="password" value={form.password || ""} onChange={onChange} placeholder="Create a secure password" required />
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Role & Access" subtitle="Set the right account type and activation state without overcrowding the page.">
            <div style={{ display: "grid", gap: "16px" }}>
              <div style={{ maxWidth: "320px" }}>
                <label className="label">Role</label>
                <select className="select" name="role" value={form.role} onChange={onChange}>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              {showActiveToggle && (
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px",
                    borderRadius: "16px",
                    border: "1px solid var(--border)",
                    background: "rgba(255,255,255,0.72)",
                    color: "var(--text)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <input type="checkbox" name="isDeleted" checked={!!form.isDeleted} onChange={onChange} style={{ width: "16px", height: "16px" }} />
                  Deactivate account
                </label>
              )}
            </div>
          </SectionCard>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
            <button type="button" className="btn" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btnPrimary" disabled={saving}>
              {saving ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
