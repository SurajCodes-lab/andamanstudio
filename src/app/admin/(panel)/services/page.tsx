import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db/client";
import { guardPage } from "@/lib/permissions";
import { PageHeader } from "../ui";

export const dynamic = "force-dynamic";

export default async function AdminServices() {
  await guardPage("content");
  const items = await db.query.services.findMany({ orderBy: (t, { asc }) => asc(t.order), with: { hero: true } });
  return (
    <div>
      <PageHeader title="Services" subtitle="Edit each shoot's full content, hero, gallery and SEO meta." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <Link key={s.id} href={`/admin/services/${s.slug}`} className="group flex items-center gap-3 rounded-xl border border-line bg-surface/30 p-3 transition-colors hover:border-gold/50">
            <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded">
              {s.hero && <Image src={s.hero.url} alt="" fill sizes="80px" className="object-cover" />}
            </div>
            <div className="min-w-0">
              <p className="font-serif text-on-deep transition-colors group-hover:text-gold">{s.title}</p>
              <p className="mono truncate text-[0.6rem] text-on-deep/40">/{s.slug}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
