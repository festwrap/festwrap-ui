import LogoLink from './logo-link';
import NavbarMenu from './navbar-menu/navbar-menu';

const Header = () => {
  return (
    <header className="text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-8">
          <div className="flex justify-start">
            <LogoLink />
          </div>
          <NavbarMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
