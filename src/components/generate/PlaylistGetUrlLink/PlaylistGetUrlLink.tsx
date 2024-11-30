import { Button } from "@/components/ui/Button"
import Heading from "@/components/ui/Heading"
import { Input } from "@/components/ui/Input"
import useTranslation from "next-translate/useTranslation"

const PlaylistGetUrlLink = () => {
  const { t } = useTranslation("generate")
  return (
    <>
      <div className="flex flex-col space-y-2">
        <Heading as="h2" size="2xl" color="primary">
          {t("steps.step3.title")}
        </Heading>
        <p className="text-lg text-muted-foreground mt-2 text-dark-blue font-medium">
          {t("steps.step3.description")}
        </p>
      </div>
      <div className="flex space-x-2 mt-6">
        <Input value="https://example.com/playlist/123" readOnly />
        <Button>{t("steps.step3.copyButton")}</Button>
      </div>
    </>
  )
}

export default PlaylistGetUrlLink
