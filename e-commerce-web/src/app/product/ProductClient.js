// ✅ This stays server-only
export const metadata = {
  title: 'Product | Farzeen Finds',
  description: 'Explore detailed product information and customer reviews at Farzeen Finds — your hub for curated fashion and lifestyle.',
};

import ProductClient from './ProductClient'; // 👈 Your actual UI goes here (client component)

export default function ProductPage() {
  return <ProductClient />;
}
