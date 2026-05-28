import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AllergieScan",
  description: "Sicher einkaufen mit Allergie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
