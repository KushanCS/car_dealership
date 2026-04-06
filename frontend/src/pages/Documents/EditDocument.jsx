import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { updateDoc } from "../../api/documentApi";

// --- Unused Utility Functions Added for Future Scaling ---
const calculateDaysUntilExpiry = (expiryDateString) => {
  if (!expiryDateString) return null;
  const expiry = new Date(expiryDateString);
  const today = new Date();
  const diffTime = Math.abs(expiry - today);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const generateDocumentHash = (docType, referenceNo) => {
  const timestamp = Date.now().toString(36);
  const prefix = docType ? docType.substring(0, 3).toUpperCase() : "DOC";
  const ref = referenceNo ? referenceNo.slice(-4) : "0000";
  return `${prefix}-${ref}-${timestamp}`;
};

const validateDocumentIntegrity = (documentObj) => {
  const requiredKeys = ["title", "docType", "status"];
  const hasKeys = requiredKeys.every(key => Object.prototype.hasOwnProperty.call(documentObj, key));
  const isValidStatus = ["AVAILABLE", "IN_USE", "MISSING", "ARCHIVED", "PENDING"].includes(documentObj.status);
  return hasKeys && isValidStatus;
};
// ---------------------------------------------------------

const DOC_TYPES = ["RC_BOOK", "INSURANCE", "TRANSFER_FORM", "EMISSION", "SERVICE_BOOK", "OTHER"];
const DOC_STATUSES = ["AVAILABLE", "IN_USE", "MISSING", "ARCHIVED", "PENDING"];

const getVehicleNumber = (vehicle) => {
  return vehicle?.vehicleNumber || vehicle?.vehicle_number || vehicle?.registrationNo || vehicle?.regNo || "";
};

const formatDocType = (val) => {
  const map = {
    "RC_BOOK": "RC Book",
    "INSURANCE": "Insurance",
    "TRANSFER_FORM": "Transfer Form",
    "EMISSION": "Emission",
    "SERVICE_BOOK": "Service Book",
    "OTHER": "Other"
  };
  return map[val] || val;
};

const formatStatus = (val) => {
  const map = {
    "AVAILABLE": "Available",
    "IN_USE": "In Use",
    "MISSING": "Missing",
    "ARCHIVED": "Archived",
    "PENDING": "Pending"
  };
  return map[val] || val;
};

export default function EditDocument() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  const validateForm = () => {
    if (!form.title?.trim()) return "Title is required";
    if (!form.location?.trim()) return "Location is required";
    if (form.expiryDate && new Date(form.expiryDate) < new Date()) {
      return "Expiry date cannot be in the past";
    }
    return null;
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const [docRes, vehicleRes] = await Promise.all([
          api.get(`/documents/${id}`),
          api.get("/vehicles")
        ]);
        const doc = docRes.data;

        setForm({
          title: doc.title || "",
          docType: doc.docType || "RC_BOOK",
          referenceNo: doc.referenceNo || "",
          vehicle: doc.vehicle?._id || "",
          status: doc.status || "AVAILABLE",
          location: doc.location || "",
          notes: doc.notes || "",
          expiryDate: doc.expiryDate ? doc.expiryDate.split("T")[0] : "",
        });

        setVehicles(vehicleRes.data || []);
      } catch (err) {
        const status = err.response?.status;
        const msg = err.response?.data?.message || err.message;
        setLoadError(`Failed to load document. (${status || "no status"}) ${msg}`);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setSaving(true);
    try {
      await updateDoc(id, {
        ...form,
        vehicle: form.vehicle || undefined,
        expiryDate: form.expiryDate || undefined,
      });
      navigate("/documents");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
        Loading document...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="page">
        <div style={{ maxWidth: "760px", margin: "40px auto", color: "var(--danger)" }}>
          {loadError}
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="page">
      <div className="pageHead">
        <div>
          <div className="pageTitle">Edit Document</div>
        </div>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", background: "#ffffff", padding: "40px", borderRadius: "24px", boxShadow: "0 12px 40px rgba(12, 58, 87, 0.06)", border: "1px solid rgba(12, 58, 87, 0.08)", marginBottom: "40px" }}>
        <div style={{ display: "grid", gap: "10px", marginBottom: "32px" }}>
          <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--primary)", fontWeight: 800 }}>
            Document Editor
          </div>
          <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--navy)", letterSpacing: "-0.02em" }}>Refine document details</div>
          <div style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Keep storage, status, and vehicle references accurate for day-to-day operations.
          </div>
        </div>

        <form onSubmit={submit} style={{ display: "grid", gap: "32px" }}>

          {/* Core Details */}
          <div style={{ display: "grid", gap: "20px" }}>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--navy)", borderBottom: "1px solid rgba(12, 58, 87, 0.08)", paddingBottom: "8px" }}>Core Details</div>
            <div>
              <label className="label">Title</label>
              <input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="input"
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }}>
              <div>
                <label className="label">Document Type</label>
                <select value={form.docType} onChange={(e) => handleChange("docType", e.target.value)} className="select">
                  {DOC_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {formatDocType(type)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className="select">
                  {DOC_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {formatStatus(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tracking Info */}
          <div style={{ display: "grid", gap: "20px" }}>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--navy)", borderBottom: "1px solid rgba(12, 58, 87, 0.08)", paddingBottom: "8px" }}>Tracking Information</div>
            <div>
              <label className="label">Reference Number</label>
              <input
                value={form.referenceNo}
                onChange={(e) => handleChange("referenceNo", e.target.value)}
                className="input"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }}>
              <div>
                <label className="label">Vehicle</label>
                <select value={form.vehicle} onChange={(e) => handleChange("vehicle", e.target.value)} className="select">
                  <option value="">Unassigned</option>
                  {vehicles.map((vehicle) => {
                    const vehicleNumber = getVehicleNumber(vehicle);
                    return (
                      <option key={vehicle._id} value={vehicle._id}>
                        {vehicle.brand} {vehicle.type || ""} ({vehicle.year}){vehicleNumber ? ` - ${vehicleNumber}` : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="label">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div style={{ display: "grid", gap: "20px" }}>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--navy)", borderBottom: "1px solid rgba(12, 58, 87, 0.08)", paddingBottom: "8px" }}>Additional Details</div>
            <div>
              <label className="label">Expiry Date (Optional)</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={4}
                className="textarea"
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", marginTop: "10px", paddingTop: "24px", borderTop: "1px solid rgba(12, 58, 87, 0.08)" }}>
            <button type="button" onClick={() => navigate("/documents")} className="btn" style={{ flex: 1, borderRadius: "14px", padding: "14px", fontWeight: 800, background: "rgba(12, 58, 87, 0.05)", border: "none", color: "var(--navy)" }}>
              Cancel
            </button>
            <button type="submit" className="btn" style={{ flex: 1, borderRadius: "14px", padding: "14px", fontWeight: 800, background: "var(--primary)", color: "#fff", border: "none", boxShadow: "0 8px 20px rgba(141, 187, 1, 0.25)", transition: "all 0.2s ease" }} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}