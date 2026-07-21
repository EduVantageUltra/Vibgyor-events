"use client";
import { useState } from "react";
import ContactForm from "./ContactForm";
import { INDIA_CITIES } from "@/lib/cities";

export default function CityPlanner() {
  const [city, setCity] = useState("");
  const known = INDIA_CITIES.some((c) => c.toLowerCase() === city.trim().toLowerCase());

  return (
    <>
      <div className="finder reveal">
        <div className="field">
          <label htmlFor="cp-city">Which city are you planning in?</label>
          <input
            id="cp-city"
            list="india-cities"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Type a city — Udaipur, Goa, Jaipur, Kochi…"
            autoComplete="off"
          />
          <datalist id="india-cities">
            {INDIA_CITIES.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div className="finder-foot">
          <span className="finder-count">
            {city.trim()
              ? known
                ? `We plan weddings in ${city.trim()} — venue options in 5 working days`
                : `${city.trim()} — tell us more below and we'll find it`
              : `${INDIA_CITIES.length}+ cities across India`}
          </span>
          {city && (
            <button type="button" className="finder-reset" onClick={() => setCity("")} data-hover>
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="contact-card reveal" style={{ marginTop: "2rem" }}>
        <ContactForm key={city} city={city.trim()} />
      </div>
    </>
  );
}
