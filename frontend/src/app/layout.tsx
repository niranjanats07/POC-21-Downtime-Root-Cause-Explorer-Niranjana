import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Downtime Root Cause Explorer | Infocreon Internship",
  description:
    "PoC 21 - Machinery and Asset Utilization Downtime Root Cause Explorer.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}