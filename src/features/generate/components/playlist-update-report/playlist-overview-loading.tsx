import { FC } from 'react';
import Skeleton from '@/components/ui/skeleton';
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
    <div className="absolute inset-0 z-10">
      <Skeleton className="w-full rounded" height={`h-[${height}px]`} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />{' '}
          <p className="text-sm text-muted-foreground">
            {t('playlistSuccess.loadingPlaylist')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaylistOverviewLoading;
