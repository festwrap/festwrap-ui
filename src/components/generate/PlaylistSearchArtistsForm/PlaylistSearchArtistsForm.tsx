import Heading from '@components/ui/Heading';
import { SearchArtistsCombobox } from './SearchArtistsCombobox';
import EmptyListImg from '@public/empty-list.png';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '@/components/ui/Form';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useArtistSearch } from './useArtistSearch';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { ArtistDTO } from '@/entities/artists';
import SelectedArtistBadge from './SelectedArtistBadge';

const PlaylistSearchArtistsForm = () => {
  const { control, watch, setValue, formState } = useFormContext();
  const { artists, search, clearArtists } = useArtistSearch();
  const { errors } = formState;

  const { t } = useTranslation('generate');

  const selectedValues: Array<ArtistDTO> = watch('artists', []);

  const removeSelectedItem = (name: string) => {
    const newSelectedItems = selectedValues.filter(
      (item) => item.name !== name
    );
    setValue('artists', newSelectedItems);
  };

  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    search(searchTerm);
  });

  const onChangeSelection = (value: ArtistDTO) => {
    const newSelectedItems = selectedValues.some(
      (item) => item.name === value.name
    )
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    setValue('artists', newSelectedItems);
    clearArtists();
  };

  return (
    <>
      <div className="flex flex-col space-y-2">
        <Heading as="h2" size="2xl" color="primary">
          {t('steps.step2.title')}
        </Heading>
        <p className="text-lg text-muted-foreground mt-2 text-dark-blue font-medium">
          {t('steps.step2.description')}
        </p>
      </div>
      <div className="w-full">
        <FormField
          control={control}
          name="artists"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SearchArtistsCombobox
                  options={artists}
                  values={field.value}
                  onChange={onChangeSelection}
                  onSearch={debouncedSearch}
                  placeholder={t('steps.step2.searchPlaceholder')}
                />
              </FormControl>
              {errors.artists?.message && (
                <ErrorMessage>
                  {t(errors.artists.message as string)}
                </ErrorMessage>
              )}
            </FormItem>
          )}
        />
        {selectedValues.length === 0 ? (
          <div className="mt-8 text-center text-dark-blue">
            <div className="flex justify-center mb-4">
              <Image
                src={EmptyListImg}
                alt="No artists selected"
                className="w-48 h-full"
              />
            </div>
            <h3 className="font-semibold mb-2">
              {t('steps.step2.emptyState.title')}
            </h3>
            <p className="text-sm">{t('steps.step2.emptyState.description')}</p>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedValues.map((item) => (
              <SelectedArtistBadge
                key={item.name}
                name={item.name}
                imageUri={item.imageUri}
                onRemove={removeSelectedItem}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PlaylistSearchArtistsForm;
