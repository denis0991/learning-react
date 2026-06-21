import type { Metadata } from "next";
import { ThemeProvider } from '@/context/theme-context';
import "../global.css";

export const metadata: Metadata = {
  title: "Star Trek Animals",
  description: "Search and explore Star Trek animals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}