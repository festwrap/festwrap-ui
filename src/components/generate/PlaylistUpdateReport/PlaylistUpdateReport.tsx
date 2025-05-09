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
      <div className="flex flex-col space-y-2">
        <Heading as="h2" size="2xl" color="primary">
          {t('steps.step3.title')}
        </Heading>
        <p className="text-lg text-muted-foreground mt-2 text-dark-blue font-medium">
          {t('steps.step3.description')}
        </p>
      </div>
      <div className="flex flex-col space-y-6 items-center">
        <div className="flex flex-col space-y-2">
          <Heading as="h3" size="lg" color="darkBlue" weight="semibold">
            {t('steps.step3.playlistGeneratedSuccessfully')} 🎉
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
