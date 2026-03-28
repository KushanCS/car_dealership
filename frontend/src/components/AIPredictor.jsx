import React, { useState } from "react";
import axios from "axios";

export default function AIPredictor() {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    yom: "",
    engine_cc: "",
    gear: "",
    fuel_type: "",
    millage_km: "",
    asking_price: "",
  });

  const [loading, setLoading] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [dealScore, setDealScore] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPredictedPrice(null);
    setDealScore(null);

    const payload = {
      brand: formData.brand,
      model: formData.model,
      yom: parseInt(formData.yom, 10),
      engine_cc: parseInt(formData.engine_cc, 10),
      gear: formData.gear,
      fuel_type: formData.fuel_type,
      millage_km: parseInt(formData.millage_km, 10),
      asking_price: formData.asking_price ? parseInt(formData.asking_price, 10) : 0,
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", payload);
      setPredictedPrice(response.data.predicted_price_lkr);
      setDealScore(response.data.deal_score);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to get valuation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return `LKR ${Number(val).toLocaleString()}`;
  };

  return (
    <div className="card" style={{ padding: "24px", maxWidth: "600px", margin: "0 auto", border: "1px solid var(--primary)" }}>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--navy)", marginBottom: "8px" }}>AI Vehicle Valuation</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Get an instant, AI-driven market price estimate for any vehicle.</p>
      </div>

      <form onSubmit={handlePredict} style={{ display: "grid", gap: "16px", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text)" }}>Brand</label>
          <input className="input" name="brand" value={formData.brand} onChange={handleChange} required placeholder="e.g. Toyota" />
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text)" }}>Model</label>
          <input className="input" name="model" value={formData.model} onChange={handleChange} required placeholder="e.g. Corolla" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text)" }}>Year (YOM)</label>
          <input className="input" type="number" name="yom" value={formData.yom} onChange={handleChange} required placeholder="e.g. 2018" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text)" }}>Engine CC</label>
          <input className="input" type="number" name="engine_cc" value={formData.engine_cc} onChange={handleChange} required placeholder="e.g. 1500" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text)" }}>Gear</label>
          <select className="select" name="gear" value={formData.gear} onChange={handleChange} required>
            <option value="">Select Gear</option>
            <option value="Auto">Auto</option>
            <option value="Manual">Manual</option>
            <option value="Tiptronic">Tiptronic</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text)" }}>Fuel Type</label>
          <select className="select" name="fuel_type" value={formData.fuel_type} onChange={handleChange} required>
            <option value="">Select Fuel</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text)" }}>Mileage (km)</label>
          <input className="input" type="number" name="millage_km" value={formData.millage_km} onChange={handleChange} required placeholder="e.g. 45000" />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text)" }}>Asking Price (Optional)</label>
          <input className="input" type="number" name="asking_price" value={formData.asking_price} onChange={handleChange} placeholder="e.g. 5500000" />
        </div>

        <div style={{ gridColumn: "1 / -1", marginTop: "12px" }}>
          <button type="submit" className="btn btnPrimary" style={{ width: "100%", padding: "14px" }} disabled={loading}>
            {loading ? "Calculating..." : "Get Valuation"}
          </button>
        </div>
      </form>

      {error && (
        <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "8px", fontSize: "14px", textAlign: "center" }}>
          {error}
        </div>
      )}

      {predictedPrice !== null && !error && !loading && (
        <div style={{ marginTop: "20px", padding: "24px", backgroundColor: "var(--background)", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(141,187,1,0.4)" }}>
          <div style={{ fontSize: "14px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "700", marginBottom: "8px" }}>
            Estimated Market Value
          </div>
          <div style={{ fontSize: "36px", fontWeight: "800", color: "var(--primary)" }}>
            {formatCurrency(predictedPrice)}
          </div>
          {dealScore && dealScore !== "N/A" && (
            <div style={{ marginTop: "16px" }}>
              <span style={{ display: "inline-block", padding: "8px 16px", borderRadius: "20px", backgroundColor: "rgba(141,187,1,0.1)", color: "var(--text)", fontWeight: "700", fontSize: "16px", border: "1px solid rgba(141,187,1,0.3)" }}>
                {dealScore}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
