import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { Providers } from '../[locale]/providers';
import "../global.css";

export const metadata: Metadata = {
  title: "Star Trek Animals",
  description: "Search and explore Star Trek animals",
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return (
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
  );
}