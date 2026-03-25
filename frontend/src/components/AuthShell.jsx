import { Link } from "react-router-dom";

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  compact = false,
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--page-gradient)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: compact ? "460px" : "560px",
          background: "var(--surface-strong)",
          border: "1px solid var(--border)",
          borderRadius: "24px",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            padding: "34px 34px 26px",
            borderBottom: "1px solid var(--border)",
            display: "grid",
            gap: "12px",
            textAlign: "center",
          }}
        >
          <Link to="/" style={{ width: "fit-content", margin: "0 auto" }}>
            <img
              src="/logo.svg"
              alt="Leaf Lanka"
              style={{
                width: "62px",
                height: "62px",
                objectFit: "contain",
                borderRadius: "14px",
                display: "block",
              }}
            />
          </Link>
          <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--primary)" }}>
            {eyebrow}
          </div>
          <div style={{ fontSize: "30px", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
            {title}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.7, maxWidth: "420px", margin: "0 auto" }}>
            {subtitle}
          </div>
        </div>

        <div style={{ padding: "30px 34px" }}>{children}</div>

        {footer ? (
          <div
            style={{
              padding: "0 34px 30px",
              color: "var(--text-muted)",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
