import { Alert } from '@/components/ui/Alert';
import useTranslation from 'next-translate/useTranslation';
import { Button } from '@/components/ui/Button';

export const BetaInfoAlert = () => {
  const { t } = useTranslation('generate');
  return (
    <Alert
      title={t('betaInfo.title')}
      variant="info"
      action={<Button variant="link">{t('betaInfo.formLink')}</Button>}
    />
  );
};
