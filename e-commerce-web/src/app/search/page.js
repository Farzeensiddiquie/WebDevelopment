import SearchClient from './SearchClient';

export default function SearchPage({ searchParams }) {
  // Safely extract the query parameter with fallback
  const query = searchParams?.q || '';
  
  return <SearchClient query={query} />;
} 