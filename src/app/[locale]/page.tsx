import { useTranslations } from "next-intl"
import HeroSection from "@/src/components/home/HeroSection/HeroSection"
import HowItWorksSection from "@/src/components/home/HowItWorksSection/HowItWorksSection"
import Head from "next/head"

export default async function Home() {
  const t = useTranslations()

  return (
    <>
      <Head>
        <title>{t("home.meta.title")}</title>
        <meta name="description" content={t("home.meta.description")} />
        <meta name="keywords" content={t("home.meta.keywords")} />
      </Head>
      <div className="flex flex-col gap-10">
        {t("home.heroSection.title")}
        {/* <HeroSection />
        <HowItWorksSection /> */}
      </div>
    </>
  )
}

// export const getStaticProps: GetStaticProps = async (
//   context: GetStaticPropsContext
// ) => {
//   const { locale } = context
//   const t = await getT(locale || "en", "home")

//   const translations: HomeTranslationProps = {
//     meta: {
//       title: t("meta.title"),
//       description: t("meta.description"),
//       keywords: t("meta.keywords"),
//     },
//   }

//   return {
//     props: {
//       translations,
//     },
//   }
// }
