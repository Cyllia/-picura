import type { Metadata } from "next";
import { AppShell } from "@/components/epicuria/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Epicuria | Cuisiner en famille",
  description:
    "Des recettes genereuses pensees pour les repas en famille, les saveurs du quotidien et les moments a partager.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
