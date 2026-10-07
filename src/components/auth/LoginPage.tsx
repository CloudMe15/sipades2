import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CitizenRequest } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SERVICE_METAS, RAKIT_KULIM_VILLAGES } from '../../data/mockData';
import {
  Building2,
  Users,
  Landmark,
  ShieldCheck,
  Search,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  FileText,
  Phone,
  Eye,
  EyeOff,
  MapPin,
  ExternalLink,
  UserPlus,
  Shield,
  KeyRound,
  Check,
  Mail,
  Copy,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    login,
    registerUser,
    users,
    requests,
    setSelectedRequest,
    setVerificationModalRequest,
    setResetPasswordModalOpen,
    sendRegistrationOtp,
    verifyRegistrationOtp
  } = useApp();

  const [activeTab, lacakTab] = useState<'public' | 'login' | 'villages'>('public');

  // Tracking & search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [searchResult, setSearchResult] = useState<CitizenRequest | null>(null);
  const [villageSearch, setVillageSearch] = useState('');

  // Sub-tab under login: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccessMsg, setLoginSuccessMsg] = useState('');

  // Self-Registration form state
  const [regRole, setRegRole] = useState<'rt' | 'operator' | 'kecamatan'>('rt');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regVillage, setRegVillage] = useState('Desa Kelayang');
  const [regIdentifier, setRegIdentifier] = useState('Ketua RT 01 / RW 01');
  const [regPhone, setRegPhone] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAvatar, setRegAvatar] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  // Email verification OTP states for registration
  const [regStep, setRegStep] = useState<'form' | 'otp' | 'success'>('form');
  const [regOtpInput, setRegOtpInput] = useState('');
  const [regGeneratedOtp, setRegGeneratedOtp] = useState('');
  const [regTimerSeconds, setRegTimerSeconds] = useState(60);
  const [regCopiedOtp, setRegCopiedOtp] = useState(false);

  // Countdown timer for registration OTP resend
  React.useEffect(() => {
    let interval: any = null;
    if (regStep === 'otp' && regTimerSeconds > 0) {
      interval = setInterval(() => {
        setRegTimerSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [regStep, regTimerSeconds]);

  // Avatar presets
  const AVATAR_PRESETS = [
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', label: 'Pria Formal 1' },
    { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', label: 'Pria Formal 2' },
    { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', label: 'Pria Formal 3' },
    { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', label: 'Wanita Formal 1' },
    { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', label: 'Wanita Formal 2' },
    { url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', label: 'Operator Loket' }
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccessMsg('');
    const res = login(username, password);
    if (!res.success) {
      setLoginError(res.message || 'Username atau kata sandi tidak cocok. Silakan periksa kembali akun Anda.');
    }
  };

  // Step 1 Registration: Validate & Send OTP to Email
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regName.trim()) {
      setRegError('Nama lengkap wajib diisi.');
      return;
    }
    const cleanEmail = regEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setRegError('Alamat email aktif wajib diisi dengan format yang benar untuk verifikasi kode OTP.');
      return;
    }
    if (!regUsername.trim()) {
      setRegError('Username wajib diisi.');
      return;
    }
    if (users.some(u => u.username.toLowerCase() === regUsername.trim().toLowerCase())) {
      setRegError(`Username '${regUsername}' sudah terdaftar. Silakan pilih username lain.`);
      return;
    }
    if (users.some(u => u.email && u.email.toLowerCase() === cleanEmail)) {
      setRegError(`Email '${cleanEmail}' sudah terdaftar pada akun lain.`);
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Kata sandi minimal 6 karakter.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsSubmittingReg(true);
    try {
      const res = await sendRegistrationOtp(cleanEmail);
      if (res.success && res.code) {
        setRegGeneratedOtp(res.code);
        setRegTimerSeconds(60);
        setRegStep('otp');
      } else {
        setRegError(res.message || 'Gagal mengirim kode verifikasi OTP ke email.');
      }
    } catch {
      setRegError('Terjadi kesalahan pengiriman kode verifikasi.');
    } finally {
      setIsSubmittingReg(false);
    }
  };

  // Step 2 Registration: Verify OTP & Activate Account
  const handleVerifyRegistrationOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    const cleanOtp = regOtpInput.trim();
    if (!cleanOtp) {
      setRegError('Masukkan 6 digit kode verifikasi OTP.');
      return;
    }

    const isValid = verifyRegistrationOtp(regEmail.trim(), cleanOtp);
    if (!isValid) {
      setRegError('Kode verifikasi OTP tidak cocok atau telah kedaluwarsa. Silakan periksa email Anda.');
      return;
    }

    setIsSubmittingReg(true);
    try {
      const res = await registerUser({
        username: regUsername.trim().toLowerCase(),
        password: regPassword,
        email: regEmail.trim().toLowerCase(),
        name: regName.trim(),
        role: regRole,
        identifier: regIdentifier.trim(),
        village: regVillage,
        avatar: regAvatar,
        phone: regPhone.trim() || '0812-0000-0000',
        emailVerified: true
      });

      if (res.success) {
        setRegStep('success');
        setRegSuccess('Pendaftaran berhasil & email telah diverifikasi! Akun Anda sedang MENUNGGU KONFIRMASI persetujuan dari Akun Master (Super Admin).');
      } else {
        setRegError(res.message);
      }
    } catch {
      setRegError('Terjadi kesalahan saat memproses pendaftaran.');
    } finally {
      setIsSubmittingReg(false);
    }
  };

  const handleResendRegistrationOtp = async () => {
    setRegError('');
    setIsSubmittingReg(true);
    try {
      const res = await sendRegistrationOtp(regEmail.trim());
      if (res.success && res.code) {
        setRegGeneratedOtp(res.code);
        setRegTimerSeconds(60);
      } else {
        setRegError(res.message);
      }
    } finally {
      setIsSubmittingReg(false);
    }
  };

  const handleUseRegCodeDirectly = () => {
    setRegOtpInput(regGeneratedOtp);
    setRegCopiedOtp(true);
    setTimeout(() => setRegCopiedOtp(false), 2000);
  };

  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchAttempted(true);

    const q = searchQuery.trim().toLowerCase();
    const found = requests.find(
      r =>
        r.ticketNumber.toLowerCase() === q ||
        r.nik === q ||
        r.namaLengkap.toLowerCase().includes(q)
    );
    setSearchResult(found || null);
  };

  const filteredVillages = RAKIT_KULIM_VILLAGES.filter(v =>
    v.name.toLowerCase().includes(villageSearch.toLowerCase()) ||
    v.kades.toLowerCase().includes(villageSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Public Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-slate-900 tracking-tight">
                    SIPADES
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Kec. Rakit Kulim
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Sistem Pelayanan Administrasi Desa Terpadu • Kab. Indragiri Hulu, Riau
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => lacakTab('public')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'public'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Lacak Surat Warga
              </button>

              <button
                onClick={() => lacakTab('villages')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'villages'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                19 Desa Rakit Kulim
              </button>

              <button
                onClick={() => lacakTab('login')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs ${
                  activeTab === 'login'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Masuk Petugas (RT / Desa)</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'public' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden text-center sm:text-left">
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pelayanan Administrasi Warga Terpadu • 19 Desa se-Kecamatan Rakit Kulim</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                  Pelayanan Surat Desa Rakit Kulim Tanpa Antre, Cepat & Terpantau
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                  Warga cukup menghubungi atau mendatangi Ketua RT di lingkungan masing-masing. Seluruh proses verifikasi berkas, penerbitan nomor surat, dan penandatanganan Kepala Desa dilakukan secara digital terpadu ke kantor desa.
                </p>

                {/* Tracking Box Inside Hero */}
                <form
                  onSubmit={handleSearchTracking}
                  className="pt-2 max-w-xl flex flex-col sm:flex-row items-stretch gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Masukkan No. Tiket (Contoh: REQ-20261006-001) atau NIK Anda..."
                      className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 rounded-xl text-xs shadow-md border-0 focus:ring-2 focus:ring-emerald-400 focus:outline-hidden font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <span>Lacak Status Surat</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Public Search Result (if searched) */}
            {searchAttempted && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-200">
                {searchResult ? (
                  <div className="bg-white rounded-2xl border border-emerald-200 shadow-md p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-900">
                            {searchResult.ticketNumber}
                          </span>
                          <StatusBadge status={searchResult.status} size="sm" />
                        </div>
                        <h3 className="font-bold text-base text-slate-900 mt-1">
                          {searchResult.namaLengkap}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono">
                          NIK: {searchResult.nik.slice(0, 6)}******{searchResult.nik.slice(-4)} • Wilayah: RT {searchResult.rt}/RW {searchResult.rw}, {searchResult.desa}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                          {searchResult.serviceType}
                        </span>
                        <span className="block text-[11px] text-slate-400 mt-1">
                          Diajukan: {searchResult.createdAt}
                        </span>
                      </div>
                    </div>

                    {/* Status Info Box */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      {searchResult.status === 'selesai_siap_ambil' ? (
                        <div className="text-emerald-800 font-medium">
                          🎉 <strong>Surat Telah Selesai & Diterbitkan!</strong> Fisik surat asli dapat diambil di Loket Kantor Pelayanan {searchResult.desa} pada jam kerja (08.00 - 15.00 WIB) dengan membawa <strong>KTP Asli</strong>.
                        </div>
                      ) : searchResult.status === 'butuh_perbaikan' ? (
                        <div className="text-rose-800 font-medium">
                          ⚠️ <strong>Membutuhkan Revisi Berkas:</strong> "{searchResult.rejectionReason}". Mohon segera hubungi Ketua RT setempat untuk melampirkan foto berkas yang jelas.
                        </div>
                      ) : searchResult.status === 'sudah_diambil' ? (
                        <div className="text-slate-700 font-medium">
                          ✓ Surat fisik asli telah diserahkan di loket desa kepada: <strong>{searchResult.handover?.pickedUpBy}</strong> ({searchResult.handover?.pickedUpAt}).
                        </div>
                      ) : (
                        <div className="text-slate-700">
                          ℹ️ Berkas sedang diproses oleh petugas loket desa. Target penyelesaian: <strong>{searchResult.estimatedCompletion}</strong>.
                        </div>
                      )}

                      {searchResult.nomorSuratDesa && (
                        <div className="pt-2 border-t border-slate-200 font-mono text-[11px] text-slate-600">
                          Nomor Surat Resmi Desa: <strong>{searchResult.nomorSuratDesa}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
                    <p className="text-xs text-slate-500">
                      Permohonan dengan kata kunci "<strong>{searchQuery}</strong>" tidak ditemukan. Pastikan nomor tiket atau NIK sudah sesuai.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Public Service Catalog Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Layanan Surat Administrasi Kependudukan
                  </h2>
                  <p className="text-xs text-slate-500">
                    Daftar jenis surat yang dapat diajukan warga melalui pengurus RT di 19 Desa se-Kecamatan Rakit Kulim
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(SERVICE_METAS).map(([code, meta]) => (
                  <div
                    key={code}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-emerald-300 transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                        {meta.code}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" /> SLA ±{meta.slaHours} Jam
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{meta.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {meta.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Persyaratan Dokumen:
                      </div>
                      <ul className="text-xs text-slate-600 space-y-0.5">
                        {meta.requiredDocs.map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Directory Tab: 19 Desa di Kecamatan Rakit Kulim */}
        {activeTab === 'villages' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Profil Wilayah
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                    19 Desa di Kecamatan Rakit Kulim
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Kabupaten Indragiri Hulu, Provinsi Riau • Terhubung ke Layanan SIPADES Terpadu
                  </p>
                </div>

                <div className="relative min-w-[260px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={villageSearch}
                    onChange={e => setVillageSearch(e.target.value)}
                    placeholder="Cari nama desa atau kepala desa..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {filteredVillages.map(v => (
                  <div
                    key={v.id}
                    className={`p-4 rounded-2xl border transition shadow-2xs ${
                      v.isCapital
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-slate-900">
                        {v.name}
                      </span>
                      {v.isCapital && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white uppercase">
                          Ibukota Kec
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Kode Kemendagri:</span>
                        <span className="font-mono font-medium">{v.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Kepala Desa:</span>
                        <span className="font-bold text-slate-800">{v.kades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Pembagian Wilayah:</span>
                        <span>{v.dusunCount} Dusun • {v.rtCount} RT</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-100">
                        <span className="text-slate-400">Kontak Kantor:</span>
                        <span className="font-mono text-emerald-800">{v.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Login & Self-Registration Tab: Portal Petugas Administrasi */}
        {activeTab === 'login' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-slate-900">
                Portal Aparatur & Pelayanan Administrasi Desa
              </h2>
              <p className="text-xs text-slate-500">
                Kecamatan Rakit Kulim • Kabupaten Indragiri Hulu, Riau
              </p>
            </div>

            {/* Auth Mode Toggle Tabs (Login vs Register) */}
            <div className="flex justify-center">
              <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1 shadow-inner max-w-md w-full">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setLoginError('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Masuk Akun Petugas</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setRegError('');
                    setRegSuccess('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Daftar Akun Mandiri</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Form Column */}
              <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
                {authMode === 'login' ? (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold text-sm text-slate-900">
                          Masuk Akun Petugas
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-400">SIPADES Rakit Kulim</span>
                    </div>

                    {loginError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      {/* Security Notice */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="text-[11px] text-slate-600 leading-snug">
                          <span className="font-bold text-slate-800 block">Sesi Privat & Terproteksi</span>
                          Masuk dengan <strong>Username</strong> atau <strong>Email</strong> terdaftar yang telah dikonfirmasi oleh Akun Master.
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Username atau Email Petugas *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Masukkan username atau email Anda"
                            className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                            required
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Untuk Akun Master gunakan Username: <strong>Admin</strong>.
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-semibold text-slate-700">
                            Kata Sandi (Password)
                          </label>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setResetPasswordModalOpen(true)}
                              className="text-[11px] text-amber-700 hover:text-amber-800 font-bold cursor-pointer hover:underline flex items-center gap-1"
                            >
                              <KeyRound className="w-3 h-3" />
                              <span>Lupa Kata Sandi?</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
                            >
                              {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                            </button>
                          </div>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => setResetPasswordModalOpen(true)}
                          className="text-slate-500 hover:text-emerald-700 font-medium cursor-pointer flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>Reset Kata Sandi via Email</span>
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono">SIPADES Terpadu</span>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Masuk ke Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>

                    <div className="pt-2 text-center border-t border-slate-100 space-y-2">
                      <p className="text-xs text-slate-500">
                        Belum memiliki akun petugas?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('register');
                            setRegError('');
                          }}
                          className="font-bold text-emerald-700 hover:underline cursor-pointer"
                        >
                          Daftar Mandiri di Sini →
                        </button>
                      </p>
                      <button
                        onClick={() => lacakTab('public')}
                        className="text-xs text-slate-400 hover:text-slate-700 font-medium cursor-pointer block mx-auto"
                      >
                        ← Kembali ke Halaman Pelayanan Publik
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold text-sm text-slate-900">
                          Formulir Registrasi Mandiri Akun
                        </h3>
                      </div>
                      <span className="text-[11px] text-slate-400">19 Desa Rakit Kulim</span>
                    </div>

                    {regError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{regError}</span>
                      </div>
                    )}

                    {regSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{regSuccess}</span>
                      </div>
                    )}

                    {/* Step A: Isi Formulir Pendaftaran */}
                    {regStep === 'form' && (
                      <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                        {/* Pilihan Jabatan / Role */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Peran / Jabatan Pelayanan:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setRegRole('rt');
                                setRegIdentifier('Ketua RT 01 / RW 01');
                              }}
                              className={`p-2 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                                regRole === 'rt'
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <Users className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                              <span>Ketua / Pengurus RT</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRegRole('operator');
                                setRegIdentifier('Operator Kantor Desa');
                              }}
                              className={`p-2 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                                regRole === 'operator'
                                  ? 'bg-blue-50 border-blue-500 text-blue-800'
                                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <Building2 className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                              <span>Operator Kantor Desa</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRegRole('kecamatan');
                                setRegIdentifier('Staf Pelayanan PATEN');
                              }}
                              className={`p-2 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                                regRole === 'kecamatan'
                                  ? 'bg-purple-50 border-purple-500 text-purple-800'
                                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <Landmark className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                              <span>Staf Kecamatan</span>
                            </button>
                          </div>
                        </div>

                        {/* Nama Lengkap */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Nama Lengkap (beserta Gelar) *
                          </label>
                          <input
                            type="text"
                            value={regName}
                            onChange={e => setRegName(e.target.value)}
                            placeholder="Contoh: H. M. Nasir, S.Sos"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                            required
                          />
                        </div>

                        {/* Alamat Email Aktif untuk Verifikasi */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Alamat Email Aktif (Wajib untuk Verifikasi Kode OTP) *
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            <input
                              type="email"
                              value={regEmail}
                              onChange={e => setRegEmail(e.target.value)}
                              placeholder="Contoh: petugas.desa@gmail.com atau rt@rakitkulim.desa.id"
                              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                              required
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Kode verifikasi 6 digit akan dikirimkan ke alamat email ini untuk aktivasi akun.
                          </p>
                        </div>

                        {/* Pilihan Desa (19 Desa Rakit Kulim) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Desa Penugasan / Wilayah *
                            </label>
                            <select
                              value={regVillage}
                              onChange={e => setRegVillage(e.target.value)}
                              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                              required
                            >
                              {RAKIT_KULIM_VILLAGES.map(v => (
                                <option key={v.id} value={v.name}>
                                  {v.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Keterangan RT / RW / Divisi *
                            </label>
                            <input
                              type="text"
                              value={regIdentifier}
                              onChange={e => setRegIdentifier(e.target.value)}
                              placeholder="Contoh: RT 03 / RW 01 atau Operator Loket"
                              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                              required
                            />
                          </div>
                        </div>

                        {/* Nomor WhatsApp */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Nomor WhatsApp Aktif
                          </label>
                          <input
                            type="text"
                            value={regPhone}
                            onChange={e => setRegPhone(e.target.value)}
                            placeholder="Contoh: 0812-3456-7890"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        {/* Username */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Username Login (Unik, huruf kecil tanpa spasi) *
                          </label>
                          <input
                            type="text"
                            value={regUsername}
                            onChange={e => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                            placeholder="Contoh: rt03-kelayang atau ahmad-rt"
                            className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                            required
                          />
                        </div>

                        {/* Kata Sandi & Konfirmasi */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Kata Sandi (Password) *
                            </label>
                            <input
                              type="password"
                              value={regPassword}
                              onChange={e => setRegPassword(e.target.value)}
                              placeholder="Minimal 6 karakter"
                              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Konfirmasi Kata Sandi *
                            </label>
                            <input
                              type="password"
                              value={regConfirmPassword}
                              onChange={e => setRegConfirmPassword(e.target.value)}
                              placeholder="Ulangi kata sandi"
                              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                              required
                            />
                          </div>
                        </div>

                        {/* Pilihan Foto Profil / Avatar */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Pilih Foto Profil:
                          </label>
                          <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {AVATAR_PRESETS.map((p, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setRegAvatar(p.url)}
                                className={`relative rounded-full shrink-0 ring-2 transition cursor-pointer p-0.5 ${
                                  regAvatar === p.url ? 'ring-emerald-600 scale-105' : 'ring-transparent hover:ring-slate-300'
                                }`}
                              >
                                <img
                                  src={p.url}
                                  alt={p.label}
                                  className="w-9 h-9 rounded-full object-cover"
                                />
                                {regAvatar === p.url && (
                                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                                    <Check className="w-2.5 h-2.5" />
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingReg}
                          className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          <span>{isSubmittingReg ? 'Mengirim Kode Verifikasi...' : 'Lanjut Verifikasi Email (Kirim OTP) →'}</span>
                        </button>
                      </form>
                    )}

                    {/* Step B: Verifikasi Kode OTP Email */}
                    {regStep === 'otp' && (
                      <form onSubmit={handleVerifyRegistrationOtp} className="space-y-4">
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 text-xs flex items-start gap-3 shadow-2xs">
                          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <span className="font-bold text-emerald-900 block text-xs">
                              Kode Verifikasi Telah Dikirim ke Email Anda
                            </span>
                            <p className="text-[11px] text-emerald-800 leading-relaxed">
                              Sistem telah mengirimkan 6 digit kode OTP aktivasi ke alamat email <strong className="font-mono text-emerald-950">{regEmail}</strong>.
                            </p>
                            <p className="text-[10px] text-emerald-700">
                              Silakan periksa <strong>Kotak Masuk (Inbox)</strong> atau folder <strong>Spam</strong> pada akun email Anda.
                            </p>
                          </div>
                        </div>

                        {/* Input 6 Digit OTP */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Masukkan 6 Digit Kode OTP dari Email
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            value={regOtpInput}
                            onChange={e => setRegOtpInput(e.target.value.replace(/\D/g, ''))}
                            placeholder="Contoh: 123456"
                            className="w-full text-center tracking-widest font-mono text-2xl font-bold py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-slate-50/60 focus:bg-white"
                            required
                            autoFocus
                          />
                          <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                            Masukkan 6 angka yang Anda terima dari email resmi SIPADES.
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            disabled={regTimerSeconds > 0 || isSubmittingReg}
                            onClick={handleResendRegistrationOtp}
                            className="text-xs text-emerald-700 hover:text-emerald-800 disabled:text-slate-400 font-semibold cursor-pointer"
                          >
                            {regTimerSeconds > 0
                              ? `Kirim ulang kode (${regTimerSeconds}s)`
                              : 'Kirim Ulang Kode OTP'}
                          </button>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setRegStep('form')}
                              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                            >
                              Ubah Data
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmittingReg}
                              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-1.5"
                            >
                              <span>{isSubmittingReg ? 'Memverifikasi...' : 'Verifikasi & Lanjutkan'}</span>
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Step C: Pendaftaran Berhasil & Menunggu Persetujuan Akun Master */}
                    {regStep === 'success' && (
                      <div className="py-6 text-center space-y-4 animate-in zoom-in-95">
                        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-md ring-4 ring-amber-50">
                          <Clock className="w-8 h-8" />
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="text-base font-black text-slate-900">
                            Pendaftaran Berhasil & Email Terverifikasi!
                          </h4>
                          <p className="text-xs text-slate-600 max-w-md mx-auto">
                            Kode OTP email telah valid. Berdasarkan kebijakan sistem, akun baru memerlukan konfirmasi dari Akun Master.
                          </p>
                        </div>

                        {/* Account Credential Summary Card */}
                        <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
                          <div className="flex justify-between items-center py-1 border-b border-slate-200">
                            <span className="text-slate-500">Nama Petugas:</span>
                            <span className="font-bold text-slate-900">{regName}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-200">
                            <span className="text-slate-500">Username untuk Login:</span>
                            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{regUsername}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-200">
                            <span className="text-slate-500">Email Terdaftar:</span>
                            <span className="font-mono text-slate-800">{regEmail}</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-slate-500">Status Akun:</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                              MENUNGGU KONFIRMASI AKUN MASTER
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                          Akun Master (Super Admin) akan memeriksa pendaftaran Anda. Setelah disetujui, Anda dapat langsung masuk menggunakan <strong>Username</strong> atau <strong>Email</strong> di atas.
                        </p>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setUsername(regUsername);
                              setPassword('');
                              setAuthMode('login');
                              setRegStep('form');
                              setLoginError('');
                            }}
                            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                          >
                            <span>Kembali ke Halaman Masuk</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 text-center border-t border-slate-100">
                      <p className="text-xs text-slate-500">
                        Sudah punya akun?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('login');
                            setLoginError('');
                          }}
                          className="font-bold text-emerald-700 hover:underline cursor-pointer"
                        >
                          Masuk di sini →
                        </button>
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Informative Government Panel (Right Column) */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-md space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-white">
                    Sistem Pelayanan Administrasi Terpadu
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Setiap <strong>Ketua RT</strong> di 19 Desa se-Kecamatan Rakit Kulim dapat menginput permohonan warga langsung dari rumah. Data dan berkas otomatis terhubung ke komputer <strong>Operator Kantor Desa</strong> secara realtime.
                  </p>
                </div>

                {/* Info Wilayah */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2 shadow-2xs">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <span>Wilayah Layanan Kecamatan Rakit Kulim:</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Mencakup 19 Desa resmi: Desa Kelayang, Kota Baru, Bukit Indah, Kuantan Tenang, Lubuk Setarak, Petonggan, Rimba Seminai, Batu Sawar, Kampung Bungo, Sungai Ekok, Talang Durian Cacar, Talang Gedabu, Talang Parigi, Talang Pring Jaya, Talang Selantai, Talang Suka Maju, Talang Sungai Limau, Talang Sungai Parit, dan Talang 7 Buah Tangga.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Public Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-bold text-slate-800">
            Sistem Informasi & Pelayanan Administrasi Desa Terpadu (SIPADES)
          </p>
          <p className="text-[11px] text-slate-500">
            Kecamatan Rakit Kulim • Kabupaten Indragiri Hulu • Provinsi Riau
          </p>
          <p className="text-[10px] text-slate-400">
            Melayani 19 Desa: Kelayang, Kota Baru, Bukit Indah, Kuantan Tenang, Lubuk Setarak, Petonggan, Rimba Seminai, Batu Sawar, Kampung Bungo, Sungai Ekok, Talang Durian Cacar, Talang Gedabu, Talang Parigi, Talang Pring Jaya, Talang Selantai, Talang Suka Maju, Talang Sungai Limau, Talang Sungai Parit, Talang 7 Buah Tangga.
          </p>
        </div>
      </footer>
    </div>
  );
};
