import Heading from '@/components/ui/heading';
import useTranslation from 'next-translate/useTranslation';
import { PlaylistOverview } from './playlist-overview/playlist-overview';

const PlaylistUpdateReport = ({
  playlistId,
}: {
  playlistId: string | undefined;
}) => {
  const { t } = useTranslation('generate');
  return (
    <>
      <div className="flex flex-col space-y-6 items-center">
        <Heading
          as="h2"
          size="2xl"
          color="darkBlue"
          weight="semibold"
          className="text-center"
        >
          {t('playlistSuccess.playlistGeneratedSuccessfully')} 🎉
        </Heading>
        <div className="flex w-full md:w-3/4 space-x-2 mt-6">
          {playlistId && <PlaylistOverview playlistId={playlistId} />}
        </div>
      </div>
    </>
  );
};

export default PlaylistUpdateReport;
