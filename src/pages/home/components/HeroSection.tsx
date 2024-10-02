import Button from "@/components/Button"
import { motion } from "framer-motion"
import Link from "next/link"
import heroBgDarkImage from "@public/hero-section-bg-dark-shape.svg"
import heroBgLightImage from "@public/hero-section-bg-light-shape.svg"
import spotifyListImage from "@public/spotify-list.svg"
import Image from "next/image"
import Chip from "./Chip"
import FloatingChips from "./FloatingChips"

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col md:flex-row items-center">
        <motion.div
          className="md:w-1/2 mb-16 md:mb-0 md:pr-10 text-dark"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl sm:text-3xl md:text-4xl font-bold mb-4"
            variants={itemVariants}
          >
            Spotify playlists <span className="text-light">Generator </span>
            using festival line-up
          </motion.h1>
          <motion.p
            className="text-xl font-medium mb-8 text-light"
            variants={itemVariants}
          >
            Generate playlist based on the current set that each group are
            playing in the tour using the API
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button variant="primary" as={Link} href="/get-started">
              Get started
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 px-10 relative h-96"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute top-0 left-3 w-full h-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
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
      </div>
    </div>
  )
}

export default HeroSection
