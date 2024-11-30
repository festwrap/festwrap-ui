import PlaylistGetUrlLink from "@/components/generate/PlaylistGetUrlLink/PlaylistGetUrlLink"
import PlaylistSearchBandsForm from "@/components/generate/PlaylistSearchBandsForm/PlaylistSearchBandsForm"
import PlaylistSetupForm from "@/components/generate/PlaylistSetupForm/PlaylistSetupForm"
import { Button } from "@/components/ui/Button"
import { Stepper, StepList, Step, StepContent } from "@/components/ui/Stepper"
import useTranslation from "next-translate/useTranslation"
import { useState } from "react"

const STEPS_COUNT = 3

const GetStarted = () => {
  const { t } = useTranslation("generate")
  const [currentStep, setCurrentStep] = useState(1)

  const handleChangeStep = (step: number) => {
    setCurrentStep(step)
  }

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  return (
    <div className="space-y-6 flex">
      <Stepper
        stepsCount={STEPS_COUNT}
        currentStep={currentStep}
        handleChangeStep={handleChangeStep}
      >
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
          <div className="flex justify-end space-x-6 mt-8">
            {currentStep > 1 && (
              <Button variant="ghost" onClick={handleBack}>
                {t("steps.navigation.previous")}
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep === STEPS_COUNT
                ? t("steps.navigation.finish")
                : t("steps.navigation.next")}
            </Button>
          </div>
        </div>
      </Stepper>
    </div>
  )
}

export default GetStarted
