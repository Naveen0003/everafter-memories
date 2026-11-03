import { CLIENT } from "./config.js";
import Hero from "./components/Hero.jsx";
import Invitation from "./components/Invitation.jsx";
import { Story, Events } from "./components/Sections.jsx";
import Gallery from "./components/Gallery.jsx";
import WishForm from "./components/WishForm.jsx";
import Rsvp from "./components/Rsvp.jsx";
import Travel from "./components/Travel.jsx";
import CouplePanel from "./components/CouplePanel.jsx";

export default function App() {
  const [a, b] = CLIENT.names;
  return (
    <>
      <nav aria-label="Sections">
        {[["top", "Home"], ["invite", "Invitation"], ["events", "Events"], ["gallery", "Gallery"], ["wish", "Send a wish"], ["rsvp", "RSVP"], ["travel", "Venue"]].map(([id, t]) => (
          <a key={id} href={`#${id}`}>{t}</a>
        ))}
      </nav>
      <Hero />
      <Invitation />
      <Story />
      <Events />
      <Gallery />
      <WishForm />
      <Rsvp />
      <Travel />
      <CouplePanel />
      <section className="thank">
        <div>
          <h2 className="script">Thank you</h2>
          <p className="sub" style={{ color: "#fff" }}>For being a part of our journey</p>
          <p className="script" style={{ fontSize: "2.2rem", margin: 0 }}>{a} &amp; {b}</p>
          <p>{CLIENT.dateParts.join(" · ")}</p>
        </div>
      </section>
      <footer>Made with EverAfter Memories</footer>
    </>
  );
}
