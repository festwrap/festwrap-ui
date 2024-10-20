import useTranslation from "next-translate/useTranslation"
import setLanguage from "next-translate/setLanguage"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Globe } from "lucide-react"

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "ca", name: "Catalan" },
]

export function LanguageSelectorComponent() {
  const { lang } = useTranslation()

  const handleLanguageChange = async (newLocale: string) => {
    await setLanguage(newLocale)
  }

  return (
    <Select onValueChange={handleLanguageChange} defaultValue={lang}>
      <SelectTrigger className="w-[150px]">
        <Globe className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
