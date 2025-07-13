import { Alert } from '@/components/ui/alert';
import useTranslation from 'next-translate/useTranslation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const GOOGLE_FORM_URL = 'https://forms.gle/NjV5wAKVDmp651x76';

export const BetaInfoAlert = () => {
  const { t } = useTranslation('generate');
  return (
    <Alert
      title={t('betaInfo.title')}
      variant="info"
      action={
        <Button variant="link" asChild>
          <Link href={GOOGLE_FORM_URL} target="_blank">
            {t('betaInfo.formLink')}
          </Link>
        </Button>
      }
    />
  );
};
