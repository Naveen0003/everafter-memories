import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CLIENT } from "../config.js";

export default function Travel() {
  const url = window.location.href.split("#")[0];
  const [copied, setCopied] = useState("Copy link");
  const copy = () => navigator.clipboard.writeText(url).then(() => setCopied("Link copied"), () => setCopied("Copy from address bar"));
  return (
    <section className="travel" id="travel">
      <div className="wrap">
        <h2 className="script">Travel &amp; venue</h2><p className="sub">Find all the details you need</p>
        <div className="tgrid">
          <div className="tbox">
            <h3 className="serif" style={{ fontSize: "1.6rem", color: "var(--plum)" }}>{CLIENT.venue.split(",")[0]}</h3>
            <p>{CLIENT.venue.split(",").slice(1).join(",").trim()}</p>
            <a className="btn out" href={CLIENT.mapsUrl} target="_blank" rel="noopener">Get directions</a>
          </div>
          <div className="tbox"><b>Hotel booking</b><p>Special guest rates available.</p><b>Transport</b><p>Airport pickup and drop on request.</p></div>
          <div className="tbox"><b>Dress code</b><p>Traditional or formal.</p><b>Contact</b><p>{CLIENT.phone}</p></div>
        </div>
        <p className="sub" style={{ marginTop: "2rem" }}>Share this invitation</p>
        <div id="qr" aria-label="QR code for this page"><QRCodeSVG value={url} size={150} fgColor="#5C3A5A" /></div><br />
        <button className="btn out" onClick={copy}>{copied}</button>{" "}
        <a className="btn" target="_blank" rel="noopener"
          href={"https://wa.me/?text=" + encodeURIComponent(`You are invited to ${CLIENT.names.join(" & ")}’s wedding: ${url}`)}>Share on WhatsApp</a>
      </div>
    </section>
  );
}
