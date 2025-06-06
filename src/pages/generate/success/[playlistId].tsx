import Head from 'next/head';
import PlaylistUpdateReport from '@/components/generate/PlaylistUpdateReport/PlaylistUpdateReport';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Alert } from '@/components/ui/Alert';
import { TriangleAlert } from 'lucide-react';
import { BetaInfoAlert } from '@/components/generate/BetaInfoAlert';

export default function PlaylistGeneratedSuccessfully() {
  const { t } = useTranslation('generate');
  const router = useRouter();
  const { playlistId, partialError } = router.query;
  return (
    <>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <meta name="keywords" content={t('meta.keywords')} />
      </Head>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex flex-col gap-6">
          <PlaylistUpdateReport playlistId={playlistId as string} />
          {partialError && (
            <Alert
              variant="warning"
              title={t('errors.submitPlaylist.missingArtists')}
              icon={TriangleAlert}
            />
          )}
          <BetaInfoAlert />
        </div>
      </div>
    </>
  );
}
