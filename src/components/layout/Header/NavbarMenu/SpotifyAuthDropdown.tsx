import { signIn, useSession } from "next-auth/react"
import UserMenu from "./UserMenu"
import Button from "@/components/ui/Button"
import Skeleton from "@/components/ui/Skeleton"
import useTranslation from "next-translate/useTranslation"

type SpotifyAuthDropdownProps = {
  isMobileScreen?: boolean
}

const SpotifyAuthDropdown = ({ isMobileScreen }: SpotifyAuthDropdownProps) => {
  const { t } = useTranslation("common")
  const { data: session, status } = useSession()

  const isSessionLoading = status === "loading"

  if (isSessionLoading) {
    return <Skeleton width="w-10" height="h-10" />
  }

  if (!session) {
    return (
      <Button
        variant="primary"
        onClick={() => signIn("spotify", { callbackUrl: "/" })}
      >
        {t("nav.login")}
      </Button>
    )
  }

  return <UserMenu session={session} isMobileScreen={isMobileScreen} />
}

export default SpotifyAuthDropdown
