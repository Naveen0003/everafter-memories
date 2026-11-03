import { useState } from "react";
import { sendRsvp } from "../supabase.js";

export default function Rsvp() {
  const [r, setR] = useState({ name: "", phone: "", attending: "", guests: "1" });
  const [s, setS] = useState({ msg: "", ok: false });
  const set = (k) => (e) => setR({ ...r, [k]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    if (!r.name.trim() || !r.phone.trim() || !r.attending) return setS({ msg: "Fill in your name, mobile number and attendance.", ok: false });
    try {
      await sendRsvp({ ...r, name: r.name.trim(), phone: r.phone.trim() });
      setS({ msg: `Thank you, ${r.name.trim()}. Your RSVP is noted.`, ok: true });
      setR({ name: "", phone: "", attending: "", guests: "1" });
    } catch { setS({ msg: "Could not send your RSVP. Try again.", ok: false }); }
  }
  return (
    <section className="rsvp" id="rsvp">
      <div className="wrap">
        <h2 className="script">RSVP</h2><p className="sub">Kindly confirm your presence</p>
        <div className="card">
          <form onSubmit={submit} noValidate>
            <div className="row">
              <label>Your name *<input value={r.name} onChange={set("name")} maxLength={60} /></label>
              <label>Mobile number *<input type="tel" value={r.phone} onChange={set("phone")} maxLength={20} /></label>
            </div>
            <div className="row">
              <label>Will you attend? *
                <select value={r.attending} onChange={set("attending")}>
                  <option value="">Select</option><option>Yes, joyfully</option><option>Joining by live stream</option><option>Sorry, cannot attend</option>
                </select>
              </label>
              <label>Number of guests
                <select value={r.guests} onChange={set("guests")}>{["1", "2", "3", "4", "5+"].map((g) => <option key={g}>{g}</option>)}</select>
              </label>
            </div>
            <button className="btn" type="submit">Submit RSVP</button>
            <p className={"msg " + (s.ok ? "ok" : "err")} role="status">{s.msg}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
