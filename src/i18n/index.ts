import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import pt from "./locales/pt/translation.json"
import en from "./locales/en/translation.json"

i18n
  .use(LanguageDetector) // detecta idioma automaticamente
  .use(initReactI18next) // integra com o React
  .init({
    fallbackLng: "en", // idioma padrão
    supportedLngs: ["en", "pt"],
    load: "languageOnly",
    // debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // React já faz o escape por padrão
    },
    resources: {
      pt: { translation: pt },
      en: { translation: en },
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  })

export default i18n
