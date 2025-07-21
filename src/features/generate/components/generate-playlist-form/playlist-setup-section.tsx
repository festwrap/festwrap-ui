import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import ErrorMessage from '@/components/ui/error-message';
import { BetaInfoAlert } from '../beta-info-alert';

const PlaylistSetupSection = () => {
  const { control, formState } = useFormContext();
  const { errors } = formState;

  const { t } = useTranslation('generate');

  return (
    <div className="flex flex-col space-y-6 mb-12">
      <Heading as="h2" size="2xl" color="primary">
        {t('playlistSetup.title')}
      </Heading>
      <div className="flex flex-col space-y-3 mt-6">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('playlistSetup.form.createNewPlaylist.giveAName')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t(
                    'playlistSetup.form.createNewPlaylist.namePlaceholder'
                  )}
                  {...field}
                />
              </FormControl>
              {errors.name?.message && (
                <ErrorMessage>{t(errors.name?.message as string)}</ErrorMessage>
              )}
            </FormItem>
          )}
        />
      </div>
      <BetaInfoAlert />
    </div>
  );
};

export default PlaylistSetupSection;
