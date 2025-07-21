import ProfileItem from '@/features/about-us/components/profile-item';
import Heading from '@/components/ui/heading';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import getT from 'next-translate/getT';
import Head from 'next/head';

type AboutTranslationProps = {
  meta: {
    title: string;
    description: string;
  };
  aboutUs: string;
  aboutUsDescription: string;
  meetTheTeam: string;
  profiles: Array<{
    name: string;
    position: string;
    imageUrl: string;
    description: string;
    linkedinUrl: string;
    githubUrl: string;
  }>;
};

type AboutPageProps = {
  translations: AboutTranslationProps;
};

export default function AboutPage({ translations }: AboutPageProps) {
  return (
    <>
      <Head>
        <title>{translations.meta.title}</title>
        <meta name="description" content={translations.meta.description} />
      </Head>
      <div className="container mx-auto py-4 md:py-12 max-w-5xl">
        <Heading size="4xl" weight="bold" className="mb-8">
          {translations.aboutUs}
        </Heading>

        <div className="space-y-6 mb-12">
          <p className="text-lg text-muted-foreground text-dark-blue font-medium">
            {translations.aboutUsDescription}
          </p>
        </div>

        <Heading as="h2" size="2xl" weight="semibold" className="mb-6">
          {translations.meetTheTeam}
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {translations.profiles.map((profile) => (
            <ProfileItem
              key={profile.name}
              name={profile.name}
              position={profile.position}
              imageUrl={profile.imageUrl}
              description={profile.description}
              linkedinUrl={profile.linkedinUrl}
              githubUrl={profile.githubUrl}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const { locale } = context;
  const t = await getT(locale || 'en', 'about');

  const profilesData = [
    {
      name: 'Dani Mora',
      position: 'Software Engineer in Machine Learning',
      description: t('profile.dani.description'),
      imageUrl: 'https://avatars.githubusercontent.com/u/71647753?v=4',
      linkedinUrl: 'https://www.linkedin.com/in/daniel-mora-de-checa/',
      githubUrl: 'https://github.com/DanielMoraDC',
    },
    {
      name: 'Alex Barro Sendros',
      position: 'Software Engineer',
      description: t('profile.alex.description'),
      imageUrl: 'https://avatars.githubusercontent.com/u/28058520?v=4',
      linkedinUrl: 'https://www.linkedin.com/in/alex-barro-sendros-913124144/',
      githubUrl: 'https://github.com/barroro',
    },
  ];

  const translations: AboutTranslationProps = {
    meta: {
      title: t('meta.title'),
      description: t('meta.description'),
    },
    aboutUs: t('aboutUs'),
    aboutUsDescription: t('aboutUsDescription'),
    meetTheTeam: t('meetTheTeam'),
    profiles: profilesData,
  };

  return {
    props: {
      translations,
    },
  };
};
