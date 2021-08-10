import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from 'expo-localization';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
export const resources = {
  en: {
    translation: {
      "average_cycle_length": "Average Cycle Length",
      "average_period_length": "Average Period Length",
      "home_last_cycles_headline": "My Cycles",
      "home_status_headline": "Health Check",
      "periode_in": "Next Period in",
      "unit_days": "days",
      "home_period_starts_in": "Your next period will start at around {{date}}.",
      "home_predictions": "Prediction",
      "cycle_phase_0": "Unknown",
      "cycle_phase_1": "Menstruation (+ Follicular phase)",
      "cycle_phase_2": "Proliferative phase (+ Follicular phase)",
      "cycle_phase_3": "Ovulation",
      "cycle_phase_4": "Luteal Phase (+ Secretory Phase)",
      "cycle_status_0": "Unknown",
      "cycle_status_1": "Menstruation",
      "cycle_status_2": "Post-Menstruation",
      "cycle_status_3": "Fertility Window",
      "cycle_status_4": "Ovulation",
      "cycle_status_5": "Pre-Menstruation",
      "home_phase": "Cycle Phase",
      "today": "Today",
      "fertility_0": "Unknown",
      "fertility_1": "Least fertile stage",
      "fertility_2": "Less fertile",
      "fertility_3": "Possible to conceive",
      "fertility_4": "Most fertile",
      "cycle_length_status_0": "Unknown",
      "cycle_length_status_1": "Abnormal",
      "cycle_length_status_2": "Normal",
      "period_length_status_0": "Unknown",
      "period_length_status_1": "Abnormal",
      "period_length_status_2": "Normal",
      "tracking_option_bleeding_headline": "Period",
      "tracking_option_bleeding_1": "Light",
      "tracking_option_bleeding_2": "Medium",
      "tracking_option_bleeding_3": "Strong",
      "tracking_option_bleeding_4": "Spotting",
      "tracking_option_emotion_headline": "Emotion",
      "tracking_option_emotion_1": "Happy",
      "tracking_option_emotion_2": "Sad",
      "tracking_option_emotion_3": "Sensitive",
      "tracking_option_emotion_4": "PMS",
      "tracking_option_intercourse_headline": "Intercourse",
      "tracking_option_intercourse_1": "Unprotected",
      "tracking_option_intercourse_2": "Protected",
      "tracking_option_intercourse_3": "High Sex Drive",
      "tracking_option_intercourse_4": "Masturbation",
      "tracking_option_pain_headline": "Pain",
      "tracking_option_pain_1": "Cramps",
      "tracking_option_pain_2": "Headache",
      "tracking_option_pain_3": "Breast Tenderness",
      "tracking_option_pain_4": "Bloating",
      "cycle_next_up_period_end": "Menstruation ends in {{days}} days",
      "cycle_next_up_fertility_window_start": "Ferility Window starts in {{days}} days",
      "cycle_next_up_ovulation_start": "Ovulation in {{days}} days",
      "cycle_next_up_fertility_window_end": "Fertility Windows ends in {{days}} days",
      "cycle_next_up_period_start": "Menstruation starts in {{days}} days",
    }
  },
  de: {
    translation: {
      "average_cycle_length": "Durchschnittliche Zykluslänge",
      "average_period_length": "Durchschnittliche Periodenlänge",
      "periode_in": "Nächste Periode in",
      "unit_days": "Tagen",
      "home_period_starts_in": "Deine nächste Periode wird ungefähr am {{date}} in {{in_days}} Tagen los gehen.",
      "home_predictions": "Voraussage",
      "today": "Heute",
    }
  }
};

console.log(Localization.locale)

i18n
.use(initReactI18next) // passes i18n down to react-i18next
.init({
  resources,
  lng: Localization.locale || 'en',
  interpolation: {
    escapeValue: false // react already safes from xss
  }
});

export default i18n;