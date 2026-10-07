import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Eye,
  EyeOff,
  Copy,
  Check,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface ResetPasswordModalProps {
  onSuccessPrefill?: (username: string, newPass: string) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ onSuccessPrefill }) => {
  const {
    resetPasswordModalOpen,
    setResetPasswordModalOpen,
    sendPasswordResetOtp,
    verifyPasswordResetOtp,
    confirmPasswordReset,
    users
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [identifier, setIdentifier] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);

  // Countdown timer for resend
  useEffect(() => {
    let interval: any = null;
    if (step === 2 && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timerSeconds]);

  // Reset internal states on open
  useEffect(() => {
    if (resetPasswordModalOpen) {
      setStep(1);
      setErrorMsg('');
      setInputOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setCopiedCode(false);
    }
  }, [resetPasswordModalOpen]);

  if (!resetPasswordModalOpen) return null;

  const handleClose = () => {
    setResetPasswordModalOpen(false);
  };

  // Step 1: Send OTP to Email
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const clean = identifier.trim();
    if (!clean) {
      setErrorMsg('Masukkan username atau alamat email akun Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendPasswordResetOtp(clean);
      if (res.success && res.email && res.code) {
        setTargetEmail(res.email);
        setGeneratedCode(res.code);
        setTimerSeconds(60);
        setStep(2);
      } else {
        setErrorMsg(res.message || 'Akun tidak ditemukan. Periksa kembali username/email Anda.');
      }
    } catch {
      setErrorMsg('Gagal mengirim kode verifikasi. Silakan coba beberapa saat lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanOtp = inputOtp.trim();
    if (!cleanOtp) {
      setErrorMsg('Masukkan 6 digit kode verifikasi OTP.');
      return;
    }

    const isValid = verifyPasswordResetOtp(identifier, cleanOtp);
    if (isValid) {
      setStep(3);
    } else {
      setErrorMsg('Kode verifikasi tidak cocok atau telah kedaluwarsa. Silakan periksa kembali email Anda.');
    }
  };

  const handleResendOtp = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await sendPasswordResetOtp(identifier);
      if (res.success && res.code) {
        setGeneratedCode(res.code);
        setTimerSeconds(60);
      } else {
        setErrorMsg(res.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCodeDirectly = () => {
    setInputOtp(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Step 3: Save new password
  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await confirmPasswordReset(identifier, inputOtp, newPassword);
      if (res.success) {
        setStep(4);
        if (onSuccessPrefill) {
          onSuccessPrefill(identifier, newPassword);
        }
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setErrorMsg('Gagal memperbarui kata sandi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6 flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Reset Kata Sandi via Email</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-normal">
                  OTP Verifikasi
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Sistem Pelayanan Administrasi Desa (SIPADES) Rakit Kulim
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-1.5 font-bold ${step === 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            <span className="hidden sm:inline">Identifikasi</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200"></div>
          <div className={`flex items-center gap-1.5 font-bold ${step === 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span className="hidden sm:inline">Kode OTP</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200"></div>
          <div className={`flex items-center gap-1.5 font-bold ${step === 3 ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
            <span className="hidden sm:inline">Sandi Baru</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200"></div>
          <div className={`flex items-center gap-1.5 font-bold ${step === 4 ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>✓</span>
            <span className="hidden sm:inline">Selesai</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Masukkan Username / Email */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Username atau Alamat Email Terdaftar
                </label>
                <p className="text-[11px] text-slate-500">
                  Masukkan username (contoh: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">admin</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">operator</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">rt01-kelayang</code>) atau email akun Anda.
                </p>
                <div className="relative mt-2">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="Contoh: admin atau nama@rakitkulim.desa.id"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Quick sample chips */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block">
                  Pilih Cepat Akun Contoh untuk Tes:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIdentifier('admin')}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-bold cursor-pointer transition"
                  >
                    👑 Akun Master (admin)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdentifier('operator')}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-[11px] font-bold cursor-pointer transition"
                  >
                    🏛️ Operator Desa (operator)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdentifier('rt01-kelayang')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold cursor-pointer transition"
                  >
                    🏢 Frontline RT (rt01-kelayang)
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>{isLoading ? 'Mengirim...' : 'Kirim Kode Verifikasi'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Masukkan Kode OTP dari Email */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 text-xs flex items-start gap-3 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-emerald-900 block text-xs">
                    Kode Verifikasi Telah Dikirim ke Email Anda
                  </span>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Sistem telah mengirimkan 6 digit kode OTP reset kata sandi ke alamat email <strong className="font-mono text-emerald-950">{targetEmail}</strong>.
                  </p>
                  <p className="text-[10px] text-emerald-700">
                    Silakan buka <strong>Kotak Masuk (Inbox)</strong> atau folder <strong>Spam</strong> pada akun email Anda.
                  </p>
                </div>
              </div>

              {/* Input OTP */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Masukkan 6 Digit Kode OTP dari Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={inputOtp}
                    onChange={e => setInputOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Contoh: 123456"
                    className="w-full text-center tracking-widest font-mono text-2xl font-bold py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-slate-50/60 focus:bg-white"
                    required
                    autoFocus
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                  Masukkan 6 angka yang Anda terima dari email SIPADES.
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  disabled={timerSeconds > 0 || isLoading}
                  onClick={handleResendOtp}
                  className="text-xs text-emerald-700 hover:text-emerald-800 disabled:text-slate-400 font-semibold cursor-pointer"
                >
                  {timerSeconds > 0
                    ? `Kirim ulang kode (${timerSeconds}s)`
                    : 'Kirim Ulang Kode Verifikasi'}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Verifikasi Kode</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: Buat Kata Sandi Baru */}
          {step === 3 && (
            <form onSubmit={handleSaveNewPassword} className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Kode OTP diverifikasi! Silakan tentukan kata sandi baru untuk akun Anda.
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Kata Sandi Baru *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
                  >
                    {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-9 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                    autoFocus
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

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Konfirmasi Kata Sandi Baru *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
                  >
                    {showConfirmPassword ? 'Sembunyikan' : 'Tampilkan'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full pl-9 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>{isLoading ? 'Menyimpan...' : 'Perbarui Kata Sandi'}</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Sukses! */}
          {step === 4 && (
            <div className="py-4 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-900">
                  Kata Sandi Berhasil Diperbarui!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Akun <strong className="text-slate-800">{identifier}</strong> kini dapat diakses dengan kata sandi baru yang telah Anda atur.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Kembali ke Halaman Masuk</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
