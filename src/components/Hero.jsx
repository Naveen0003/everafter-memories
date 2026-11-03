import { useEffect, useMemo, useState } from "react";
import { CLIENT } from "../config.js";

function useCountdown(iso) {
  const calc = () => Math.max(0, new Date(iso).getTime() - Date.now()) / 1000;
  const [s, setS] = useState(calc);
  useEffect(() => { const t = setInterval(() => setS(calc()), 30000); return () => clearInterval(t); }, [iso]);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60) };
}

export default function Hero() {
  const { d, h, m } = useCountdown(CLIENT.dateISO);
  const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const petals = useMemo(() => Array.from({ length: 14 }, () => ({
    left: Math.random() * 100 + "%", dur: 9 + Math.random() * 9 + "s",
    delay: -Math.random() * 12 + "s", op: 0.45 + Math.random() * 0.4,
  })), []);
  const [p1, p2, p3] = CLIENT.dateParts;
  return (
    <header className="hero" id="top">
      <svg className="arch" viewBox="0 0 800 200" preserveAspectRatio="none" aria-hidden="true">
        <path fill="#2c1830" d="M0 200V120q50-70 100 0v80zM140 200V90q60-90 120 0v110zM300 200V70q100-120 200 0v130zM540 200V90q60-90 120 0v110zM700 200V120q50-70 100 0v80z" />
      </svg>
      <span className="lamp" style={{ left: "12%", top: "38%" }} />
      <span className="lamp" style={{ left: "86%", top: "42%", animationDelay: "1s" }} />
      <span className="lamp" style={{ left: "30%", top: "60%", animationDelay: "2s" }} />
      {!reduce && petals.map((p, i) => (
        <span key={i} className="petal" style={{ left: p.left, animationDuration: p.dur, animationDelay: p.delay, opacity: p.op }} />
      ))}
      <div style={{ position: "relative", zIndex: 2 }}>
        <p className="line">TOGETHER FOREVER</p>
        <h1 className="script">{CLIENT.names[0]} &amp; {CLIENT.names[1]}</h1>
        <p className="line">{CLIENT.tagline}</p>
        <div className="date"><span>{p1}</span><i /><span>{p2}</span><i /><span>{p3}</span></div>
        <p>{CLIENT.venue}</p>
        <div className="count" aria-label="Countdown">
          <div><b>{d}</b><span>days</span></div><div><b>{h}</b><span>hours</span></div><div><b>{m}</b><span>minutes</span></div>
        </div>
        <a className="btn" href="#invite">Open your invitation</a>
      </div>
    </header>
  );
}
