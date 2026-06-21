const ICON: Record<string, string> = {
  note: "📝",
  call: "📞",
  whatsapp: "💬",
  email: "✉",
  stage: "➜",
  payment: "₹",
  assign: "👤",
};

type Activity = { id: number; kind: string; body: string; userName: string | null; createdAt: Date | string };

export default function ActivityTimeline({ items }: { items: Activity[] }) {
  if (!items.length) return <p className="text-sm text-on-deep/40">No activity yet.</p>;
  return (
    <ul className="space-y-3">
      {items.map((a) => (
        <li key={a.id} className="flex gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-xs">{ICON[a.kind] ?? "•"}</span>
          <div className="min-w-0">
            <p className="text-sm text-on-deep/85">{a.body}</p>
            <p className="mono text-[0.6rem] text-on-deep/35">
              {a.userName ?? "system"} · {new Date(a.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
