import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import {
  Stepper,
  StepList,
  Step,
  StepContent,
  StepperNavigation,
} from "@/components/ui/Stepper"
import { Switch } from "@/components/ui/switch"
import { ChevronRight } from "lucide-react"

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

        <div className="min-h-[600px] flex flex-col justify-between">
          <StepContent stepNumber={1}>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Choose an option to start
              </h2>
              <p className="text-lg text-muted-foreground mt-2">
                Select to create a new playlist or use an existing playlist in
                your account
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Card className="p-6 hover:bg-accent cursor-pointer">
                <h3 className="font-semibold text-lg">Create new playlist</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Use this option to create a playlist from scratch
                </p>
              </Card>
              <Card className="p-6 hover:bg-accent cursor-pointer relative">
                <h3 className="font-semibold text-lg">
                  Use an existing playlist
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Use this option to add the songs generated in playlist already
                  created
                </p>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2" />
              </Card>
            </div>

            <div className="space-y-2 mt-6">
              <Label htmlFor="playlist-search">
                Give a name to the playlist
              </Label>
              <Input id="playlist-search" placeholder="Playlist name" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="airplane-mode" />
              <Label htmlFor="airplane-mode" className="flex flex-col">
                <span className="text-sm font-medium">Private playlist</span>
                <span className="text-sm text-muted-foreground text-dark-blue">
                  Playlist will only be visible to you
                </span>
              </Label>
            </div>
          </StepContent>

          <StepContent stepNumber={2}>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Find your artists
              </h2>
              <p className="text-lg text-muted-foreground mt-2">
                Find your artists by name using the search box
              </p>
            </div>
            <Input placeholder="Search artists..." className="max-w-md mt-6" />
          </StepContent>

          <StepContent stepNumber={3}>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Copy the URL
              </h2>
              <p className="text-lg text-muted-foreground mt-2">
                Open the list generated or modified using the URL.
              </p>
            </div>
            <Input
              value="https://example.com/playlist/123"
              readOnly
              className="max-w-md mt-6"
            />
          </StepContent>

          <StepperNavigation />
        </div>
      </Stepper>
    </div>
  )
}

export default GetStarted
