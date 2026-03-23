const formatDisplayTime = (time) => {
  if (!time) return "Select a session";
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

function Surface({ title, subtitle, children }) {
  return (
    <section
      className="card cardPad"
      style={{
        display: "grid",
        gap: "18px",
        background: "rgba(255,255,255,0.9)",
      }}
    >
      {(title || subtitle) && (
        <div style={{ display: "grid", gap: "4px" }}>
          {title ? <div className="sectionTitle">{title}</div> : null}
          {subtitle ? <div className="sub">{subtitle}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "14px", alignItems: "flex-start" }}>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
          minWidth: "76px",
        }}
      >
        {label}
      </div>
      <div style={{ fontWeight: 700, color: "var(--text)", textAlign: "right" }}>{value}</div>
    </div>
  );
}

function HeroMetric({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.16)",
        borderRadius: "18px",
        padding: "16px",
        background: "rgba(255,255,255,0.12)",
        display: "grid",
        gap: "6px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.74)",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "20px", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>{value}</div>
    </div>
  );
}

export default function CustomerAppointmentForm({
  title,
  subtitle,
  vehicleField,
  sidePanel,
  date,
  setDate,
  minDate,
  availableSlots,
  loading,
  error,
  time,
  setTime,
  submit,
  savingLabel,
  submitLabel,
  cancelLabel,
  onCancel,
  selectedVehicleLabel,
}) {
  const showHeader = Boolean(title || subtitle);

  return (
    <div className="page">
      {showHeader ? (
        <div className="pageHead">
          <div>
            <div className="pageTitle">{title}</div>
            <div className="pageSub">{subtitle}</div>
          </div>
        </div>
      ) : null}

      <div style={{ maxWidth: "1180px", margin: "0 auto", display: "grid", gap: "22px" }}>
        <section
          className="card"
          style={{
            overflow: "hidden",
            background:
              "radial-gradient(circle at top right, rgba(141,187,1,0.16), transparent 28%), linear-gradient(135deg, rgba(12,58,87,0.98) 0%, rgba(17,73,109,0.95) 58%, rgba(141,187,1,0.9) 100%)",
            color: "#fff",
          }}
        >
          <div
            className="cardPad"
            style={{
              padding: "30px",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.15fr) minmax(280px, 0.85fr)",
              gap: "22px",
              alignItems: "end",
            }}
          >
            <div style={{ display: "grid", gap: "10px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", opacity: 0.74 }}>
                Customer Booking
              </div>
              <div style={{ fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.06, fontWeight: 800, letterSpacing: "-0.05em", maxWidth: "640px" }}>
                {selectedVehicleLabel || "Reserve your next showroom visit."}
              </div>
              <div style={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.75, maxWidth: "620px" }}>
                Select a future date, choose a one-hour session, and let the team prepare a smooth premium handover for your visit.
              </div>
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
              <HeroMetric label="Date" value={date || "Select date"} />
              <HeroMetric label="Session" value={formatDisplayTime(time)} />
              <HeroMetric label="Window" value="9:00 AM - 5:00 PM" />
            </div>
          </div>
        </section>

        <form onSubmit={submit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.12fr) minmax(280px, 0.88fr)",
              gap: "22px",
              alignItems: "start",
            }}
          >
            <div style={{ display: "grid", gap: "22px" }}>
              {vehicleField ? (
                <Surface title="Vehicle" subtitle="Choose the vehicle you want to inspect or test drive.">
                  {vehicleField}
                </Surface>
              ) : null}

              <Surface title="Schedule" subtitle="Future dates only, with real session availability based on staff capacity.">
                <div style={{ display: "grid", gap: "18px" }}>
                  <div>
                    <label className="label">Appointment Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      min={minDate}
                      className="input"
                    />
                    <div className="sub" style={{ marginTop: "8px" }}>
                      Sessions are offered between 9:00 AM and 5:00 PM on open working days.
                    </div>
                  </div>

                  {error ? (
                    <div
                      className="card cardPad"
                      style={{
                        borderColor: "rgba(186, 94, 94, 0.22)",
                        color: "var(--danger)",
                        background: "rgba(255,255,255,0.96)",
                      }}
                    >
                      {error}
                    </div>
                  ) : null}

                  <div style={{ display: "grid", gap: "10px" }}>
                    <label className="label">Available Sessions</label>
                    {loading ? (
                      <div className="card cardPad" style={{ color: "var(--text-muted)" }}>
                        Loading available sessions...
                      </div>
                    ) : date ? (
                      availableSlots.length > 0 ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(168px, 1fr))", gap: "12px" }}>
                          {availableSlots.map((slot) => {
                            const selected = time === slot.time;
                            const disabled = slot.availableStaffCount === 0;

                            return (
                              <button
                                key={slot.time}
                                type="button"
                                disabled={disabled}
                                onClick={() => !disabled && setTime(slot.time)}
                                className="btn"
                                style={{
                                  minHeight: "88px",
                                  padding: "16px 14px",
                                  borderRadius: "20px",
                                  display: "grid",
                                  gap: "6px",
                                  justifyItems: "start",
                                  background: selected
                                    ? "linear-gradient(135deg, #0C3A57 0%, #15517a 58%, #8DBB01 100%)"
                                    : "rgba(255,255,255,0.98)",
                                  color: selected ? "#fff" : "var(--navy)",
                                  border: selected ? "1px solid transparent" : "1px solid var(--border)",
                                  boxShadow: selected ? "0 14px 28px rgba(12,58,87,0.16)" : "none",
                                  opacity: disabled ? 0.42 : 1,
                                  cursor: disabled ? "not-allowed" : "pointer",
                                }}
                                title={`${slot.availableStaffCount} staff member${slot.availableStaffCount !== 1 ? "s" : ""} available`}
                              >
                                <div style={{ fontWeight: 800, fontSize: "15px" }}>{formatDisplayTime(slot.time)}</div>
                                <div style={{ fontSize: "12px", opacity: selected ? 0.92 : 0.72 }}>
                                  {slot.availableStaffCount} available
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="card cardPad" style={{ color: "var(--text-muted)" }}>
                          No sessions are available for this date.
                        </div>
                      )
                    ) : (
                      <div className="card cardPad" style={{ color: "var(--text-muted)" }}>
                        Select a date to reveal available sessions.
                      </div>
                    )}
                  </div>
                </div>
              </Surface>
            </div>

            <div style={{ display: "grid", gap: "18px", position: "sticky", top: "92px" }}>
              <Surface title="Booking Summary" subtitle="A quick final check before you confirm.">
                <div style={{ display: "grid", gap: "12px" }}>
                  <SummaryRow label="Vehicle" value={selectedVehicleLabel || "Showroom visit"} />
                  <SummaryRow label="Date" value={date || "Select date"} />
                  <SummaryRow label="Session" value={formatDisplayTime(time)} />
                  <SummaryRow label="Window" value="9:00 AM - 5:00 PM" />
                </div>
              </Surface>

              {sidePanel ? (
                sidePanel
              ) : (
                <Surface title="Visit Notes" subtitle="A calm experience starts with a clear booking policy.">
                  <div style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                    Your session is matched against available staff so the vehicle can be prepared properly before you arrive.
                  </div>
                </Surface>
              )}

              <div style={{ display: "grid", gap: "12px" }}>
                <button type="submit" disabled={!date || !time} className="btn btnPrimary" style={{ width: "100%", minHeight: "50px" }}>
                  {savingLabel || submitLabel}
                </button>
                <button type="button" onClick={onCancel} className="btn" style={{ width: "100%" }}>
                  {cancelLabel}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export { formatDisplayTime };
