// Supporting content from the brochure: FAQ, tips, terms, booking, testimonials.

// The studio's top shooting locations (brochure FAQ — "top places at Havelock").
export const locations = [
  {
    name: "Radhanagar Beach",
    blurb:
      "Asia's finest white sand and turquoise water — our signature location for beach, sunset and cinematic sessions.",
    image: "/img/beach/photoshoot-at-radhanagar-beach.webp",
  },
  {
    name: "The Forest at Radhanagar",
    blurb:
      "Cool, green canopy a short walk from the sand — dramatic, intimate frames with rich natural depth.",
    image: "/img/forest/best-forest-shoot-at-havelock.webp",
  },
  {
    name: "Kalapathar Beach",
    blurb:
      "Striking black rocks against clear shallows — quieter than Radhanagar and endlessly cinematic.",
    image: "/img/sunset/havelock-island-radhanagar-beach-sunset-shoot.webp",
  },
  {
    name: "Beach No. 5",
    blurb:
      "The long, scenic stretch at Beach No. 5 — perfect for relaxed candid and golden-hour photography.",
    image: "/img/sunset/perfect-sunset-shoots-at-havelock.webp",
  },
];


export const faqs = [
  {
    q: "Are there changing rooms available while shooting outdoors?",
    a: "Yes — most of the tourist locations we shoot at have changing rooms available.",
  },
  {
    q: "Do you provide hard copies along with soft copies?",
    a: "No, we don't provide hard copies for pre/post weddings or any other outdoor sessions.",
  },
  {
    q: "Do you provide costume rental for the photoshoot?",
    a: "No, we don't offer costume services, for hygiene reasons.",
  },
  {
    q: "What are the top places to shoot at Havelock?",
    a: "Radhanagar Beach, the forest around Radhanagar, Kalapathar Beach, and the stretch at Beach No. 5.",
  },
];

export const tips = [
  "Keep one red dress paired with black — it photographs beautifully.",
  "Avoid yellow or green in natural locations, as they tend to merge with the surroundings.",
  "A long-tail dress and a hat add an elegant, editorial touch.",
  "Be yourself and enjoy the moment — it always gives the best outcome.",
  "Want your whole trip captured? Try Memory Maker — moments from your stay, Radhanagar Beach and a candlelight dinner woven into a short film.",
];

export const terms = [
  "50% of the payment is required at the time of booking the photoshoot.",
  "Processed photos are delivered within 3–5 working days after the shoot.",
  "All RAW photos are provided after the pending payment is collected.",
  "No cheque payments are accepted.",
  "In the unlikely event of cancellation by the photographer or total photographic failure, liability is limited to an 80% refund of fees paid.",
  "No refund once the shoot is completed.",
  "If a shoot is rescheduled or delayed, no cancellation charge applies on the booking amount.",
  "In case of bad weather, the shoot is moved to the next day; cancellation is not allowed for the same.",
  "Any charges for using a property during the shoot are the customer's responsibility.",
  "No cancellation is allowed within 10 days of the shoot.",
];

export const bookingSteps = [
  {
    title: "Select your package",
    body: "Pick the photoshoot package that suits you. Need help? Our tour coordinators are a call away at +91 9513290687 / +91 7695070721.",
  },
  {
    title: "Confirm the date",
    body: "WhatsApp us your preferred date along with the payment details to +91 9513290687 / +91 7695070721.",
  },
  {
    title: "Share payment details",
    body: "Send your booking payment details to andamanisland.studio@gmail.com with the date you need the photoshoot.",
  },
  {
    title: "We confirm your shoot",
    body: "We'll check the details and confirm your booking. See you on the islands!",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

// NOTE: Replace these with REAL client reviews (name, role, quote) before launch.
// They are placeholder samples only.
export const testimonials: Testimonial[] = [
  {
    quote:
      "Every moment of our honeymoon was captured perfectly. The team made us feel completely at ease and the cinematic film still gives us goosebumps.",
    name: "Aisha & Rohan",
    role: "Honeymoon couple",
  },
  {
    quote:
      "Professional, flexible and incredibly talented. They worked around our schedule and delivered stunning edits within days.",
    name: "Vikram S.",
    role: "Software professional",
  },
  {
    quote:
      "We travelled with our infant and were worried about the shoot, but they were so patient and kind. The candid family photos are priceless.",
    name: "The Mehtas",
    role: "Family with infant",
  },
  {
    quote:
      "Our post-wedding shoot at Radhanagar and Kalapathar was beyond what we imagined. Worth every rupee.",
    name: "Neha & Arjun",
    role: "Post-wedding couple",
  },
];
