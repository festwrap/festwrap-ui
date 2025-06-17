import Link from 'next/link';
import { LanguageSelectorComponent } from './LanguageSelector';
import useTranslation from 'next-translate/useTranslation';

const Footer = () => {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary bg-opacity-30 text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-">
        <div className="flex items-center justify-between border-t border-secondary py-2 text-sm">
          <div className="flex items-center space-x-6">
            <LanguageSelectorComponent />
            <Link href="/terms-of-service">{t('nav.termsOfService')}</Link>
            <Link href="/privacy-policy">{t('nav.privacyPolicy')}</Link>
          </div>
          <p>
            &copy; {currentYear} Festwrap. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
