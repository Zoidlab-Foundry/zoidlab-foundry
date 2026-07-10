import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZoidLab",
  description: "The ZoidLab workspace — launch your apps.",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
