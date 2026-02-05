import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './translations';

i18n
  .use(initReactI18next)
  .init({
    resources: translations,
    lng: 'es', // idioma por defecto: español
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // React ya hace escape
    },
  });

export default i18n;
