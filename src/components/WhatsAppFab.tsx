import { whatsappLink } from "@/data/site";

// Persistent floating WhatsApp button — same studio number as the header.
export default function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Andaman Studio on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border border-gold/40 bg-ink-deep/90 py-2.5 pl-2.5 pr-3 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 hover:border-gold sm:bottom-7 sm:right-7"
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
        <svg viewBox="0 0 24 24" fill="currentColor" className="relative h-6 w-6 text-white" aria-hidden>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.24.69-1.42 1.34-1.95 1.39-.5.05-1.13.07-1.82-.11a16.6 16.6 0 0 1-1.65-.61c-2.9-1.25-4.8-4.17-4.95-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36l.56.01c.18.01.42-.07.66.5.24.59.82 2.03.89 2.18.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.3.37-.42.5-.14.14-.29.29-.12.57.17.29.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.42.29.14.46.12.63-.07.17-.19.72-.85.91-1.14.19-.29.39-.24.66-.14.27.09 1.7.8 1.99.95.29.14.48.21.55.34.07.12.07.71-.17 1.4Z" />
        </svg>
      </span>
      <span className="font-syne hidden pr-1 text-[0.78rem] font-bold uppercase tracking-[0.06em] text-on-deep transition-colors group-hover:text-gold sm:inline">
        WhatsApp
      </span>
    </a>
  );
}
