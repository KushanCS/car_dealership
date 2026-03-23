import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../components/ToastProvider";
import { deleteStaff, getStaff, updateStaff } from "../../api/adminUserApi";
import { getAuth } from "../../utils/auth";

function roleMeta(role) {
  if (role === "manager") return { label: "Manager", badge: "badge badgeCyan" };
  if (role === "staff") return { label: "Staff", badge: "badge badgeOrange" };
  if (role === "user") return { label: "User", badge: "badge badgeGreen" };
  return { label: role || "Unknown", badge: "badge badgePink" };
}

function accountMeta(isDeleted) {
  return isDeleted ? { label: "Deactivated", badge: "badge badgePink" } : { label: "Active", badge: "badge badgeGreen" };
}

function MetricCard({ label, value, sub }) {
  return (
    <div className="kpiCard">
      <div className="kpiLabel">{label}</div>
      <div className="kpiValue">{value}</div>
      <div className="kpiSub">{sub}</div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start" }}>
      <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", minWidth: "86px" }}>
        {label}
      </div>
      <div style={{ textAlign: "right", color: "var(--text)", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

export default function UserManagementList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchName, setSearchName] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const { role } = getAuth();
  const isAdmin = role === "admin";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStaff();
      setUsers(response.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load users", "Load failed");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleActive = async (user) => {
    try {
      await updateStaff(user._id, { isDeleted: !user.isDeleted });
      await load();
      toast.success(user.isDeleted ? "User activated" : "User deactivated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed", "Update failed");
    }
  };

  const hardDelete = async (user) => {
    if (!window.confirm(`Permanently delete ${user.name}?`)) return;

    try {
      await deleteStaff(user._id);
      setUsers((current) => current.filter((item) => item._id !== user._id));
      toast.success("User deleted permanently");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed", "Delete failed");
    }
  };

  const filteredUsers = useMemo(
    () =>
      users
        .filter((user) => user.role !== "admin")
        .filter((user) => selectedRole === "all" || user.role === selectedRole)
        .filter((user) => user.name.toLowerCase().includes(searchName.toLowerCase())),
    [users, searchName, selectedRole]
  );

  const stats = useMemo(() => {
    const managedUsers = users.filter((user) => user.role !== "admin");
    return {
      total: managedUsers.length,
      active: managedUsers.filter((user) => !user.isDeleted).length,
      managers: managedUsers.filter((user) => user.role === "manager").length,
      staff: managedUsers.filter((user) => user.role === "staff").length,
    };
  }, [users]);

  if (!isAdmin) {
    return (
      <div className="page">
        <div className="pageHead">
          <div>
            <div className="pageTitle">Staff Management</div>
          </div>
        </div>
        <div className="card cardPad" style={{ textAlign: "center", color: "var(--text)" }}>Access denied</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="pageHead">
        <div>
          <div className="pageTitle">User & Role Management</div>
        </div>
      </div>

      <div className="kpiGrid">
        <MetricCard label="Managed Users" value={loading ? "—" : stats.total} sub="Non-admin accounts" />
        <MetricCard label="Active Accounts" value={loading ? "—" : stats.active} sub="Available to sign in" />
        <MetricCard label="Managers" value={loading ? "—" : stats.managers} sub="Team leaders" />
        <MetricCard label="Staff" value={loading ? "—" : stats.staff} sub="Operational users" />
      </div>

      <div className="card cardPad" style={{ marginBottom: "20px" }}>
        <div className="row" style={{ alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <div className="sectionTitle">Team Directory</div>
            <div className="sub">Search by name, filter by role, or add a new operational account.</div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginLeft: "auto", flexWrap: "wrap" }}>
            <input
              className="input"
              style={{ minWidth: "220px" }}
              placeholder="Search staff members..."
              value={searchName}
              onChange={(event) => setSearchName(event.target.value)}
            />

            <select className="select" value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)}>
              <option value="all">All Roles</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="user">User</option>
            </select>

            <button className="btn" onClick={load} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <Link to="/admin/create-staff">
              <button className="btn btnPrimary">Add User</button>
            </Link>
          </div>
        </div>
      </div>

      {!loading && filteredUsers.length === 0 ? (
        <div className="card cardPad" style={{ textAlign: "center", padding: "56px 24px", color: "var(--text-muted)" }}>
          {searchName || selectedRole !== "all" ? "No users match the current filters." : "No staff members found yet."}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            justifyContent: "start",
            gap: "18px",
          }}
        >
          {filteredUsers.map((user) => {
            const roleInfo = roleMeta(user.role);
            const accountInfo = accountMeta(user.isDeleted);

            return (
              <div key={user._id} className="card cardPad" style={{ display: "grid", gap: "16px", width: "100%", maxWidth: "340px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ display: "grid", gap: "4px" }}>
                    <div style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.03em" }}>{user.name}</div>
                    <div className="sub">{user.email}</div>
                  </div>
                  <span className={roleInfo.badge}>{roleInfo.label}</span>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <span className={accountInfo.badge}>{accountInfo.label}</span>
                </div>

                <div style={{ display: "grid", gap: "10px" }}>
                  <DetailRow label="Role" value={roleInfo.label} />
                  <DetailRow label="Status" value={accountInfo.label} />
                  <DetailRow label="Email" value={user.email} />
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button className="btn btnPrimary" onClick={() => navigate(`/admin/staff/edit/${user._id}`)} style={{ flex: 1 }}>
                    Edit User
                  </button>
                  <button className="btn" onClick={() => toggleActive(user)} style={{ flex: 1 }}>
                    {user.isDeleted ? "Activate" : "Deactivate"}
                  </button>
                  <button className="btn btnDanger" onClick={() => hardDelete(user)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
