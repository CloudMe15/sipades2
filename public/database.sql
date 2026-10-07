-- ========================================================
-- SIPADES - Sistem Pelayanan Administrasi Desa Terpadu
-- Kecamatan Rakit Kulim, Kabupaten Indragiri Hulu, Riau
-- Skema Database MySQL / MariaDB Terpusat
-- ========================================================

SET NAMES utf8mb4;
SET time_zone = '+07:00';

-- 1. Tabel Pengguna / Aparatur (RBAC: RT, Operator Desa, Kasi Kecamatan, Super Admin)
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100),
  `name` VARCHAR(100) NOT NULL,
  `role` ENUM('rt', 'operator', 'kecamatan', 'admin') NOT NULL,
  `identifier` VARCHAR(100) NOT NULL,
  `village` VARCHAR(100) DEFAULT 'Desa Kelayang',
  `avatar` TEXT,
  `phone` VARCHAR(30),
  `status` ENUM('active', 'pending', 'rejected') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel Permohonan Surat Warga
CREATE TABLE IF NOT EXISTS `requests` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `ticket_number` VARCHAR(50) NOT NULL UNIQUE,
  `nomor_surat_desa` VARCHAR(100) DEFAULT NULL,
  `nik` VARCHAR(20) NOT NULL,
  `nama_lengkap` VARCHAR(150) NOT NULL,
  `nomor_whatsapp` VARCHAR(30) NOT NULL,
  `nomor_kk` VARCHAR(30) DEFAULT NULL,
  `tempat_lahir` VARCHAR(100) DEFAULT NULL,
  `tanggal_lahir` DATE DEFAULT NULL,
  `jenis_kelamin` ENUM('Laki-laki', 'Perempuan') DEFAULT 'Laki-laki',
  `agama` VARCHAR(50) DEFAULT 'Islam',
  `pekerjaan` VARCHAR(100) DEFAULT NULL,
  `alamat` TEXT,
  `rt` VARCHAR(10) NOT NULL,
  `rw` VARCHAR(10) NOT NULL,
  `desa` VARCHAR(100) DEFAULT 'Desa Kelayang',
  `service_type` VARCHAR(20) NOT NULL,
  `keperluan` TEXT NOT NULL,
  `rincian_tambahan` LONGTEXT DEFAULT NULL,
  `status` ENUM('menunggu_verifikasi', 'butuh_perbaikan', 'diproses', 'menunggu_ttd_kades', 'selesai_siap_ambil', 'sudah_diambil') NOT NULL DEFAULT 'menunggu_verifikasi',
  `rejection_reason` TEXT DEFAULT NULL,
  `estimated_completion` VARCHAR(100) DEFAULT 'Dalam 24 Jam Kerja',
  `completed_at` VARCHAR(50) DEFAULT NULL,
  `sla_actual_hours` DECIMAL(5,2) DEFAULT NULL,
  `handover_data` LONGTEXT DEFAULT NULL,
  `created_at` VARCHAR(50) NOT NULL,
  `updated_at` VARCHAR(50) NOT NULL,
  `created_timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_nik` (`nik`),
  INDEX `idx_status` (`status`),
  INDEX `idx_ticket` (`ticket_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel Berkas / Lampiran Dokumen Warga
CREATE TABLE IF NOT EXISTS `attachments` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `request_id` VARCHAR(50) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `file_url` LONGTEXT NOT NULL,
  `uploaded_at` VARCHAR(50) NOT NULL,
  `uploaded_by` VARCHAR(100) NOT NULL,
  `status` ENUM('valid', 'invalid', 'pending') DEFAULT 'pending',
  `revision_note` TEXT DEFAULT NULL,
  `created_timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_request_id` (`request_id`),
  FOREIGN KEY (`request_id`) REFERENCES `requests`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel Jejak Audit & Alur (Timeline Log)
CREATE TABLE IF NOT EXISTS `timelines` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `request_id` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `timestamp` VARCHAR(50) NOT NULL,
  `actor` VARCHAR(100) NOT NULL,
  `role` VARCHAR(30) NOT NULL,
  `note` TEXT DEFAULT NULL,
  `created_timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_timeline_request` (`request_id`),
  FOREIGN KEY (`request_id`) REFERENCES `requests`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabel Log WhatsApp Gateway
CREATE TABLE IF NOT EXISTS `wa_logs` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `recipient_phone` VARCHAR(30) NOT NULL,
  `recipient_name` VARCHAR(150) NOT NULL,
  `ticket_number` VARCHAR(50) NOT NULL,
  `message_type` VARCHAR(50) NOT NULL,
  `content` TEXT NOT NULL,
  `timestamp` VARCHAR(50) NOT NULL,
  `status` VARCHAR(30) DEFAULT 'Terkirim',
  `direct_wa_link` TEXT NOT NULL,
  `created_timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- DATA AWAL PENGGUNA RESMI KECAMATAN RAKIT KULIM
-- ========================================================
INSERT INTO `users` (`id`, `username`, `password`, `email`, `name`, `role`, `identifier`, `village`, `avatar`, `phone`)
VALUES
-- RT Desa Kelayang (Ibukota Kecamatan)
('user-rt-kelayang-01', 'rt01-kelayang', 'password123', 'rt01.kelayang@rakitkulim.desa.id', 'Junaidi, S.Pd', 'rt', 'Ketua RT 01 / RW 01', 'Desa Kelayang', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', '0812-7654-3201'),
('user-rt-kelayang-02', 'rt02-kelayang', 'password123', 'rt02.kelayang@rakitkulim.desa.id', 'Marlina, S.Sos', 'rt', 'Ketua RT 02 / RW 01', 'Desa Kelayang', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', '0813-8765-4302'),

-- RT Desa Kota Baru
('user-rt-kotabaru-01', 'rt01-kotabaru', 'password123', 'rt01.kotabaru@rakitkulim.desa.id', 'Hendra Wijaya', 'rt', 'Ketua RT 01 / RW 01', 'Desa Kota Baru', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', '0852-6543-2103'),

-- RT Desa Bukit Indah
('user-rt-bukitindah-01', 'rt01-bukitindah', 'password123', 'rt01.bukitindah@rakitkulim.desa.id', 'Suparman', 'rt', 'Ketua RT 01 / RW 01', 'Desa Bukit Indah', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', '0821-4321-8705'),

-- RT Desa Kuantan Tenang
('user-rt-kuantan-01', 'rt01-kuantan', 'password123', 'rt01.kuantan@rakitkulim.desa.id', 'Zulkifli Harahap', 'rt', 'Ketua RT 01 / RW 01', 'Desa Kuantan Tenang', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', '0853-1234-5606'),

-- RT Desa Petonggan
('user-rt-petonggan-01', 'rt01-petonggan', 'password123', 'rt01.petonggan@rakitkulim.desa.id', 'Arifin Siregar', 'rt', 'Ketua RT 01 / RW 01', 'Desa Petonggan', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', '0812-3456-7807'),

-- RT Desa Talang Suka Maju
('user-rt-talangsukamaju-01', 'rt01-talangsukamaju', 'password123', 'rt01.talangsukamaju@rakitkulim.desa.id', 'Darmawan Santoso', 'rt', 'Ketua RT 01 / RW 01', 'Desa Talang Suka Maju', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', '0822-7890-1209'),

-- RT Desa Lubuk Setarak
('user-rt-lubuk-01', 'rt01-lubuksetarak', 'password123', 'rt01.lubuk@rakitkulim.desa.id', 'Herman Syah', 'rt', 'Ketua RT 01 / RW 01', 'Desa Lubuk Setarak', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', '0813-9012-3408'),

-- RT Desa Talang Parigi
('user-rt-talangparigi-01', 'rt01-talangparigi', 'password123', 'rt01.talangparigi@rakitkulim.desa.id', 'Nasrudin', 'rt', 'Ketua RT 01 / RW 01', 'Desa Talang Parigi', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', '0852-8901-2310'),

-- RT Desa Rimba Seminai
('user-rt-rimbaseminai-01', 'rt01-rimbaseminai', 'password123', 'rt01.rimba@rakitkulim.desa.id', 'Bambang Hermanto', 'rt', 'Ketua RT 01 / RW 01', 'Desa Rimba Seminai', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', '0813-7890-1207'),

-- RT Desa Batu Sawar
('user-rt-batusawar-01', 'rt01-batusawar', 'password123', 'rt01.batusawar@rakitkulim.desa.id', 'M. Nasiruddin', 'rt', 'Ketua RT 01 / RW 01', 'Desa Batu Sawar', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', '0822-6789-0108'),

-- RT Desa Kampung Bungo
('user-rt-kampungbungo-01', 'rt01-kampungbungo', 'password123', 'rt01.bungo@rakitkulim.desa.id', 'Baharuddin', 'rt', 'Ketua RT 01 / RW 01', 'Desa Kampung Bungo', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', '0852-3456-7809'),

-- RT Desa Sungai Ekok
('user-rt-sungaiekok-01', 'rt01-sungaiekok', 'password123', 'rt01.sungaiekok@rakitkulim.desa.id', 'Saprudin', 'rt', 'Ketua RT 01 / RW 01', 'Desa Sungai Ekok', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', '0853-9012-3410'),

-- RT Desa Talang Durian Cacar
('user-rt-talangduriancacar-01', 'rt01-talangduriancacar', 'password123', 'rt01.cacar@rakitkulim.desa.id', 'Marwan Effendi', 'rt', 'Ketua RT 01 / RW 01', 'Desa Talang Durian Cacar', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', '0812-8901-2311'),

-- RT Desa Talang Gedabu
('user-rt-talanggedabu-01', 'rt01-talanggedabu', 'password123', 'rt01.gedabu@rakitkulim.desa.id', 'Sudirman', 'rt', 'Ketua RT 01 / RW 01', 'Desa Talang Gedabu', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', '0813-4567-8912'),

-- RT Desa Talang Pring Jaya
('user-rt-talangpringjaya-01', 'rt01-talangpringjaya', 'password123', 'rt01.pringjaya@rakitkulim.desa.id', 'Wagiran Santoso', 'rt', 'Ketua RT 01 / RW 01', 'Desa Talang Pring Jaya', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', '0852-6789-0114'),

-- RT Desa Talang Selantai
('user-rt-talangselantai-01', 'rt01-talangselantai', 'password123', 'rt01.selantai@rakitkulim.desa.id', 'Suwardi', 'rt', 'Ketua RT 01 / RW 01', 'Desa Talang Selantai', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', '0853-7890-1215'),

-- RT Desa Talang Sungai Limau
('user-rt-talangsungailimau-01', 'rt01-talangsungailimau', 'password123', 'rt01.sungailimau@rakitkulim.desa.id', 'Hermanto', 'rt', 'Ketua RT 01 / RW 01', 'Desa Talang Sungai Limau', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', '0813-0123-4517'),

-- RT Desa Talang Sungai Parit
('user-rt-talangsungaiparit-01', 'rt01-talangsungaiparit', 'password123', 'rt01.sungaiparit@rakitkulim.desa.id', 'Jupriadi', 'rt', 'Ketua RT 01 / RW 01', 'Desa Talang Sungai Parit', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', '0821-1234-5618'),

-- RT Desa Talang Tujuh Buah Tangga
('user-rt-talang7buahtangga-01', 'rt01-talang7buahtangga', 'password123', 'rt01.7buahtangga@rakitkulim.desa.id', 'Alamsyah', 'rt', 'Ketua RT 01 / RW 01', 'Desa Talang Tujuh Buah Tangga', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', '0852-2345-6719'),

-- Operator Kantor Desa
('user-operator', 'operator', 'password123', 'pelayanan@rakitkulim.desa.id', 'Asep Ridwan, S.Kom', 'operator', 'Operator Pelayanan Kantor Desa', 'Desa Kelayang (Kec. Rakit Kulim)', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', '0857-1234-5678'),

-- Kasi Tata Pemerintahan & Pelayanan PATEN Kecamatan Rakit Kulim
('user-kecamatan', 'kasi', 'password123', 'paten@rakitkulim.inhukab.go.id', 'Drs. H. Suryana, M.Si', 'kecamatan', 'Kasi Tata Pemerintahan & PATEN', 'Kecamatan Rakit Kulim, Kab. Inhu', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', '0811-2233-4455'),

-- Super Admin Master (Pemerintah Kecamatan Rakit Kulim)
('user-superadmin', 'admin', 'CloudMe', 'admin.master@rakitkulim.inhukab.go.id', 'Administrator Master PATEN', 'admin', 'Super Admin Kecamatan Rakit Kulim', 'Kecamatan Rakit Kulim, Kab. Inhu', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', '0812-9988-7766')
ON DUPLICATE KEY UPDATE `password`=VALUES(`password`), `name`=VALUES(`name`), `identifier`=VALUES(`identifier`), `village`=VALUES(`village`);
