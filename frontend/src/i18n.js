import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Configuration de i18next
i18n
  .use(HttpBackend) // Pour charger les traductions depuis des fichiers externes si nécessaire
  .use(LanguageDetector) // Pour détecter la langue du navigateur
  .use(initReactI18next) // Intégration avec React
  .init({
    fallbackLng: 'en', // Langue par défaut si la langue préférée n'est pas disponible
    debug: true, // Affiche les informations de debug
    interpolation: {
      escapeValue: false, // Pas nécessaire avec React
    },
    resources: {
      en: {
        translation: {
          welcome: "Welcome",
          description: "This is a bilingual app",
        },
      },
      fr: {
        translation: {
          welcome: "Bienvenue",
          description: "C'est une application bilingue",
        },
      },
    },
  });

export default i18n;
