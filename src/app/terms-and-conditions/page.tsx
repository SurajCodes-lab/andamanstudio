import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalView from "@/components/LegalView";
import { getLegalPage } from "@/lib/db/queries";

export async function generateMetadata(): Promise<Metadata> {
  const p = await getLegalPage("terms-and-conditions");
  return {
    title: p?.metaTitle ?? p?.title ?? "Terms & Conditions",
    description: p?.metaDescription ?? undefined,
    alternates: { canonical: "/terms-and-conditions" },
  };
}

export default async function TermsPage() {
  const page = await getLegalPage("terms-and-conditions");
  if (!page) notFound();
  return <LegalView page={page} />;
}
