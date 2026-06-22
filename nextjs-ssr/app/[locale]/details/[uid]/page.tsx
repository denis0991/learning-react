import { Details } from '@/components/results/details.component';


interface DetailsPageProps {
  params: Promise<{ uid: string }>;
  searchParams: Promise<{ page?: string }>;
}
export default async function DetailsPage({ params }: DetailsPageProps) {
  await params;
  return <Details />;
}