import NavLink from '@components/layout/Header/NavbarMenu/NavLink';
import useTranslation from 'next-translate/useTranslation';

const DesktopNavbarMenu = () => {
  const { t } = useTranslation('common');
  return (
    <nav className="hidden md:flex gap-10 items-center">
      <NavLink href="/generate">{t('nav.getStarted')}</NavLink>
      <NavLink href="/about-us">{t('nav.aboutUs')}</NavLink>
    </nav>
  );
};

export default DesktopNavbarMenu;
