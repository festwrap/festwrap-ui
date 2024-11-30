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

const GetStarted = () => {
  return (
    <div className="space-y-6">
      <Stepper>
        <StepList>
          <Step
            stepNumber={1}
            title="Choose an option to start"
            description="Select to create a new playlist or use an existing playlist in your account"
          />
          <Step
            stepNumber={2}
            title="Find your artists"
            description="Find your artists by name using the search box"
          />
          <Step
            stepNumber={3}
            title="Copy the URL"
            description="Open the list generated or modified using the URL."
          />
        </StepList>
        <div className="min-h-[450px] flex flex-col justify-between">
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
