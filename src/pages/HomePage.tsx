import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { ServiceHighlights } from '../components/home/ServiceHighlights';
import { ShopByPet } from '../components/home/ShopByPet';
import { FeaturedProductsSection } from '../components/home/FeaturedProductsSection';
import { GroomingBanner } from '../components/home/GroomingBanner';
import { LatestBlogSection } from '../components/home/LatestBlogSection';
import { ContactCtaBar } from '../components/home/ContactCtaBar';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-4">
      <HeroBanner />
      <ServiceHighlights />
      <ShopByPet />
      <FeaturedProductsSection />
      <GroomingBanner />
      <LatestBlogSection />
      <ContactCtaBar />
    </div>
  );
};
