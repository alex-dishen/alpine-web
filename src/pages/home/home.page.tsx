import { HomeHeader } from '@/pages/home/features/home.header';
import { HomeFeatures } from '@/pages/home/features/home.features';

export const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <HomeHeader />
      <HomeFeatures />
    </div>
  );
};
