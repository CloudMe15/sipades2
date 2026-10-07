import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RAKIT_KULIM_VILLAGES } from '../../data/mockData';
import { UserRole } from '../../types';
import {
  X,
  UserPlus,
  Users,
  Building2,
  Lock,
  Phone,
  User,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Mail,
  Copy,
  Check
} from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const { registerUser, users, sendRegistrationOtp, verifyRegistrationOtp } = useApp();

  if (!isOpen) return null;

  const [role, setRole] = useState<UserRole>('rt');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('Desa Kelayang');
  const [rtVal, setRtVal] = useState('01');
  const [rwVal, setRwVal] = useState('01');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // OTP Verification state
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timerSeconds]);

  // Step 1: Request OTP
  const handleProceedToOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama lengkap wajib diisi.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Alamat email aktif wajib diisi dengan format valid.');
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('Nomor WhatsApp wajib diisi.');
      return;
    }

    if (!username.trim()) {
      setErrorMsg('Username wajib diisi.');
      return;
    }

    if (users.some(u => u.username.toLowerCase() === username.trim().toLowerCase())) {
      setErrorMsg('Username ini sudah digunakan oleh akun lain. Silakan pilih username lain.');
      return;
    }

    if (users.some(u => u.email && u.email.toLowerCase() === cleanEmail)) {
      setErrorMsg('Alamat email ini sudah terdaftar.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendRegistrationOtp(cleanEmail);
      if (res.success && res.code) {
        setGeneratedOtp(res.code);
        setTimerSeconds(60);
        setStep('otp');
      } else {
        setErrorMsg(res.message || 'Gagal mengirim kode verifikasi.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan pengiriman kode verifikasi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP and Register
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanOtp = otpInput.trim();
    if (!cleanOtp) {
      setErrorMsg('Masukkan 6 digit kode OTP verifikasi.');
      return;
    }

    const isValid = verifyRegistrationOtp(email.trim(), cleanOtp);
    if (!isValid) {
      setErrorMsg('Kode verifikasi tidak cocok atau telah kedaluwarsa.');
      return;
    }

    setIsSubmitting(true);
    try {
      const identifier = role === 'rt'
        ? `Ketua RT ${rtVal.padStart(2, '0')} / RW ${rwVal.padStart(2, '0')}`
        : 'Operator Pelayanan Desa';

      const defaultAvatar = role === 'rt'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80';

      const res = await registerUser({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        password,
        role,
        identifier,
        village,
        phone: phone.trim(),
        avatar: defaultAvatar,
        email: email.trim().toLowerCase(),
        emailVerified: true
      });

      if (res.success) {
        setStep('success');
        setSuccessMsg('Email berhasil diverifikasi! Pendaftaran akun Anda kini menunggu konfirmasi dari Akun Master (Super Admin).');
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setErrorMsg(res.message || 'Gagal mendaftarkan akun. Silakan coba kembali.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan saat pendaftaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const res = await sendRegistrationOtp(email.trim());
      if (res.success && res.code) {
        setGeneratedOtp(res.code);
        setTimerSeconds(60);
      } else {
        setErrorMsg(res.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseCodeDirectly = () => {
    setOtpInput(generatedOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-sm text-white">
                Pendaftaran Akun Mandiri Aparatur Desa / RT
              </h3>
              <p className="text-[11px] text-emerald-100">
                Kecamatan Rakit Kulim, Kabupaten Indragiri Hulu, Riau
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-emerald-900/60 text-emerald-200 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper progress indicator */}
        <div className="bg-slate-50 px-6 py-2 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className={`font-bold ${step === 'form' ? 'text-emerald-700' : 'text-slate-400'}`}>
            1. Formulir Data
          </span>
          <span className="text-slate-300">→</span>
          <span className={`font-bold ${step === 'otp' ? 'text-emerald-700' : 'text-slate-400'}`}>
            2. Verifikasi Email OTP
          </span>
          <span className="text-slate-300">→</span>
          <span className={`font-bold ${step === 'success' ? 'text-emerald-700' : 'text-slate-400'}`}>
            3. Akun Aktif
          </span>
        </div>

        <div className="p-6 text-xs space-y-4">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Form Input */}
          {step === 'form' && (
            <form onSubmit={handleProceedToOtp} className="space-y-4">
              {/* Role selector */}
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Pilih Jenis Peran Akun:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('rt')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3 ${
                      role === 'rt'
                        ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Ketua / Pengurus RT</div>
                      <div className="text-[10px] text-slate-500">Input surat & dampingi warga</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('operator')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3 ${
                      role === 'operator'
                        ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Operator Desa</div>
                      <div className="text-[10px] text-slate-500">Verifikasi, cetak & loket</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Contoh: Bambang Irawan, S.Pd"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alamat Email Aktif *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Contoh: petugas@desa.id"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Contoh: 0812-7654-3201"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Pilih Wilayah Desa *
                  </label>
                  <select
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                  >
                    {RAKIT_KULIM_VILLAGES.map(v => (
                      <option key={v.id} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {role === 'rt' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Keterangan RT / RW
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rtVal}
                      onChange={e => setRtVal(e.target.value)}
                      placeholder="RT (01)"
                      className="w-1/2 px-3 py-2 border border-slate-300 rounded-xl text-center"
                      required
                    />
                    <span>/</span>
                    <input
                      type="text"
                      value={rwVal}
                      onChange={e => setRwVal(e.target.value)}
                      placeholder="RW (01)"
                      className="w-1/2 px-3 py-2 border border-slate-300 rounded-xl text-center"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                  Kredensial Masuk Akun:
                </span>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Username Pilihan *
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="Contoh: rt03-kelayang atau ahmad-rt"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Kata Sandi *
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Konfirmasi Kata Sandi *
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-bold rounded-xl shadow cursor-pointer transition flex items-center gap-2"
                >
                  <span>{isSubmitting ? 'Mengirim OTP...' : 'Lanjut Verifikasi Email →'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 text-xs flex items-start gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-emerald-900 block text-xs">
                    Kode Verifikasi Telah Dikirim ke Email Anda
                  </span>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Sistem telah mengirimkan 6 digit kode OTP verifikasi ke alamat email <strong className="font-mono text-emerald-950">{email}</strong>.
                  </p>
                  <p className="text-[10px] text-emerald-700">
                    Silakan buka <strong>Kotak Masuk (Inbox)</strong> atau folder <strong>Spam</strong> pada akun email Anda.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Masukkan 6 Digit Kode OTP dari Email
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
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
                  disabled={timerSeconds > 0 || isSubmitting}
                  onClick={handleResendOtp}
                  className="text-xs text-emerald-700 hover:text-emerald-800 disabled:text-slate-400 font-semibold cursor-pointer"
                >
                  {timerSeconds > 0
                    ? `Kirim ulang (${timerSeconds}s)`
                    : 'Kirim Ulang Kode OTP'}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition flex items-center gap-1.5"
                  >
                    <span>{isSubmitting ? 'Memverifikasi...' : 'Verifikasi & Aktifkan'}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: Sukses */}
          {step === 'success' && (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900">
                  Pendaftaran Berhasil & Email Terverifikasi!
                </h4>
                <p className="text-xs text-slate-600">
                  Akun untuk <strong>{name}</strong> (Username: <code>{username}</code>) telah dicatat dan saat ini <strong>MENUNGGU KONFIRMASI</strong> aktivasi oleh Akun Master (Super Admin).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
