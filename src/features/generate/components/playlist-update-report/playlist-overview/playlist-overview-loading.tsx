import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Loader2 } from 'lucide-react';

interface PlaylistOverviewLoadingProps {
  height?: number;
}

const PlaylistOverviewLoading: FC<PlaylistOverviewLoadingProps> = ({
  height = 500,
}) => {
  const { t } = useTranslation('generate');

  return (
    <div
      className="relative w-full flex items-center justify-center bg-slate-100 rounded-lg"
      style={{ height }}
    >
      <div className="text-center space-y-2">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-dark-blue" />
        <p className="text-muted-foreground text-dark-blue">
          {t('playlistSuccess.loadingPlaylist')}
        </p>
      </div>
    </div>
  );
};

export default PlaylistOverviewLoading;
