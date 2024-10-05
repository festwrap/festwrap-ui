import HeroSectionRight from "./HeroSectionRight"
import HeroSectionLeft from "./HeroSectionLeft"

const HeroSection = () => {
  return (
    <div className="flex items-center justify-center py-6">
      <div className="flex flex-col md:flex-row items-center">
        <HeroSectionLeft />
        <HeroSectionRight />
      </div>
    </div>
  )
}

export default HeroSection
