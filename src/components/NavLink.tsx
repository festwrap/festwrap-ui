import Link from "next/link"

const NavLink = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => {
  return (
    <Link
      href={href}
      className="text-primary hover:text-opacity-80 transition-all ease-in-out duration-300 font-medium"
    >
      {children}
    </Link>
  )
}

export default NavLink
