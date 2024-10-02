import Button from "@/components/Button"
import { motion } from "framer-motion"
import Link from "next/link"

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

const HeroSectionLeft = () => {
  return (
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
        Generate playlist based on the current set that each group are playing
        in the tour using the API
      </motion.p>
      <motion.div variants={itemVariants}>
        <Button variant="primary" as={Link} href="/get-started">
          Get started
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default HeroSectionLeft
