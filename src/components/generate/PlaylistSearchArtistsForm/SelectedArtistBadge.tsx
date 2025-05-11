import Image from 'next/image';
import { X } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';

interface SelectedArtistBadgeProps {
  name: string;
  imageUri?: string;
  onRemove: (_artistName: string) => void;
}

const SelectedArtistBadge = ({
  name,
  imageUri,
  onRemove,
}: SelectedArtistBadgeProps) => {
  const { t } = useTranslation('generate');
  const IMAGE_SIZE = 24;

  return (
    <div className="inline-flex items-center overflow-hidden rounded-lg border-2 bg-white h-[40px] w-full min-w-0 flex-shrink-0 transition-colors hover:bg-gray-50">
      <button
        onClick={() => onRemove(name)}
        type="button"
        className="ml-1 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors flex-shrink-0"
        aria-label={`${t('steps.step2.removeArtist')} ${name}`}
      >
        <X className="h-4 w-4" />
      </button>
      {imageUri ? (
        <div className="h-full aspect-square flex-shrink-0 flex items-center justify-center">
          <Image
            src={imageUri}
            alt={name}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            className="object-cover"
          />
        </div>
      ) : (
        <div className="h-full aspect-square flex-shrink-0 bg-gray-300 flex items-center justify-center text-white text-xs">
          {name.substring(0, 1).toUpperCase()}
        </div>
      )}
      <div className="px-3 py-2 min-w-0 flex-shrink truncate">
        <span className="text-sm font-medium text-gray-700 block truncate">
          {name}
        </span>
      </div>
    </div>
  );
};

export default SelectedArtistBadge;
