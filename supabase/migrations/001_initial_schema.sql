-- Tabel profiles (linked ke auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  education_level TEXT CHECK (education_level IN ('SD','SMP','SMA/SMK','D3','S1','S2')) NOT NULL,
  interests TEXT[] DEFAULT '{}',
  domicile TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel opportunities
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organizer TEXT NOT NULL,
  category TEXT CHECK (category IN ('Lomba','Beasiswa','Magang','Pertukaran Pelajar','Workshop','Lainnya')) NOT NULL,
  field TEXT CHECK (field IN ('Akademik','Sains','Seni','Olahraga','Teknologi','Kewirausahaan','Umum')) NOT NULL,
  target_levels TEXT[] NOT NULL,
  type TEXT CHECK (type IN ('Individu','Tim')) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  rewards TEXT DEFAULT '',
  registration_open_date DATE,
  registration_close_date DATE NOT NULL,
  event_date DATE,
  registration_link TEXT NOT NULL,
  guidebook_link TEXT,
  contact_info TEXT,
  organizer_socials JSONB DEFAULT '{}',
  poster_url TEXT,
  verification_status TEXT CHECK (verification_status IN ('verified','pending','draft')) DEFAULT 'pending',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel user_saved
CREATE TABLE user_saved_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('interested','applying','applied')) DEFAULT 'interested',
  notes TEXT,
  reminder_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- Tabel user_submissions
CREATE TABLE user_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  opportunity_title TEXT NOT NULL,
  information_link TEXT NOT NULL,
  additional_notes TEXT,
  status TEXT CHECK (status IN ('pending_review','approved','rejected')) DEFAULT 'pending_review',
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_opp_category ON opportunities(category);
CREATE INDEX idx_opp_field ON opportunities(field);
CREATE INDEX idx_opp_close_date ON opportunities(registration_close_date);
CREATE INDEX idx_opp_verification ON opportunities(verification_status);
CREATE INDEX idx_saved_user ON user_saved_opportunities(user_id);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Anyone can read verified opportunities" ON opportunities FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Users can CRUD own saved" ON user_saved_opportunities FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own submissions" ON user_submissions FOR ALL USING (auth.uid() = user_id);

-- Seed data
INSERT INTO opportunities (title, organizer, category, field, target_levels, type, description, requirements, rewards, registration_open_date, registration_close_date, event_date, registration_link, verification_status) VALUES
('Lomba Debat Nasional UI 2026', 'Universitas Indonesia', 'Lomba', 'Akademik', ARRAY['SMA/SMK','S1'], 'Individu', 'Lomba debat nasional tingkat SMA dan mahasiswa se-Indonesia dengan format British Parliamentary.', ARRAY['KTP/Kartu Pelajar','Surat rekomendasi','Esai 500 kata'], 'Juara 1: Rp15.000.000, Juara 2: Rp10.000.000, Juara 3: Rp5.000.000', '2026-06-01', '2026-07-15', '2026-08-10', 'https://debate.ui.ac.id/daftar', 'verified'),
('Beasiswa Unggulan Kemendikbud 2026', 'Kemendikbud RI', 'Beasiswa', 'Umum', ARRAY['S1','S2'], 'Individu', 'Beasiswa penuh dari pemerintah untuk mahasiswa berprestasi mencakup biaya kuliah dan biaya hidup.', ARRAY['IPK minimal 3.5','Surat rekomendasi','TOEFL ITP 500/IELTS 6.0'], 'Biaya kuliah penuh + tunjangan Rp2.500.000/bulan', '2026-05-15', '2026-06-30', '2026-09-01', 'https://beasiswaunggulan.kemdikbud.go.id', 'verified'),
('Hackathon Merdeka 2026', 'Kemendikbudristek', 'Lomba', 'Teknologi', ARRAY['S1'], 'Tim', 'Hackathon 48 jam menciptakan solusi digital untuk UMKM Indonesia. Tim 3-4 orang.', ARRAY['Mahasiswa aktif S1','Tim 3-4 orang','Proposal ide'], 'Juara 1: Rp50.000.000 + inkubasi', '2026-05-20', '2026-07-05', '2026-07-20', 'https://kampusmerdeka.kemdikbud.go.id/hackathon', 'verified'),
('Magang BUMN 2026', 'Kementerian BUMN', 'Magang', 'Umum', ARRAY['D3','S1'], 'Individu', 'Program magang 3-6 bulan di BUMN ternama. Tersedia di bidang Keuangan, Teknik, IT, Marketing.', ARRAY['IPK minimal 3.0','CV terbaru','Surat motivasi'], 'Sertifikat + uang saku Rp3.000.000/bulan', '2026-06-01', '2026-06-20', '2026-07-15', 'https://rekrutmenbersama.fhcibumn.id/magang', 'verified'),
('OSN SMA 2026', 'Kemendikdasmen RI', 'Lomba', 'Sains', ARRAY['SMA/SMK'], 'Individu', 'Olimpiade Sains Nasional untuk siswa SMA. Bidang: Matematika, Fisika, Kimia, Biologi, Informatika.', ARRAY['Siswa kelas X/XI','Nilai sains minimal 85'], 'Medali + beasiswa + pembinaan', '2026-05-10', '2026-06-25', '2026-08-01', 'https://osn.kemdikbud.go.id/daftar', 'verified');