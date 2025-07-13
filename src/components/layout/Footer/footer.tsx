import { LanguageSelectorComponent } from './language-selector';
import useTranslation from 'next-translate/useTranslation';

const Footer = () => {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary bg-opacity-30 text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-">
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-between border-t border-secondary py-2 text-sm">
          <LanguageSelectorComponent />
          <p>
            &copy; {currentYear} Festwrap. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
