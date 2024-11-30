import PlaylistGetUrlLink from "@/components/generate/PlaylistGetUrlLink/PlaylistGetUrlLink"
import PlaylistSearchBandsForm from "@/components/generate/PlaylistSearchBandsForm/PlaylistSearchBandsForm"
import PlaylistSetupForm from "@/components/generate/PlaylistSetupForm/PlaylistSetupForm"
import {
  Stepper,
  StepList,
  Step,
  StepContent,
  StepperNavigation,
} from "@/components/ui/Stepper"
import useTranslation from "next-translate/useTranslation"

const GetStarted = () => {
  const { t } = useTranslation("generate")
  return (
    <div className="space-y-6 flex">
      <Stepper>
        <StepList>
          <Step
            stepNumber={1}
            title={t("steps.step1.title")}
            description={t("steps.step1.description")}
          />
          <Step
            stepNumber={2}
            title={t("steps.step2.title")}
            description={t("steps.step2.description")}
          />
          <Step
            stepNumber={3}
            title={t("steps.step3.title")}
            description={t("steps.step3.description")}
          />
        </StepList>
        <div className="min-h-[450px] flex flex-1 flex-col justify-between">
          <StepContent stepNumber={1}>
            <PlaylistSetupForm />
          </StepContent>
          <StepContent stepNumber={2}>
            <PlaylistSearchBandsForm />
          </StepContent>
          <StepContent stepNumber={3}>
            <PlaylistGetUrlLink />
          </StepContent>
          <StepperNavigation />
        </div>
      </Stepper>
    </div>
  )
}

export default GetStarted
