import { ArtistDTO } from '@/entities/artists';
import ArtistSearchResult from './ArtistSearchResult';
import useTranslation from 'next-translate/useTranslation';

/* eslint-disable no-unused-vars */
export enum ArtistSearchStatus {
  Searching = 1,
  Empty,
  Error,
  NoResults,
  HasResults,
}

type ArtistSearchResultListProps = {
  activeArtistIndex: number;
  status: ArtistSearchStatus;
  searchedArtists: ArtistDTO[];
  selectedArtists: ArtistDTO[];
  onArtistSelect: (_artist: ArtistDTO) => void;
};

export function ArtistSearchResultList({
  activeArtistIndex,
  status,
  searchedArtists,
  selectedArtists,
  onArtistSelect,
}: ArtistSearchResultListProps) {
  const { t } = useTranslation('generate');

  function buildMessageItem(text: string, role: 'status' | 'alert') {
    const textClass = role === 'status' ? 'text-secondary' : 'text-red-400';
    return (
      <li className={`px-4 py-2 ${textClass}`} role={role}>
        {text}
      </li>
    );
  }

  function buildStatusItem(text: string) {
    return buildMessageItem(text, 'status');
  }

  function buildAlertStatusItem(text: string) {
    return buildMessageItem(text, 'alert');
  }

  return (
    <ul
      id="combobox-items"
      role="listbox"
      className="absolute z-10 w-full mt-2 bg-white border border-secondary rounded-xl shadow-lg max-h-60 overflow-auto py-3"
    >
      {status === ArtistSearchStatus.Searching
        ? buildStatusItem(t('playlistSearchArtists.artistSearch.searching'))
        : status === ArtistSearchStatus.Empty
          ? buildStatusItem(t('playlistSearchArtists.artistSearch.empty'))
          : status === ArtistSearchStatus.Error
            ? buildAlertStatusItem(t('errors.artistSearch.unexpectedError'))
            : status === ArtistSearchStatus.NoResults
              ? buildStatusItem(
                  t('playlistSearchArtists.artistSearch.noResults')
                )
              : status === ArtistSearchStatus.HasResults
                ? searchedArtists.map((item, index) => (
                    <ArtistSearchResult
                      key={index}
                      name={item.name}
                      isActive={index === activeArtistIndex}
                      isSelected={selectedArtists.some(
                        (selectedItem) => selectedItem.name === item.name
                      )}
                      handleItemSelect={() => onArtistSelect(item)}
                      imageUrl={item.imageUri}
                    />
                  ))
                : buildAlertStatusItem(
                    t('errors.artistSearch.unexpectedError')
                  )}
    </ul>
  );
}
