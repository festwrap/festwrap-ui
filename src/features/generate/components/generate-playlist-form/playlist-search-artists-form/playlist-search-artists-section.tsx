import Heading from '@/components/ui/heading';
import { SearchArtistsCombobox } from './search-artists-combobox';
import EmptyListImg from '@public/empty-list.png';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import ErrorMessage from '@/components/ui/error-message';
import { useArtistSearch } from './use-artist-search';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { ArtistDTO } from '@/entities/artists';
import SelectedArtistBadge from './selected-artist-badge';
import { MAX_ARTISTS } from '@/entities/playlists';

const DEBOUNCE_INPUT_TIME = 300;

const PlaylistSearchArtistsSection = () => {
  const { control, watch, setValue, formState } = useFormContext();
  const { artists, loading, error, search, clearArtists } = useArtistSearch();
  const { errors } = formState;

  const { t } = useTranslation('generate');

  const selectedValues: Array<ArtistDTO> = watch('artists', []);

  const removeSelectedItem = (name: string) => {
    const newSelectedItems = selectedValues.filter(
      (item) => item.name !== name
    );
    setValue('artists', newSelectedItems, { shouldValidate: true });
  };

  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    search(searchTerm);
  }, DEBOUNCE_INPUT_TIME);

  const onChangeSelection = (value: ArtistDTO) => {
    const newSelectedItems = selectedValues.some(
      (item) => item.name === value.name
    )
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    setValue('artists', newSelectedItems, { shouldValidate: true });
    clearArtists();
  };

  return (
    <div className="flex flex-col space-y-6 mb-12">
      <Heading as="h2" size="2xl" color="primary">
        {t('playlistSearchArtists.title')}
      </Heading>
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
                  hasError={error !== null}
                  placeholder={t(
                    'playlistSearchArtists.artistSearch.placeholder'
                  )}
                  isSearching={loading}
                />
              </FormControl>
              {errors.artists?.message && (
                <ErrorMessage>
                  {t(errors.artists.message as string, {
                    max: MAX_ARTISTS,
                  })}
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
              {t('playlistSearchArtists.emptyState.title')}
            </h3>
            <p className="text-sm">
              {t('playlistSearchArtists.emptyState.description')}
            </p>
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
    </div>
  );
};

export default PlaylistSearchArtistsSection;
