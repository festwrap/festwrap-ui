import Head from "next/head"
import HeroSection from "./components/HeroSection"

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
        <meta property="og:title" content="Home" />
        <meta
          property="og:description"
          content="Descripción para redes sociales."
        />
        <meta property="og:image" content="/path-to-image.jpg" />
        <meta property="og:url" content="https://tusitio.com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="flex flex-col">
        <HeroSection />
      </div>
    </>
  )
}

export default Home
