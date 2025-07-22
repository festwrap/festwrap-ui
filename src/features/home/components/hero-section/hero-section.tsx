import HeroSectionRight from './hero-section-right';
import HeroSectionLeft from './hero-section-left';

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center py-6 md:flex-row md:justify-between">
      <HeroSectionLeft />
      <HeroSectionRight />
    </div>
  );
};

export default HeroSection;
