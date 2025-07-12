import NewArrivalsClient from './NewArrivalsClient';
import { productAPI } from '../../utils/api';

export const metadata = {
  title: "New Arrivals | Farzeen Finds",
};

export default async function NewArrivalsPage() {
  let products = [];

  try {
    // Fetch new arrivals from backend (sorted by newest)
    const response = await productAPI.getAll({ 
      sort: 'newest',
      limit: 50 
    });
    products = response.data || [];
  } catch (error) {
    console.error('Failed to fetch new arrivals:', error);
  }

  return <NewArrivalsClient products={products} />;
}
