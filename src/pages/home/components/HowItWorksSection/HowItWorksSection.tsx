import { motion } from "framer-motion"
import Heading from "@/components/ui/Heading"
import customizePlaylistImage from "@public/customize-playlist.svg"
import spotifyLockImage from "@public/spotify-lock.svg"
import searchArtistsImage from "@public/search-artists.svg"
import AnimatedSection from "./AnimatedSection"

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
          <AnimatedSection
            backgroundShape="platinum"
            floatingPosition="sm:top-10 sm:-left-16"
          >
            <AnimatedSection.Image src={spotifyLockImage} alt="Spotify lock" />
            <AnimatedSection.Title>
              Sign in on your Spotify account
            </AnimatedSection.Title>
          </AnimatedSection>
          <AnimatedSection
            backgroundShape="dark-silver"
            floatingPosition="sm:-top-0 sm:-right-28"
          >
            <AnimatedSection.Image
              src={searchArtistsImage}
              alt="Search artists"
            />
            <AnimatedSection.Title>
              Find and select the artists using Spotify search engine
            </AnimatedSection.Title>
          </AnimatedSection>
          <AnimatedSection
            backgroundShape="platinum"
            floatingPosition="sm:-top-16 sm:-left-16"
          >
            <AnimatedSection.Image
              src={customizePlaylistImage}
              alt="Customize playlist"
            />
            <AnimatedSection.Title>
              Check the generated playlist and customize it as you like
            </AnimatedSection.Title>
          </AnimatedSection>
        </div>
      </motion.div>
    </section>
  )
}

export default HowItWorksSection
