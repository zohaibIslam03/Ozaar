import type { Metadata } from "next";
import NotFoundClient from "@/components/NotFoundClient";

export const metadata: Metadata = {
  title: "Tool Not Found | Ozaar",
  robots: { index: false, follow: false },
};

export default function ToolNotFound() {
  return <NotFoundClient />;
}
