import ProfileItem from '@/components/about-us/ProfileItem';
import { motion } from 'framer-motion';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import getT from 'next-translate/getT';
import Head from 'next/head';

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const paragraphVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.4,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const sectionTitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.6,
      duration: 0.5,
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

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
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <motion.h1
          className="text-4xl sm:text-3xl md:text-4xl font-bold mb-8"
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          {translations.aboutUs}
        </motion.h1>
        <div className="space-y-6 mb-12">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={paragraphVariants}
            className="text-lg text-muted-foreground text-dark-blue font-medium"
          >
            {translations.aboutUsDescription}
          </motion.p>
        </div>
        <motion.h2
          initial="hidden"
          animate="visible"
          variants={sectionTitleVariants}
          className="text-2xl font-semibold mb-6"
        >
          {translations.meetTheTeam}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {translations.profiles.map((profile) => (
            <motion.div
              key={profile.name}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <ProfileItem
                key={profile.name}
                name={profile.name}
                position={profile.position}
                imageUrl={profile.imageUrl}
                description={profile.description}
                linkedinUrl={profile.linkedinUrl}
                githubUrl={profile.githubUrl}
              />
            </motion.div>
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
