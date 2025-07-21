import { GetStaticProps } from 'next';
import FAQSection from '@/features/faqs/components/faq-section';
import Head from 'next/head';
import getT from 'next-translate/getT';

export const getStaticProps: GetStaticProps = async (context) => {
  const t = await getT(context.locale || 'en', 'faq');

  return {
    props: {
      translations: {
        meta: {
          title: t('meta.title'),
          description: t('meta.description'),
        },
      },
    },
  };
};

type FaqPageProps = {
  translations: {
    meta: {
      title: string;
      description: string;
    };
  };
};

export default function FaqPage({ translations }: FaqPageProps) {
  return (
    <>
      <Head>
        <title>{translations.meta.title}</title>
        <meta name="description" content={translations.meta.description} />
      </Head>
      <FAQSection />
    </>
  );
}
