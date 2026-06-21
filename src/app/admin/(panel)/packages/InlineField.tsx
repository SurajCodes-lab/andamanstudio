"use client";

// Tiny click-to-edit field: submits its form on blur (and on Enter). Used for
// product name (text) and price (number) editing.
export default function InlineField({
  action,
  id,
  name,
  defaultValue,
  type = "text",
  prefix,
  className = "",
}: {
  action: (formData: FormData) => void;
  id: number;
  name: string;
  defaultValue: string | number;
  type?: "text" | "number";
  prefix?: string;
  className?: string;
}) {
  return (
    <form action={action} className="flex items-center gap-1">
      <input type="hidden" name="id" value={id} />
      {prefix && <span className="text-on-deep/50">{prefix}</span>}
      <input
        name={name}
        type={type}
        inputMode={type === "number" ? "numeric" : undefined}
        defaultValue={defaultValue}
        onBlur={(e) => e.currentTarget.form?.requestSubmit()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        className={`rounded border border-line bg-ink-deep px-2 py-1 text-sm text-on-deep outline-none focus:border-gold ${className}`}
      />
    </form>
  );
}
