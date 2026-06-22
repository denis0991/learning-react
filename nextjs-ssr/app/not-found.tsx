import { NotFound } from '@/components/notFound/notFound.component';
import { ThemeProvider } from '@/context/theme-context';
import { NextIntlClientProvider } from 'next-intl';
import { headers } from 'next/headers';

export default async function NotFoundPage() {
  const headersList = await headers();
  const locale = headersList.get('x-next-intl-locale') ?? 'en';

  const messages = (await import(`../messages/en.json`)).default;


  return (
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <NotFound />
          </ThemeProvider>
        </NextIntlClientProvider>
  );
}