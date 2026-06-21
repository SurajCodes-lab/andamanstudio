import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";
import { getSessionPerms, can, MODULES } from "@/lib/permissions";
import AdminNav from "./AdminNav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const sp = await getSessionPerms();
  if (!sp) redirect("/admin/login");

  const allowed = MODULES.filter((m) => can(sp, m.key)).map((m) => m.key);

  return (
    <div className="flex min-h-screen">
      <aside
        className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-line p-5"
        style={{ background: "linear-gradient(180deg,#14110b 0%,#0c0a06 100%)" }}
      >
        <Link href="/admin" className="block">
          <span className="font-serif text-xl text-on-deep">Andaman <span className="text-gradient italic">Studio</span></span>
          <span className="meta mt-0.5 block text-on-deep/40">Content manager</span>
        </Link>

        <div className="my-6 h-px bg-gradient-to-r from-transparent via-line to-transparent" />

        <AdminNav allowed={allowed} isOwner={sp.isOwner} />

        <div className="mt-auto border-t border-line pt-5">
          <p className="meta truncate text-on-deep/45">{sp.name}</p>
          <p className="mono text-[0.6rem] text-gold-soft/70">{sp.roleName}</p>
          <div className="mt-2 flex items-center justify-between">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button className="text-sm text-on-deep/60 transition-colors hover:text-gold">Sign out →</button>
            </form>
            <Link href="/" target="_blank" className="text-xs text-on-deep/40 hover:text-gold">Live site ↗</Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">{children}</div>
      </main>
    </div>
  );
}
