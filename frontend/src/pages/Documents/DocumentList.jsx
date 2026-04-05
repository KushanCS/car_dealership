import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/ToastProvider";
import { getDocs, deleteDoc } from "../../api/documentApi";
import { getAuth } from "../../utils/auth";

const STATUS_STYLES = {
  available: { bg: "rgba(141, 187, 1, 0.12)", color: "#8DBB01", label: "Available" },
  in_use: { bg: "rgba(59, 130, 246, 0.12)", color: "#3b82f6", label: "In Use" },
  missing: { bg: "rgba(186, 94, 94, 0.12)", color: "var(--danger)", label: "Missing" },
  archived: { bg: "rgba(102, 119, 133, 0.12)", color: "var(--muted)", label: "Archived" },
  pending: { bg: "rgba(185, 135, 56, 0.15)", color: "var(--warning)", label: "Pending" },
};

const Icons = {
  Total: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>,
  Available: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
  InUse: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Missing: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  Archived: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>,
  Pending: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
};

export default function DocumentList() {
  const { role } = getAuth();
  const canDeleteDocuments = role === "admin";
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const toast = useToast();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDocs();
      setDocs(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load documents", "Load failed");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const total = docs.length;
    const available = docs.filter((d) => String(d.status || "").toLowerCase() === "available").length;
    const inUse = docs.filter((d) => String(d.status || "").toLowerCase() === "in_use").length;
    const missing = docs.filter((d) => String(d.status || "").toLowerCase() === "missing").length;
    const archived = docs.filter((d) => String(d.status || "").toLowerCase() === "archived").length;
    const pending = docs.filter((d) => String(d.status || "").toLowerCase() === "pending").length;
    return { total, available, inUse, missing, archived, pending };
  }, [docs]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return docs;
    return docs.filter((d) => String(d.status || "").toLowerCase() === statusFilter);
  }, [docs, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document permanently?")) return;
    try {
      await deleteDoc(id);
      setDocs((current) => current.filter((doc) => doc._id !== id));
      toast.success("Document deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed", "Delete failed");
    }
  };

  const getVehicleName = (vehicle) => {
    if (!vehicle) return "Unassigned";
    return `${vehicle.brand || ""} ${vehicle.type || ""}`.trim() || "Unassigned";
  };

  const getVehicleNumber = (vehicle) =>
    vehicle?.vehicleNumber || vehicle?.vehicle_number || vehicle?.registrationNo || vehicle?.regNo || "No registration";

  const getStatusStyle = (status) => STATUS_STYLES[String(status || "").toLowerCase()] || STATUS_STYLES.available;

  return (
    <div className="page" style={{ paddingBottom: '60px' }}>
      <div style={{
        background: "linear-gradient(135deg, rgba(141,187,1,0.1), rgba(12,58,87,0.03))",
        padding: "32px 36px",
        borderRadius: "24px",
        border: "1px solid rgba(141,187,1,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "32px",
        boxShadow: "0 12px 32px rgba(12,58,87,0.05)",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <div>
          <div style={{ fontSize: '36px', fontWeight: '900', color: 'var(--navy)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>Documents</div>
          <div style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '8px' }}>Manage and track all physical records securely.</div>
        </div>
        <button className="btn btnPrimary" onClick={() => navigate("/documents/add")} style={{ padding: "14px 28px", fontSize: "15px", borderRadius: "16px", boxShadow: "0 10px 24px rgba(141,187,1,0.25)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Document
        </button>
      </div>

      <div className="kpiGrid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: '24px', marginBottom: '32px' }}>
        <MetricCard icon={Icons.Total} label="Total Documents" value={loading ? "—" : stats.total} sub="All physical records" color={{ bg: 'rgba(12, 58, 87, 0.08)', text: 'var(--navy)' }} />
        <MetricCard icon={Icons.Available} label="Available" value={loading ? "—" : stats.available} sub="Ready for use" color={{ bg: 'rgba(141, 187, 1, 0.15)', text: 'var(--primary)' }} />
        <MetricCard icon={Icons.InUse} label="In Use" value={loading ? "—" : stats.inUse} sub="Currently checked out" color={{ bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' }} />
        <MetricCard icon={Icons.Missing} label="Missing" value={loading ? "—" : stats.missing} sub="Needs attention" color={{ bg: 'rgba(186, 94, 94, 0.15)', text: 'var(--danger)' }} />
        <MetricCard icon={Icons.Archived} label="Archived" value={loading ? "—" : stats.archived} sub="Stored records" color={{ bg: 'rgba(102, 119, 133, 0.15)', text: 'var(--muted)' }} />
        <MetricCard icon={Icons.Pending} label="Pending" value={loading ? "—" : stats.pending} sub="Awaiting action" color={{ bg: 'rgba(185, 135, 56, 0.15)', text: 'var(--warning)' }} />
      </div>

      <div style={{ marginBottom: "28px", background: 'rgba(255,255,255,0.7)', padding: '20px 28px', borderRadius: '20px', border: '1px solid rgba(12,58,87,0.08)', backdropFilter: 'blur(10px)' }}>
        <div className="row" style={{ alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '5px', height: '32px', background: 'var(--primary)', borderRadius: '6px' }} />
            <div>
              <div className="sectionTitle" style={{ fontSize: '22px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>Document Library</div>
              <div className="sub" style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Filter records by status and keep inventory paperwork tidy.</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginLeft: "auto", flexWrap: "wrap", alignItems: "center" }}>
            <select className="select" style={{ minWidth: "200px", width: "auto", background: '#fff', borderRadius: '12px', padding: '12px 16px', fontWeight: '600', border: '1px solid rgba(12,58,87,0.15)' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="in_use">In Use</option>
              <option value="missing">Missing</option>
              <option value="archived">Archived</option>
              <option value="pending">Pending</option>
            </select>
            <button className="btn" onClick={load} disabled={loading} style={{ borderRadius: '12px', padding: '12px 20px', fontWeight: '700' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 && !loading ? (
        <div style={{ textAlign: "center", padding: "64px 24px", color: "var(--text-muted)", background: '#fff', borderRadius: '24px', border: '1px dashed rgba(12,58,87,0.2)' }}>
          <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--navy)' }}>{statusFilter === "all" ? "No documents yet." : "No documents found for this status."}</div>
          <p style={{ marginTop: '8px' }}>Add a new document to start tracking.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            justifyContent: "start",
            gap: "24px",
          }}
        >
          {filtered.map((doc) => {
            const statusStyle = getStatusStyle(doc.status);
            return (
              <div key={doc._id} style={{ 
                display: "flex", flexDirection: "column", gap: "20px", width: "100%", 
                background: '#ffffff', borderRadius: '24px', padding: '24px',
                border: '1px solid rgba(12, 58, 87, 0.08)', boxShadow: '0 12px 36px rgba(12, 58, 87, 0.04)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ 
                      width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                      background: 'linear-gradient(135deg, rgba(141,187,1,0.18), rgba(141,187,1,0.05))', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--primary)', border: '1px solid rgba(141,187,1,0.2)'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div style={{ display: "grid", gap: "6px" }}>
                      <div style={{ fontSize: "20px", fontWeight: 900, color: "var(--navy)", lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                        {doc.title || doc.docType || "Untitled document"}
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "8px",
                            background: "rgba(12, 58, 87, 0.06)",
                            color: "var(--navy)",
                            fontSize: "11px",
                            fontWeight: 850,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {doc.docType || "Document"}
                        </span>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "8px",
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            fontSize: "11px",
                            fontWeight: 850,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {statusStyle.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gap: "0px", background: 'rgba(244, 245, 242, 0.6)', padding: '16px 20px', borderRadius: '18px', border: '1px solid rgba(12,58,87,0.05)' }}>
                  <InfoRow label="Vehicle" value={getVehicleName(doc.vehicle)} />
                  <InfoRow label="Registration" value={getVehicleNumber(doc.vehicle)} />
                  <InfoRow label="Location" value={doc.location || "Not specified"} />
                  <InfoRow label="Reference" value={doc.referenceNo || "None"} isLast />
                </div>

                {doc.notes ? (
                  <div style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.65, padding: '0 8px' }}>
                    {doc.notes}
                  </div>
                ) : null}

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: 'auto' }}>
                  <button className="btn btnPrimary" onClick={() => navigate(`/documents/edit/${doc._id}`)} style={{ flex: 1, padding: '12px', borderRadius: '14px', fontSize: '14px', fontWeight: '800' }}>
                    Edit Record
                  </button>
                  {canDeleteDocuments ? (
                    <button
                      className="btn"
                      onClick={() => handleDelete(doc._id)}
                      style={{ flex: 1, color: "var(--danger)", borderColor: "rgba(186, 94, 94, 0.3)", background: 'rgba(186, 94, 94, 0.06)', padding: '12px', borderRadius: '14px', fontSize: '14px', fontWeight: '800' }}
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, sub, color, icon }) {
  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.95)',
      border: `1px solid ${color?.bg}`,
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 12px 32px rgba(12, 58, 87, 0.04)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
          <div style={{ fontSize: '38px', fontWeight: '900', color: color?.text || 'var(--navy)', marginTop: '8px', letterSpacing: '-0.02em', lineHeight: '1' }}>{value}</div>
        </div>
        <div style={{
          width: '54px', height: '54px', borderRadius: '16px',
          background: color?.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color?.text
        }}>
          {icon}
        </div>
      </div>
      <div style={{ marginTop: '16px', color: 'var(--muted)', fontSize: '13px', fontWeight: '700' }}>{sub}</div>
    </div>
  );
}

function InfoRow({ label, value, isLast }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "center", padding: "12px 0", borderBottom: isLast ? 'none' : "1px dashed rgba(12, 58, 87, 0.12)" }}>
      <span style={{ color: "var(--text-secondary)", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
      <span style={{ color: "var(--navy)", fontSize: "14px", fontWeight: 900, textAlign: "right" }}>{value}</span>
    </div>
  );
}