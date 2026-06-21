import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalView from "@/components/LegalView";
import { getLegalPage } from "@/lib/db/queries";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getLegalPage("privacy-policy");
  return {
    title: p?.metaTitle ?? p?.title ?? "Privacy Policy",
    description: p?.metaDescription ?? undefined,
    alternates: { canonical: "/privacy-policy" },
  };
}

export default async function PrivacyPolicyPage() {
  const page = await getLegalPage("privacy-policy");
  if (!page) notFound();
  return <LegalView page={page} />;
}
