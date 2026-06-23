import { About } from '@/components/about/about.component';
import { getTranslations } from 'next-intl/server';

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ru' },
  ];
}

export async function generateMetadata() {
  const t = await getTranslations('about');
  
  return {
    title: t('title'),
    description: 'Explore animals from the Star Trek universe',
  };
}
export default function AboutPage() {
  return <About />;
}