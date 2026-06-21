import { db } from "@/lib/db/client";
import { guardPage } from "@/lib/permissions";
import { updateLegalPage } from "./actions";
import { Card, Field, PageHeader, SaveButton, fieldCls } from "../ui";

export const dynamic = "force-dynamic";

export default async function AdminLegal() {
  await guardPage("content");
  const pages = await db.query.legalPages.findMany({ orderBy: (t, { asc }) => asc(t.order) });

  return (
    <div>
      <PageHeader title="Legal pages" subtitle="Privacy Policy & Terms — edit the content and SEO meta. Changes publish instantly." />

      <div className="space-y-6">
        {pages.map((p) => (
          <Card key={p.id}>
            <form action={updateLegalPage} className="space-y-4">
              <input type="hidden" name="id" value={p.id} />
              <div className="flex items-center justify-between">
                <span className="mono text-xs text-gold-soft">/{p.slug}</span>
                <a href={`/${p.slug}`} target="_blank" className="text-xs text-on-deep/40 hover:text-gold">View live ↗</a>
              </div>
              <Field label="Title"><input name="title" defaultValue={p.title} className={fieldCls} /></Field>
              <Field label="Body" hint="leave a blank line between paragraphs">
                <textarea name="body" defaultValue={p.body} rows={12} className={`${fieldCls} resize-y leading-relaxed`} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Meta title" hint="SEO"><input name="metaTitle" defaultValue={p.metaTitle ?? ""} placeholder={p.title} className={fieldCls} /></Field>
                <Field label="Meta description" hint="SEO"><input name="metaDescription" defaultValue={p.metaDescription ?? ""} className={fieldCls} /></Field>
              </div>
              <SaveButton />
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
