"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";

// Pull the src out of a pasted Google Maps <iframe>, or return a trimmed bare URL.
function extractMapSrc(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  const m = v.match(/src\s*=\s*["']([^"']+)["']/i);
  return (m ? m[1] : v).trim();
}

export async function updateSiteSettings(formData: FormData) {
  await requirePermission("settings");
  const phones = String(formData.get("phones") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  await db
    .update(siteSettings)
    .set({
      tagline: String(formData.get("tagline") ?? ""),
      mission: String(formData.get("mission") ?? ""),
      email: String(formData.get("email") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? "").replace(/\D/g, ""),
      heroVideoId: (String(formData.get("heroVideoId") ?? "").trim() || null) as string | null,
      phones,
      social: {
        instagram: String(formData.get("instagram") ?? ""),
        instagramHandle: String(formData.get("instagramHandle") ?? ""),
        youtube: String(formData.get("youtube") ?? ""),
        youtubeHandle: String(formData.get("youtubeHandle") ?? ""),
      },
      stat: { value: String(formData.get("statValue") ?? ""), label: String(formData.get("statLabel") ?? "") },
      address: {
        line1: String(formData.get("addr1") ?? ""),
        line2: String(formData.get("addr2") ?? ""),
        line3: String(formData.get("addr3") ?? ""),
        mapsQuery: String(formData.get("mapsQuery") ?? ""),
        // Accept either a full <iframe …src="…"…> paste or a bare URL; store just the src.
        mapEmbed: extractMapSrc(String(formData.get("mapEmbed") ?? "")),
      },
    })
    .where(eq(siteSettings.id, 1));
  revalidatePath("/", "layout");
}
