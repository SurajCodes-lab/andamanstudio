// Shared, premium-styled admin form primitives (server-safe — no hooks).

export const fieldCls =
  "w-full rounded-lg border border-line bg-ink-deep/60 px-3.5 py-2.5 text-sm text-on-deep outline-none transition-colors placeholder:text-on-deep/30 focus:border-gold";

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="meta mb-1.5 block text-on-deep/55">
        {label}
        {hint && <span className="ml-2 lowercase tracking-normal text-on-deep/30">· {hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface/30 p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl text-on-deep">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-on-deep/55">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function SaveButton({ children = "Save changes" }: { children?: React.ReactNode }) {
  return (
    <button className="font-syne rounded-full bg-gold px-5 py-2 text-xs font-bold uppercase tracking-[0.08em] text-ink-deep transition-colors hover:bg-gold-soft">
      {children}
    </button>
  );
}
