import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  CitizenRequest,
  CurrentUser,
  DocumentAttachment,
  RakitKulimVillage,
  RequestStatus,
  ServiceType,
  VillageStats,
  WhatsAppMessageLog
} from '../types';
import {
  INITIAL_REQUESTS,
  INITIAL_WA_LOGS,
  MOCK_USERS,
  MOCK_VILLAGE_STATS,
  RAKIT_KULIM_VILLAGES,
  SERVICE_METAS
} from '../data/mockData';

interface WaGatewayConfig {
  provider: 'Fonnte WA Gateway' | 'Direct WA Gateway' | 'Wablas API' | 'Twilio API';
  apiKey: string;
  senderPhone: string;
  autoSendOnReady: boolean;
  autoSendOnRevision: boolean;
  autoSendOnSubmission: boolean;
}

interface AppContextType {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  switchUserById: (id: string) => void;
  login: (usernameOrEmail: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  registerUser: (newUser: Omit<CurrentUser, 'id'>) => Promise<{ success: boolean; message: string; user?: CurrentUser }>;
  updateProfile: (updatedData: Partial<CurrentUser>) => Promise<{ success: boolean; message: string }>;
  approveUser: (userId: string) => Promise<boolean>;
  rejectUser: (userId: string) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  users: CurrentUser[];

  // Profile Modal State
  profileModalOpen: boolean;
  setProfileModalOpen: (open: boolean) => void;

  // Master Admin Approval Modal State
  adminApprovalModalOpen: boolean;
  setAdminApprovalModalOpen: (open: boolean) => void;

  // Reset Password Modal State
  resetPasswordModalOpen: boolean;
  setResetPasswordModalOpen: (open: boolean) => void;

  sendPasswordResetOtp: (emailOrUsername: string) => Promise<{ success: boolean; message: string; email?: string; code?: string }>;
  verifyPasswordResetOtp: (emailOrUsername: string, code: string) => boolean;
  confirmPasswordReset: (emailOrUsername: string, code: string, newPassword: string) => Promise<{ success: boolean; message: string }>;

  sendRegistrationOtp: (email: string) => Promise<{ success: boolean; message: string; code: string }>;
  verifyRegistrationOtp: (email: string, code: string) => boolean;

  requests: CitizenRequest[];
  createRequest: (newReqData: {
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
    rt: string;
    rw: string;
    desa: string;
    serviceType: ServiceType;
    keperluan: string;
    rincianTambahan?: Record<string, string>;
    attachments: DocumentAttachment[];
  }) => CitizenRequest;

  operatorAcceptRequest: (requestId: string) => void;
  operatorRequestRevision: (requestId: string, reason: string) => void;
  operatorSendToKades: (requestId: string) => void;
  operatorCompleteRequest: (requestId: string, scanDocUrl?: string, scanDocName?: string) => void;
  rtSubmitRevision: (requestId: string, updatedAttachments: DocumentAttachment[], note?: string) => void;
  recordHandover: (requestId: string, handoverData: NonNullable<CitizenRequest['handover']>) => void;
  deleteRequest: (requestId: string) => void;
  resetToSampleData: () => void;
  clearComparisonData: () => Promise<void>;
  downloadDocument: (fileUrl: string, fileName: string) => Promise<void>;
  downloadAllDocuments: (req: CitizenRequest) => Promise<void>;
  exportRequestsToCsv: (customRequests?: CitizenRequest[]) => void;

  // Real-time MySQL sync state
  isSyncing: boolean;
  lastSyncTime: Date | null;
  forceSync: () => Promise<void>;
  newNotification: string | null;
  clearNotification: () => void;

  // WA Gateway
  waLogs: WhatsAppMessageLog[];
  waGatewayConfig: WaGatewayConfig;
  updateWaGatewayConfig: (config: Partial<WaGatewayConfig>) => void;
  sendManualWhatsApp: (phone: string, text: string) => void;

  // Stats
  villageStats: VillageStats[];

  // Villages & Kepala Desa Management (Super Admin)
  villages: RakitKulimVillage[];
  updateVillageKades: (villageId: string, newKadesName: string, phone?: string) => Promise<boolean>;
  resetVillagesToDefault: () => void;
  manageVillagesModalOpen: boolean;
  setManageVillagesModalOpen: (open: boolean) => void;

  // Manual Signed Document Upload & Preview
  uploadManualSignedFile: (requestId: string, fileUrl: string, fileName: string, markComplete?: boolean) => void;
  previewSignedDoc: { url: string; name: string; request?: CitizenRequest } | null;
  setPreviewSignedDoc: (doc: { url: string; name: string; request?: CitizenRequest } | null) => void;

  // Active view modals
  selectedRequest: CitizenRequest | null;
  setSelectedRequest: (req: CitizenRequest | null) => void;
  letterModalRequest: CitizenRequest | null;
  setLetterModalRequest: (req: CitizenRequest | null) => void;
  verificationModalRequest: CitizenRequest | null;
  setVerificationModalRequest: (req: CitizenRequest | null) => void;
  waModalOpen: boolean;
  setWaModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  REQUESTS: 'sipades_requests_v1',
  WA_LOGS: 'sipades_wa_logs_v1',
  ACTIVE_USER: 'sipades_active_user_v1',
  GATEWAY_CONFIG: 'sipades_gateway_config_v1',
  USERS: 'sipades_users_v1',
  VILLAGES: 'sipades_villages_kades_v1'
};

const DEFAULT_WA_CONFIG: WaGatewayConfig = {
  provider: 'Fonnte WA Gateway',
  apiKey: 'FONNTE_DEMO_KEY_RAKIT_KULIM_2026',
  senderPhone: '0857-1234-5678 (KANTOR PELAYANAN KEC. RAKIT KULIM)',
  autoSendOnReady: true,
  autoSendOnRevision: true,
  autoSendOnSubmission: true
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<CurrentUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with any new defaults and enforce master admin password CloudMe
          const merged = parsed.map((u: any) => {
            if (u.username && u.username.toLowerCase() === 'admin') {
              return {
                ...u,
                password: 'CloudMe',
                role: 'admin',
                status: 'active',
                emailVerified: true
              };
            }
            return u;
          });
          MOCK_USERS.forEach(mu => {
            if (!merged.find(u => u.username.toLowerCase() === mu.username.toLowerCase())) {
              merged.push(mu);
            }
          });
          return merged;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return MOCK_USERS;
  });

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    if (saved) {
      try {
        const savedUsersRaw = localStorage.getItem(STORAGE_KEYS.USERS);
        const userList: CurrentUser[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : MOCK_USERS;
        const found = userList.find(u => u.id === saved || u.username === saved);
        if (found) return found;
      } catch (e) {
        console.error(e);
      }
    }
    return null; // Start as public portal / login screen
  });

  const [requests, setRequests] = useState<CitizenRequest[]>(() => {
    // Reset test storage cache so tester starts with clean 0 requests
    const resetMarker = localStorage.getItem('sipades_empty_test_v3');
    if (!resetMarker) {
      localStorage.removeItem(STORAGE_KEYS.REQUESTS);
      localStorage.setItem('sipades_empty_test_v3', 'true');
      return [];
    }
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REQUESTS;
  });

  const [waLogs, setWaLogs] = useState<WhatsAppMessageLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WA_LOGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_WA_LOGS;
  });

  const [waGatewayConfig, setWaGatewayConfig] = useState<WaGatewayConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GATEWAY_CONFIG);
    if (saved) {
      try {
        return { ...DEFAULT_WA_CONFIG, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_WA_CONFIG;
  });

  // Komparasi Pelayanan Antar-Desa dihitung dinamis dari data pengujian permohonan nyata
  const villageStats: VillageStats[] = useMemo(() => {
    return MOCK_VILLAGE_STATS.map(v => {
      const normalizedName = v.villageName.toLowerCase().replace(/\s*\(.*\)/, '').trim();
      const villageRequests = requests.filter(r => {
        const reqDesa = (r.desa || '').toLowerCase();
        return reqDesa.includes(normalizedName) || normalizedName.includes(reqDesa);
      });

      const total = villageRequests.length;
      if (total === 0) {
        return {
          ...v,
          totalRequests: 0,
          completed: 0,
          inProgress: 0,
          revision: 0,
          averageSlaHours: 0,
          slaPerformancePercent: 0,
          topService: '-'
        };
      }

      const completedReqs = villageRequests.filter(
        r => r.status === 'selesai_siap_ambil' || r.status === 'sudah_diambil'
      );
      const revision = villageRequests.filter(r => r.status === 'butuh_perbaikan').length;
      const inProgress = villageRequests.filter(
        r => ['menunggu_verifikasi', 'diproses', 'menunggu_ttd_kades'].includes(r.status)
      ).length;

      const completedWithSla = completedReqs.filter(r => typeof r.slaActualHours === 'number' && r.slaActualHours > 0);
      const avgSla = completedWithSla.length > 0
        ? parseFloat((completedWithSla.reduce((sum, r) => sum + (r.slaActualHours || 0), 0) / completedWithSla.length).toFixed(1))
        : 0;

      const slaPercent = total > 0 ? Math.round((completedReqs.length / total) * 100) : 0;

      const serviceCounts: Record<string, number> = {};
      villageRequests.forEach(r => {
        const svc = r.serviceType || 'SKU';
        serviceCounts[svc] = (serviceCounts[svc] || 0) + 1;
      });
      let topSvc = '-';
      let maxCount = 0;
      Object.entries(serviceCounts).forEach(([k, c]) => {
        if (c > maxCount) {
          maxCount = c;
          topSvc = k;
        }
      });

      const serviceNames: Record<string, string> = {
        SKU: 'Surat Keterangan Usaha (SKU)',
        SKTM: 'Surat Keterangan Tidak Mampu (SKTM)',
        SKCK: 'Surat Pengantar SKCK',
        SKD: 'Surat Keterangan Domisili (SKD)',
        SKP: 'Surat Keterangan Pindah (SKP)',
        SPN: 'Surat Pengantar Nikah (SPN)',
        SKK: 'Surat Keterangan Kematian/Kelahiran'
      };

      return {
        ...v,
        totalRequests: total,
        completed: completedReqs.length,
        inProgress,
        revision,
        averageSlaHours: avgSla,
        slaPerformancePercent: slaPercent,
        topService: serviceNames[topSvc] || topSvc
      };
    });
  }, [requests]);

  // Modals state
  const [selectedRequest, setSelectedRequest] = useState<CitizenRequest | null>(null);
  const [letterModalRequest, setLetterModalRequest] = useState<CitizenRequest | null>(null);
  const [verificationModalRequest, setVerificationModalRequest] = useState<CitizenRequest | null>(null);
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [adminApprovalModalOpen, setAdminApprovalModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [manageVillagesModalOpen, setManageVillagesModalOpen] = useState(false);

  // Daftar 19 Desa & Nama Kepala Desa (Dapat diubah oleh Super Admin)
  const [villages, setVillages] = useState<RakitKulimVillage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VILLAGES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return RAKIT_KULIM_VILLAGES;
  });

  const updateVillageKades = async (villageId: string, newKadesName: string, phone?: string): Promise<boolean> => {
    const cleanKades = newKadesName.trim();
    if (!cleanKades) return false;

    setVillages(prev => {
      const updated = prev.map(v => {
        if (v.id === villageId || v.name.toLowerCase() === villageId.toLowerCase()) {
          return {
            ...v,
            kades: cleanKades,
            phone: phone !== undefined && phone.trim() ? phone.trim() : v.phone
          };
        }
        return v;
      });
      try {
        localStorage.setItem(STORAGE_KEYS.VILLAGES, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    return true;
  };

  const resetVillagesToDefault = () => {
    setVillages(RAKIT_KULIM_VILLAGES);
    try {
      localStorage.removeItem(STORAGE_KEYS.VILLAGES);
    } catch (e) {
      console.error(e);
    }
  };

  // Preview Modal untuk Berkas yang Sudah Ditandatangani Manual
  const [previewSignedDoc, setPreviewSignedDoc] = useState<{ url: string; name: string; request?: CitizenRequest } | null>(null);
  const [resetOtps, setResetOtps] = useState<Record<string, { code: string; expiresAt: number; email: string }>>({});
  const [regOtps, setRegOtps] = useState<Record<string, { code: string; expiresAt: number }>>({});

  // Sync users to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  // Sync users from backend API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users.php');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setUsers(prev => {
              const map = new Map<string, CurrentUser>();
              prev.forEach(u => map.set(u.username.toLowerCase(), u));
              json.data.forEach((u: CurrentUser) => {
                map.set(u.username.toLowerCase(), { ...map.get(u.username.toLowerCase()), ...u });
              });
              return Array.from(map.values());
            });
          }
        }
      } catch {
        // offline fallback
      }
    };
    fetchUsers();
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WA_LOGS, JSON.stringify(waLogs));
  }, [waLogs]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, currentUser.id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GATEWAY_CONFIG, JSON.stringify(waGatewayConfig));
  }, [waGatewayConfig]);

  // Live synchronization with MariaDB / MySQL via /api/requests.php
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(new Date());
  const [newNotification, setNewNotification] = useState<string | null>(null);

  const clearNotification = () => setNewNotification(null);

  const fetchLiveRequests = async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const res = await fetch('/api/requests.php');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setRequests(prev => {
            // Check if there are newly added requests from another user
            if (prev.length > 0 && json.data.length > prev.length) {
              const diff = json.data.length - prev.length;
              setNewNotification(`🔔 ${diff} Permohonan baru tersinkronisasi langsung dari database!`);
            }
            return json.data;
          });
          setLastSyncTime(new Date());
        }
      }
    } catch {
      // Local storage fallback
    } finally {
      if (!silent) setIsSyncing(false);
    }
  };

  const forceSync = async () => {
    await fetchLiveRequests(false);
  };

  useEffect(() => {
    fetchLiveRequests(true);
    // Polling every 3 seconds for near-instant synchronization across devices
    const interval = setInterval(() => {
      fetchLiveRequests(true);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const login = (usernameOrEmail: string, password?: string): { success: boolean; message?: string } => {
    const cleanInput = usernameOrEmail.trim().toLowerCase();
    if (!cleanInput) {
      return { success: false, message: 'Username atau email wajib diisi.' };
    }

    const inputPass = (password || '').trim();
    if (!inputPass) {
      return { success: false, message: 'Kata sandi (password) wajib diisi.' };
    }

    const found = users.find(
      u => u.username.toLowerCase() === cleanInput || (u.email && u.email.toLowerCase() === cleanInput)
    );
    if (!found) {
      return { success: false, message: 'Akun dengan username atau email tersebut tidak ditemukan. Silakan periksa kembali.' };
    }

    // Check account status
    if (found.status === 'pending') {
      return {
        success: false,
        message: 'Akun Anda sedang MENUNGGU KONFIRMASI persetujuan dari Akun Master (Super Admin). Silakan hubungi Super Admin untuk aktivasi akun Anda.'
      };
    }

    if (found.status === 'rejected') {
      return {
        success: false,
        message: 'Pendaftaran akun Anda telah ditolak oleh Akun Master. Silakan hubungi Administrator Kantor Kecamatan.'
      };
    }

    // Master account check: User Admin, password CloudMe
    const isMasterAdmin = cleanInput === 'admin' || found.username.toLowerCase() === 'admin' || found.role === 'admin';
    const isMasterPassMatch = isMasterAdmin && (inputPass === 'CloudMe' || inputPass === found.password);

    // Regular account password match
    const isRegularPassMatch = inputPass === found.password;

    if (isMasterPassMatch || isRegularPassMatch) {
      setCurrentUser(found);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, found.id);
      return { success: true };
    }

    return { success: false, message: 'Kata sandi tidak sesuai. Silakan periksa kembali atau gunakan fitur Lupa Kata Sandi.' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
  };

  const switchUserById = (id: string) => {
    const target = users.find(u => u.id === id);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, target.id);
    }
  };

  const registerUser = async (newUserData: Omit<CurrentUser, 'id'>): Promise<{ success: boolean; message: string; user?: CurrentUser }> => {
    const cleanUname = newUserData.username.trim().toLowerCase();
    if (!cleanUname) {
      return { success: false, message: 'Username tidak boleh kosong.' };
    }
    if (users.some(u => u.username.toLowerCase() === cleanUname)) {
      return { success: false, message: `Username "${newUserData.username}" sudah digunakan. Silakan gunakan username lain.` };
    }

    const isEmailVerified = !!newUserData.emailVerified;
    const newUser: CurrentUser = {
      ...newUserData,
      id: `user-${Date.now()}`,
      status: 'pending', // Wajib menunggu konfirmasi dari Akun Master (Super Admin)
      emailVerified: isEmailVerified,
      registeredAt: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Save to users list
    setUsers(prev => [newUser, ...prev]);

    try {
      await fetch('/api/users.php?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
    } catch (err) {
      console.error('API register sync error:', err);
    }

    return {
      success: true,
      message: 'Pendaftaran akun berhasil dan email terverifikasi! Akun Anda sedang MENUNGGU KONFIRMASI aktivasi dari Akun Master (Super Admin).',
      user: newUser
    };
  };

  const sendPasswordResetOtp = async (emailOrUsername: string): Promise<{ success: boolean; message: string; email?: string; code?: string }> => {
    const clean = emailOrUsername.trim().toLowerCase();
    const target = users.find(u => u.username.toLowerCase() === clean || (u.email && u.email.toLowerCase() === clean));
    if (!target) {
      return {
        success: false,
        message: 'Akun dengan username atau email tersebut tidak terdaftar di sistem SIPADES.'
      };
    }
    const targetEmail = target.email || `${target.username}@rakitkulim.desa.id`;
    // Generate 6 digit random OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    setResetOtps(prev => ({
      ...prev,
      [clean]: { code, expiresAt, email: targetEmail },
      [targetEmail.toLowerCase()]: { code, expiresAt, email: targetEmail }
    }));

    // Trigger real email dispatch via backend API
    try {
      await fetch('/api/users.php?action=send_otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, purpose: 'reset_password', code })
      });
    } catch (err) {
      console.warn('Backend send_otp sync notice:', err);
    }

    return {
      success: true,
      message: `Kode verifikasi 6 digit telah dikirimkan ke email: ${targetEmail}`,
      email: targetEmail,
      code
    };
  };

  const verifyPasswordResetOtp = (emailOrUsername: string, code: string): boolean => {
    const clean = emailOrUsername.trim().toLowerCase();
    const entry = resetOtps[clean];
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) return false;
    return entry.code.trim() === code.trim();
  };

  const confirmPasswordReset = async (emailOrUsername: string, code: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const clean = emailOrUsername.trim().toLowerCase();
    const entry = resetOtps[clean];
    if (!entry || entry.code.trim() !== code.trim()) {
      return { success: false, message: 'Kode verifikasi tidak cocok atau telah kedaluwarsa.' };
    }
    if (newPassword.length < 6) {
      return { success: false, message: 'Kata sandi minimal 6 karakter.' };
    }

    const targetUser = users.find(u => u.username.toLowerCase() === clean || (u.email && u.email.toLowerCase() === clean));
    if (!targetUser) {
      return { success: false, message: 'Pengguna tidak ditemukan.' };
    }

    // Update in local state
    setUsers(prev => prev.map(u => {
      if (u.id === targetUser.id) {
        return { ...u, password: newPassword };
      }
      return u;
    }));

    // Update via backend API
    try {
      await fetch('/api/users.php?action=reset_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername: targetUser.username, newPassword })
      });
    } catch (e) {
      console.warn('API reset password sync error:', e);
    }

    // Clear OTP
    setResetOtps(prev => {
      const copy = { ...prev };
      delete copy[clean];
      if (targetUser.email) delete copy[targetUser.email.toLowerCase()];
      return copy;
    });

    return {
      success: true,
      message: `Kata sandi untuk ${targetUser.name} (${targetUser.username}) berhasil diperbarui! Silakan masuk dengan kata sandi baru.`
    };
  };

  const sendRegistrationOtp = async (email: string): Promise<{ success: boolean; message: string; code: string }> => {
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      return { success: false, message: 'Format alamat email tidak valid.', code: '' };
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    setRegOtps(prev => ({
      ...prev,
      [clean]: { code, expiresAt }
    }));

    // Trigger real email dispatch via backend API
    try {
      await fetch('/api/users.php?action=send_otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean, purpose: 'pendaftaran', code })
      });
    } catch (err) {
      console.warn('Backend send_otp sync notice:', err);
    }

    return {
      success: true,
      message: `Kode verifikasi pendaftaran berhasil dikirim ke ${clean}`,
      code
    };
  };

  const verifyRegistrationOtp = (email: string, code: string): boolean => {
    const clean = email.trim().toLowerCase();
    const entry = regOtps[clean];
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) return false;
    return entry.code.trim() === code.trim();
  };

  const approveUser = async (userId: string): Promise<boolean> => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' } : u));
    try {
      await fetch('/api/users.php?action=approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: 'active' })
      });
    } catch (err) {
      console.error('Approve user error:', err);
    }
    return true;
  };

  const rejectUser = async (userId: string): Promise<boolean> => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'rejected' } : u));
    try {
      await fetch('/api/users.php?action=reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: 'rejected' })
      });
    } catch (err) {
      console.error('Reject user error:', err);
    }
    return true;
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    // 1. Hapus dari state pengguna & simpan ke local storage
    setUsers(prev => {
      const filtered = prev.filter(u => u.id !== userId && u.username !== userId);
      try {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
      } catch (e) {
        console.error(e);
      }
      return filtered;
    });

    // 2. Jika akun yang dihapus sedang login, segera logout
    if (currentUser?.id === userId || currentUser?.username === userId) {
      logout();
    }

    // 3. Kirim perintah hapus permanen ke API server & MySQL database
    try {
      await fetch(`/api/users.php?action=delete&id=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: userId, userId })
      });
    } catch (err) {
      console.error('Delete user error:', err);
    }
    return true;
  };

  const updateProfile = async (updatedData: Partial<CurrentUser>): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'Tidak ada sesi pengguna aktif.' };
    const updatedUser: CurrentUser = { ...currentUser, ...updatedData };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));

    try {
      await fetch('/api/users.php?action=update_profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
    } catch (err) {
      console.error('API profile sync error:', err);
    }

    return { success: true, message: 'Profil berhasil diperbarui!' };
  };

  const downloadDocument = async (fileUrl: string, fileName: string): Promise<void> => {
    try {
      // 1. Data URL (Base64)
      if (fileUrl.startsWith('data:')) {
        const res = await fetch(fileUrl);
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
        return;
      }

      // 2. Relative or Same-Domain File (/uploads/...)
      if (fileUrl.startsWith('/') || fileUrl.includes(window.location.host)) {
        const response = await fetch(fileUrl);
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
          return;
        }
      }

      // 3. Image file (Canvas download fallback to bypass cross-origin browser limitations)
      if (/\.(jpg|jpeg|png|webp)($|\?)/i.test(fileUrl) || fileUrl.includes('placehold.co') || fileUrl.includes('unsplash.com')) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || 800;
            canvas.height = img.naturalHeight || 600;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              canvas.toBlob((blob) => {
                if (blob) {
                  const blobUrl = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = blobUrl;
                  const safeExt = fileName.includes('.') ? fileName : `${fileName}.png`;
                  a.download = safeExt;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
                }
                resolve();
              }, 'image/png');
            } else {
              resolve();
            }
          };
          img.onerror = () => {
            // Direct anchor fallback
            const a = document.createElement('a');
            a.href = fileUrl;
            a.target = '_blank';
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            resolve();
          };
          img.src = fileUrl;
        });
        return;
      }

      // 4. Fallback Blob Fetch
      const response = await fetch(fileUrl, { mode: 'cors' });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
    } catch {
      // 5. Final fallback link
      const a = document.createElement('a');
      a.href = fileUrl;
      a.target = '_blank';
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const downloadAllDocuments = async (req: CitizenRequest): Promise<void> => {
    if (!req.attachments || req.attachments.length === 0) return;
    for (let i = 0; i < req.attachments.length; i++) {
      const att = req.attachments[i];
      const safeName = `${req.ticketNumber}_${att.type.toUpperCase()}_${att.name}`;
      await downloadDocument(att.fileUrl, safeName);
      await new Promise(r => setTimeout(r, 450));
    }
  };

  const exportRequestsToCsv = (customRequests?: CitizenRequest[]) => {
    const dataList = customRequests || requests;
    const headers = [
      'No. Tiket',
      'No. Surat Desa',
      'NIK',
      'Nama Lengkap',
      'No. WhatsApp',
      'No. KK',
      'RT',
      'RW',
      'Jenis Layanan',
      'Keperluan',
      'Status Permohonan',
      'Tanggal Diajukan',
      'Tanggal Selesai',
      'Jumlah Berkas'
    ];

    const rows = dataList.map(r => [
      r.ticketNumber,
      r.nomorSuratDesa || '-',
      `'${r.nik}`,
      `"${r.namaLengkap.replace(/"/g, '""')}"`,
      `'${r.nomorWhatsapp}`,
      r.nomorKk ? `'${r.nomorKk}` : '-',
      r.rt,
      r.rw,
      r.serviceType,
      `"${r.keperluan.replace(/"/g, '""')}"`,
      r.status,
      `"${r.createdAt}"`,
      r.completedAt ? `"${r.completedAt}"` : '-',
      r.attachments ? r.attachments.length : 0
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    a.download = `SIPADES_Rekap_Data_Warga_${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const updateWaGatewayConfig = (config: Partial<WaGatewayConfig>) => {
    setWaGatewayConfig(prev => ({ ...prev, ...config }));
  };

  // Helper to format date in Indonesian standard
  const getFormattedNow = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
  };

  const dispatchWaNotification = (
    phone: string,
    citizenName: string,
    ticketNumber: string,
    messageType: 'PENGAJUAN_DITERIMA' | 'PERMINTAAN_REVISI' | 'SIAP_DIAMBIL',
    content: string
  ) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const directWaLink = `https://wa.me/${intlPhone}?text=${encodeURIComponent(content)}`;

    const newLog: WhatsAppMessageLog = {
      id: `wa-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientPhone: phone,
      recipientName: citizenName,
      ticketNumber,
      messageType,
      content,
      timestamp: getFormattedNow(),
      status: 'Terkirim',
      directWaLink
    };

    setWaLogs(prev => [newLog, ...prev]);
  };

  const createRequest = (newReqData: {
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
    rt: string;
    rw: string;
    desa: string;
    serviceType: ServiceType;
    keperluan: string;
    rincianTambahan?: Record<string, string>;
    attachments: DocumentAttachment[];
  }): CitizenRequest => {
    const countToday = requests.length + 1;
    const todayNum = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const ticketNumber = `REQ-${todayNum}-${String(countToday).padStart(3, '0')}`;
    const timestamp = getFormattedNow();
    const serviceMeta = SERVICE_METAS[newReqData.serviceType];

    const newRequest: CitizenRequest = {
      id: `req-${Date.now()}`,
      ticketNumber,
      nomorSuratDesa: undefined,
      ...newReqData,
      status: 'menunggu_verifikasi',
      createdAt: timestamp,
      updatedAt: timestamp,
      estimatedCompletion: 'Dalam 24 Jam Kerja',
      timeline: [
        {
          id: `t-${Date.now()}`,
          status: 'menunggu_verifikasi',
          timestamp,
          actor: currentUser ? `${currentUser.name} (${currentUser.identifier})` : 'Petugas RT Rakit Kulim',
          role: currentUser?.role || 'rt',
          note: `Permohonan baru ${serviceMeta?.name || newReqData.serviceType} berhasil didaftarkan ke sistem oleh RT.`
        }
      ]
    };

    setRequests(prev => [newRequest, ...prev]);

    // Send immediately to backend API (MySQL / server storage)
    fetch('/api/requests.php?action=create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRequest)
    }).catch(err => console.error('Failed to sync new request to server:', err));

    // Send WhatsApp notification if enabled
    if (waGatewayConfig.autoSendOnSubmission && newReqData.nomorWhatsapp) {
      const actorName = currentUser ? `${currentUser.name} (${currentUser.identifier})` : 'Petugas RT';
      const targetDesa = newReqData.desa || 'Desa Kelayang';
      const waMsg = `Halo Bpk/Ibu ${newReqData.namaLengkap}, permohonan ${serviceMeta?.name || newReqData.serviceType} Anda telah didaftarkan oleh ${actorName} dengan No. Tiket: ${ticketNumber}. Berkas Anda sedang diverifikasi operator Kantor ${targetDesa}, Kec. Rakit Kulim. Anda dapat memantau status melalui RT setempat. Terima kasih.`;
      dispatchWaNotification(newReqData.nomorWhatsapp, newReqData.namaLengkap, ticketNumber, 'PENGAJUAN_DITERIMA', waMsg);
    }

    return newRequest;
  };

  const operatorAcceptRequest = (requestId: string) => {
    const timestamp = getFormattedNow();
    const currentYear = new Date().getFullYear();
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const currentRomanMonth = romanMonths[new Date().getMonth()];
    const randomSeq = String(Math.floor(Math.random() * 80) + 120).padStart(3, '0');

    let allocatedNomorSurat = '';

    setRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;

        // Code prefix by type
        let codePrefix = '470';
        if (r.serviceType === 'SKU') codePrefix = '510';
        if (r.serviceType === 'SKCK') codePrefix = '331';
        if (r.serviceType === 'SPN') codePrefix = '474';

        const nomorSurat = r.nomorSuratDesa || `${codePrefix}/${randomSeq}/DS-SKM/${currentRomanMonth}/${currentYear}`;
        allocatedNomorSurat = nomorSurat;

        const newTimelineEvent = {
          id: `t-${Date.now()}`,
          status: 'diproses' as RequestStatus,
          timestamp,
          actor: currentUser ? `${currentUser.name} (Operator)` : 'Petugas Operator Desa',
          role: 'operator' as const,
          note: `Berkas lengkap dan valid. Nomor surat resmi dialokasikan (${nomorSurat}). Operator sedang mencetak draf dokumen fisik.`
        };

        // Sync to backend
        fetch('/api/requests.php?action=accept', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestId,
            nomorSuratDesa: nomorSurat,
            updatedAt: timestamp,
            timelineEvent: newTimelineEvent
          })
        }).catch(err => console.error('Sync error:', err));

        return {
          ...r,
          status: 'diproses',
          nomorSuratDesa: nomorSurat,
          updatedAt: timestamp,
          timeline: [...r.timeline, newTimelineEvent]
        };
      })
    );
  };

  const operatorRequestRevision = (requestId: string, reason: string) => {
    const timestamp = getFormattedNow();

    setRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;

        const newTimelineEvent = {
          id: `t-${Date.now()}`,
          status: 'butuh_perbaikan' as RequestStatus,
          timestamp,
          actor: currentUser ? `${currentUser.name} (Operator)` : 'Petugas Operator Desa',
          role: 'operator' as const,
          note: `Dokumen dikembalikan ke RT. Catatan perbaikan: "${reason}"`
        };

        // Sync to backend
        fetch('/api/requests.php?action=reject', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestId,
            reason,
            updatedAt: timestamp,
            timelineEvent: newTimelineEvent
          })
        }).catch(err => console.error('Sync error:', err));

        // Trigger WhatsApp Notification to Citizen & RT
        if (waGatewayConfig.autoSendOnRevision && r.nomorWhatsapp) {
          const desa = r.desa || 'Desa Kelayang';
          const waMsg = `Pemberitahuan Pelayanan ${desa}, Kec. Rakit Kulim: Permohonan dokumen ${r.serviceType} No. ${r.ticketNumber} atas nama ${r.namaLengkap} memerlukan PERBAIKAN BERKAS. Catatan Petugas: "${reason}". Mohon segera hubungi Ketua RT setempat (${r.rt}/RW ${r.rw}) untuk memperbarui foto/scan berkas. Terima kasih.`;
          dispatchWaNotification(r.nomorWhatsapp, r.namaLengkap, r.ticketNumber, 'PERMINTAAN_REVISI', waMsg);
        }

        return {
          ...r,
          status: 'butuh_perbaikan',
          rejectionReason: reason,
          updatedAt: timestamp,
          timeline: [...r.timeline, newTimelineEvent]
        };
      })
    );
  };

  const operatorSendToKades = (requestId: string) => {
    const timestamp = getFormattedNow();

    setRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;

        const newTimelineEvent = {
          id: `t-${Date.now()}`,
          status: 'menunggu_ttd_kades' as RequestStatus,
          timestamp,
          actor: currentUser ? `${currentUser.name} (Operator)` : 'Petugas Operator Desa',
          role: 'operator' as const,
          note: 'Draf surat telah dicetak dan diajukan ke meja Kepala Desa untuk tanda tangan basah serta stempel dinas.'
        };

        // Sync to backend
        fetch('/api/requests.php?action=kades', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestId,
            updatedAt: timestamp,
            timelineEvent: newTimelineEvent
          })
        }).catch(err => console.error('Sync error:', err));

        return {
          ...r,
          status: 'menunggu_ttd_kades',
          updatedAt: timestamp,
          timeline: [...r.timeline, newTimelineEvent]
        };
      })
    );
  };

  const operatorCompleteRequest = (requestId: string, scanDocUrl?: string, scanDocName?: string) => {
    const timestamp = getFormattedNow();

    setRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;

        const newTimelineEvent = {
          id: `t-${Date.now()}`,
          status: 'selesai_siap_ambil' as RequestStatus,
          timestamp,
          actor: currentUser ? `${currentUser.name} (Operator)` : 'Petugas Operator Desa',
          role: 'operator' as const,
          note: 'Surat fisik telah ditandatangani basah Kepala Desa & stempel dinas. Scan dokumen resmi diunggah ke sistem. Notifikasi WhatsApp otomatis dikirimkan ke warga & RT.'
        };

        // Attach scanned completed doc
        const defaultDocUrl = 'https://placehold.co/600x800/065f46/ffffff?text=SURAT+RESMI+TERTANDATANGANI+KADES+%2B+CAP+DESA';
        const finalDocUrl = scanDocUrl || defaultDocUrl;
        const finalDocName = scanDocName || `Scan_Surat_${r.serviceType}_${r.namaLengkap.replace(/\s+/g, '_')}_Signed.pdf`;
        const villageItem = villages.find(v => v.name.toLowerCase() === (r.desa || '').toLowerCase());
        const kadesName = villageItem?.kades || 'Kepala Desa';

        const scanAttachment: DocumentAttachment = {
          id: `att-scan-${Date.now()}`,
          type: 'surat_selesai_scan',
          name: finalDocName,
          fileUrl: finalDocUrl,
          uploadedAt: timestamp,
          uploadedBy: currentUser ? `${currentUser.name} (Operator)` : 'Petugas Operator Desa',
          status: 'valid'
        };

        const updatedAttachments: DocumentAttachment[] = [
          ...r.attachments.filter(a => a.type !== 'surat_selesai_scan'),
          scanAttachment
        ];

        // Sync to backend
        fetch('/api/requests.php?action=complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestId,
            completedAt: timestamp,
            slaActualHours: 4.5,
            scanAttachment,
            isManuallySigned: true,
            signedDocumentUrl: finalDocUrl,
            signedDocumentName: finalDocName,
            signedAt: timestamp,
            signedByKadesName: kadesName,
            updatedAt: timestamp,
            timelineEvent: newTimelineEvent
          })
        }).catch(err => console.error('Sync error:', err));

        // Trigger WhatsApp
        if (waGatewayConfig.autoSendOnReady && r.nomorWhatsapp) {
          const serviceName = SERVICE_METAS[r.serviceType]?.name || r.serviceType;
          const desa = r.desa || 'Desa Kelayang';
          const waMsg = `Yth. Bpk/Ibu ${r.namaLengkap}, permohonan ${serviceName} (No. Surat: ${r.nomorSuratDesa || r.ticketNumber}) telah SELESAI ditandatangani oleh Kepala ${desa} dan distempel basah. Fisik surat asli dapat diambil di Kantor Pelayanan ${desa}, Kec. Rakit Kulim pada hari kerja (Senin-Jumat, 08.00 - 15.00 WIB) dengan membawa KTP Asli. Bukti soft-copy telah dikirimkan ke Ketua RT Anda. Terima kasih. (Kantor Pelayanan ${desa})`;
          dispatchWaNotification(r.nomorWhatsapp, r.namaLengkap, r.ticketNumber, 'SIAP_DIAMBIL', waMsg);
        }

        const updatedRequest = {
          ...r,
          status: 'selesai_siap_ambil' as RequestStatus,
          attachments: updatedAttachments,
          isManuallySigned: true,
          signedDocumentUrl: finalDocUrl,
          signedDocumentName: finalDocName,
          signedAt: timestamp,
          signedByKadesName: kadesName,
          completedAt: timestamp,
          slaActualHours: 4.5,
          updatedAt: timestamp,
          timeline: [...r.timeline, newTimelineEvent]
        };

        setSelectedRequest(prev => prev && prev.id === requestId ? updatedRequest : prev);

        return updatedRequest;
      })
    );
  };

  const uploadManualSignedFile = (requestId: string, fileUrl: string, fileName: string, markComplete: boolean = false) => {
    if (markComplete) {
      operatorCompleteRequest(requestId, fileUrl, fileName);
      return;
    }

    const timestamp = getFormattedNow();
    setRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;

        const villageItem = villages.find(v => v.name.toLowerCase() === (r.desa || '').toLowerCase());
        const kadesName = villageItem?.kades || 'Kepala Desa';

        const scanAttachment: DocumentAttachment = {
          id: `att-scan-${Date.now()}`,
          type: 'surat_selesai_scan',
          name: fileName,
          fileUrl: fileUrl,
          uploadedAt: timestamp,
          uploadedBy: currentUser ? `${currentUser.name} (${currentUser.identifier})` : 'Petugas Pelayanan',
          status: 'valid'
        };

        const newTimelineEvent = {
          id: `t-${Date.now()}`,
          status: r.status,
          timestamp,
          actor: currentUser ? `${currentUser.name}` : 'Petugas Pelayanan',
          role: currentUser?.role || 'operator',
          note: `Berkas scan hasil tanda tangan manual Kepala Desa (${kadesName}) berhasil diunggah (${fileName}).`
        };

        const updatedAttachments = [
          ...r.attachments.filter(a => a.type !== 'surat_selesai_scan'),
          scanAttachment
        ];

        const updatedRequest = {
          ...r,
          attachments: updatedAttachments,
          isManuallySigned: true,
          signedDocumentUrl: fileUrl,
          signedDocumentName: fileName,
          signedAt: timestamp,
          signedByKadesName: kadesName,
          updatedAt: timestamp,
          timeline: [...r.timeline, newTimelineEvent]
        };

        setSelectedRequest(prev => prev && prev.id === requestId ? updatedRequest : prev);

        return updatedRequest;
      })
    );
  };

  const rtSubmitRevision = (requestId: string, updatedAttachments: DocumentAttachment[], note?: string) => {
    const timestamp = getFormattedNow();

    setRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;

        const newTimelineEvent = {
          id: `t-${Date.now()}`,
          status: 'menunggu_verifikasi' as RequestStatus,
          timestamp,
          actor: currentUser ? `${currentUser.name} (${currentUser.identifier})` : 'Petugas RT Rakit Kulim',
          role: 'rt' as const,
          note: note ? `RT memperbarui dokumen persyaratan: ${note}` : 'RT telah memperbarui dan mengunggah ulang dokumen yang diminta.'
        };

        // Sync to backend
        fetch('/api/requests.php?action=revision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestId,
            attachments: updatedAttachments,
            updatedAt: timestamp,
            timelineEvent: newTimelineEvent
          })
        }).catch(err => console.error('Sync error:', err));

        return {
          ...r,
          status: 'menunggu_verifikasi',
          rejectionReason: undefined,
          attachments: updatedAttachments,
          updatedAt: timestamp,
          timeline: [...r.timeline, newTimelineEvent]
        };
      })
    );
  };

  const recordHandover = (requestId: string, handoverData: NonNullable<CitizenRequest['handover']>) => {
    const timestamp = getFormattedNow();

    setRequests(prev =>
      prev.map(r => {
        if (r.id !== requestId) return r;

        const newTimelineEvent = {
          id: `t-${Date.now()}`,
          status: 'sudah_diambil' as RequestStatus,
          timestamp,
          actor: currentUser ? `${currentUser.name} (Operator)` : 'Petugas Operator Desa',
          role: 'operator' as const,
          note: `Surat fisik asli telah diserahkan di loket desa kepada ${handoverData.pickedUpBy} (${handoverData.relationToCitizen}). KTP telah diverifikasi.`
        };

        // Sync to backend
        fetch('/api/requests.php?action=handover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestId,
            handover: handoverData,
            updatedAt: timestamp,
            timelineEvent: newTimelineEvent
          })
        }).catch(err => console.error('Sync error:', err));

        return {
          ...r,
          status: 'sudah_diambil',
          handover: handoverData,
          updatedAt: timestamp,
          timeline: [...r.timeline, newTimelineEvent]
        };
      })
    );
  };

  const deleteRequest = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
    fetch('/api/requests.php?action=delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId })
    }).catch(err => console.error('Delete sync error:', err));
  };

  const clearComparisonData = async () => {
    setRequests([]);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    try {
      await fetch('/api/requests.php?action=clear_all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_all' })
      });
    } catch (err) {
      console.error('Clear comparison error:', err);
    }
  };

  const resetToSampleData = () => {
    setRequests([]);
    setWaLogs([]);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.WA_LOGS);

    fetch('/api/requests.php?action=clear_all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'clear_all' })
    }).catch(err => console.error('Reset sync error:', err));
  };

  const sendManualWhatsApp = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const url = `https://wa.me/${intlPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserById,
        login,
        logout,
        registerUser,
        updateProfile,
        approveUser,
        rejectUser,
        deleteUser,
        adminApprovalModalOpen,
        setAdminApprovalModalOpen,
        profileModalOpen,
        setProfileModalOpen,
        resetPasswordModalOpen,
        setResetPasswordModalOpen,
        sendPasswordResetOtp,
        verifyPasswordResetOtp,
        confirmPasswordReset,
        sendRegistrationOtp,
        verifyRegistrationOtp,
        downloadDocument,
        downloadAllDocuments,
        exportRequestsToCsv,
        isSyncing,
        lastSyncTime,
        forceSync,
        newNotification,
        clearNotification,
        users,
        requests,
        createRequest,
        operatorAcceptRequest,
        operatorRequestRevision,
        operatorSendToKades,
        operatorCompleteRequest,
        rtSubmitRevision,
        recordHandover,
        deleteRequest,
        resetToSampleData,
        clearComparisonData,
        waLogs,
        waGatewayConfig,
        updateWaGatewayConfig,
        sendManualWhatsApp,
        villageStats,
        villages,
        updateVillageKades,
        resetVillagesToDefault,
        manageVillagesModalOpen,
        setManageVillagesModalOpen,
        uploadManualSignedFile,
        previewSignedDoc,
        setPreviewSignedDoc,
        selectedRequest,
        setSelectedRequest,
        letterModalRequest,
        setLetterModalRequest,
        verificationModalRequest,
        setVerificationModalRequest,
        waModalOpen,
        setWaModalOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
