import { ArtistDTO } from '@/entities/artists';
import ArtistSearchResult from './ArtistSearchResult';
import useTranslation from 'next-translate/useTranslation';
import { cn } from '@/lib/utils';

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
    return (
      <li
        className={cn(
          'px-4 py-2',
          role === 'status' ? 'text-secondary' : 'text-red-400'
        )}
        role={role}
      >
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

  function renderContent() {
    switch (status) {
      case ArtistSearchStatus.Searching:
        return buildStatusItem(
          t('playlistSearchArtists.artistSearch.searching')
        );
      case ArtistSearchStatus.Empty:
        return buildStatusItem(t('playlistSearchArtists.artistSearch.empty'));
      case ArtistSearchStatus.Error:
        return buildAlertStatusItem(t('errors.artistSearch.unexpectedError'));
      case ArtistSearchStatus.NoResults:
        return buildStatusItem(
          t('playlistSearchArtists.artistSearch.noResults')
        );
      case ArtistSearchStatus.HasResults:
        return searchedArtists.map((item, index) => (
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
        ));
      default:
        return buildAlertStatusItem(t('errors.artistSearch.unexpectedError'));
    }
  }

  return (
    <ul
      id="combobox-items"
      role="listbox"
      className="absolute z-10 w-full mt-2 bg-white border border-secondary rounded-xl shadow-lg max-h-60 overflow-auto py-3"
    >
      {renderContent()}
    </ul>
  );
}
