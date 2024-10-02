import { delay, motion } from "framer-motion"
import FloatingChips from "./FloatingChips"
import heroBgDarkImage from "@public/hero-section-bg-dark-shape.svg"
import heroBgLightImage from "@public/hero-section-bg-light-shape.svg"
import spotifyListImage from "@public/spotify-list.svg"
import Image from "next/image"

const containerVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
  },
}

const HeroSectionRight = () => {
  return (
    <motion.div
      className="w-full md:w-1/2 px-10 relative h-96"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="absolute top-0 left-3 w-full h-full flex items-center justify-center"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Image
          src={heroBgLightImage}
          alt="Hero illustration"
          className="h-full w-auto"
          quality={80}
          priority
        />
      </motion.div>
      <motion.div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Image
          src={heroBgDarkImage}
          alt="Hero illustration"
          className="h-full w-auto"
          quality={80}
          priority
        />
      </motion.div>
      <motion.div
        className="absolute top-0 right-0 w-full h-full flex items-center justify-center"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Image
          src={spotifyListImage}
          alt="Spotify list"
          className="w-42 h-auto"
        />
      </motion.div>
      <FloatingChips />
    </motion.div>
  )
}

export default HeroSectionRight
