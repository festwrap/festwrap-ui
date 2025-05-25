import Image from 'next/image';
import { X } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';

interface SelectedArtistBadgeProps {
  name: string;
  imageUri?: string;
  onRemove: (_artistName: string) => void;
}

const IMAGE_SIZE = 20;

const SelectedArtistBadge = ({
  name,
  imageUri,
  onRemove,
}: SelectedArtistBadgeProps) => {
  const { t } = useTranslation('generate');

  return (
    <div className="inline-flex items-center overflow-hidden rounded-lg border-2 bg-white">
      {imageUri ? (
        <div className="h-10 w-10 flex-shrink-0">
          <Image
            src={imageUri}
            alt={name}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div
          className="h-full w-10 flex-shrink-0 bg-gray-300 flex items-center justify-center text-white text-xs"
          style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
        >
          {name.substring(0, 1).toUpperCase()}
        </div>
      )}
      <div className="px-3 py-2">
        <span className="text-sm font-medium text-gray-700">{name}</span>
      </div>
      <button
        onClick={() => onRemove(name)}
        type="button"
        className="mr-1 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
        aria-label={`${t('playlistSearchArtists.removeArtist')} ${name}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SelectedArtistBadge;
