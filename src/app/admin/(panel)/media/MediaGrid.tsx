"use client";

import Image from "next/image";
import { updateAlt, deleteMedia } from "./actions";

type MediaItem = { id: number; url: string; alt: string };

export default function MediaGrid({ items }: { items: MediaItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((m) => (
        <div key={m.id} className="overflow-hidden rounded-xl border border-line bg-surface/40">
          <div className="relative aspect-square">
            <Image src={m.url} alt={m.alt} fill sizes="20vw" className="object-cover" />
          </div>
          <div className="p-2.5">
            <form action={updateAlt}>
              <input type="hidden" name="id" value={m.id} />
              <input
                name="alt"
                defaultValue={m.alt}
                onBlur={(e) => e.currentTarget.form?.requestSubmit()}
                placeholder="alt text"
                className="w-full rounded border border-line bg-ink-deep px-2 py-1 text-xs text-on-deep outline-none focus:border-gold"
              />
            </form>
            <form action={deleteMedia} className="mt-1.5 flex items-center justify-between">
              <input type="hidden" name="id" value={m.id} />
              <span className="mono text-[0.6rem] text-on-deep/30">#{m.id}</span>
              <button className="text-[0.65rem] uppercase tracking-[0.12em] text-on-deep/40 transition-colors hover:text-[#e0633b]">
                Delete
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
