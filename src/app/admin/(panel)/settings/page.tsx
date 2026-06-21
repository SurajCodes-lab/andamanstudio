import { getSite } from "@/lib/db/queries";
import { guardPage } from "@/lib/permissions";
import { updateSiteSettings } from "./actions";
import { Card, Field, PageHeader, SaveButton, fieldCls } from "../ui";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  await guardPage("settings");
  const s = await getSite();

  return (
    <div>
      <PageHeader title="Site settings" subtitle="Contact details, social links and studio facts — used across the site and the floating buttons." />

      <form action={updateSiteSettings} className="space-y-6">
        <Card>
          <h3 className="mb-4 font-serif text-lg text-gold-soft">Contact</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email"><input name="email" defaultValue={s.email} className={fieldCls} /></Field>
            <Field label="WhatsApp number" hint="digits only, with country code"><input name="whatsapp" defaultValue={s.whatsapp} className={fieldCls} /></Field>
          </div>
          <div className="mt-4">
            <Field label="Phone numbers" hint="one per line"><textarea name="phones" defaultValue={s.phones.join("\n")} rows={2} className={`${fieldCls} resize-y`} /></Field>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-serif text-lg text-gold-soft">Social links</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Instagram URL"><input name="instagram" defaultValue={s.social.instagram} className={fieldCls} /></Field>
            <Field label="Instagram handle"><input name="instagramHandle" defaultValue={s.social.instagramHandle} className={fieldCls} /></Field>
            <Field label="YouTube URL"><input name="youtube" defaultValue={s.social.youtube} className={fieldCls} /></Field>
            <Field label="YouTube handle"><input name="youtubeHandle" defaultValue={s.social.youtubeHandle} className={fieldCls} /></Field>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-serif text-lg text-gold-soft">Studio facts</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tagline"><input name="tagline" defaultValue={s.tagline} className={fieldCls} /></Field>
            <Field label="Hero video ID" hint="YouTube ID"><input name="heroVideoId" defaultValue={s.heroVideoId ?? ""} className={fieldCls} /></Field>
            <Field label="Stat value" hint="e.g. 10k+"><input name="statValue" defaultValue={s.stat.value} className={fieldCls} /></Field>
            <Field label="Stat label" hint="e.g. Customers served"><input name="statLabel" defaultValue={s.stat.label} className={fieldCls} /></Field>
          </div>
          <div className="mt-4">
            <Field label="Mission"><textarea name="mission" defaultValue={s.mission} rows={3} className={`${fieldCls} resize-y`} /></Field>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 font-serif text-lg text-gold-soft">Address</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Line 1"><input name="addr1" defaultValue={s.address.line1} className={fieldCls} /></Field>
            <Field label="Line 2"><input name="addr2" defaultValue={s.address.line2} className={fieldCls} /></Field>
            <Field label="Line 3"><input name="addr3" defaultValue={s.address.line3} className={fieldCls} /></Field>
            <Field label="Maps query"><input name="mapsQuery" defaultValue={s.address.mapsQuery} className={fieldCls} /></Field>
          </div>
          <div className="mt-4">
            <Field
              label="Map embed"
              hint="Paste the Google Maps embed — either the full <iframe …> code or just the src URL. Leave blank to auto-build from the maps query."
            >
              <textarea name="mapEmbed" defaultValue={s.address.mapEmbed ?? ""} rows={3} className={`${fieldCls} resize-y font-mono text-xs`} />
            </Field>
          </div>
        </Card>

        <SaveButton />
      </form>
    </div>
  );
}
