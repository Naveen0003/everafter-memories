import { useEffect, useState } from "react";
import { demoMode, hasSession, signIn, signOut, loadWishes, deleteWish } from "../supabase.js";

export default function CouplePanel() {
  const [authed, setAuthed] = useState(false);
  const [wishes, setWishes] = useState([]);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  async function open() {
    try { setWishes(await loadWishes()); setAuthed(true); setErr(""); }
    catch { setErr("Could not load wishes."); }
  }
  useEffect(() => { hasSession().then((ok) => ok && open()); }, []);

  async function login(e) {
    e.preventDefault();
    (await signIn(email.trim(), pw)) ? open() : setErr(demoMode ? "Incorrect PIN." : "Wrong email or password.");
  }
  async function lock() { await signOut(); setAuthed(false); setPw(""); setWishes([]); }
  async function remove(w) { await deleteWish(w); setWishes(wishes.filter((x) => x.id !== w.id)); }

  const count = (k) => wishes.filter((w) => w.kind === k).length;
  return (
    <section className="couple" id="couple">
      <div className="wrap">
        <h2 className="script">For the couple only</h2>
        <p className="sub" style={{ color: "#e9cfd6" }}>Every wish sent to you appears here</p>
        {!authed ? (
          <form onSubmit={login}>
            <p className="hint" style={{ color: "#d9c4cf" }}>
              {demoMode ? "Demo mode. Demo PIN: 1512 (not secure; real sites use the couple’s login)." : "Sign in with the couple’s account."}
            </p>
            <div className="pin">
              {!demoMode && <label style={{ color: "#fff" }}>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></label>}
              <label style={{ color: "#fff" }}>{demoMode ? "PIN" : "Password"}
                <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete={demoMode ? "off" : "current-password"} />
              </label>
              <button className="btn" type="submit" style={{ alignSelf: "end" }}>Open my wishes</button>
            </div>
            <p className="msg err">{err}</p>
          </form>
        ) : (
          <div>
            <div className="stats">
              <div><b>{wishes.length}</b>Total wishes</div><div><b>{count("video")}</b>Videos</div><div><b>{count("photo")}</b>Photos</div>
            </div>
            <div className="list">
              {wishes.length === 0 && <p>No wishes yet. They will appear here as guests send them.</p>}
              {wishes.map((w) => (
                <article className="w" key={w.id}>
                  <div className="who">{w.name}{w.kind !== "text" && <span className="tag">{w.kind === "video" ? "Video" : "Photo"}</span>}</div>
                  <small>{w.relation}{w.place && ` · from ${w.place}`}</small>
                  <p>{w.message || w.caption}</p>
                  {w.message && w.caption && <p><small>{w.caption}</small></p>}
                  {w.url && (w.kind === "video" ? <video controls src={w.url} /> : <img alt={`Photo from ${w.name}`} src={w.url} />)}
                  {!w.url && w.fileName && <small>File: {w.fileName} (preview needs the real backend)</small>}
                  <br /><button onClick={() => remove(w)}>Delete</button>
                </article>
              ))}
            </div>
            <p><button className="btn out" style={{ marginTop: "1.5rem" }} onClick={lock}>Lock</button></p>
          </div>
        )}
      </div>
    </section>
  );
}
