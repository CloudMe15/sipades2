import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VerificationQueueView } from './VerificationQueueView';
import { PrintingManagementView } from './PrintingManagementView';
import { CompletionUploadView } from './CompletionUploadView';
import { HandoverBookView } from './HandoverBookView';
import {
  Inbox,
  Printer,
  Upload,
  BookOpen,
  CheckCircle2,
  Clock,
  Building2,
  TrendingUp,
  FileCheck2,
  AlertCircle,
  Download
} from 'lucide-react';

export const OperatorDashboard: React.FC = () => {
  const {
    requests,
    currentUser,
    exportRequestsToCsv
  } = useApp();

  const [activeMenu, setActiveMenu] = useState<
    'verification' | 'printing' | 'completion' | 'handover'
  >('verification');

  // Workload metrics
  const countVerification = requests.filter(r => r.status === 'menunggu_verifikasi').length;
  const countPrinting = requests.filter(
    r => r.status === 'diproses' || r.status === 'menunggu_ttd_kades'
  ).length;
  const countPendingKades = requests.filter(r => r.status === 'menunggu_ttd_kades').length;
  const countReadyPickup = requests.filter(r => r.status === 'selesai_siap_ambil').length;
  const countArchived = requests.filter(r => r.status === 'sudah_diambil').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-blue-200 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Unit Pelayanan Administrasi {currentUser?.village || 'Desa Kelayang'} • Kec. Rakit Kulim</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Dashboard Operator: {currentUser?.name || 'Operator Loket'}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl">
              Alur kerja terpadu: Verifikasi berkas masuk dari seluruh RT se-Kecamatan Rakit Kulim, cetak surat fisik ber-Kop resmi desa, pengajuan tanda tangan basah Kades, scan surat terbit, hingga pencatatan serah terima buku tamu digital.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportRequestsToCsv()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow transition cursor-pointer"
              title="Unduh seluruh rekapan permohonan warga ke format Excel / CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export Rekap Excel ({requests.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Workload Summary Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Antrean Verifikasi */}
        <div
          onClick={() => setActiveMenu('verification')}
          className={`p-5 rounded-2xl border shadow-2xs transition cursor-pointer ${
            activeMenu === 'verification'
              ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-300/30'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              1. Verifikasi Masuk
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">
              {countVerification}
            </span>
            <span className="text-xs text-slate-400">Berkas baru</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {countVerification > 0 ? '⚠️ Butuh tinjauan operator' : 'Semua sudah ditinjau'}
          </div>
        </div>

        {/* Antrean Cetak & TTD Kades */}
        <div
          onClick={() => setActiveMenu('printing')}
          className={`p-5 rounded-2xl border shadow-2xs transition cursor-pointer ${
            activeMenu === 'printing'
              ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-300/30'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              2. Cetak & TTD Kades
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600">{countPrinting}</span>
            <span className="text-xs text-purple-700 font-bold">
              ({countPendingKades} di Meja Kades)
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Cetak draf fisik & tanda tangan
          </div>
        </div>

        {/* Penyelesaian & Upload Scan */}
        <div
          onClick={() => setActiveMenu('completion')}
          className={`p-5 rounded-2xl border shadow-2xs transition cursor-pointer ${
            activeMenu === 'completion'
              ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-300/30'
              : 'bg-white border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              3. Scan & Terbitkan
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-600">
              {countPendingKades}
            </span>
            <span className="text-xs text-slate-400">Siap scan</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Upload hasil scan & kirim WA
          </div>
        </div>

        {/* Buku Tamu Pengambilan */}
        <div
          onClick={() => setActiveMenu('handover')}
          className={`p-5 rounded-2xl border shadow-2xs transition cursor-pointer ${
            activeMenu === 'handover'
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-300/30'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              4. Buku Ekspedisi Loket
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">
              {countReadyPickup}
            </span>
            <span className="text-xs text-slate-400">Menunggu warga</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {countArchived} berkas sudah diserahkan
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs matching required workflows */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex items-center gap-1 shadow-2xs overflow-x-auto">
        <button
          onClick={() => setActiveMenu('verification')}
          className={`flex-1 min-w-[210px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeMenu === 'verification'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>1. Verifikasi Berkas Masuk</span>
          {countVerification > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white text-amber-800 font-bold">
              {countVerification}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveMenu('printing')}
          className={`flex-1 min-w-[210px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeMenu === 'printing'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>2. Cetak & TTD Kades</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-800 text-blue-100">
            {countPrinting}
          </span>
        </button>

        <button
          onClick={() => setActiveMenu('completion')}
          className={`flex-1 min-w-[210px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeMenu === 'completion'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>3. Penyelesaian & Upload Scan</span>
        </button>

        <button
          onClick={() => setActiveMenu('handover')}
          className={`flex-1 min-w-[210px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeMenu === 'handover'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>4. Buku Tamu / Ekspedisi Loket</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-800 text-emerald-100">
            {countReadyPickup}
          </span>
        </button>
      </div>

      {/* Views */}
      {activeMenu === 'verification' && <VerificationQueueView />}
      {activeMenu === 'printing' && <PrintingManagementView />}
      {activeMenu === 'completion' && <CompletionUploadView />}
      {activeMenu === 'handover' && <HandoverBookView />}
    </div>
  );
};
