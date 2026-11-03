import { createClient } from "@supabase/supabase-js";
import { CLIENT } from "./config.js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const sb = url && key ? createClient(url, key) : null;
export const demoMode = !sb;

const BUCKET = "guest-media";
const LS = "ea-demo-wishes";
const readLocal = () => { try { return JSON.parse(localStorage.getItem(LS) || "[]"); } catch { return []; } };
const writeLocal = (a) => { try { localStorage.setItem(LS, JSON.stringify(a)); } catch {} };

// GUEST: send only. Guests can never read wishes.
export async function sendWish(w, file) {
  if (demoMode) {
    writeLocal([{ ...w, id: crypto.randomUUID(), fileName: file?.name || "" }, ...readLocal()]);
    return;
  }
  let path = null;
  if (file) {
    const ext = (file.name.split(".").pop() || "bin").replace(/[^a-z0-9]/gi, "").slice(0, 5);
    path = `${CLIENT.slug}/${crypto.randomUUID()}.${ext}`;
    const up = await sb.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
    if (up.error) throw up.error;
  }
  const { error } = await sb.rpc("submit_wish", {
    p_slug: CLIENT.slug, p_name: w.name, p_place: w.place, p_relation: w.relation,
    p_message: w.message, p_caption: w.caption, p_kind: w.kind, p_file_path: path,
  });
  if (error) throw error;
}

export async function sendRsvp(r) {
  if (demoMode) return;
  const { error } = await sb.rpc("submit_rsvp", {
    p_slug: CLIENT.slug, p_name: r.name, p_phone: r.phone, p_attending: r.attending, p_guests: r.guests,
  });
  if (error) throw error;
}

// COUPLE: sign in, read, delete. Database rules enforce that only the owner can read.
export async function signIn(email, password) {
  if (demoMode) return password === "1512"; // demo only, not secure
  const { error } = await sb.auth.signInWithPassword({ email, password });
  return !error;
}
export async function signOut() { if (sb) await sb.auth.signOut(); }
export async function hasSession() {
  if (demoMode) return false;
  const { data } = await sb.auth.getSession();
  return !!data.session;
}

export async function loadWishes() {
  if (demoMode) return readLocal().map((w) => ({ ...w, url: "", path: "" }));
  const { data, error } = await sb.from("wishes").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  const paths = data.filter((r) => r.file_path).map((r) => r.file_path);
  const signed = {};
  if (paths.length) {
    const s = await sb.storage.from(BUCKET).createSignedUrls(paths, 3600);
    (s.data || []).forEach((x) => { if (x.signedUrl) signed[x.path] = x.signedUrl; });
  }
  return data.map((r) => ({
    id: r.id, name: r.guest_name, place: r.place || "", relation: r.relation || "",
    message: r.message || "", caption: r.caption || "", kind: r.kind,
    path: r.file_path || "", url: signed[r.file_path] || "",
  }));
}

export async function deleteWish(w) {
  if (demoMode) { writeLocal(readLocal().filter((x) => x.id !== w.id)); return; }
  if (w.path) await sb.storage.from(BUCKET).remove([w.path]);
  await sb.from("wishes").delete().eq("id", w.id);
}
