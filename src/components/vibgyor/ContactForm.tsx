"use client";
import { useState } from "react";
import { burstConfetti } from "./confetti";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    const btn = (e.currentTarget as HTMLFormElement).querySelector("button");
    const r = btn?.getBoundingClientRect();
    burstConfetti(r ? r.left + r.width / 2 : undefined, r ? r.top : undefined);
  };
  return (
    <form className="form-grid" style={{ marginTop: 0 }} onSubmit={onSubmit}>
      <div className="field"><label>Your Name</label><input type="text" required placeholder="Bride & Groom" /></div>
      <div className="field"><label>Phone</label><input type="tel" required placeholder="+91" /></div>
      <div className="field"><label>Email</label><input type="email" required placeholder="you@email.com" /></div>
      <div className="field"><label>Wedding Date</label><input type="text" required placeholder="Approx. month / year" /></div>
      <div className="field"><label>City / Destination</label><input type="text" placeholder="Where will the magic happen?" /></div>
      <div className="field"><label>Budget Range</label>
        <select required defaultValue="">
          <option value="" disabled>Select</option>
          <option>₹25L – ₹50L</option><option>₹50L – ₹1 Cr</option><option>₹1 Cr – ₹3 Cr</option><option>₹3 Cr +</option>
        </select>
      </div>
      <div className="field full"><label>Tell us about your dream day</label><textarea placeholder="Number of guests, functions, vibe, anything..." /></div>
      <button className="btn-pill" type="submit" data-hover style={{ marginTop: ".4rem" }}>
        {sent ? "Thank you · We will call you ♥" : <>Send Enquiry <span className="dot">→</span></>}
      </button>
    </form>
  );
}
