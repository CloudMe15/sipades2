import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CitizenRequest } from '../../types';
import {
  BookOpen,
  CheckCircle2,
  Search,
  UserCheck,
  Calendar,
  Clock,
  ShieldCheck,
  X,
  FileCheck2,
  Archive,
  Download
} from 'lucide-react';

export const HandoverBookView: React.FC = () => {
  const { requests, recordHandover, currentUser, setLetterModalRequest } = useApp();

  const [activeTab, setActiveTab] = useState<'pending_pickup' | 'archive'>('pending_pickup');
  const [searchQuery, setSearchQuery] = useState('');

  // Handover action modal state
  const [handoverReq, setHandoverReq] = useState<CitizenRequest | null>(null);
  const [pickedUpBy, setPickedUpBy] = useState('');
  const [relation, setRelation] = useState<'Pemohon Sendiri' | 'Keluarga 1 KK' | 'Kuasa/Perwakilan'>('Pemohon Sendiri');
  const [idCardVerified, setIdCardVerified] = useState(true);
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const readyRequests = requests.filter(r => r.status === 'selesai_siap_ambil');
  const archivedRequests = requests.filter(r => r.status === 'sudah_diambil');

  const displayedRequests = (
    activeTab === 'pending_pickup' ? readyRequests : archivedRequests
  ).filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.namaLengkap.toLowerCase().includes(q) ||
      r.nik.includes(q) ||
      r.ticketNumber.toLowerCase().includes(q) ||
      (r.nomorSuratDesa && r.nomorSuratDesa.toLowerCase().includes(q))
    );
  });

  const handleOpenHandover = (req: CitizenRequest) => {
    setHandoverReq(req);
    setPickedUpBy(req.namaLengkap);
    setRelation('Pemohon Sendiri');
    setIdCardVerified(true);
    setNotes('Diserahkan langsung dengan mencocokkan e-KTP Asli pemohon. Fisik surat utuh berstempel.');
  };

  const handleSubmitHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoverReq) return;
    if (!idCardVerified) {
      alert('Pemeriksaan identitas / e-KTP asli wajib dicentang untuk keamanan arsip desa.');
      return;
    }

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timestampStr = `${day} ${month} ${year}, ${hours}:${minutes} WIB`;

    recordHandover(handoverReq.id, {
      pickedUpAt: timestampStr,
      pickedUpBy: pickedUpBy || handoverReq.namaLengkap,
      relationToCitizen: relation,
      operatorName: currentUser?.name || 'Asep Ridwan, S.Kom',
      notes: notes || undefined,
      idCardVerified: true
    });

    setSuccessMsg(
      `Fisik surat ${handoverReq.serviceType} atas nama ${handoverReq.namaLengkap} berhasil dicatat dalam Buku Tamu Ekspedisi!`
    );
    setTimeout(() => setSuccessMsg(''), 6000);
    setHandoverReq(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              Buku Ekspedisi & Serah Terima Dokumen (Digital Handover Book)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Menggantikan buku ekspedisi fisik manual. Petugas loket mencatat warga yang datang mengambil dokumen fisik asli, memverifikasi KTP asli, dan mengarsipkan tanda bukti pengambilan secara permanen.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-2xl font-black text-emerald-400">
            {readyRequests.length}
          </span>
          <span className="text-[11px] text-slate-400 block font-medium">
            Menunggu Diambil
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {/* Tabs and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pending_pickup')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'pending_pickup'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Siap Diambil di Loket ({readyRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('archive')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'archive'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Riwayat Sudah Diserahkan ({archivedRequests.length})</span>
          </button>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari NIK, Nama Warga, No. Surat..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Table of Handover records */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center text-slate-400">#</th>
                <th className="py-3 px-4">No. Registrasi Surat</th>
                <th className="py-3 px-4">Warga Pemohon & NIK</th>
                <th className="py-3 px-4">Jenis Surat</th>
                {activeTab === 'pending_pickup' ? (
                  <>
                    <th className="py-3 px-4">Status Pengambilan</th>
                    <th className="py-3 px-4 text-center">Aksi Serah Terima</th>
                  </>
                ) : (
                  <>
                    <th className="py-3 px-4">Penerima & Waktu Ambil</th>
                    <th className="py-3 px-4">Petugas Loket & Catatan</th>
                    <th className="py-3 px-4 text-center">Dokumen</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada data dalam buku ekspedisi untuk kategori ini.
                  </td>
                </tr>
              ) : (
                displayedRequests.map((req, idx) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {req.nomorSuratDesa || req.ticketNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{req.namaLengkap}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        NIK: {req.nik} • RT {req.rt}/RW {req.rw}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {req.serviceType}
                      </span>
                    </td>

                    {activeTab === 'pending_pickup' ? (
                      <>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 w-fit">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Siap Diambil di Loket
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleOpenHandover(req)}
                            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 mx-auto shadow-2xs"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Proses Serah Terima</span>
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">
                            {req.handover?.pickedUpBy || req.namaLengkap}
                          </div>
                          <div className="text-[11px] text-emerald-700 font-semibold">
                            Hubungan: {req.handover?.relationToCitizen || 'Pemohon Sendiri'}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {req.handover?.pickedUpAt || req.updatedAt}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-xs text-slate-700">
                            Operator: <strong>{req.handover?.operatorName || 'Asep Ridwan'}</strong>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 italic">
                            "{req.handover?.notes || 'KTP asli terverifikasi cocok'}"
                          </p>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setLetterModalRequest(req)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="Format Surat Fisik"
                          >
                            <FileCheck2 className="w-4 h-4 text-blue-600" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Handover Dialog Form */}
      {handoverReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">
                  Formulir Serah Terima Dokumen Fisik Asli
                </h3>
              </div>
              <button
                onClick={() => setHandoverReq(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitHandover} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div>
                  <span className="text-slate-500">Nomor Surat:</span>{' '}
                  <strong className="font-mono text-slate-900">
                    {handoverReq.nomorSuratDesa || handoverReq.ticketNumber}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Jenis Dokumen:</span>{' '}
                  <strong className="text-blue-700">{handoverReq.serviceType}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Nama Pemohon (KTP):</span>{' '}
                  <strong className="text-slate-900">{handoverReq.namaLengkap}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama yang Mengambil Dokumen Fisik *
                </label>
                <input
                  type="text"
                  value={pickedUpBy}
                  onChange={e => setPickedUpBy(e.target.value)}
                  placeholder="Nama orang yang hadir di loket"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hubungan dengan Pemohon *
                </label>
                <select
                  value={relation}
                  onChange={e =>
                    setRelation(
                      e.target.value as 'Pemohon Sendiri' | 'Keluarga 1 KK' | 'Kuasa/Perwakilan'
                    )
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                >
                  <option value="Pemohon Sendiri">Pemohon Sendiri (Sesuai KTP)</option>
                  <option value="Keluarga 1 KK">Keluarga dalam 1 Kartu Keluarga</option>
                  <option value="Kuasa/Perwakilan">Pihak Kuasa / Perwakilan Surat Kuasa</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={idCardVerified}
                    onChange={e => setIdCardVerified(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    required
                  />
                  <span className="text-xs font-bold text-emerald-900">
                    e-KTP Asli telah dicocokkan & sesuai dengan data registrasi
                  </span>
                </label>
                <p className="text-[10px] text-emerald-700 mt-1 pl-6">
                  Wajib diverifikasi secara fisik oleh petugas loket sebelum berkas asli diserahkan.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Petugas Loket (Opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Contoh: Kondisi surat baik dan cap basah jelas."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setHandoverReq(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Konfirmasi Serah Terima Fisik</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
