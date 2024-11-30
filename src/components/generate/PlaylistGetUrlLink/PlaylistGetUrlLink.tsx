import { Button } from "@/components/ui/Button"
import Heading from "@/components/ui/Heading"
import { Input } from "@/components/ui/Input"

const PlaylistGetUrlLink = () => {
  return (
    <>
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
        <Button>Copy URL</Button>
      </div>
    </>
  )
}

export default PlaylistGetUrlLink
