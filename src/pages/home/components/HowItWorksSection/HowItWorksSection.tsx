import { motion } from "framer-motion"
import Heading from "@/components/Heading"
import Image from "next/image"
import darkSilverShapeImage from "@public/dark-silver-shape.svg"
import platinumShapeImage from "@public/platinum-shape.svg"
import customizePlaylistImage from "@public/customize-playlist.svg"
import spotifyLockImage from "@public/spotify-lock.svg"
import searchArtistsImage from "@public/search-artists.svg"

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

const HowItWorksSection = () => {
  return (
    <section className="flex flex-col py-6 px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center"
      >
        <motion.div className="mb-8" variants={itemVariants}>
          <Heading as="h2" size="3xl" color="dark" weight="semibold">
            How It Works
          </Heading>
        </motion.div>
        <div className="flex flex-col w-full sm:w-1/2 gap-6">
          <div className="relative w-full sm:h-72">
            <motion.div
              className="relative sm:absolute sm:top-10 sm:-left-16"
              variants={itemVariants}
            >
              <Image src={darkSilverShapeImage} alt="Dark silver shape" />
              <div className="absolute top-0 left-10 w-full h-full flex items-center justify-center">
                <div className="flex items-center gap-4">
                  <Image
                    src={spotifyLockImage}
                    alt="Spotify lock"
                    className="h-40 w-auto"
                  />
                  <Heading as="h3" size="xl" color="dark" weight="normal">
                    Sign in on your Spotify account
                  </Heading>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="relative w-full sm:h-72">
            <motion.div
              className="relative sm:absolute sm:-top-24 sm:-right-28"
              variants={itemVariants}
            >
              <Image src={platinumShapeImage} alt="Dark silver shape" />
              <div className="absolute top-0 left-10 h-full flex items-center justify-center">
                <div className="flex items-center gap-4">
                  <Image
                    src={searchArtistsImage}
                    alt="Search artists"
                    className="h-40 w-auto"
                  />
                  <Heading as="h3" size="xl" color="neutral" weight="normal">
                    Find and select the artists using Spotify search engine
                  </Heading>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="relative w-full sm:h-72">
            <motion.div
              className="relative sm:absolute sm:-top-16 sm:-left-16"
              variants={itemVariants}
            >
              <Image src={darkSilverShapeImage} alt="Dark silver shape" />
              <div className="absolute top-0 left-10 w-full h-full flex items-center justify-center">
                <div className="flex items-center gap-4">
                  <Image
                    src={customizePlaylistImage}
                    alt="Customize playlist"
                    className="h-40 w-auto"
                  />
                  <Heading as="h3" size="xl" color="dark" weight="normal">
                    Check the generated playlist and customize it as you like
                  </Heading>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default HowItWorksSection
