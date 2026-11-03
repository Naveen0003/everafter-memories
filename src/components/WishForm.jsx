import { useState } from "react";
import { CLIENT } from "../config.js";
import { sendWish } from "../supabase.js";

const TYPES = {
  text: { label: "Message" },
  video: { label: "Video wish", accept: "video/*", max: 25, hint: "MP4 or MOV, under 1 minute.", pick: "Choose a video (max 25 MB)" },
  photo: { label: "Old memory photo", accept: "image/*", max: 8, hint: "JPG or PNG of a memory with the couple.", pick: "Choose a photo (max 8 MB)" },
};
const empty = { name: "", place: "", relation: "Family", message: "", caption: "", hp: "" };

export default function WishForm() {
  const [kind, setKind] = useState("text");
  const [f, setF] = useState(empty);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ msg: "", ok: false });
  const [sent, setSent] = useState("");
  const media = kind !== "text";
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const err = (msg) => setStatus({ msg, ok: false });

  async function submit(e) {
    e.preventDefault();
    if (f.hp) return; // spam trap
    if (!f.name.trim()) return err("Enter your name so " + CLIENT.names[0] + " and " + CLIENT.names[1] + " know who sent this.");
    if (!media && !f.message.trim()) return err("Write a message before sending.");
    if (media) {
      if (!file) return err("Choose a " + (kind === "video" ? "video" : "photo") + " to upload.");
      if (!file.type.startsWith(kind === "video" ? "video/" : "image/")) return err("That file type is not accepted.");
      if (file.size > TYPES[kind].max * 1048576) return err("File is too large. The limit is " + TYPES[kind].max + " MB.");
    }
    setStatus({ msg: "Sending your wish…", ok: true });
    try {
      await sendWish({ name: f.name.trim(), place: f.place.trim(), relation: f.relation, message: f.message.trim(), caption: f.caption.trim(), kind }, media ? file : null);
      setSent(f.name.trim());
    } catch {
      err("Could not send. Check your connection and try again.");
    }
  }

  function reset() { setSent(""); setF(empty); setFile(null); setStatus({ msg: "", ok: false }); }

  return (
    <section className="wish" id="wish">
      <div className="wrap">
        <h2 className="script">Send your wishes</h2>
        <p className="sub">From anywhere in the world, tell us you are thinking of us</p>
        <div className="card">
          {sent ? (
            <div className="thanks">
              <h3 className="script">Thank you, {sent}</h3>
              <p>Your wish was sent. Only {CLIENT.names[0]} &amp; {CLIENT.names[1]} will read it.</p>
              <button className="btn out" onClick={reset}>Send another wish</button>
            </div>
          ) : (
            <>
              <div className="priv"><span aria-hidden="true">🔒</span><span>This is a private guestbook. Only {CLIENT.names[0]} &amp; {CLIENT.names[1]} can read your wish. Other guests cannot see it.</span></div>
              <div className="tabs" role="tablist" aria-label="Wish type">
                {Object.entries(TYPES).map(([k, t]) => (
                  <button key={k} type="button" className="tab" role="tab" aria-selected={kind === k}
                    onClick={() => { setKind(k); setFile(null); setStatus({ msg: "", ok: false }); }}>{t.label}</button>
                ))}
              </div>
              <form onSubmit={submit} noValidate>
                <div className="row">
                  <label>Your name *<input value={f.name} onChange={set("name")} maxLength={60} autoComplete="name" /></label>
                  <label>Writing from<input value={f.place} onChange={set("place")} maxLength={60} placeholder="City, country" /></label>
                </div>
                <label>How do you know us?
                  <select value={f.relation} onChange={set("relation")}>
                    {["Family", "Friend", "Colleague", "Neighbour", "Other"].map((r) => <option key={r}>{r}</option>)}
                  </select>
                </label>
                <label>{media ? "Short message (optional)" : "Your message *"}
                  <textarea rows={4} value={f.message} onChange={set("message")} maxLength={500} placeholder="Write in any language" />
                </label>
                {media && (
                  <>
                    <label>{TYPES[kind].pick}
                      <input type="file" accept={TYPES[kind].accept} onChange={(e) => setFile(e.target.files[0] || null)} />
                      <span className="hint">{TYPES[kind].hint}</span>
                    </label>
                    <label>The story behind it<textarea rows={2} value={f.caption} onChange={set("caption")} maxLength={200} /></label>
                  </>
                )}
                <label style={{ display: "none" }} aria-hidden="true">Leave blank<input value={f.hp} onChange={set("hp")} tabIndex={-1} autoComplete="off" /></label>
                <button className="btn" type="submit">Send to the couple</button>
                <p className={"msg " + (status.ok ? "ok" : "err")} role="status">{status.msg}</p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
