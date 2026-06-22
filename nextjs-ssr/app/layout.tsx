import type { Metadata } from "next";
import { getLocale } from 'next-intl/server';
import "./global.css";
export const metadata: Metadata = {
  title: "Star Trek Animals",
  description: "Search and explore Star Trek animals",
  icons: { icon: '/favicon.ico' },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}