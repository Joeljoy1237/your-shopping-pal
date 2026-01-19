import { StoreHeader } from '@/components/store/StoreHeader';
import { StoreHero } from '@/components/store/StoreHero';
import { FeaturedProducts } from '@/components/store/FeaturedProducts';
import { HelpBanner } from '@/components/store/HelpBanner';
import { StoreFooter } from '@/components/store/StoreFooter';
import { ChatWidget } from '@/components/chat/ChatWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main>
        <StoreHero />
        <FeaturedProducts />
        <HelpBanner />
      </main>
      <StoreFooter />
      <ChatWidget />
    </div>
  );
};

export default Index;
