export const dynamic = "force-dynamic";

import BrandBar from "../components/BrandBar";
import HeroSection from "../components/HeroSection";
import ProductSection from "../components/ProductSection";
import DressStyleSection from "../components/DressStyleSection";
import HappyCustomers from '../components/HappyCustomer';
import { productAPI } from "../utils/api";

export const metadata = {
  title: "Home | Farzeen Finds",
};

export default async function Home() {
  await new Promise((res) => setTimeout(res, 800)); // optional delay

  let newArrivals = [];
  let topSelling = [];

  try {
    // Fetch products from backend API
    const response = await productAPI.getAll({ limit: 8 });
    const products = response.data || [];
    
    newArrivals = products.slice(0, 4);
    topSelling = products.slice(4, 8);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    // Fallback to empty arrays if API fails
  }

  return (
    <>
      <HeroSection />
      <BrandBar />

      <ProductSection title="NEW ARRIVALS" products={newArrivals} viewAllRoute="/newarrivals" />
      <ProductSection title="TOP SELLING" products={topSelling} viewAllRoute="/onsale" />

      <DressStyleSection />
      <HappyCustomers />
    </>
  );
}
