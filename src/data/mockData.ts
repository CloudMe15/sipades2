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
export const INITIAL_REQUESTS: CitizenRequest[] = [
  {
    id: 'req-001',
    ticketNumber: 'REQ-20261006-001',
    nomorSuratDesa: '510/042/DS-KLY/X/2026',
    nik: '1402091205930002',
    namaLengkap: 'Budi Santoso',
    nomorWhatsapp: '081287654321',
    nomorKk: '1402092508110005',
    tempatLahir: 'Kelayang',
    tanggalLahir: '1993-05-12',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    pekerjaan: 'Petani Kelapa Sawit / Wiraswasta',
    alamat: 'Dusun Sukamulia, RT 01 / RW 01',
    rt: '01',
    rw: '01',
    desa: 'Desa Kelayang',
    serviceType: 'SKU',
    keperluan: 'Syarat pengajuan modal perkebunan kelapa sawit Kredit Usaha Rakyat (KUR) di Bank BRI Unit Kelayang.',
    rincianTambahan: {
      'Nama Usaha': 'Usaha Perkebunan Kelapa Sawit & Saprodi Berkah',
      'Bidang Usaha': 'Perkebunan Rakyat & Penjualan Pupuk',
      'Tahun Berdiri': '2019',
      'Lokasi Usaha': 'Jl. Poros Desa Kelayang, RT 01/RW 01'
    },
    attachments: [
      {
        id: 'att-001',
        type: 'ktp',
        name: 'KTP_Budi_Santoso_Kelayang.jpg',
        fileUrl: 'https://placehold.co/600x400/1e293b/ffffff?text=FOTO+E-KTP+BUDI+SANTOSO',
        uploadedAt: '06 Okt 2026, 08:30 WIB',
        uploadedBy: 'Junaidi, S.Pd (RT 01 Desa Kelayang)',
        status: 'valid'
      },
      {
        id: 'att-002',
        type: 'kk',
        name: 'KK_Budi_Santoso.jpg',
        fileUrl: 'https://placehold.co/600x400/334155/ffffff?text=KARTU+KELUARGA+BUDI+SANTOSO',
        uploadedAt: '06 Okt 2026, 08:30 WIB',
        uploadedBy: 'Junaidi, S.Pd (RT 01 Desa Kelayang)',
        status: 'valid'
      }
    ],
    status: 'menunggu_verifikasi',
    createdAt: '06 Okt 2026, 08:30 WIB',
    updatedAt: '06 Okt 2026, 08:30 WIB',
    estimatedCompletion: 'Dalam 24 Jam Kerja',
    timeline: [
      {
        id: 'tl-001',
        status: 'menunggu_verifikasi',
        timestamp: '06 Okt 2026, 08:30 WIB',
        actor: 'Junaidi, S.Pd (Ketua RT 01)',
        role: 'rt',
        note: 'Permohonan Surat Keterangan Usaha (SKU) didaftarkan melalui loket online RT 01 Desa Kelayang.'
      }
    ]
  },
  {
    id: 'req-002',
    ticketNumber: 'REQ-20261006-002',
    nomorSuratDesa: '331/018/DS-KTB/X/2026',
    nik: '1402095508020003',
    namaLengkap: 'Siti Rahmawati',
    nomorWhatsapp: '085277889900',
    nomorKk: '1402091402120008',
    tempatLahir: 'Kota Baru',
    tanggalLahir: '2002-08-15',
    jenisKelamin: 'Perempuan',
    agama: 'Islam',
    pekerjaan: 'Pelajar / Mahasiswa',
    alamat: 'Jl. Pemuda No. 12, RT 01 / RW 01',
    rt: '01',
    rw: '01',
    desa: 'Desa Kota Baru',
    serviceType: 'SKCK',
    keperluan: 'Syarat pendaftaran seleksi Calon Pegawai Negeri Sipil (CPNS) di Pemerintah Kabupaten Indragiri Hulu.',
    attachments: [
      {
        id: 'att-003',
        type: 'ktp',
        name: 'KTP_Siti_Rahmawati.jpg',
        fileUrl: 'https://placehold.co/600x400/0f172a/ffffff?text=KTP+SITI+RAHMAWATI',
        uploadedAt: '06 Okt 2026, 09:10 WIB',
        uploadedBy: 'Hendra Wijaya (RT 01 Desa Kota Baru)',
        status: 'valid'
      },
      {
        id: 'att-004',
        type: 'kk',
        name: 'KK_Keluarga_Rahmawati.jpg',
        fileUrl: 'https://placehold.co/600x400/1e1b4b/ffffff?text=KK+KELUARGA+SITI+RAHMAWATI',
        uploadedAt: '06 Okt 2026, 09:10 WIB',
        uploadedBy: 'Hendra Wijaya (RT 01 Desa Kota Baru)',
        status: 'valid'
      }
    ],
    status: 'diproses',
    createdAt: '06 Okt 2026, 09:10 WIB',
    updatedAt: '06 Okt 2026, 09:45 WIB',
    estimatedCompletion: 'Dalam 4 Jam Kerja',
    timeline: [
      {
        id: 'tl-002',
        status: 'menunggu_verifikasi',
        timestamp: '06 Okt 2026, 09:10 WIB',
        actor: 'Hendra Wijaya (RT 01 Kota Baru)',
        role: 'rt',
        note: 'Pengajuan Pengantar SKCK berhasil diserahkan ke sistem desa.'
      },
      {
        id: 'tl-003',
        status: 'diproses',
        timestamp: '06 Okt 2026, 09:45 WIB',
        actor: 'Asep Ridwan, S.Kom (Operator)',
        role: 'operator',
        note: 'Berkas e-KTP dan KK diverifikasi lengkap. Draf surat fisik pengantar ke Polsek sedang dicetak.'
      }
    ]
  },
  {
    id: 'req-003',
    ticketNumber: 'REQ-20261005-015',
    nomorSuratDesa: '470/115/DS-BKI/X/2026',
    nik: '1402092107980004',
    namaLengkap: 'Rian Hidayat',
    nomorWhatsapp: '081399887766',
    nomorKk: '1402091104100002',
    tempatLahir: 'Bukit Indah',
    tanggalLahir: '1998-07-21',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    pekerjaan: 'Karyawan Swasta',
    alamat: 'Dusun Jaya Makmur RT 01 / RW 01',
    rt: '01',
    rw: '01',
    desa: 'Desa Bukit Indah',
    serviceType: 'SKD',
    keperluan: 'Persyaratan kelengkapan mutasi kerja di pabrik kelapa sawit PT. Inhu Palma Lestari.',
    attachments: [
      {
        id: 'att-005',
        type: 'ktp',
        name: 'KTP_Rian_Hidayat.jpg',
        fileUrl: 'https://placehold.co/600x400/064e3b/ffffff?text=KTP+RIAN+HIDAYAT',
        uploadedAt: '05 Okt 2026, 14:00 WIB',
        uploadedBy: 'Suparman (RT 01 Bukit Indah)',
        status: 'valid'
      },
      {
        id: 'att-006',
        type: 'surat_selesai_scan',
        name: 'Scan_Resmi_SKD_Rian_Hidayat_Signed.pdf',
        fileUrl: 'https://placehold.co/600x800/065f46/ffffff?text=SURAT+RESMI+TERTANDATANGANI+KADES+BUKIT+INDAH',
        uploadedAt: '05 Okt 2026, 16:30 WIB',
        uploadedBy: 'Asep Ridwan (Operator)',
        status: 'valid'
      }
    ],
    status: 'selesai_siap_ambil',
    createdAt: '05 Okt 2026, 14:00 WIB',
    updatedAt: '05 Okt 2026, 16:30 WIB',
    completedAt: '05 Okt 2026, 16:30 WIB',
    slaActualHours: 2.5,
    estimatedCompletion: 'Selesai',
    timeline: [
      {
        id: 'tl-004',
        status: 'menunggu_verifikasi',
        timestamp: '05 Okt 2026, 14:00 WIB',
        actor: 'Suparman (RT 01 Bukit Indah)',
        role: 'rt',
        note: 'Pengajuan surat domisili didaftarkan.'
      },
      {
        id: 'tl-005',
        status: 'diproses',
        timestamp: '05 Okt 2026, 14:30 WIB',
        actor: 'Operator Pelayanan',
        role: 'operator',
        note: 'Draf surat dicetak.'
      },
      {
        id: 'tl-006',
        status: 'menunggu_ttd_kades',
        timestamp: '05 Okt 2026, 15:00 WIB',
        actor: 'Operator Pelayanan',
        role: 'operator',
        note: 'Diserahkan ke Kepala Desa untuk tanda tangan basah & stempel dinas.'
      },
      {
        id: 'tl-007',
        status: 'selesai_siap_ambil',
        timestamp: '05 Okt 2026, 16:30 WIB',
        actor: 'Operator Pelayanan',
        role: 'operator',
        note: 'Surat resmi selesai ditandatangani Kades. Notifikasi WhatsApp terkirim ke warga.'
      }
    ]
  },
  {
    id: 'req-004',
    ticketNumber: 'REQ-20261005-008',
    nomorSuratDesa: '474/011/DS-TSM/X/2026',
    nik: '1402094803970001',
    namaLengkap: 'Dewi Lestari',
    nomorWhatsapp: '085366778899',
    nomorKk: '1402092006150009',
    tempatLahir: 'Talang Suka Maju',
    tanggalLahir: '1997-03-08',
    jenisKelamin: 'Perempuan',
    agama: 'Islam',
    pekerjaan: 'Wiraswasta',
    alamat: 'Dusun Rimba Makmur RT 01 / RW 01',
    rt: '01',
    rw: '01',
    desa: 'Desa Talang Suka Maju',
    serviceType: 'SPN',
    keperluan: 'Permohonan formulir pengantar pendaftaran akad nikah N1-N4 ke KUA Kecamatan Rakit Kulim.',
    attachments: [
      {
        id: 'att-007',
        type: 'ktp',
        name: 'KTP_Dewi_Lestari.jpg',
        fileUrl: 'https://placehold.co/600x400/4c1d95/ffffff?text=KTP+DEWI+LESTARI',
        uploadedAt: '05 Okt 2026, 10:15 WIB',
        uploadedBy: 'Darmawan (RT 01 Talang Suka Maju)',
        status: 'valid'
      }
    ],
    status: 'sudah_diambil',
    createdAt: '05 Okt 2026, 10:15 WIB',
    updatedAt: '05 Okt 2026, 17:00 WIB',
    completedAt: '05 Okt 2026, 15:45 WIB',
    slaActualHours: 5.5,
    estimatedCompletion: 'Selesai',
    handover: {
      pickedUpAt: '05 Okt 2026, 17:00 WIB',
      pickedUpBy: 'Dewi Lestari',
      relationToCitizen: 'Pemohon Sendiri',
      operatorName: 'Asep Ridwan, S.Kom',
      notes: 'Surat formulir nikah N1-N4 asli diserahkan langsung kepada pemohon untuk dibawa ke KUA Rakit Kulim.',
      idCardVerified: true
    },
    timeline: [
      {
        id: 'tl-008',
        status: 'menunggu_verifikasi',
        timestamp: '05 Okt 2026, 10:15 WIB',
        actor: 'Darmawan (RT 01 Talang Suka Maju)',
        role: 'rt',
        note: 'Permohonan diajukan.'
      },
      {
        id: 'tl-009',
        status: 'selesai_siap_ambil',
        timestamp: '05 Okt 2026, 15:45 WIB',
        actor: 'Operator Pelayanan',
        role: 'operator',
        note: 'Surat selesai ditandatangani Kepala Desa.'
      },
      {
        id: 'tl-010',
        status: 'sudah_diambil',
        timestamp: '05 Okt 2026, 17:00 WIB',
        actor: 'Operator Pelayanan',
        role: 'operator',
        note: 'Fisik surat asli telah diserahkan di loket kantor desa kepada Dewi Lestari. KTP telah dicocokkan.'
      }
    ]
  }
];

// Statistik 19 Desa di Kecamatan Rakit Kulim untuk Dashboard Kecamatan
export const MOCK_VILLAGE_STATS: VillageStats[] = [
  {
    villageId: 'desa-kelayang',
    villageName: 'Desa Kelayang (Ibukota Kec)',
    totalRequests: 145,
    completed: 132,
    inProgress: 9,
    revision: 4,
    averageSlaHours: 4.2,
    slaPerformancePercent: 96.5,
    topService: 'Surat Keterangan Usaha (SKU)'
  },
  {
    villageId: 'desa-kotabaru',
    villageName: 'Desa Kota Baru',
    totalRequests: 118,
    completed: 106,
    inProgress: 8,
    revision: 4,
    averageSlaHours: 4.8,
    slaPerformancePercent: 94.0,
    topService: 'Surat Pengantar SKCK'
  },
  {
    villageId: 'desa-bukitindah',
    villageName: 'Desa Bukit Indah',
    totalRequests: 96,
    completed: 88,
    inProgress: 5,
    revision: 3,
    averageSlaHours: 5.1,
    slaPerformancePercent: 92.5,
    topService: 'Surat Keterangan Domisili (SKD)'
  },
  {
    villageId: 'desa-kuantantenang',
    villageName: 'Desa Kuantan Tenang',
    totalRequests: 84,
    completed: 78,
    inProgress: 4,
    revision: 2,
    averageSlaHours: 5.4,
    slaPerformancePercent: 93.8,
    topService: 'Surat Keterangan Tidak Mampu (SKTM)'
  },
  {
    villageId: 'desa-petonggan',
    villageName: 'Desa Petonggan',
    totalRequests: 92,
    completed: 84,
    inProgress: 6,
    revision: 2,
    averageSlaHours: 4.9,
    slaPerformancePercent: 94.2,
    topService: 'Surat Pengantar Nikah (SPN)'
  },
  {
    villageId: 'desa-lubuksetarak',
    villageName: 'Desa Lubuk Setarak',
    totalRequests: 76,
    completed: 70,
    inProgress: 4,
    revision: 2,
    averageSlaHours: 5.6,
    slaPerformancePercent: 91.0,
    topService: 'Surat Keterangan Usaha (SKU)'
  },
  {
    villageId: 'desa-rimbaseminai',
    villageName: 'Desa Rimba Seminai',
    totalRequests: 68,
    completed: 62,
    inProgress: 4,
    revision: 2,
    averageSlaHours: 5.8,
    slaPerformancePercent: 90.2,
    topService: 'Surat Keterangan Pindah (SKP)'
  },
  {
    villageId: 'desa-batusawar',
    villageName: 'Desa Batu Sawar',
    totalRequests: 64,
    completed: 58,
    inProgress: 4,
    revision: 2,
    averageSlaHours: 6.0,
    slaPerformancePercent: 89.5,
    topService: 'Surat Pengantar SKCK'
  },
  {
    villageId: 'desa-kampungbungo',
    villageName: 'Desa Kampung Bungo',
    totalRequests: 59,
    completed: 54,
    inProgress: 3,
    revision: 2,
    averageSlaHours: 6.2,
    slaPerformancePercent: 88.9,
    topService: 'Surat Keterangan Domisili'
  },
  {
    villageId: 'desa-talangsukamaju',
    villageName: 'Desa Talang Suka Maju',
    totalRequests: 72,
    completed: 66,
    inProgress: 4,
    revision: 2,
    averageSlaHours: 5.2,
    slaPerformancePercent: 92.0,
    topService: 'Surat Pengantar Nikah (N1-N4)'
  },
  {
    villageId: 'desa-talangparigi',
    villageName: 'Desa Talang Parigi',
    totalRequests: 55,
    completed: 50,
    inProgress: 3,
    revision: 2,
    averageSlaHours: 6.4,
    slaPerformancePercent: 87.5,
    topService: 'Surat Keterangan Usaha (SKU)'
  },
  {
    villageId: 'desa-talangpringjaya',
    villageName: 'Desa Talang Pring Jaya',
    totalRequests: 62,
    completed: 56,
    inProgress: 4,
    revision: 2,
    averageSlaHours: 5.9,
    slaPerformancePercent: 90.0,
    topService: 'Surat Keterangan Tidak Mampu (SKTM)'
  },
  {
    villageId: 'desa-talangselantai',
    villageName: 'Desa Talang Selantai',
    totalRequests: 48,
    completed: 43,
    inProgress: 3,
    revision: 2,
    averageSlaHours: 6.6,
    slaPerformancePercent: 86.8,
    topService: 'Surat Pengantar SKCK'
  },
  {
    villageId: 'desa-talangduriancacar',
    villageName: 'Desa Talang Durian Cacar',
    totalRequests: 52,
    completed: 47,
    inProgress: 3,
    revision: 2,
    averageSlaHours: 6.3,
    slaPerformancePercent: 88.0,
    topService: 'Surat Keterangan Usaha (SKU)'
  },
  {
    villageId: 'desa-talanggedabu',
    villageName: 'Desa Talang Gedabu',
    totalRequests: 46,
    completed: 41,
    inProgress: 3,
    revision: 2,
    averageSlaHours: 6.7,
    slaPerformancePercent: 86.0,
    topService: 'Surat Keterangan Domisili'
  },
  {
    villageId: 'desa-talangsungailimau',
    villageName: 'Desa Talang Sungai Limau',
    totalRequests: 44,
    completed: 39,
    inProgress: 3,
    revision: 2,
    averageSlaHours: 6.8,
    slaPerformancePercent: 85.5,
    topService: 'Surat Pengantar Nikah (N1-N4)'
  },
  {
    villageId: 'desa-talangsungaiparit',
    villageName: 'Desa Talang Sungai Parit',
    totalRequests: 42,
    completed: 38,
    inProgress: 2,
    revision: 2,
    averageSlaHours: 6.5,
    slaPerformancePercent: 87.0,
    topService: 'Surat Keterangan Tidak Mampu'
  },
  {
    villageId: 'desa-talang7buahtangga',
    villageName: 'Desa Talang Tujuh Buah Tangga',
    totalRequests: 40,
    completed: 36,
    inProgress: 2,
    revision: 2,
    averageSlaHours: 6.9,
    slaPerformancePercent: 85.0,
    topService: 'Surat Keterangan Usaha (SKU)'
  },
  {
    villageId: 'desa-sungaiekok',
    villageName: 'Desa Sungai Ekok',
    totalRequests: 38,
    completed: 34,
    inProgress: 2,
    revision: 2,
    averageSlaHours: 7.0,
    slaPerformancePercent: 84.5,
    topService: 'Surat Pengantar SKCK'
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
