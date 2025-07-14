export const dynamic = "force-dynamic";

import BrandBar from "../components/BrandBar";
import HeroSection from "../components/HeroSection";
import ProductSection from "../components/ProductSection";
import DressStyleSection from "../components/DressStyleSection";
import HappyCustomers from '../components/HappyCustomer';

export const metadata = {
  title: "Home | Farzeen Finds",
};

export default async function Home() {
  // Remove the delay and API call - let client components handle data fetching
  return (
    <>
      <HeroSection />
      <BrandBar />

      <ProductSection title="NEW ARRIVALS" viewAllRoute="/newarrivals" productType="newarrivals" />
      <ProductSection title="TOP SELLING" viewAllRoute="/onsale" productType="onsale" />

      <DressStyleSection />
      <HappyCustomers />
    </>
  );
}
