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
import useTranslation from "next-translate/useTranslation"
import { useState } from "react"

const PlaylistSetupForm = () => {
  const { t } = useTranslation("generate")
  const [playlistSelection, setPlaylistSelection] = useState("new")

  return (
    <>
      <div className="flex flex-col space-y-2">
        <Heading as="h2" size="2xl" color="primary">
          {t("steps.step1.title")}
        </Heading>
        <p className="text-lg text-muted-foreground mt-2 text-dark-blue font-medium">
          {t("steps.step1.description")}
        </p>
      </div>

      <RadioGroupButtons
        defaultValue={playlistSelection}
        onChange={(value) => setPlaylistSelection(value)}
      >
        <RadioGroupButton value="new">
          <RadioGroupButtonTitle>
            {t("steps.step1.form.createNewPlaylist.title")}
          </RadioGroupButtonTitle>
          <RadioGroupButtonDescription>
            {t("steps.step1.form.createNewPlaylist.description")}
          </RadioGroupButtonDescription>
        </RadioGroupButton>
        <RadioGroupButton value="existing">
          <RadioGroupButtonTitle>
            {t("steps.step1.form.useExistingPlaylist.title")}
          </RadioGroupButtonTitle>
          <RadioGroupButtonDescription>
            {t("steps.step1.form.useExistingPlaylist.description")}
          </RadioGroupButtonDescription>
        </RadioGroupButton>
      </RadioGroupButtons>

      <div className="space-y-2 mt-6">
        <Label htmlFor="playlist-search">
          {t("steps.step1.form.createNewPlaylist.giveAName")}
        </Label>
        <Input
          id="playlist-search"
          placeholder={t("steps.step1.form.createNewPlaylist.namePlaceholder")}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="private-playlist" />
        <Label htmlFor="private-playlist" className="flex flex-col">
          <span className="text-sm font-medium">
            {t("steps.step1.form.createNewPlaylist.privatePlaylist.title")}
          </span>
          <span className="text-sm text-muted-foreground text-dark-blue">
            {t(
              "steps.step1.form.createNewPlaylist.privatePlaylist.description"
            )}
          </span>
        </Label>
      </div>
    </>
  )
}

export default PlaylistSetupForm
