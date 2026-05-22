// ============================================================
// TYPES UNTUK LANGKAH.ID
// ============================================================

export const EDUCATION_LEVELS = ['SD', 'SMP', 'SMA/SMK', 'D3', 'S1', 'S2'] as const;
export type EducationLevel = (typeof EDUCATION_LEVELS)[number];

export const CATEGORIES = ['Lomba', 'Beasiswa', 'Magang', 'Pertukaran Pelajar', 'Workshop', 'Lainnya'] as const;
export type Category = (typeof CATEGORIES)[number];

export const FIELDS = ['Akademik', 'Sains', 'Seni', 'Olahraga', 'Teknologi', 'Kewirausahaan', 'Umum'] as const;
export type Field = (typeof FIELDS)[number];

export const OPPORTUNITY_TYPES = ['Individu', 'Tim'] as const;
export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number];

export const VERIFICATION_STATUSES = ['verified', 'pending', 'draft'] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const SAVED_STATUSES = ['interested', 'applying', 'applied'] as const;
export type SavedStatus = (typeof SAVED_STATUSES)[number];

export const SUBMISSION_STATUSES = ['pending_review', 'approved', 'rejected'] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export interface Profile {
  id: string;
  full_name: string;
  education_level: EducationLevel;
  interests: string[];
  domicile: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organizer: string;
  category: Category;
  field: Field;
  target_levels: EducationLevel[];
  type: OpportunityType;
  description: string;
  requirements: string[];
  rewards: string | null;
  registration_open_date: string | null;
  registration_close_date: string;
  event_date: string | null;
  registration_link: string;
  guidebook_link: string | null;
  contact_info: string | null;
  organizer_socials: {
    instagram?: string;
    twitter?: string;
    website?: string;
    email?: string;
  };
  poster_url: string | null;
  verification_status: VerificationStatus;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserSavedOpportunity {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: SavedStatus;
  notes: string | null;
  reminder_date: string | null;
  created_at: string;
  opportunity?: Opportunity;
}

export interface UserSubmission {
  id: string;
  user_id: string;
  opportunity_title: string;
  information_link: string;
  additional_notes: string | null;
  status: SubmissionStatus;
  reviewed_by: string | null;
  created_at: string;
}

export interface OpportunityFilters {
  category: Category | null;
  field: Field | null;
  target_level: EducationLevel | null;
  type: OpportunityType | null;
  status: 'open' | 'closed' | null;
  search: string;
  sort: 'deadline_terdekat' | 'terbaru' | 'terpopuler';
  page: number;
  limit: number;
}

export interface DashboardStats {
  totalSaved: number;
  currentlyApplying: number;
  deadlinesThisWeek: number;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  Lomba: 'bg-blue-100 text-blue-800 border-blue-300',
  Beasiswa: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Magang: 'bg-purple-100 text-purple-800 border-purple-300',
  'Pertukaran Pelajar': 'bg-amber-100 text-amber-800 border-amber-300',
  Workshop: 'bg-pink-100 text-pink-800 border-pink-300',
  Lainnya: 'bg-gray-100 text-gray-800 border-gray-300',
};

export const SAVED_STATUS_COLORS: Record<SavedStatus, { bg: string; text: string; label: string }> = {
  interested: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Tertarik' },
  applying: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Sedang Daftar' },
  applied: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Selesai Daftar' },
};