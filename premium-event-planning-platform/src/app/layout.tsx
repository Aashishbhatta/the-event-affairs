import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Event Affair — Plan. Connect. Celebrate.",
  description:
    "Thoughtfully plan a memorable event in one place. Discover wonderful vendors, compare packages, manage the details, and celebrate with The Event Affair.",
  applicationName: "The Event Affair",
  keywords: ["event planning", "event vendors", "wedding planning", "event booking", "Ahmedabad events"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
