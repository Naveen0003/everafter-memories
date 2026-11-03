import { useState } from "react";
import { CLIENT } from "../config.js";

export default function Gallery() {
  const list = CLIENT.photos, n = list.length;
  const [gi, setGi] = useState(0);
  const style = (i) => {
    let o = i - gi;
    if (o > n / 2) o -= n;
    if (o < -n / 2) o += n;
    const a = Math.abs(o);
    return {
      transform: `translateX(${o * 120}px) translateZ(${-a * 120}px) rotateY(${-o * 26}deg) scale(${a === 0 ? 1.12 : 1})`,
      opacity: a > 2 ? 0 : 1 - a * 0.25, zIndex: 10 - a,
    };
  };
  return (
    <section className="gallery" id="gallery">
      <div className="wrap">
        <h2 className="script">Our gallery</h2>
        <p className="sub">Moments that made our story beautiful</p>
        <div className="cf">
          {list.map((p, i) => (
            <div key={p.caption} className="fr" role="img" aria-label={p.caption}
              style={{ ...style(i), background: p.img ? `url(${p.img}) center/cover` : `linear-gradient(165deg,${p.colors})` }}>
              {p.caption}
            </div>
          ))}
        </div>
        <button className="btn out" aria-label="Previous photo" onClick={() => setGi((gi - 1 + n) % n)}>Previous</button>{" "}
        <button className="btn" aria-label="Next photo" onClick={() => setGi((gi + 1) % n)}>Next</button>
      </div>
    </section>
  );
}
