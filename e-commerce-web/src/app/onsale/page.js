import OnSaleClient from './OnSaleClient';
import { productAPI } from '../../utils/api';

export const metadata = {
  title: "On Sale | Farzeen Finds",
};

export default async function OnSalePage() {
  let products = [];

  try {
    // Fetch products on sale from backend
    const response = await productAPI.getAll({ 
      isOnSale: true,
      limit: 50 
    });
    products = response.data || [];
  } catch (error) {
    console.error('Failed to fetch on-sale products:', error);
  }

  return <OnSaleClient products={products} />;
}
