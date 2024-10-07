import NavLink from "@/components/layout/Header/NavbarMenu/NavLink"
import SpotifyAuthDropdown from "./SpotifyAuthDropdown"

const DesktopNavbarMenu = () => {
  return (
    <nav className="hidden md:flex gap-10 items-center">
      <NavLink href="/get-started">Get started</NavLink>
      <NavLink href="/about-us">About us</NavLink>
      <SpotifyAuthDropdown />
    </nav>
  )
}

export default DesktopNavbarMenu
