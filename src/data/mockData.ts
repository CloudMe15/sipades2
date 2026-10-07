import { CitizenRequest, CurrentUser, ServiceMeta, VillageStats, WhatsAppMessageLog } from '../types';

export interface RakitKulimVillage {
  id: string;
  name: string;
  code: string;
  dusunCount: number;
  rtCount: number;
  rwCount: number;
  kades: string;
  phone: string;
  isCapital?: boolean;
}

// 19 Desa Resmi di Kecamatan Rakit Kulim, Kabupaten Indragiri Hulu, Riau
export const RAKIT_KULIM_VILLAGES: RakitKulimVillage[] = [
  { id: 'desa-kelayang', name: 'Desa Kelayang', code: '14.02.09.2001', dusunCount: 4, rtCount: 8, rwCount: 4, kades: 'H. Syamsir, S.Sos', phone: '0812-7654-3201', isCapital: true },
  { id: 'desa-kotabaru', name: 'Desa Kota Baru', code: '14.02.09.2002', dusunCount: 4, rtCount: 10, rwCount: 4, kades: 'M. Yusuf', phone: '0813-6543-2102' },
  { id: 'desa-bukitindah', name: 'Desa Bukit Indah', code: '14.02.09.2003', dusunCount: 3, rtCount: 8, rwCount: 3, kades: 'Suparmin', phone: '0852-9876-5403' },
  { id: 'desa-kuantantenang', name: 'Desa Kuantan Tenang', code: '14.02.09.2004', dusunCount: 3, rtCount: 6, rwCount: 3, kades: 'Ahmad Syafei', phone: '0821-4321-8704' },
  { id: 'desa-lubuksetarak', name: 'Desa Lubuk Setarak', code: '14.02.09.2005', dusunCount: 3, rtCount: 6, rwCount: 3, kades: 'Rustam Efendi', phone: '0853-1234-5605' },
  { id: 'desa-petonggan', name: 'Desa Petonggan', code: '14.02.09.2006', dusunCount: 3, rtCount: 8, rwCount: 3, kades: 'Zulkarnain', phone: '0812-3456-7806' },
  { id: 'desa-rimbaseminai', name: 'Desa Rimba Seminai', code: '14.02.09.2007', dusunCount: 3, rtCount: 6, rwCount: 3, kades: 'Herman', phone: '0813-7890-1207' },
  { id: 'desa-batusawar', name: 'Desa Batu Sawar', code: '14.02.09.2008', dusunCount: 3, rtCount: 6, rwCount: 3, kades: 'M. Nasir', phone: '0822-6789-0108' },
  { id: 'desa-kampungbungo', name: 'Desa Kampung Bungo', code: '14.02.09.2009', dusunCount: 3, rtCount: 6, rwCount: 3, kades: 'Baharuddin', phone: '0852-3456-7809' },
  { id: 'desa-sungaiekok', name: 'Desa Sungai Ekok', code: '14.02.09.2010', dusunCount: 2, rtCount: 5, rwCount: 2, kades: 'Saprudin', phone: '0853-9012-3410' },
  { id: 'desa-talangduriancacar', name: 'Desa Talang Durian Cacar', code: '14.02.09.2011', dusunCount: 3, rtCount: 6, rwCount: 3, kades: 'Marwan', phone: '0812-8901-2311' },
  { id: 'desa-talanggedabu', name: 'Desa Talang Gedabu', code: '14.02.09.2012', dusunCount: 3, rtCount: 6, rwCount: 3, kades: 'Sudirman', phone: '0813-4567-8912' },
  { id: 'desa-talangparigi', name: 'Desa Talang Parigi', code: '14.02.09.2013', dusunCount: 3, rtCount: 6, rwCount: 3, kades: 'Asnawi', phone: '0821-5678-9013' },
  { id: 'desa-talangpringjaya', name: 'Desa Talang Pring Jaya', code: '14.02.09.2014', dusunCount: 3, rtCount: 7, rwCount: 3, kades: 'Wagiran', phone: '0852-6789-0114' },
  { id: 'desa-talangselantai', name: 'Desa Talang Selantai', code: '14.02.09.2015', dusunCount: 3, rtCount: 6, rwCount: 3, kades: 'Suwardi', phone: '0853-7890-1215' },
  { id: 'desa-talangsukamaju', name: 'Desa Talang Suka Maju', code: '14.02.09.2016', dusunCount: 3, rtCount: 6, rwCount: 3, kades: 'Bambang Irawan', phone: '0812-9012-3416' },
  { id: 'desa-talangsungailimau', name: 'Desa Talang Sungai Limau', code: '14.02.09.2017', dusunCount: 3, rtCount: 6, rwCount: 3, kades: 'Hermanto', phone: '0813-0123-4517' },
  { id: 'desa-talangsungaiparit', name: 'Desa Talang Sungai Parit', code: '14.02.09.2018', dusunCount: 3, rtCount: 6, rwCount: 3, kades: 'Jupri', phone: '0821-1234-5618' },
  { id: 'desa-talang7buahtangga', name: 'Desa Talang Tujuh Buah Tangga', code: '14.02.09.2019', dusunCount: 3, rtCount: 6, rwCount: 3, kades: 'Alamsyah', phone: '0852-2345-6719' }
];

export const SERVICE_METAS: Record<string, ServiceMeta> = {
  SKU: {
    code: 'SKU',
    name: 'Surat Keterangan Usaha (SKU)',
    fullName: 'Surat Keterangan Kegiatan Usaha Mikro, Kecil & Menengah',
    requiredDocs: ['Foto KTP Asli', 'Foto Kartu Keluarga (KK)', 'Foto Tempat / Kegiatan Usaha'],
    slaHours: 4,
    description: 'Untuk keperluan pengajuan pinjaman modal KUR Bank, pendaftaran legalitas NIB, atau bantuan UMKM desa.'
  },
  SKCK: {
    code: 'SKCK',
    name: 'Surat Pengantar SKCK',
    fullName: 'Surat Pengantar Catatan Kepolisian ke Polsek Batang Cenaku / Rakit Kulim',
    requiredDocs: ['Foto KTP Asli', 'Foto Kartu Keluarga (KK)', 'Pas Foto 4x6 Background Merah'],
    slaHours: 3,
    description: 'Untuk melamar pekerjaan swasta/BUMN, seleksi CPNS/PPPK, atau pendaftaran TNI/Polri.'
  },
  SKTM: {
    code: 'SKTM',
    name: 'Surat Keterangan Tidak Mampu (SKTM)',
    fullName: 'Surat Keterangan Kurang Mampu / Desil Ekonomi Warga',
    requiredDocs: ['Foto KTP Asli', 'Foto Kartu Keluarga (KK)', 'Surat Pernyataan / Pengantar RT'],
    slaHours: 4,
    description: 'Untuk beasiswa KIP-Kuliah, permohonan keringanan biaya berobat di RSUD Indragiri Hulu / BPJS PBI.'
  },
  SKD: {
    code: 'SKD',
    name: 'Surat Keterangan Domisili',
    fullName: 'Surat Keterangan Tempat Tinggal / Domisili Penduduk',
    requiredDocs: ['Foto KTP Asli', 'Foto Kartu Keluarga (KK)'],
    slaHours: 2,
    description: 'Untuk pembukaan rekening bank, penerimaan karyawan perkebunan/PKS, atau persyaratan domisili sekolah.'
  },
  SPN: {
    code: 'SPN',
    name: 'Surat Pengantar Nikah (N1-N4)',
    fullName: 'Surat Pengantar Permohonan Pernikahan ke KUA Rakit Kulim',
    requiredDocs: ['Foto KTP Calon Pengantin', 'Foto KK', 'Akta Kelahiran', 'Ijazah Terakhir'],
    slaHours: 6,
    description: 'Formulir resmi model N1-N4 untuk pendaftaran akad nikah di Kantor Urusan Agama (KUA) Kec. Rakit Kulim.'
  },
  SKP: {
    code: 'SKP',
    name: 'Surat Keterangan Pindah',
    fullName: 'Surat Pengantar Pindah Penduduk Antar Desa / Kabupaten',
    requiredDocs: ['Foto KTP Asli', 'Foto Kartu Keluarga Asli', 'Pas Foto 3x4'],
    slaHours: 5,
    description: 'Pengantar penerbitan SKPWNI ke Disdukcapil Kabupaten Indragiri Hulu di Rengat.'
  },
  SKK: {
    code: 'SKK',
    name: 'Surat Keterangan Kelahiran / Kematian',
    fullName: 'Surat Keterangan Pelaporan Peristiwa Kependudukan Desa',
    requiredDocs: ['KTP Pelapor & Saksi', 'Kartu Keluarga', 'Surat Keterangan Bidan / Puskesmas'],
    slaHours: 4,
    description: 'Bukti pelaporan peristiwa kelahiran/kematian untuk penerbitan Akta Catatan Sipil.'
  }
};

// Akun Pengguna Terdaftar (Role-Based Access Control)
export const MOCK_USERS: CurrentUser[] = [
  // --- AKUN RT (Frontline Warga) ---
  {
    id: 'user-rt-kelayang-01',
    username: 'rt01-kelayang',
    password: 'password123',
    email: 'rt01.kelayang@rakitkulim.desa.id',
    name: 'Junaidi, S.Pd',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Kelayang',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '0812-7654-3201'
  },
  {
    id: 'user-rt-kelayang-02',
    username: 'rt02-kelayang',
    password: 'password123',
    email: 'rt02.kelayang@rakitkulim.desa.id',
    name: 'Marlina, S.Sos',
    role: 'rt',
    identifier: 'Ketua RT 02 / RW 01',
    village: 'Desa Kelayang',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '0813-8765-4302'
  },
  {
    id: 'user-rt-kotabaru-01',
    username: 'rt01-kotabaru',
    password: 'password123',
    email: 'rt01.kotabaru@rakitkulim.desa.id',
    name: 'Hendra Wijaya',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Kota Baru',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '0852-6543-2103'
  },
  {
    id: 'user-rt-bukitindah-01',
    username: 'rt01-bukitindah',
    password: 'password123',
    email: 'rt01.bukitindah@rakitkulim.desa.id',
    name: 'Suparman',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Bukit Indah',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '0821-4321-8705'
  },
  {
    id: 'user-rt-kuantan-01',
    username: 'rt01-kuantan',
    password: 'password123',
    email: 'rt01.kuantan@rakitkulim.desa.id',
    name: 'Zulkifli Harahap',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Kuantan Tenang',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    phone: '0853-1234-5606'
  },
  {
    id: 'user-rt-petonggan-01',
    username: 'rt01-petonggan',
    password: 'password123',
    email: 'rt01.petonggan@rakitkulim.desa.id',
    name: 'Arifin Siregar',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Petonggan',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    phone: '0812-3456-7807'
  },
  {
    id: 'user-rt-lubuk-01',
    username: 'rt01-lubuksetarak',
    password: 'password123',
    email: 'rt01.lubuk@rakitkulim.desa.id',
    name: 'Herman Syah',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Lubuk Setarak',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    phone: '0813-9012-3408'
  },
  {
    id: 'user-rt-talangsukamaju-01',
    username: 'rt01-talangsukamaju',
    password: 'password123',
    email: 'rt01.talangsukamaju@rakitkulim.desa.id',
    name: 'Darmawan Santoso',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Talang Suka Maju',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '0822-7890-1209'
  },
  {
    id: 'user-rt-talangparigi-01',
    username: 'rt01-talangparigi',
    password: 'password123',
    email: 'rt01.talangparigi@rakitkulim.desa.id',
    name: 'Nasrudin',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Talang Parigi',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    phone: '0852-8901-2310'
  },
  {
    id: 'user-rt-rimbaseminai-01',
    username: 'rt01-rimbaseminai',
    password: 'password123',
    email: 'rt01.rimba@rakitkulim.desa.id',
    name: 'Bambang Hermanto',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Rimba Seminai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '0813-7890-1207'
  },
  {
    id: 'user-rt-batusawar-01',
    username: 'rt01-batusawar',
    password: 'password123',
    email: 'rt01.batusawar@rakitkulim.desa.id',
    name: 'M. Nasiruddin',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Batu Sawar',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '0822-6789-0108'
  },
  {
    id: 'user-rt-kampungbungo-01',
    username: 'rt01-kampungbungo',
    password: 'password123',
    email: 'rt01.bungo@rakitkulim.desa.id',
    name: 'Baharuddin',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Kampung Bungo',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '0852-3456-7809'
  },
  {
    id: 'user-rt-sungaiekok-01',
    username: 'rt01-sungaiekok',
    password: 'password123',
    email: 'rt01.sungaiekok@rakitkulim.desa.id',
    name: 'Saprudin',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Sungai Ekok',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    phone: '0853-9012-3410'
  },
  {
    id: 'user-rt-talangduriancacar-01',
    username: 'rt01-talangduriancacar',
    password: 'password123',
    email: 'rt01.cacar@rakitkulim.desa.id',
    name: 'Marwan Effendi',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Talang Durian Cacar',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    phone: '0812-8901-2311'
  },
  {
    id: 'user-rt-talanggedabu-01',
    username: 'rt01-talanggedabu',
    password: 'password123',
    email: 'rt01.gedabu@rakitkulim.desa.id',
    name: 'Sudirman',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Talang Gedabu',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    phone: '0813-4567-8912'
  },
  {
    id: 'user-rt-talangpringjaya-01',
    username: 'rt01-talangpringjaya',
    password: 'password123',
    email: 'rt01.pringjaya@rakitkulim.desa.id',
    name: 'Wagiran Santoso',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Talang Pring Jaya',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '0852-6789-0114'
  },
  {
    id: 'user-rt-talangselantai-01',
    username: 'rt01-talangselantai',
    password: 'password123',
    email: 'rt01.selantai@rakitkulim.desa.id',
    name: 'Suwardi',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Talang Selantai',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '0853-7890-1215'
  },
  {
    id: 'user-rt-talangsungailimau-01',
    username: 'rt01-talangsungailimau',
    password: 'password123',
    email: 'rt01.sungailimau@rakitkulim.desa.id',
    name: 'Hermanto',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Talang Sungai Limau',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '0813-0123-4517'
  },
  {
    id: 'user-rt-talangsungaiparit-01',
    username: 'rt01-talangsungaiparit',
    password: 'password123',
    email: 'rt01.sungaiparit@rakitkulim.desa.id',
    name: 'Jupriadi',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Talang Sungai Parit',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    phone: '0821-1234-5618'
  },
  {
    id: 'user-rt-talang7buahtangga-01',
    username: 'rt01-talang7buahtangga',
    password: 'password123',
    email: 'rt01.7buahtangga@rakitkulim.desa.id',
    name: 'Alamsyah',
    role: 'rt',
    identifier: 'Ketua RT 01 / RW 01',
    village: 'Desa Talang Tujuh Buah Tangga',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    phone: '0852-2345-6719'
  },

  // --- AKUN OPERATOR KANTOR DESA / PATEN ---
  {
    id: 'user-operator',
    username: 'operator',
    password: 'password123',
    email: 'pelayanan@rakitkulim.desa.id',
    name: 'Asep Ridwan, S.Kom',
    role: 'operator',
    identifier: 'Operator Pelayanan Kantor Desa',
    village: 'Desa Kelayang (Kec. Rakit Kulim)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    phone: '0857-1234-5678'
  },

  // --- AKUN KASI PELAYANAN UMUM KECAMATAN RAKIT KULIM ---
  {
    id: 'user-kecamatan',
    username: 'kasi',
    password: 'password123',
    email: 'paten@rakitkulim.inhukab.go.id',
    name: 'Drs. H. Suryana, M.Si',
    role: 'kecamatan',
    identifier: 'Kasi Tata Pemerintahan & PATEN',
    village: 'Kecamatan Rakit Kulim, Kab. Inhu',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    phone: '0811-2233-4455',
    status: 'active'
  },

  // --- AKUN MASTER (SUPER ADMIN KECAMATAN RAKIT KULIM) ---
  {
    id: 'user-superadmin',
    username: 'admin',
    password: 'CloudMe',
    email: 'admin.master@rakitkulim.inhukab.go.id',
    name: 'Administrator Master PATEN',
    role: 'admin',
    identifier: 'Super Admin Kecamatan Rakit Kulim',
    village: 'Kecamatan Rakit Kulim, Kab. Inhu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '0812-9988-7766',
    status: 'active',
    emailVerified: true
  }
];

// Data Permohonan Awal di Kecamatan Rakit Kulim
export const INITIAL_REQUESTS: CitizenRequest[] = [];

// Statistik 19 Desa di Kecamatan Rakit Kulim untuk Dashboard Kecamatan
export const MOCK_VILLAGE_STATS: VillageStats[] = [
  {
    villageId: "desa-kelayang",
    villageName: "Desa Kelayang (Ibukota Kec)",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-kotabaru",
    villageName: "Desa Kota Baru",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-bukitindah",
    villageName: "Desa Bukit Indah",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-kuantantenang",
    villageName: "Desa Kuantan Tenang",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-petonggan",
    villageName: "Desa Petonggan",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-lubuksetarak",
    villageName: "Desa Lubuk Setarak",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-rimbaseminai",
    villageName: "Desa Rimba Seminai",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-batusawar",
    villageName: "Desa Batu Sawar",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-kampungbungo",
    villageName: "Desa Kampung Bungo",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-talangsukamaju",
    villageName: "Desa Talang Suka Maju",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-talangparigi",
    villageName: "Desa Talang Parigi",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-talangpringjaya",
    villageName: "Desa Talang Pring Jaya",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-talangselantai",
    villageName: "Desa Talang Selantai",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-talangduriancacar",
    villageName: "Desa Talang Durian Cacar",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-talanggedabu",
    villageName: "Desa Talang Gedabu",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-talangsungailimau",
    villageName: "Desa Talang Sungai Limau",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-talangsungaiparit",
    villageName: "Desa Talang Sungai Parit",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-talang7buahtangga",
    villageName: "Desa Talang Tujuh Buah Tangga",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  },
  {
    villageId: "desa-sungaiekok",
    villageName: "Desa Sungai Ekok",
    totalRequests: 0,
    completed: 0,
    inProgress: 0,
    revision: 0,
    averageSlaHours: 0,
    slaPerformancePercent: 0,
    topService: "-"
  }
];

export const INITIAL_WA_LOGS: WhatsAppMessageLog[] = [
  {
    id: 'wa-001',
    recipientPhone: '081399887766',
    recipientName: 'Rian Hidayat',
    ticketNumber: 'REQ-20261005-015',
    messageType: 'SIAP_DIAMBIL',
    content: 'Yth. Bpk/Ibu Rian Hidayat, permohonan Surat Keterangan Domisili (SKD) No: 470/115/DS-BKI/X/2026 telah SELESAI ditandatangani Kepala Desa Bukit Indah. Silakan ambil fisik surat asli di Kantor Pelayanan Desa Bukit Indah pada jam kerja (08.00-15.00 WIB) dengan membawa KTP Asli. Terima kasih. (Kantor Pelayanan Desa Bukit Indah, Kec. Rakit Kulim)',
    timestamp: '05 Okt 2026, 16:30 WIB',
    status: 'Terkirim',
    directWaLink: 'https://wa.me/6281399887766?text=Halo%20Bpk%2FIbu%20Rian%20Hidayat'
  },
  {
    id: 'wa-002',
    recipientPhone: '081287654321',
    recipientName: 'Budi Santoso',
    ticketNumber: 'REQ-20261006-001',
    messageType: 'PENGAJUAN_DITERIMA',
    content: 'Halo Bpk Budi Santoso, permohonan Surat Keterangan Usaha (SKU) Anda telah didaftarkan oleh Junaidi, S.Pd (RT 01 Desa Kelayang) dengan No. Tiket: REQ-20261006-001. Berkas Anda sedang menunggu verifikasi petugas Kantor Pelayanan Desa Kelayang, Kec. Rakit Kulim.',
    timestamp: '06 Okt 2026, 08:30 WIB',
    status: 'Terkirim',
    directWaLink: 'https://wa.me/6281287654321?text=Halo%20Bpk%20Budi%20Santoso'
  }
];
