
const photo = (filename) =>
  `${import.meta.env.BASE_URL}photos/${filename}`;

export const CLIENT = {
  slug: "Naveen-Anu",
  names: ["Naveen", "Anu"],

  dateISO: "2026-12-15T08:00:00+05:30",
  dateParts: ["15", "DEC", "2026"],
  dateLong: "15 Dec 2026, 8:00 AM",

  venue: "ITC Grand Chola, A Luxury Collection Hotel, Chennai",
  phone: "+91 80564 53776",

  tagline: "Two hearts · One journey · A lifetime of love",

  story: [
    "It all started with a simple conversation, and turned into a beautiful journey of love, laughter and togetherness.",
    "Today, we are excited to take the next step and celebrate our love with the people who mean the most to us, near and far.",
  ],

  events: [
    {
      icon: "🌿",
      title: "Mehendi",
      when: "12 Dec 2026 · 4:00 PM",
      where: "The Royal Lawn",
    },
    {
      icon: "🪔",
      title: "Sangeet",
      when: "13 Dec 2026 · 6:00 PM",
      where: "The Grand Ballroom",
    },
    {
      icon: "🔥",
      title: "Wedding",
      when: "15 Dec 2026 · 8:00 AM",
      where: "The Main Garden",
    },
    {
      icon: "🥂",
      title: "Reception",
      when: "15 Dec 2026 · 7:00 PM",
      where: "The Grand Ballroom",
    },
  ],

  storyImage: photo("Romantic.jpg"),

  photos: [
    {
      caption: "Engagement",
      img: photo("Engagement.jpg"),
    },
    {
      caption: "Palace night",
      img: photo("Palacenight.jpg"),
    },
    {
      caption: "First dance",
      img: photo("Firstdance.jpg"),
    },
    {
      caption: "Haldi",
      img: photo("Haldi.jpg"),
    },
    {
      caption: "Family",
      img: photo("Family.jpg"),
    },
    {
      caption: "Sunset",
      img: photo("Sunset.jpg"),
    },
  ],

  mapsUrl: "https://maps.app.goo.gl/DRsz427iH6k5GknX7",
};
