import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  Check,
  XCircle,
  Clock,
  UserCheck,
  Building2,
  Users,
  Landmark,
  Phone,
  Mail,
  Trash2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const AdminApprovalModal: React.FC = () => {
  const {
    adminApprovalModalOpen,
    setAdminApprovalModalOpen,
    users,
    approveUser,
    rejectUser,
    deleteUser,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'rejected'>('pending');
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!adminApprovalModalOpen) return null;

  const pendingUsers = users.filter(u => u.status === 'pending');
  const activeUsers = users.filter(u => !u.status || u.status === 'active');
  const rejectedUsers = users.filter(u => u.status === 'rejected');

  const handleApprove = async (id: string, name: string) => {
    await approveUser(id);
    setActionMessage({ text: `Akun ${name} berhasil disetujui & diaktifkan!`, type: 'success' });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleReject = async (id: string, name: string) => {
    await rejectUser(id);
    setActionMessage({ text: `Pendaftaran akun ${name} telah ditolak.`, type: 'error' });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Hapus permanen akun ${name}?`)) {
      await deleteUser(id);
      setActionMessage({ text: `Akun ${name} telah dihapus permanen.`, type: 'success' });
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'rt':
        return { label: 'Frontline RT', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'operator':
        return { label: 'Operator Desa', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'kecamatan':
        return { label: 'Staf PATEN', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'admin':
        return { label: 'Super Admin', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      default:
        return { label: role, color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">
                  Konfirmasi & Persetujuan Akun Aparatur
                </h3>
                {pendingUsers.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                    {pendingUsers.length} Menunggu
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300">
                Pemerintah Kecamatan Rakit Kulim • Super Admin Master Control
              </p>
            </div>
          </div>

          <button
            onClick={() => setAdminApprovalModalOpen(false)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0 bg-slate-50/60">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Menunggu Konfirmasi ({pendingUsers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Akun Aktif ({activeUsers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'rejected'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Ditolak ({rejectedUsers.length})</span>
            </button>
          </div>
        </div>

        {/* Alert Notification */}
        {actionMessage && (
          <div
            className={`mx-6 mt-3 p-3 rounded-xl border text-xs flex items-center gap-2 font-medium shrink-0 ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Content List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {activeTab === 'pending' && (
            <>
              {pendingUsers.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">Tidak ada pendaftaran yang menunggu persetujuan</p>
                  <p className="text-xs text-slate-500">
                    Semua akun yang didaftarkan secara mandiri telah diverifikasi oleh Administrator Master.
                  </p>
                </div>
              ) : (
                pendingUsers.map(u => {
                  const roleBadge = getRoleBadge(u.role);
                  return (
                    <div
                      key={u.id}
                      className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:border-amber-300 transition"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{u.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${roleBadge.color}`}>
                              {roleBadge.label}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                              Username: @{u.username}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            {u.identifier} • <strong>{u.village}</strong>
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono">
                            {u.phone && <span>📱 {u.phone}</span>}
                            {u.registeredAt && <span>🕒 Terdaftar: {u.registeredAt}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => handleReject(u.id, u.name)}
                          className="px-3 py-1.5 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Tolak</span>
                        </button>
                        <button
                          onClick={() => handleApprove(u.id, u.name)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Setujui (Aktivasi)</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {activeTab === 'active' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 mb-2">
                Menampilkan seluruh akun resmi yang aktif dan dapat login ke dalam sistem SIPADES:
              </p>
              {activeUsers.map(u => {
                const roleBadge = getRoleBadge(u.role);
                const isSuperAdmin = u.role === 'admin';
                return (
                  <div
                    key={u.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-bold text-slate-900">{u.name}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${roleBadge.color}`}>
                            {roleBadge.label}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          Username: <strong className="text-slate-700 font-mono">@{u.username}</strong> • {u.identifier} ({u.village})
                        </div>
                      </div>
                    </div>

                    {!isSuperAdmin && (
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                        title="Hapus Akun"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'rejected' && (
            <>
              {rejectedUsers.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                  Tidak ada akun yang ditolak.
                </div>
              ) : (
                rejectedUsers.map(u => (
                  <div
                    key={u.id}
                    className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900">{u.name} (Username: @{u.username})</div>
                      <div className="text-[11px] text-rose-700">{u.identifier} • {u.village}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(u.id, u.name)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer"
                      >
                        Pulihkan & Aktifkan
                      </button>
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        className="p-1 rounded-lg text-rose-600 hover:bg-rose-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
          <span>Kredensial Master: Akun Super Admin Kecamatan Rakit Kulim</span>
          <button
            onClick={() => setAdminApprovalModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
