import type { Metadata } from "next";
import NotFoundClient from "@/components/NotFoundClient";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you're looking for doesn't exist. Browse all 12 free tools on the homepage.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundClient />;
}
