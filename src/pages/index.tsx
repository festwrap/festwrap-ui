import HeroSection from '@/features/home/components/hero-section/hero-section';
import Head from 'next/head';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import getT from 'next-translate/getT';

type HomeTranslationProps = {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
};

type HomeProps = {
  translations: HomeTranslationProps;
};

export default function Home({ translations }: HomeProps) {
  return (
    <>
      <Head>
        <title>{translations.meta.title}</title>
        <meta name="description" content={translations.meta.description} />
        <meta name="keywords" content={translations.meta.keywords} />
      </Head>
      <div className="flex flex-col gap-10">
        <HeroSection />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const { locale } = context;
  const t = await getT(locale || 'en', 'home');

  const translations: HomeTranslationProps = {
    meta: {
      title: t('meta.title'),
      description: t('meta.description'),
      keywords: t('meta.keywords'),
    },
  };

  return {
    props: {
      translations,
    },
  };
};
