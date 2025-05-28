import { FormField, FormLabel, FormItem } from '@/components/ui/Form';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';
import { usePlaylistSearch } from './usePlaylistSearch';
import { useState } from 'react';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/Command';

const getEmptyMessageTranslationKey = (
  loading: boolean,
  playlists: any[],
  searchValue: string
) => {
  if (loading) {
    return 'playlistSetup.form.useExistingPlaylist.playlistSelector.loading';
  }

  if (playlists.length === 0 && searchValue.trim() !== '') {
    return 'playlistSetup.form.useExistingPlaylist.playlistSelector.noResults';
  }

  return 'playlistSetup.form.useExistingPlaylist.playlistSelector.searchPlaceholder';
};

const PlaylistSearcher = () => {
  const { t } = useTranslation('generate');
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const { playlists, search, loading } = usePlaylistSearch();

  const { control, formState } = useFormContext();
  const { errors } = formState;

  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    search(searchTerm);
    setSearchValue(searchTerm);
  });

  const emptyMessageKeyTranslation = getEmptyMessageTranslationKey(
    loading,
    playlists,
    searchValue
  );

  return (
    <FormField
      control={control}
      name="playlistSelected"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {t('playlistSetup.form.useExistingPlaylist.playlistSelector.title')}
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {field.value
                  ? field.value.name
                  : t(
                      'playlistSetup.form.useExistingPlaylist.playlistSelector.placeholder'
                    )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder={t(
                    'playlistSetup.form.useExistingPlaylist.playlistSelector.placeholder'
                  )}
                  onValueChange={debouncedSearch}
                />
                <CommandList>
                  <CommandEmpty>{t(emptyMessageKeyTranslation)}</CommandEmpty>
                  <CommandGroup>
                    {playlists.map((playlist) => (
                      <CommandItem
                        key={playlist.id}
                        value={playlist.id}
                        onSelect={(currentValue: string) => {
                          field.onChange(
                            playlists.find((item) => item.id === currentValue)
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            field.value === playlist.id
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {playlist.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.playlistSelected?.message && (
            <ErrorMessage>
              {t(errors.playlistSelected?.message as string)}
            </ErrorMessage>
          )}
        </FormItem>
      )}
    />
  );
};

export default PlaylistSearcher;
