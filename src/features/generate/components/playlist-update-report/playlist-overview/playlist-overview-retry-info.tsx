import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Loader2 } from 'lucide-react';

interface PlaylistOverviewRetryInfoProps {
  retryCount: number;
  maxRetries?: number;
  height?: number;
}

const PlaylistOverviewRetryInfo: FC<PlaylistOverviewRetryInfoProps> = ({
  retryCount,
  maxRetries = 3,
  height = 500,
}) => {
  const { t } = useTranslation('generate');

  return (
    <div className="absolute z-10 w-full h-full">
      <div
        className="flex flex-col items-center justify-center p-4 space-y-3 bg-slate-100 rounded-lg"
        style={{ height }}
      >
        <p className="text-dark-blue">
          {t('playlistSuccess.retryingLoad')} ({retryCount}/{maxRetries})
        </p>
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-dark-blue" />
      </div>
    </div>
  );
};

export default PlaylistOverviewRetryInfo;
