import Button from "@/components/Button"
import { motion } from "framer-motion"
import Link from "next/link"
import heroBgDarkImage from "@public/hero-section-bg-dark-shape.svg"
import heroBgLightImage from "@public/hero-section-bg-light-shape.svg"
import spotifyListImage from "@public/spotify-list.svg"
import Image from "next/image"
import Chip from "./Chip"
import FloatingChips from "./FloatingChips"
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
