// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  dateJoined: string;
  isEmailVerified: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: Theme;
  fontSize: FontSize;
  language: Language;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  medicationReminders: boolean;
  appointmentReminders: boolean;
  expiryAlerts: boolean;
  emailNotifications: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Prescription and Medication Types
export interface Prescription {
  id: string;
  name: string;
  file: string; // base64 encoded file data
  fileType: 'pdf' | 'image';
  mimeType: string;
  uploadDate: string;
  notes?: string;
  tags?: string[];
  size: number; // file size in bytes
  
  // Medication tracking fields
  medications?: Medication[];
  doctorInfo?: DoctorInfo;
  nextAppointment?: string; // ISO date string
  prescriptionDate?: string; // ISO date string
  expiryDate?: string; // ISO date string
  isActive?: boolean;
  
  // AI-extracted data
  extractedText?: string;
  aiProcessed?: boolean;
  aiConfidence?: number; // 0-1 confidence score
  drugInteractions?: string[];
  healthInsights?: string[];
  
  // User association
  userId: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string; // e.g., "500mg", "1 tablet"
  frequency: MedicationFrequency;
  duration: string; // e.g., "7 days", "2 weeks", "ongoing"
  instructions: string; // e.g., "Take with food", "Before bedtime"
  startDate: string; // ISO date string
  endDate?: string; // ISO date string for finite courses
  isActive: boolean;
  reminderTimes?: string[]; // Array of times like ["08:00", "14:00", "20:00"]
  sideEffects?: string[];
  notes?: string;
  userId: string;
}

export interface MedicationFrequency {
  type: 'daily' | 'weekly' | 'as-needed';
  timesPerDay?: number; // for daily medications
  daysOfWeek?: number[]; // for weekly medications (0 = Sunday, 1 = Monday, etc.)
  interval?: number; // hours between doses for as-needed
  maxPerDay?: number; // maximum doses per day for as-needed
}

export interface DoctorInfo {
  name: string;
  specialty?: string;
  clinic?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface MedicationSchedule {
  medicationId: string;
  medicationName: string;
  time: string; // HH:mm format
  dosage: string;
  taken: boolean;
  date: string; // YYYY-MM-DD format
  notes?: string;
  userId: string;
}

export interface AppointmentReminder {
  id: string;
  prescriptionId?: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime?: string;
  reason: string;
  location?: string;
  notes?: string;
  reminderSet: boolean;
  userId: string;
}

// UI and Application Types
export interface UploadProgress {
  isUploading: boolean;
  progress: number;
  fileName: string;
}

export type Theme = 'light' | 'dark';
export type FontSize = 'normal' | 'large' | 'very-large';
export type Language = 'en';
export type ViewMode = 'grid' | 'list';

export interface AIProcessingStatus {
  isProcessing: boolean;
  stage: 'ocr' | 'parsing' | 'analysis' | 'complete';
  progress: number;
  error?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps extends BaseComponentProps {
  title?: string;
}

// State Management Types
export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  error: string | null;
}

export interface AppState {
  theme: Theme;
  fontSize: FontSize;
  language: Language;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'date' | 'time' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
} 