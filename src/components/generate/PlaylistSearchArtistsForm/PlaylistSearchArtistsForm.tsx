import Heading from '@components/ui/Heading';
import { X } from 'lucide-react';
import { SearchArtistsCombobox } from './SearchArtistsCombobox';
import EmptyListImg from '@public/empty-list.png';
import Image from 'next/image';
import { Badge } from '@components/ui/Badge';
import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem } from '@/components/ui/Form';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useArtistSearch } from './useArtistSearch';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';

const PlaylistSearchArtistsForm = () => {
  const { control, watch, setValue, formState } = useFormContext();
  const { artists, search, clearArtists } = useArtistSearch();
  const { errors } = formState;

  const { t } = useTranslation('generate');

  const selectedValues: Array<string> = watch('artists', []);

  const removeSelectedItem = (name: string) => {
    const newSelectedItems = selectedValues.filter((item) => item !== name);
    setValue('artists', newSelectedItems, { shouldValidate: true });
  };

  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    search(searchTerm);
  });

  const onChangeSelection = (value: string) => {
    const newSelectedItems = selectedValues.some((item) => item === value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];
    setValue('artists', newSelectedItems, { shouldValidate: true });
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
              <Badge
                key={item}
                variant="secondary"
                size="lg"
                className="flex items-center gap-1 px-3 py-1"
              >
                {item}
                <button
                  onClick={() => removeSelectedItem(item)}
                  className="ml-1 hover:bg-slate-100 rounded-full hover:text-primary text-dark-blue"
                  type="button"
                  aria-label={`${t('steps.step2.removeArtist')} ${item}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PlaylistSearchArtistsForm;
