"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Uploader() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || "Upload failed");
      } else {
        if (inputRef.current) inputRef.current.value = "";
        router.refresh();
      }
    } catch {
      setErr("Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <label className="font-syne inline-flex cursor-pointer items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold uppercase tracking-[0.08em] text-ink-deep transition-colors hover:bg-gold-soft">
        {busy ? "Uploading…" : "Upload image / video"}
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm" hidden onChange={onChange} disabled={busy} />
      </label>
      {err && <p className="text-sm text-[#e0633b]">{err}</p>}
    </div>
  );
}
