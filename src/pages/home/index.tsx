import Head from "next/head"
import HeroSection from "./components/HeroSection/HeroSection"
import HowItWorksSection from "./components/HowItWorksSection/HowItWorksSection"

const Home = () => {
  return (
    <>
      <Head>
        <title>Home | Festwrap</title>
        <meta
          name="description"
          content="Spotify playlists Generator using festival line-up"
        />
        <meta
          name="keywords"
          content="spotify, generator, playlist, festival, line-up"
        />
      </Head>
      <div className="flex flex-col gap-10">
        <HeroSection />
        <HowItWorksSection />
      </div>
    </>
  )
}

export default Home
