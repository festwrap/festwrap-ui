import { signIn, useSession } from "next-auth/react"
import UserMenu from "./UserMenu"
import Button from "@/components/ui/Button"
import Skeleton from "@/components/ui/Skeleton"

type SpotifyAuthDropdownProps = {
  isMobileScreen?: boolean
}

const SpotifyAuthDropdown = ({ isMobileScreen }: SpotifyAuthDropdownProps) => {
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
        Login with Spotify
      </Button>
    )
  }

  return <UserMenu session={session} isMobileScreen={isMobileScreen} />
}

export default SpotifyAuthDropdown
