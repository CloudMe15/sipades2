export type UserRole = 'rt' | 'operator' | 'kecamatan' | 'admin';

export type RequestStatus =
  | 'menunggu_verifikasi'    // 🟡 Menunggu Verifikasi Operator
  | 'butuh_perbaikan'        // 🔴 Butuh Perbaikan Dokumen (Ditolak Sementara)
  | 'diproses'               // 🔵 Sedang Diproses Operator
  | 'menunggu_ttd_kades'     // 🟣 Menunggu Tanda Tangan Kades
  | 'selesai_siap_ambil'     // 🟢 Selesai & Siap Diambil
  | 'sudah_diambil';         // ⚪ Sudah Diambil Warga (Arsip)

export type ServiceType =
  | 'SKCK'      // Surat Pengantar SKCK
  | 'SKU'       // Surat Keterangan Usaha
  | 'SKTM'      // Surat Keterangan Tidak Mampu
  | 'SKD'       // Surat Keterangan Domisili
  | 'SKP'       // Surat Keterangan Pindah
  | 'SPN'       // Surat Pengantar Nikah (N1-N4)
  | 'SKK';      // Surat Keterangan Kematian/Kelahiran

export interface ServiceMeta {
  code: ServiceType;
  name: string;
  fullName: string;
  requiredDocs: string[];
  slaHours: number;
  description: string;
}

export interface DocumentAttachment {
  id: string;
  type: 'ktp' | 'kk' | 'surat_pengantar_rt' | 'dokumen_pendukung' | 'surat_selesai_scan';
  name: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
  status: 'valid' | 'invalid' | 'pending';
  revisionNote?: string;
}

export interface StatusTimelineEvent {
  id: string;
  status: RequestStatus;
  timestamp: string;
  actor: string;
  role: UserRole;
  note?: string;
}

export interface CitizenRequest {
  id: string;
  ticketNumber: string; // e.g. REQ-20261006-001
  nomorSuratDesa?: string; // e.g. 470/102/DS-SKM/X/2026

  // Data Pemohon (Warga)
  nik: string;
  namaLengkap: string;
  nomorWhatsapp: string;
  nomorKk: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  agama: string;
  pekerjaan: string;
  alamat: string;
  rt: string; // e.g. "01"
  rw: string; // e.g. "03"
  desa: string; // e.g. "Desa Sukamaju"

  // Data Permohonan
  serviceType: ServiceType;
  keperluan: string;
  rincianTambahan?: Record<string, string>; // e.g. Nama Usaha, Jenis Usaha untuk SKU

  // Dokumen
  attachments: DocumentAttachment[];

  // Status & Tracking
  status: RequestStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  estimatedCompletion: string;
  completedAt?: string;
  slaActualHours?: number;

  // Tracking Log
  timeline: StatusTimelineEvent[];

  // Ekspedisi / Handover Data
  handover?: {
    pickedUpAt: string;
    pickedUpBy: string;
    relationToCitizen: 'Pemohon Sendiri' | 'Keluarga 1 KK' | 'Kuasa/Perwakilan';
    operatorName: string;
    notes?: string;
    idCardVerified: boolean;
  };
}

export interface CurrentUser {
  id: string;
  username: string;
  password?: string;
  email?: string;
  name: string;
  role: UserRole;
  identifier: string; // e.g. "RT 01 / RW 03", "Operator Umum", "Kasi Pelayanan Kecamatan", "Super Admin Master"
  village: string;
  avatar: string;
  phone: string;
  status?: 'active' | 'pending' | 'rejected';
  emailVerified?: boolean;
  emailVerificationCode?: string;
  registeredAt?: string;
}

export interface WhatsAppMessageLog {
  id: string;
  recipientPhone: string;
  recipientName: string;
  ticketNumber: string;
  messageType: 'PENGAJUAN_DITERIMA' | 'PERMINTAAN_REVISI' | 'SIAP_DIAMBIL';
  content: string;
  timestamp: string;
  status: 'Terkirim' | 'Gagal' | 'Pending';
  directWaLink: string;
}

export interface VillageStats {
  villageId: string;
  villageName: string;
  totalRequests: number;
  completed: number;
  inProgress: number;
  revision: number;
  averageSlaHours: number;
  slaPerformancePercent: number;
  topService: string;
}
