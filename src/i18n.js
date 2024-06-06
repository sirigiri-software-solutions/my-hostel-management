import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
import English from './locales/en/translation.json';
import Hindi from './locales/hi/translation.json';
import Telugu from './locales/te/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: English,
      },
      hi: {
        translation: Hindi,
      },
      te: {
        translation: Telugu,
      },
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    // Add more configuration options as needed
  });

export default i18n;
