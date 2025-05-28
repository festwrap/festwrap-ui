import Heading from '@components/ui/Heading';
import useTranslation from 'next-translate/useTranslation';
import { PlaylistOverview } from '../PlaylistUpdateReport/PlaylistOverview';

const PlaylistUpdateReport = ({
  playlistId,
}: {
  playlistId: string | undefined;
}) => {
  const { t } = useTranslation('generate');
  return (
    <>
      <div className="flex flex-col space-y-6 items-center">
        <div className="flex flex-col space-y-2">
          <Heading as="h2" size="2xl" color="darkBlue" weight="semibold">
            {t('playlistSuccess.playlistGeneratedSuccessfully')} 🎉
          </Heading>
        </div>
        <div className="flex w-full md:w-3/4 space-x-2 mt-6">
          {playlistId && <PlaylistOverview playlistId={playlistId} />}
        </div>
      </div>
    </>
  );
};

export default PlaylistUpdateReport;
