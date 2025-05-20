import { useForm, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PlaylistUpdateReport from '@/components/generate/PlaylistUpdateReport/PlaylistUpdateReport';
import PlaylistSearchArtistsForm from '@/components/generate/PlaylistSearchArtistsForm/PlaylistSearchArtistsForm';
import PlaylistSetupForm from '@components/generate/PlaylistSetupForm/PlaylistSetupForm';
import { Button } from '@components/ui/Button';
import { Stepper, StepList, Step, StepContent } from '@components/ui/Stepper';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { Form } from '@components/ui/Form';
import {
  SubmissionStatus,
  usePlaylistSubmission,
} from './usePlaylistSubmission';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { MAX_ARTISTS } from '@/entities/playlists';

const STEPS_COUNT = 3;

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
    .max(MAX_ARTISTS, 'steps.errors.selectedArtists.max')
    .nonempty('steps.errors.selectedArtists.required'),
});

const newPlaylistSchema = baseSchema.extend({
  playlistCreationMode: z.literal(PlaylistCreationMode.New),
  name: z.string().min(1, 'steps.errors.name.required'),
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
      message: 'steps.errors.playlistSelected.required',
    }),
});

const formSchema = z.discriminatedUnion('playlistCreationMode', [
  newPlaylistSchema,
  existingPlaylistSchema,
]);

export type FormSchemaType = z.infer<typeof formSchema>;

const GeneratePlaylistStepper = () => {
  const { t } = useTranslation('generate');
  const { isLoading, submitPlaylist } = usePlaylistSubmission();

  const [currentStep, setCurrentStep] = useState(1);
  const [playlistId, setPlaylistId] = useState<string | undefined>(undefined);

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

  const { handleSubmit, trigger, formState, getValues } = form;

  const handleNext = async () => {
    const currentPlaylistCreationMode = getValues('playlistCreationMode');

    let fieldsToValidateStep1: Path<FormSchemaType>[] = [
      'playlistCreationMode',
    ];

    if (currentPlaylistCreationMode === PlaylistCreationMode.New) {
      fieldsToValidateStep1.push('name');
    } else if (currentPlaylistCreationMode === PlaylistCreationMode.Existing) {
      fieldsToValidateStep1.push('playlistSelected');
    }

    const fieldsToValidate: Path<FormSchemaType>[] =
      currentStep === 1 ? fieldsToValidateStep1 : ['artists'];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const onSubmit = async (values: FormSchemaType) => {
    const { status, playlistId } = await submitPlaylist(values);

    if (status === SubmissionStatus.OK) {
      setCurrentStep((prev) => prev + 1);
      setPlaylistId(playlistId);
    } else {
      const errorKey =
        status === SubmissionStatus.PARTIAL_ERRORS
          ? 'steps.errors.submitPlaylist.missingArtists'
          : 'steps.errors.submitPlaylist.unexpectedError';
      toast.error(t(errorKey));
    }
  };

  const handleChangeStep = (step: number) => {
    setCurrentStep(step);
  };

  const shouldDisplayBackButton =
    currentStep > 1 && currentStep !== STEPS_COUNT;
  const shouldDisplayNextButton = currentStep === 1;
  const shouldDisplaySubmitButton = currentStep === 2;

  return (
    <Form {...form}>
      <form className="space-y-6 flex" onSubmit={handleSubmit(onSubmit)}>
        <Stepper
          stepsCount={STEPS_COUNT}
          currentStep={currentStep}
          onStepChange={handleChangeStep}
          isCompleted={formState.isSubmitted}
        >
          <StepList>
            <Step
              stepNumber={1}
              title={t('steps.step1.title')}
              description={t('steps.step1.description')}
            />
            <Step
              stepNumber={2}
              title={t('steps.step2.title')}
              description={t('steps.step2.description')}
            />
            <Step
              stepNumber={3}
              title={t('steps.step3.title')}
              description={t('steps.step3.description')}
            />
          </StepList>
          <div className="min-h-[450px] flex flex-1 flex-col justify-between">
            <StepContent stepNumber={1}>
              <PlaylistSetupForm />
            </StepContent>
            <StepContent stepNumber={2}>
              <PlaylistSearchArtistsForm />
            </StepContent>
            <StepContent stepNumber={3}>
              <PlaylistUpdateReport playlistId={playlistId} />
            </StepContent>
            <div className="flex justify-end space-x-6 mt-8">
              {shouldDisplayBackButton && (
                <Button variant="ghost" onClick={handleBack}>
                  {t('steps.navigation.previous')}
                </Button>
              )}
              {shouldDisplayNextButton && (
                <Button onClick={handleNext}>
                  {t('steps.navigation.next')}
                </Button>
              )}
              {shouldDisplaySubmitButton && (
                <Button
                  type="submit"
                  disabled={isLoading || formState.isSubmitting}
                >
                  {isLoading && <Loader2 className="animate-spin" />}
                  {isLoading
                    ? t('steps.navigation.generating')
                    : t('steps.navigation.generate')}
                </Button>
              )}
            </div>
          </div>
        </Stepper>
      </form>
    </Form>
  );
};

export default GeneratePlaylistStepper;
