import Heading from '@components/ui/Heading';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { SearchedArtist, SearchBandsCombobox } from './SearchBandsCombobox';
import EmptyListImg from '@public/empty-list.png';
import Image from 'next/image';
import { useState } from 'react';
import { Badge } from '@components/ui/Badge';
import useTranslation from 'next-translate/useTranslation';

const PlaylistSearchBandsForm = () => {
  const imageWidth = parseInt(process.env.NEXT_PUBLIC_IMAGE_WIDTH || '32', 10);
  const imageHeight = parseInt(
    process.env.NEXT_PUBLIC_IMAGE_HEIGHT || '32',
    10
  );
  const imageSearchLimit = parseInt(
    process.env.NEXT_PUBLIC_IMAGE_SEARCH_LIMIT || '5',
    10
  );

  const { t } = useTranslation('generate');
  const { data: session } = useSession();
  const [selectedArtists, setSelectedArtists] = useState<SearchedArtist[]>([]);

  const removeSelectedItem = (id: number) => {
    const newSelection = selectedArtists.filter((item) => item.id !== id);
    setSelectedArtists(newSelection);
  };

  async function searchArtists(name: string): Promise<SearchedArtist[]> {
    if (!session) {
      throw new Error('Could not obtain user session, search failed');
    }
    const token = session.user.accessToken;
    try {
      const url = `${window.location.origin}/api/artists/search`;
      const response = await fetch(
        `${url}?name=${name}&token=${token}&limit=${imageSearchLimit}`
      );
      if (!response.ok) {
        throw new Error('Could not obtain response from server');
      }
      const data = await response.json();
      if (!data.artists) {
        throw new Error('No artists found in the response');
      }
      return data.artists.map((artist: any) =>
        !artist.icon
          ? { id: artist.name, title: artist.name }
          : {
              id: artist.name,
              title: artist.name,
              icon: {
                src: artist.imageUri,
                height: imageHeight,
                width: imageWidth,
              },
            }
      );
    } catch (error) {
      throw new Error('Error fetching artists');
    }
  }

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
        <SearchBandsCombobox
          onArtistSearch={searchArtists}
          onSelectionChange={setSelectedArtists}
          searchPlaceholder={t('steps.step2.searchPlaceholder')}
        />
        {selectedArtists.length === 0 ? (
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
            {selectedArtists.map((item) => (
              <Badge
                key={item.id}
                variant="secondary"
                size="lg"
                className="flex items-center gap-1 px-3 py-1"
              >
                {item.title}
                <button
                  onClick={() => removeSelectedItem(item.id)}
                  className="ml-1 hover:bg-slate-100 rounded-full hover:text-primary text-dark-blue"
                  type="button"
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

export default PlaylistSearchBandsForm;
