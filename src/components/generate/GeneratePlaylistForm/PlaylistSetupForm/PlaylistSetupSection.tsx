import Heading from '@components/ui/Heading';
import { Input } from '@components/ui/Input';
import {
  RadioGroupButtons,
  RadioGroupButton,
  RadioGroupButtonTitle,
  RadioGroupButtonDescription,
} from '@components/ui/RadioGroupButtons';
import { Switch } from '@components/ui/Switch';
import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/Form';
import ErrorMessage from '@/components/ui/ErrorMessage';
import PlaylistSearcher from './PlaylistSearcher';
import { PlaylistCreationMode } from '../GeneratePlaylistForm';

const PlaylistSetupSection = () => {
  const { watch, control, formState } = useFormContext();
  const { errors } = formState;

  const { t } = useTranslation('generate');

  const playlistModeSelected = watch('playlistCreationMode');

  return (
    <div className="flex flex-col space-y-6 mb-12">
      <Heading as="h2" size="2xl" color="primary">
        {t('playlistSetup.title')}
      </Heading>
      <FormField
        control={control}
        name="playlistCreationMode"
        render={({ field }) => (
          <RadioGroupButtons
            defaultValue={field.value}
            onChange={(value) => field.onChange(value)}
          >
            <RadioGroupButton value={PlaylistCreationMode.New}>
              <RadioGroupButtonTitle>
                {t('playlistSetup.form.createNewPlaylist.title')}
              </RadioGroupButtonTitle>
              <RadioGroupButtonDescription>
                {t('playlistSetup.form.createNewPlaylist.description')}
              </RadioGroupButtonDescription>
            </RadioGroupButton>
            <RadioGroupButton value={PlaylistCreationMode.Existing}>
              <RadioGroupButtonTitle>
                {t('playlistSetup.form.useExistingPlaylist.title')}
              </RadioGroupButtonTitle>
              <RadioGroupButtonDescription>
                {t('playlistSetup.form.useExistingPlaylist.description')}
              </RadioGroupButtonDescription>
            </RadioGroupButton>
          </RadioGroupButtons>
        )}
      />
      {playlistModeSelected === PlaylistCreationMode.New ? (
        <>
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
                    <ErrorMessage>
                      {t(errors.name?.message as string)}
                    </ErrorMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                      title={t(
                        'playlistSetup.form.createNewPlaylist.publicPlaylist.title'
                      )}
                    />
                  </FormControl>
                  <FormLabel className="flex flex-col">
                    <span className="text-sm font-medium">
                      {t(
                        'playlistSetup.form.createNewPlaylist.publicPlaylist.title'
                      )}
                    </span>
                    <span className="text-sm text-muted-foreground text-dark-blue">
                      {t(
                        'playlistSetup.form.createNewPlaylist.publicPlaylist.description'
                      )}
                    </span>
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </>
      ) : (
        <div className="space-y-2 mt-6">
          <PlaylistSearcher />
        </div>
      )}
    </div>
  );
};

export default PlaylistSetupSection;
