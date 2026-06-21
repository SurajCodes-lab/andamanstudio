import { db } from "@/lib/db/client";
import { guardPage } from "@/lib/permissions";
import { updateTestimonial, addTestimonial, deleteTestimonial } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminTestimonials() {
  await guardPage("content");
  const items = await db.query.testimonials.findMany({ orderBy: (t, { asc }) => asc(t.order) });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-on-deep">Testimonials</h1>
          <p className="mt-1 text-sm text-on-deep/55">Real client reviews shown on the home & about pages.</p>
        </div>
        <form action={addTestimonial}>
          <button className="font-syne rounded-full border border-gold/50 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-gold transition-colors hover:bg-gold hover:text-ink-deep">
            + Add
          </button>
        </form>
      </div>

      <div className="space-y-5">
        {items.map((t) => (
          <form key={t.id} action={updateTestimonial} className="rounded-2xl border border-line bg-surface/30 p-5">
            <input type="hidden" name="id" value={t.id} />
            <textarea
              name="quote"
              defaultValue={t.quote}
              rows={3}
              className="w-full resize-y rounded-lg border border-line bg-ink-deep px-3 py-2 text-sm text-on-deep outline-none focus:border-gold"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <input name="name" defaultValue={t.name} placeholder="Name" className="rounded-lg border border-line bg-ink-deep px-3 py-2 text-sm text-on-deep outline-none focus:border-gold" />
              <input name="role" defaultValue={t.role} placeholder="Role" className="rounded-lg border border-line bg-ink-deep px-3 py-2 text-sm text-on-deep outline-none focus:border-gold" />
              <button className="font-syne rounded-full bg-gold px-5 py-2 text-xs font-bold uppercase tracking-[0.08em] text-ink-deep transition-colors hover:bg-gold-soft">
                Save
              </button>
              <button
                formAction={deleteTestimonial}
                className="ml-auto text-xs uppercase tracking-[0.12em] text-on-deep/40 transition-colors hover:text-[#e0633b]"
              >
                Delete
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
