
import { CLIENT } from "../config.js";

export function Story() {
  return (
    <section className="story" id="story">
      <div className="wrap">

        <div className="story-heading">
          <span className="story-eyebrow">
            A LITTLE LOVE STORY
          </span>

          <h2 className="script">Our story</h2>

          <p className="sub">
            From strangers to soulmates
          </p>

          <span className="story-divider">✦</span>
        </div>

        <div className="cols story-content">

          <div className="polaroid story-photo">
            <img
              src={CLIENT.storyImage}
              alt="Naveen and Anu romantic engagement"
            />

            <span className="photo-caption">
              Together, forever ♥
            </span>
          </div>

          <div className="story-text">
            <span className="story-small-title">
              TWO HEARTS, ONE BEAUTIFUL JOURNEY
            </span>

            <p className="serif story-intro">
              {CLIENT.story[0]}
            </p>

            {CLIENT.story.slice(1).map((t, i) => (
              <p key={i}>{t}</p>
            ))}

            <div className="story-signature">
              With love, Naveen & Anu
              <span>♥</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


export function Events() {
  return (
    <section className="events" id="events">
      <div className="wrap">

        <h2 className="script">Wedding events</h2>

        <p className="sub">
          Join us in celebrating our special moments
        </p>

        <div className="ecards">
          {CLIENT.events.map((e) => (
            <div className="ecard" key={e.title}>

              <div className="ic" aria-hidden="true">
                {e.icon}
              </div>

              <h3>{e.title}</h3>

              <p>{e.when}</p>

              <p>{e.where}</p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
