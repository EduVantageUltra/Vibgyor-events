// Lightweight DOM confetti burst — no library. Rainbow celebration on enquiry.
export function burstConfetti(x?: number, y?: number) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cx = x ?? window.innerWidth / 2;
  const cy = y ?? window.innerHeight / 2;
  const colors = ["#8b5cf6", "#2563eb", "#16a34a", "#eab308", "#f97316", "#e11d48", "#e8c87a", "#ffffff"];
  const layer = document.createElement("div");
  layer.style.cssText = "position:fixed;inset:0;z-index:10001;pointer-events:none";
  document.body.appendChild(layer);
  const N = 100;
  for (let i = 0; i < N; i++) {
    const b = document.createElement("span");
    const size = 6 + Math.random() * 9;
    const round = Math.random() > 0.6;
    b.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:${size}px;height:${round ? size : size * 0.55}px;background:${colors[i % colors.length]};border-radius:${round ? "50%" : "2px"};will-change:transform,opacity`;
    layer.appendChild(b);
    const ang = Math.random() * Math.PI * 2;
    const vel = 130 + Math.random() * 280;
    const dx = Math.cos(ang) * vel;
    const dy = Math.sin(ang) * vel - (130 + Math.random() * 130);
    const rot = Math.random() * 760 - 380;
    const dur = 1000 + Math.random() * 1000;
    b.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy + 300}px) rotate(${rot}deg)`, opacity: 0 },
      ],
      { duration: dur, easing: "cubic-bezier(0.18,0.9,0.32,1)", fill: "forwards" }
    );
  }
  setTimeout(() => layer.remove(), 2400);
}
