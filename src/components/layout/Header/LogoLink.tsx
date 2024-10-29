import Image from "next/image"
import Link from "next/link"

const LogoLink = () => {
  return (
    <Link href="/">
      <Image
        src="/logo.svg"
        alt="Festwrap logo"
        width={155}
        height={36}
        priority
      />
    </Link>
  )
}

export default LogoLink
