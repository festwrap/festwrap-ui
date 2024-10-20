import Link from "next/link"
import { LanguageSelectorComponent } from "../LanguageSelector"
import useTranslation from "next-translate/useTranslation"

const Footer = () => {
  const { t } = useTranslation("common")
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-secondary bg-opacity-30 text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center space-x-6 py-6">
          <LanguageSelectorComponent />
          <nav className="flex flex-col gap-3 sm:flex-row sm:gap-10 font-medium text-sm items-end">
            <Link href="/get-started">{t("nav.getStarted")}</Link>
            <Link href="/about-us">{t("nav.aboutUs")}</Link>
          </nav>
        </div>
        <div className="flex justify-between space-x-6 text-sm border-t border-secondary py-4">
          <p>
            &copy; {currentYear} Festwrap. {t("footer.allRightsReserved")}
          </p>
          <nav className="flex flex-col sm:flex-row gap-5 sm:gap-10">
            <Link href="/terms-of-service">{t("nav.termsOfService")}</Link>
            <Link href="/privacy-policy">{t("nav.privacyPolicy")}</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
