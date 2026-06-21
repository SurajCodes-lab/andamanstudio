"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type M = { id: number; url: string; alt: string; mime?: string };

const isVid = (mime?: string, url?: string) =>
  (mime?.startsWith("video") ?? false) || /\.(mp4|webm|mov)$/i.test(url ?? "");

function Thumb({ url, mime, className }: { url: string; mime?: string; className?: string }) {
  if (isVid(mime, url)) {
    return <video src={url} muted playsInline preload="metadata" className={className ?? "h-full w-full object-cover"} />;
  }
  return <Image src={url} alt="" fill sizes="200px" className={className ?? "object-cover"} />;
}

export default function ImagePicker({
  label,
  current,
  targetId,
  action,
  media,
  accept = "image",
}: {
  label: string;
  current: { url: string; mime?: string } | null;
  targetId: number;
  action: (formData: FormData) => void;
  media: M[];
  /** "image" (default), "video", or "all" — what the Upload-new control accepts. */
  accept?: "image" | "video" | "all";
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "image" | "video">("all");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const acceptAttr =
    accept === "video"
      ? "video/mp4,video/webm"
      : accept === "all"
      ? "image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
      : "image/jpeg,image/png,image/webp,image/avif";

  const select = (mediaId: number) => {
    const fd = new FormData();
    fd.append("targetId", String(targetId));
    fd.append("mediaId", String(mediaId));
    action(fd);
    setOpen(false);
  };

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(j.error || "Upload failed");
      } else {
        if (fileRef.current) fileRef.current.value = "";
        select(j.id); // immediately assign the freshly uploaded file
        router.refresh();
      }
    } catch {
      setErr("Upload failed");
    } finally {
      setBusy(false);
    }
  }

  const shown = media.filter((m) =>
    tab === "all" ? true : tab === "video" ? isVid(m.mime, m.url) : !isVid(m.mime, m.url)
  );

  return (
    <div>
      {label && <p className="meta mb-1.5 text-on-deep/55">{label}</p>}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg border border-line"
      >
        {current ? (
          <Thumb url={current.url} mime={current.mime} />
        ) : (
          <span className="flex h-full items-center justify-center text-xs text-on-deep/40">+ Choose / upload</span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-ink-deep/0 text-xs font-bold uppercase tracking-[0.12em] text-white opacity-0 transition-all group-hover:bg-ink-deep/55 group-hover:opacity-100">
          {current ? "Change" : "Add"}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/75 p-4 sm:p-6" onClick={() => setOpen(false)}>
          <div
            className="max-h-[88vh] w-full max-w-5xl overflow-auto rounded-2xl border border-line bg-ink-deep p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {(["all", "image", "video"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.1em] ${
                      tab === t ? "border-gold bg-gold text-ink-deep" : "border-line text-on-deep/60 hover:text-gold"
                    }`}
                  >
                    {t === "all" ? "All" : t === "image" ? "Photos" : "Videos"}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gold px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-ink-deep hover:bg-gold-soft">
                  {busy ? "Uploading…" : "↑ Upload new"}
                  <input ref={fileRef} type="file" accept={acceptAttr} hidden disabled={busy} onChange={onUpload} />
                </label>
                <button onClick={() => setOpen(false)} className="text-sm text-on-deep/60 hover:text-gold">Close ✕</button>
              </div>
            </div>
            {err && <p className="mb-3 text-sm text-[#e0633b]">{err}</p>}

            {shown.length === 0 ? (
              <p className="py-12 text-center text-sm text-on-deep/40">
                Nothing here yet — use <span className="text-gold">↑ Upload new</span> to add one.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                {shown.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => select(m.id)}
                    className="relative block aspect-square w-full overflow-hidden rounded border border-line transition-colors hover:border-gold"
                    title={m.alt}
                  >
                    <Thumb url={m.url} mime={m.mime} />
                    {isVid(m.mime, m.url) && (
                      <span className="absolute bottom-1 right-1 rounded bg-ink-deep/80 px-1 text-[0.55rem] text-gold">▶ video</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
