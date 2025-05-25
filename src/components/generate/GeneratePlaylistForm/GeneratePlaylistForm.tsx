import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PlaylistSearchArtistsSection from '@/components/generate/GeneratePlaylistForm/PlaylistSearchArtistsForm/PlaylistSearchArtistsSection';
import PlaylistSetupSection from '@/components/generate/GeneratePlaylistForm/PlaylistSetupForm/PlaylistSetupSection';
import { Button } from '@components/ui/Button';
import useTranslation from 'next-translate/useTranslation';
import { Form } from '@components/ui/Form';
import {
  SubmissionStatus,
  usePlaylistSubmission,
} from './usePlaylistSubmission';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { MAX_ARTISTS } from '@/entities/playlists';
import { useRouter } from 'next/router';

export const PlaylistCreationMode = {
  New: 'new',
  Existing: 'existing',
} as const;

const baseSchema = z.object({
  artists: z
    .array(
      z.object({
        name: z.string(),
        imageUri: z.string().optional(),
      })
    )
    .max(MAX_ARTISTS, 'errors.selectedArtists.max')
    .nonempty('errors.selectedArtists.required'),
});

const newPlaylistSchema = baseSchema.extend({
  playlistCreationMode: z.literal(PlaylistCreationMode.New),
  name: z.string().min(1, 'errors.name.required'),
  description: z.string().optional(),
  isPublic: z.boolean(),
});

const existingPlaylistSchema = baseSchema.extend({
  playlistCreationMode: z.literal(PlaylistCreationMode.Existing),
  playlistSelected: z
    .object({
      id: z.string().min(1),
      name: z.string(),
    })
    .optional()
    .refine((val) => !!val, {
      message: 'errors.playlistSelected.required',
    }),
});

const formSchema = z.discriminatedUnion('playlistCreationMode', [
  newPlaylistSchema,
  existingPlaylistSchema,
]);

export type FormSchemaType = z.infer<typeof formSchema>;

const GeneratePlaylistForm = () => {
  const { t } = useTranslation('generate');
  const router = useRouter();
  const { isLoading, submitPlaylist } = usePlaylistSubmission();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playlistCreationMode: PlaylistCreationMode.New,
      name: '',
      description: '',
      isPublic: false,
      artists: [],
    },
  });

  const { handleSubmit, formState } = form;

  const onSubmit = async (values: FormSchemaType) => {
    const { status, playlistId } = await submitPlaylist(values);

    if (status === SubmissionStatus.OK) {
      router.push(`/generate/success/${playlistId}`);
    } else if (status === SubmissionStatus.PARTIAL_ERRORS) {
      router.push(`/generate/success/${playlistId}?partialError=true`);
    } else {
      toast.error(t('errors.submitPlaylist.unexpectedError'));
    }
  };

  return (
    <Form {...form}>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <PlaylistSetupSection />
        <PlaylistSearchArtistsSection />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading || formState.isSubmitting}>
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? t('navigation.generating') : t('navigation.generate')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GeneratePlaylistForm;
