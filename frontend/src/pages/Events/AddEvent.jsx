import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import eventApi from "../../api/eventApi";

const EVENT_COLORS = ["#8DBB01", "#0C3A57", "#3d8fa5", "#d48a3a", "#c86f7c", "#6d7fa0"];
const EVENT_TYPES = [
  { value: "holiday", label: "Holiday" },
  { value: "weather", label: "Weather Issue" },
  { value: "flood", label: "Flood / Disaster" },
  { value: "special", label: "Special Closure" },
  { value: "other", label: "Other" },
];

export default function AddEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const minEventDate = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    name: "",
    type: "holiday",
    description: "",
    startDate: "",
    endDate: "",
    isShopClosed: true,
    color: "#8DBB01",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) return setError("Event name is required");
    if (!formData.startDate) return setError("Start date is required");
    if (!formData.endDate) return setError("End date is required");
    if (formData.startDate < minEventDate) {
      return setError("Events can only be created from today onward");
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      return setError("End date must be on or after start date");
    }

    try {
      setLoading(true);
      await eventApi.createEvent(formData);
      navigate("/events");
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to create event";
      const details = err.response?.data?.details;
      setError(details ? `${errorMsg}: ${details.join(", ")}` : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="pageHead">
        <div className="pageHeadLeft">
          <h1 className="h1">Add Event</h1>
        </div>
      </div>

      <div className="card cardPad" style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div style={{ display: "grid", gap: "10px", marginBottom: "24px" }}>
          <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--primary)", fontWeight: 700 }}>
            New Event
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--navy)" }}>Minimal setup, clear scheduling</div>
          <div style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
            Use concise details and a clean visual code so your event list stays easy to scan.
          </div>
        </div>

        {error ? (
          <div
            style={{
              marginBottom: "22px",
              padding: "14px 16px",
              borderRadius: "16px",
              border: "1px solid rgba(186, 94, 94, 0.18)",
              background: "rgba(255,255,255,0.92)",
              color: "var(--danger)",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "22px" }}>
          <div style={{ display: "grid", gap: "18px" }}>
            <div>
              <label className="label">Event Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. New Year Holiday" className="input" />
            </div>

            <div>
              <label className="label">Event Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="select">
                {EVENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }}>
              <div>
                <label className="label">Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="input" min={minEventDate} />
              </div>
              <div>
                <label className="label">End Date</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="input" min={formData.startDate || minEventDate} />
              </div>
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add a short internal description"
                className="textarea"
                style={{ minHeight: "120px" }}
              />
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: "18px",
              border: "1px solid var(--border)",
              background: "rgba(236, 236, 236, 0.42)",
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
            }}
          >
            <input
              type="checkbox"
              name="isShopClosed"
              id="isShopClosed"
              checked={formData.isShopClosed}
              onChange={handleChange}
              style={{ width: "18px", height: "18px", marginTop: "2px" }}
            />
            <label htmlFor="isShopClosed" style={{ cursor: "pointer", margin: 0 }}>
              <div style={{ color: "var(--navy)", fontWeight: 700, marginBottom: "4px" }}>Shop is closed</div>
              <div style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.6 }}>
                Customers will not be able to book appointments during this event window.
              </div>
            </label>
          </div>

          <div>
            <label className="label">Color Accent</label>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {EVENT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((current) => ({ ...current, color }))}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "999px",
                    background: color,
                    border: formData.color === color ? "3px solid #ffffff" : "2px solid rgba(12, 58, 87, 0.12)",
                    boxShadow: formData.color === color ? "0 0 0 3px rgba(12, 58, 87, 0.18)" : "none",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", paddingTop: "6px" }}>
            <button type="button" className="btn" onClick={() => navigate("/events")} disabled={loading} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btnPrimary" disabled={loading} style={{ flex: 1 }}>
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
