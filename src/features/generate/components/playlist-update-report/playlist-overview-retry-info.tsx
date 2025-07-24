import { FC } from 'react';
import { Card } from '@/components/ui/card';
import useTranslation from 'next-translate/useTranslation';

interface PlaylistOverviewRetryInfoProps {
  retryCount: number;
  maxRetries?: number;
}

const PlaylistOverviewRetryInfo: FC<PlaylistOverviewRetryInfoProps> = ({
  retryCount,
  maxRetries = 3,
}) => {
  const { t } = useTranslation('generate');

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <Card className="p-4 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          {t('playlistSuccess.retryingLoad')} ({retryCount}/{maxRetries})
        </p>
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </Card>
    </div>
  );
};

export default PlaylistOverviewRetryInfo;
