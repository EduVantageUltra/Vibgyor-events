const ITEMS = ["Mehendi", "Haldi", "Sangeet", "The Wedding", "Reception", "Destination"];

export default function Marquee() {
  const row = (
    <>
      {ITEMS.map((it, i) => (
        <span key={i} style={{ display: "inline-flex", gap: "2.6rem", alignItems: "center" }}>
          <b>✦</b> {it}
        </span>
      ))}
    </>
  );
  return (
    <div className="marquee">
      <div className="marquee-track" style={{ animationDuration: "120s" }}>
        {row}
        {row}
      </div>
    </div>
  );
}
