import Heading from "@/components/ui/Heading"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import {
  RadioGroupButtons,
  RadioGroupButton,
  RadioGroupButtonTitle,
  RadioGroupButtonDescription,
} from "@/components/ui/RadioGroupButtons"
import { Switch } from "@/components/ui/Switch"
import { useState } from "react"

const PlaylistSetupForm = () => {
  const [playlistSelection, setPlaylistSelection] = useState("new")

  return (
    <>
      <div className="flex flex-col space-y-2">
        <Heading as="h2" size="2xl" color="primary">
          Choose an option to start
        </Heading>
        <p className="text-lg text-muted-foreground mt-2 text-dark-blue font-medium">
          Select to create a new playlist or use an existing playlist in your
          account
        </p>
      </div>

      <RadioGroupButtons
        defaultValue={playlistSelection}
        onChange={(value) => setPlaylistSelection(value)}
      >
        <RadioGroupButton value="new">
          <RadioGroupButtonTitle>Create new playlist</RadioGroupButtonTitle>
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
        <Label htmlFor="playlist-search">Give a name to the playlist</Label>
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
    </>
  )
}

export default PlaylistSetupForm
