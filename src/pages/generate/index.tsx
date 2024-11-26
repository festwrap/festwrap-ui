import ArtistSearch from "@/components/generate/ArtistSearch"
import Button from "@/components/ui/Button"
import Heading from "@/components/ui/Heading"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import {
  RadioGroupButtons,
  RadioGroupButton,
  RadioGroupButtonTitle,
  RadioGroupButtonDescription,
} from "@/components/ui/RadioGroupButtons"
import {
  Stepper,
  StepList,
  Step,
  StepContent,
  StepperNavigation,
} from "@/components/ui/Stepper"
import { Switch } from "@/components/ui/Switch"
import { useState } from "react"

const GetStarted = () => {
  const [playlistSelection, setPlaylistSelection] = useState("new")
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
            <div className="flex flex-col space-y-2">
              <Heading as="h2" size="2xl" color="primary">
                Choose an option to start
              </Heading>
              <p className="text-lg text-muted-foreground mt-2 text-dark-blue font-medium">
                Select to create a new playlist or use an existing playlist in
                your account
              </p>
            </div>

            <RadioGroupButtons
              defaultValue={playlistSelection}
              onChange={(value) => setPlaylistSelection(value)}
            >
              <RadioGroupButton value="new">
                <RadioGroupButtonTitle>
                  Create new playlist
                </RadioGroupButtonTitle>
                <RadioGroupButtonDescription>
                  Use this option to create a playlist from scratch
                </RadioGroupButtonDescription>
              </RadioGroupButton>
              <RadioGroupButton value="existing">
                <RadioGroupButtonTitle>
                  Use an existing playlist
                </RadioGroupButtonTitle>
                <RadioGroupButtonDescription>
                  Use this option to add the songs generated in playlist already
                  created
                </RadioGroupButtonDescription>
              </RadioGroupButton>
            </RadioGroupButtons>

            <div className="space-y-2 mt-6">
              <Label htmlFor="playlist-search">
                Give a name to the playlist
              </Label>
              <Input id="playlist-search" placeholder="Playlist name" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="private-playlist" />
              <Label htmlFor="private-playlist" className="flex flex-col">
                <span className="text-sm font-medium">Private playlist</span>
                <span className="text-sm text-muted-foreground text-dark-blue">
                  Playlist will only be visible to you
                </span>
              </Label>
            </div>
          </StepContent>

          <StepContent stepNumber={2}>
            <div className="flex flex-col space-y-2">
              <Heading as="h2" size="2xl" color="primary">
                Find your artists
              </Heading>
              <p className="text-lg text-muted-foreground mt-2 text-dark-blue font-medium">
                Find your artists by name using the search box
              </p>
            </div>
            <ArtistSearch />
          </StepContent>

          <StepContent stepNumber={3}>
            <div className="flex flex-col space-y-2">
              <Heading as="h2" size="2xl" color="primary">
                Copy the URL
              </Heading>
              <p className="text-lg text-muted-foreground mt-2 text-dark-blue font-medium">
                Open the list generated or modified using the URL.
              </p>
            </div>
            <div className="flex space-x-2 mt-6">
              <Input value="https://example.com/playlist/123" readOnly />
              <Button variant="primary">Copy URL</Button>
            </div>
          </StepContent>

          <StepperNavigation />
        </div>
      </Stepper>
    </div>
  )
}

export default GetStarted
