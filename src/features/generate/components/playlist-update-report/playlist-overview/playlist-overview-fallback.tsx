import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Heading from '@/components/ui/heading';
import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { FC } from 'react';

interface PlaylistOverviewFallbackProps {
  height: number;
  handleRetry: () => void;
  directUrl: string;
}

const PlaylistOverviewFallback: FC<PlaylistOverviewFallbackProps> = ({
  height,
  handleRetry,
  directUrl,
}) => {
  const { t } = useTranslation('generate');

  return (
    <Card className="w-full p-6 text-center space-y-4" style={{ height }}>
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <AlertCircle className="w-12 h-12 text-dark-blue" />
        <div className="space-y-2">
          <Heading as="h3" size="lg" weight="semibold" color="darkBlue">
            {t('playlistSuccess.embedLoadError')}
          </Heading>
          <p className="text-muted-foreground text-sm text-dark-blue">
            {t('playlistSuccess.embedLoadErrorDescription')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleRetry}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('playlistSuccess.retryEmbed')}
          </Button>
          <Button asChild>
            <a href={directUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              {t('playlistSuccess.openInSpotify')}
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PlaylistOverviewFallback;
