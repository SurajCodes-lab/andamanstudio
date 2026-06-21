import { db } from "@/lib/db/client";
import { guardPage } from "@/lib/permissions";
import Uploader from "./Uploader";
import MediaGrid from "./MediaGrid";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await guardPage("content");
  const items = await db.query.media.findMany({ orderBy: (t, { desc }) => desc(t.id) });

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-on-deep">Media library</h1>
          <p className="mt-1 text-sm text-on-deep/55">{items.length} images · upload, rename or remove.</p>
        </div>
        <Uploader />
      </div>
      <MediaGrid items={items.map((m) => ({ id: m.id, url: m.url, alt: m.alt }))} />
    </div>
  );
}
