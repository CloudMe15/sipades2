import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CitizenRequest } from '../../types';
import { SERVICE_METAS } from '../../data/mockData';
import {
  Upload,
  CheckCircle2,
  FileCheck2,
  Send,
  Eye,
  Camera,
  Download,
  Clock,
  Sparkles
} from 'lucide-react';

export const CompletionUploadView: React.FC = () => {
  const {
    requests,
    operatorCompleteRequest,
    setLetterModalRequest,
    setSelectedRequest,
    setWaModalOpen
  } = useApp();

  const awaitingCompletionRequests = requests.filter(
    r => r.status === 'menunggu_ttd_kades' || r.status === 'diproses'
  );

  const [uploadMap, setUploadMap] = useState<
    Record<string, { name: string; url: string }>
  >({});
  const [successNote, setSuccessNote] = useState('');

  const handleSimulateScan = (req: CitizenRequest) => {
    setUploadMap(prev => ({
      ...prev,
      [req.id]: {
        name: `Scan_Surat_Resmi_${req.serviceType}_${req.namaLengkap.replace(/\s+/g, '_')}_Signed_Stempel.pdf`,
        url: 'https://placehold.co/600x800/047857/ffffff?text=SURAT+RESMI+TERTANDATANGANI+BASAH+KADES+%2B+CAP+DESA'
      }
    }));
  };

  const handleComplete = (req: CitizenRequest) => {
    const uploaded = uploadMap[req.id];
    operatorCompleteRequest(
      req.id,
      uploaded?.url ||
        'https://placehold.co/600x800/047857/ffffff?text=SURAT+RESMI+TERTANDATANGANI+BASAH+KADES+%2B+CAP+DESA',
      uploaded?.name
    );

    setSuccessNote(
      `Permohonan ${req.namaLengkap} (${req.ticketNumber}) berhasil diselesaikan! Notifikasi WhatsApp otomatis telah dikirimkan ke warga (${req.nomorWhatsapp}).`
    );
    setTimeout(() => setSuccessNote(''), 7000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-emerald-950">
              Menu Penyelesaian & Upload Scan Dokumen
            </h3>
            <p className="text-xs text-emerald-800 mt-0.5">
              Setelah surat fisik asli ditandatangani basah oleh Kepala Desa dan distempel, Operator memindai (scan) fisik surat, mengunggahnya ke sistem, dan menekan <strong>"Selesai & Siap Diambil"</strong>. Sistem akan otomatis mengirimkan pesan WhatsApp ke warga.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-2xl font-black text-emerald-700">
            {awaitingCompletionRequests.length}
          </span>
          <span className="text-[11px] text-emerald-800 block font-medium">
            Siap Diselesaikan
          </span>
        </div>
      </div>

      {successNote && (
        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span className="font-bold">{successNote}</span>
          </div>
          <button
            onClick={() => setWaModalOpen(true)}
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Buka Log WhatsApp Gateway
          </button>
        </div>
      )}

      {awaitingCompletionRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-2xs">
          Tidak ada berkas yang menunggu penyelesaian atau unggah scan surat.
        </div>
      ) : (
        <div className="space-y-4">
          {awaitingCompletionRequests.map(req => {
            const uploaded = uploadMap[req.id];
            const meta = SERVICE_METAS[req.serviceType];

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 hover:border-emerald-300 transition"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                        {req.ticketNumber}
                      </span>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {req.serviceType}
                      </span>
                      <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-semibold">
                        No. Surat: {req.nomorSuratDesa || '470/120/DS-SKM/2026'}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 mt-2">
                      {req.namaLengkap}
                    </h4>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1">
                      <span>NIK: {req.nik}</span>
                      <span>•</span>
                      <span>RT {req.rt} / RW {req.rw}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">
                        WA: {req.nomorWhatsapp}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setLetterModalRequest(req)}
                      className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Cek Draf Format</span>
                    </button>

                    <button
                      onClick={() => handleSimulateScan(req)}
                      className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {uploaded ? 'Ganti File Scan' : '+ Lampirkan Scan Surat Ditandatangani'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleComplete(req)}
                      className="px-5 py-2 text-xs font-black text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md shadow-emerald-700/20 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesai & Siap Diambil (Kirim WA)</span>
                    </button>
                  </div>
                </div>

                {/* Upload Status Card */}
                {uploaded && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold font-mono">{uploaded.name}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-medium bg-emerald-100 px-2 py-0.5 rounded">
                      Siap diterbitkan & dikirim ke warga
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
