import { Details } from '@/components/results/details.component';

interface DetailsPageProps {
  params: {
    uid: string;
  };
  searchParams: {
    page?: string;
  };
}

export default function DetailsPage({ params, searchParams }: DetailsPageProps) {
  return <Details />;
}