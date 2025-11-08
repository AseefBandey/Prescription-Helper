import { Language } from '../types';

export type TranslationKey = 
  // App Title & Header
  | 'app.title'
  | 'app.logo.alt'
  
  // Theme Controls
  | 'theme.light'
  | 'theme.dark'
  | 'theme.toggle'
  
  // Font Size Controls
  | 'fontSize.normal'
  | 'fontSize.large'
  | 'fontSize.normal.aria'
  | 'fontSize.large.aria'
  
  // Language Controls
  | 'language.en'
  | 'language.zh-TW'
  | 'language.toggle'
  
  // Appointment Calculator
  | 'appointment.title'
  | 'appointment.date.label'
  | 'appointment.weeks.label'
  | 'appointment.weeks.unit'
  | 'appointment.followUpDate'
  | 'appointment.date.format'
  
  // Medication List
  | 'medication.title'
  | 'medication.add'
  | 'medication.name.label'
  | 'medication.name.placeholder'
  | 'medication.dailyDosage.label'
  | 'medication.dailyDosage.placeholder'
  | 'medication.pillsPerBox.label'
  | 'medication.pillsPerBox.placeholder'
  | 'medication.notes.label'
  | 'medication.notes.placeholder'
  | 'medication.totalPills'
  | 'medication.boxesNeeded'
  | 'medication.remainder'
  | 'medication.edit'
  | 'medication.delete'
  | 'medication.save'
  | 'medication.cancel'
  
  // Checklist
  | 'checklist.title'
  | 'checklist.add'
  | 'checklist.placeholder'
  | 'checklist.empty'
  | 'checklist.delete'
  
  // Confirm Modal
  | 'confirm.title'
  | 'confirm.clearData'
  | 'confirm.cancel'
  | 'confirm.clear'
  
  // Footer
  | 'footer.copyright'
  | 'footer.clearData'
  | 'footer.clearData.aria';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  'en': {
    // App Title & Header
    'app.title': 'Digital Prescription Vault',
    'app.logo.alt': 'Digital Prescription Vault Logo',
    
    // Theme Controls
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggle': 'Toggle theme',
    
    // Font Size Controls
    'fontSize.normal': 'A',
    'fontSize.large': 'A',
    'fontSize.normal.aria': 'Use normal font size',
    'fontSize.large.aria': 'Use large font size',
    
    // Language Controls
    'language.en': 'EN',
    'language.zh-TW': '中',
    'language.toggle': 'Switch language',
    
    // Appointment Calculator
    'appointment.title': 'Follow-up Appointment Calculator',
    'appointment.date.label': 'Appointment Date',
    'appointment.weeks.label': 'Follow-up Interval',
    'appointment.weeks.unit': 'weeks',
    'appointment.followUpDate': 'Next follow-up date',
    'appointment.date.format': 'en-US',
    
    // Medication List
    'medication.title': 'Medication Management',
    'medication.add': 'Add Medication',
    'medication.name.label': 'Medication Name',
    'medication.name.placeholder': 'e.g., Aspirin',
    'medication.dailyDosage.label': 'Daily Dosage (pills)',
    'medication.dailyDosage.placeholder': 'e.g., 2',
    'medication.pillsPerBox.label': 'Pills per Box',
    'medication.pillsPerBox.placeholder': 'e.g., 30',
    'medication.notes.label': 'Notes',
    'medication.notes.placeholder': 'e.g., Take with food',
    'medication.totalPills': 'Total pills needed',
    'medication.boxesNeeded': 'Boxes',
    'medication.remainder': 'Remainder Pills',
    'medication.edit': 'Edit',
    'medication.delete': 'Delete',
    'medication.save': 'Save',
    'medication.cancel': 'Cancel',
    
    // Checklist
    'checklist.title': 'Pre-appointment Checklist',
    'checklist.add': 'Add Item',
    'checklist.placeholder': 'Add a new checklist item...',
    'checklist.empty': 'No checklist items yet',
    'checklist.delete': 'Delete',
    
    // Confirm Modal
    'confirm.title': 'Confirm Action',
    'confirm.clearData': 'Are you sure you want to clear all data? This action cannot be undone.',
    'confirm.cancel': 'Cancel',
    'confirm.clear': 'Clear All Data',
    
    // Footer
    'footer.copyright': '© 2024 Digital Prescription Vault. All rights reserved.',
    'footer.clearData': 'Clear All Data',
    'footer.clearData.aria': 'Clear all saved data'
  },
  'zh-TW': {
    // App Title & Header
    'app.title': 'Digital Prescription Vault',
    'app.logo.alt': 'Digital Prescription Vault Logo',
    
    // Theme Controls
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggle': 'Toggle theme',
    
    // Font Size Controls
    'fontSize.normal': 'A',
    'fontSize.large': 'A',
    'fontSize.normal.aria': 'Use normal font size',
    'fontSize.large.aria': 'Use large font size',
    
    // Language Controls
    'language.en': 'EN',
    'language.zh-TW': '中',
    'language.toggle': 'Switch language',
    
    // Appointment Calculator
    'appointment.title': 'Follow-up Appointment Calculator',
    'appointment.date.label': 'Appointment Date',
    'appointment.weeks.label': 'Follow-up Interval',
    'appointment.weeks.unit': 'weeks',
    'appointment.followUpDate': 'Next follow-up date',
    'appointment.date.format': 'zh-TW',
    
    // Medication List
    'medication.title': 'Medication Management',
    'medication.add': 'Add Medication',
    'medication.name.label': 'Medication Name',
    'medication.name.placeholder': 'e.g., Aspirin',
    'medication.dailyDosage.label': 'Daily Dosage (pills)',
    'medication.dailyDosage.placeholder': 'e.g., 2',
    'medication.pillsPerBox.label': 'Pills per Box',
    'medication.pillsPerBox.placeholder': 'e.g., 30',
    'medication.notes.label': 'Notes',
    'medication.notes.placeholder': 'e.g., Take with food',
    'medication.totalPills': 'Total pills needed',
    'medication.boxesNeeded': 'Boxes',
    'medication.remainder': 'Remainder Pills',
    'medication.edit': 'Edit',
    'medication.delete': 'Delete',
    'medication.save': 'Save',
    'medication.cancel': 'Cancel',
    
    // Checklist
    'checklist.title': 'Pre-appointment Checklist',
    'checklist.add': 'Add Item',
    'checklist.placeholder': 'Add a new checklist item...',
    'checklist.empty': 'No checklist items yet',
    'checklist.delete': 'Delete',
    
    // Confirm Modal
    'confirm.title': 'Confirm Action',
    'confirm.clearData': 'Are you sure you want to clear all data? This action cannot be undone.',
    'confirm.cancel': 'Cancel',
    'confirm.clear': 'Clear All Data',
    
    // Footer
    'footer.copyright': '© 2024 Digital Prescription Vault. All rights reserved.',
    'footer.clearData': 'Clear All Data',
    'footer.clearData.aria': 'Clear all saved data'
  }
};

export const t = (key: TranslationKey, language: Language): string => {
  return translations[language][key] || translations['zh-TW'][key];
};