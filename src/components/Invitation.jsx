import { useState } from "react";
import { CLIENT } from "../config.js";

export default function Invitation() {
  const [open, setOpen] = useState(false);
  const [a, b] = CLIENT.names;
  return (
    <section className="invite" id="invite">
      <div className="wrap">
        <h2 className="script">You’re invited</h2>
        <p className="sub">To celebrate the beginning of our forever</p>
        <div className={"env" + (open ? " open" : "")} onClick={() => setOpen(!open)}>
          <div className="letter">
            <h3 className="script">{a} &amp; {b}</h3>
            <p>request the joy of your company</p>
            <p><b>{CLIENT.dateLong}</b></p>
            <p>{CLIENT.venue}</p>
          </div>
          <div className="body" /><div className="flap" /><div className="seal">{a[0]}{b[0]}</div>
        </div>
        <button className="btn" onClick={() => setOpen(!open)}>{open ? "Close invitation" : "Open invitation"}</button>
      </div>
    </section>
  );
}
