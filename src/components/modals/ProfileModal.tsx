import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RAKIT_KULIM_VILLAGES } from '../../data/mockData';
import {
  User,
  Camera,
  X,
  Check,
  ShieldCheck,
  Phone,
  Mail,
  Building2,
  Lock,
  Save,
  AlertTriangle,
  CheckCircle2,
  Upload
} from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const {
    currentUser,
    profileModalOpen,
    setProfileModalOpen,
    updateProfile
  } = useApp();

  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [village, setVillage] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const AVATAR_PRESETS = [
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', label: 'Pria Formal 1' },
    { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', label: 'Pria Formal 2' },
    { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', label: 'Pria Formal 3' },
    { url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', label: 'Pria Formal 4' },
    { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', label: 'Wanita Formal 1' },
    { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', label: 'Wanita Formal 2' },
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', label: 'Wanita Formal 3' },
    { url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', label: 'Operator Loket' },
    { url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', label: 'Pejabat Formal' }
  ];

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setIdentifier(currentUser.identifier || '');
      setVillage(currentUser.village || 'Desa Kelayang');
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email || '');
      setAvatar(currentUser.avatar || '');
      setPassword(currentUser.password || 'password123');
      setMessage(null);
    }
  }, [currentUser, profileModalOpen]);

  if (!profileModalOpen || !currentUser) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ text: 'Ukuran foto maksimal 2MB.', type: 'error' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage({ text: 'Nama lengkap wajib diisi.', type: 'error' });
      return;
    }

    setIsSaving(true);
    setMessage(null);
    try {
      const res = await updateProfile({
        name: name.trim(),
        identifier: identifier.trim(),
        village: village.trim(),
        phone: phone.trim(),
        email: email.trim(),
        avatar: avatar.trim(),
        password: password.trim() || undefined
      });

      if (res.success) {
        setMessage({ text: 'Profil dan foto Anda berhasil diperbarui!', type: 'success' });
        setTimeout(() => {
          setProfileModalOpen(false);
        }, 1200);
      } else {
        setMessage({ text: res.message, type: 'error' });
      }
    } catch {
      setMessage({ text: 'Gagal memperbarui profil.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleLabel = () => {
    switch (currentUser.role) {
      case 'rt':
        return 'Ketua / Pengurus RT';
      case 'operator':
        return 'Operator Pelayanan Kantor Desa';
      case 'kecamatan':
        return 'Kasi / Staf PATEN Kecamatan';
      default:
        return currentUser.role;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full my-6 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                Edit Profil Akun Aparatur
              </h3>
              <p className="text-xs text-slate-400">
                Ubah nama, foto profil, wilayah tugas & kredensial akun
              </p>
            </div>
          </div>

          <button
            onClick={() => setProfileModalOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Notification Alert */}
          {message && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 font-medium ${
                message.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Avatar Preview & Selection */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="relative shrink-0">
              <img
                src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={name}
                className="w-18 h-18 rounded-2xl object-cover ring-4 ring-white shadow-md"
              />
              <label
                htmlFor="upload-avatar"
                className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer"
                title="Unggah Foto dari Komputer"
              >
                <Camera className="w-3.5 h-3.5" />
                <input
                  id="upload-avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Peran Akun (RBAC)
                </span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                  {getRoleLabel()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Pilih foto avatar di bawah atau klik ikon kamera untuk unggah foto Anda sendiri:
              </p>
            </div>
          </div>

          {/* Avatar Presets Slider */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilihan Preset Foto Resmi:
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {AVATAR_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(p.url)}
                  className={`relative rounded-full shrink-0 ring-2 transition cursor-pointer p-0.5 ${
                    avatar === p.url ? 'ring-emerald-600 scale-105' : 'ring-transparent hover:ring-slate-300'
                  }`}
                  title={p.label}
                >
                  <img
                    src={p.url}
                    alt={p.label}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  {avatar === p.url && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap & Gelar *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Contoh: Junaidi, S.Pd"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Jabatan / Identifier & Desa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jabatan / Identitas Tugas *
              </label>
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Contoh: Ketua RT 01 / RW 01"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Desa Domisili / Tugas *
              </label>
              <select
                value={village}
                onChange={e => setVillage(e.target.value)}
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
          </div>

          {/* Kontak WhatsApp & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0812-7654-3201"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Akun
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="rt01@rakitkulim.desa.id"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Kata Sandi (Password Baru) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kata Sandi Akun (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Kata sandi akun Anda"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Disimpan untuk masuk ke portal petugas berikutnya.
            </span>
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setProfileModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Profil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
