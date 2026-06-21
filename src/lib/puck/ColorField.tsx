"use client";

/** Custom Puck field: a colour swatch + hex input, with a "none" reset. */
export function ColorField({
  value,
  onChange,
  allowNone = true,
}: {
  value?: string;
  onChange: (v: string) => void;
  allowNone?: boolean;
}) {
  const current = value && value !== "none" ? value : "";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input
        type="color"
        value={current || "#7c5cff"}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 38, height: 30, border: "1px solid #ddd", borderRadius: 8, background: "none", cursor: "pointer" }}
      />
      <input
        type="text"
        value={value || ""}
        placeholder={allowNone ? "none / hex" : "#hex"}
        onChange={(e) => onChange(e.target.value)}
        style={{ flex: 1, padding: "7px 9px", border: "1px solid #e2e2e8", borderRadius: 8, fontSize: 12, fontFamily: "monospace" }}
      />
      {allowNone && (
        <button
          type="button"
          onClick={() => onChange("none")}
          style={{ padding: "6px 10px", border: "1px solid #e2e2e8", borderRadius: 8, background: "#f7f7fa", fontSize: 12, cursor: "pointer" }}
        >
          clear
        </button>
      )}
    </div>
  );
}
