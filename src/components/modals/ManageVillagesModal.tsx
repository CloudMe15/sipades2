import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Building2,
  UserCheck,
  Search,
  Save,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Landmark,
  AlertCircle
} from 'lucide-react';

export const ManageVillagesModal: React.FC = () => {
  const {
    manageVillagesModalOpen,
    setManageVillagesModalOpen,
    villages,
    updateVillageKades,
    resetVillagesToDefault,
    currentUser
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [editedKades, setEditedKades] = useState<Record<string, { kades: string; phone: string }>>({});
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);
  const [globalMessage, setGlobalMessage] = useState<string | null>(null);

  if (!manageVillagesModalOpen) return null;

  const filteredVillages = villages.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.kades.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKadesChange = (villageId: string, value: string) => {
    setEditedKades(prev => ({
      ...prev,
      [villageId]: {
        kades: value,
        phone: prev[villageId]?.phone ?? (villages.find(v => v.id === villageId)?.phone || '')
      }
    }));
  };

  const handlePhoneChange = (villageId: string, value: string) => {
    setEditedKades(prev => ({
      ...prev,
      [villageId]: {
        kades: prev[villageId]?.kades ?? (villages.find(v => v.id === villageId)?.kades || ''),
        phone: value
      }
    }));
  };

  const handleSaveOne = async (villageId: string, villageName: string) => {
    const edit = editedKades[villageId];
    const current = villages.find(v => v.id === villageId);
    const newKades = edit?.kades !== undefined ? edit.kades.trim() : current?.kades || '';
    const newPhone = edit?.phone !== undefined ? edit.phone.trim() : current?.phone || '';

    if (!newKades) {
      alert('Nama Kepala Desa tidak boleh kosong.');
      return;
    }

    const success = await updateVillageKades(villageId, newKades, newPhone);
    if (success) {
      setSavedSuccessId(villageId);
      setGlobalMessage(`Nama Kepala Desa ${villageName} berhasil diperbarui menjadi "${newKades}"!`);
      setTimeout(() => setSavedSuccessId(null), 2500);
      setTimeout(() => setGlobalMessage(null), 4000);
    }
  };

  const handleSaveAll = async () => {
    let count = 0;
    for (const [vId, val] of Object.entries(editedKades)) {
      if (val.kades && val.kades.trim()) {
        await updateVillageKades(vId, val.kades.trim(), val.phone?.trim());
        count++;
      }
    }

    setGlobalMessage(`Berhasil menyimpan perubahan data untuk ${count || 'seluruh'} Kepala Desa!`);
    setTimeout(() => setGlobalMessage(null), 4000);
  };

  const handleResetDefault = () => {
    if (window.confirm('Kembalikan seluruh nama Kepala Desa ke data bawaan awal kecamatan?')) {
      resetVillagesToDefault();
      setEditedKades({});
      setGlobalMessage('Seluruh nama Kepala Desa berhasil dikembalikan ke pengaturan default.');
      setTimeout(() => setGlobalMessage(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  Kelola Nama Kepala Desa (19 Desa)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider">
                  Super Admin Panel
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Pemerintah Kecamatan Rakit Kulim • Perbarui nama pejabat penandatangan draf surat resmi
              </p>
            </div>
          </div>

          <button
            onClick={() => setManageVillagesModalOpen(false)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer"
            title="Tutup Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Notification Banner */}
        {globalMessage && (
          <div className="px-6 py-2.5 bg-emerald-100 border-b border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{globalMessage}</span>
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 bg-indigo-50/70 border-b border-indigo-100 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-900">
            <span className="font-bold">Otoritas Penggantian Nama Kepala Desa:</span>
            <p className="text-indigo-800 text-[11px] mt-0.5 leading-relaxed">
              Nama Kepala Desa yang disimpan di panel ini akan langsung terhubung ke format pencetakan draf surat resmi desa (bagian nama di bawah tanda tangan basah), verifikasi publik dokumen, dan sistem registrasi pelayanan se-Kecamatan Rakit Kulim.
            </p>
          </div>
        </div>

        {/* Search Bar & Stats */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari desa atau nama kepala desa..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Menampilkan <strong>{filteredVillages.length}</strong> dari <strong>19</strong> Desa</span>
            <button
              onClick={handleResetDefault}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center gap-1 cursor-pointer transition shadow-2xs"
              title="Reset ke nama bawaan default"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Default</span>
            </button>
          </div>
        </div>

        {/* Villages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredVillages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Tidak ada desa yang cocok dengan kata kunci pencarian "{searchQuery}".
            </div>
          ) : (
            filteredVillages.map((village, idx) => {
              const currentVal = editedKades[village.id]?.kades ?? village.kades;
              const currentPhone = editedKades[village.id]?.phone ?? village.phone;
              const hasChanged = currentVal !== village.kades || currentPhone !== village.phone;
              const isSaved = savedSuccessId === village.id;

              return (
                <div
                  key={village.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSaved
                      ? 'border-emerald-400 bg-emerald-50/40 ring-2 ring-emerald-400/20'
                      : hasChanged
                      ? 'border-indigo-300 bg-indigo-50/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    {/* Village Info */}
                    <div className="md:col-span-4">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">
                          {village.name}
                        </h4>
                        {village.isCapital && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-black border border-emerald-300">
                            Ibukota
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1 font-mono">
                        <span>Kode: {village.code}</span>
                        <span>•</span>
                        <span>{village.rtCount} RT / {village.rwCount} RW</span>
                      </div>
                    </div>

                    {/* Input Nama Kepala Desa */}
                    <div className="md:col-span-4">
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Nama Kepala Desa (Kades)
                      </label>
                      <input
                        type="text"
                        value={currentVal}
                        onChange={e => handleKadesChange(village.id, e.target.value)}
                        placeholder="Nama Kepala Desa..."
                        className="w-full px-3 py-1.5 text-xs font-semibold text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>

                    {/* Input No HP / Kontak */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                        Kontak / Telepon
                      </label>
                      <input
                        type="text"
                        value={currentPhone}
                        onChange={e => handlePhoneChange(village.id, e.target.value)}
                        placeholder="No. HP..."
                        className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-700 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>

                    {/* Action Button */}
                    <div className="md:col-span-2 flex items-center justify-end">
                      <button
                        onClick={() => handleSaveOne(village.id, village.name)}
                        disabled={!hasChanged && !isSaved}
                        className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                          isSaved
                            ? 'bg-emerald-600 text-white'
                            : hasChanged
                            ? 'bg-indigo-700 hover:bg-indigo-800 text-white shadow-indigo-600/20'
                            : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        }`}
                      >
                        {isSaved ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tersimpan</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Simpan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Perubahan nama Kepala Desa berlaku secara instan pada sistem cetak dan database.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setManageVillagesModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              Tutup
            </button>

            {Object.keys(editedKades).length > 0 && (
              <button
                onClick={handleSaveAll}
                className="px-5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-700/20 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Semua ({Object.keys(editedKades).length})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
