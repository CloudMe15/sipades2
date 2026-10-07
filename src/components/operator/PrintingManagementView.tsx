import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CitizenRequest } from '../../types';
import { SERVICE_METAS } from '../../data/mockData';
import { StatusBadge } from '../common/StatusBadge';
import {
  Printer,
  FileCheck,
  Send,
  Eye,
  FileText,
  Clock,
  CheckCircle2,
  Filter,
  Upload,
  FileCheck2,
  Check
} from 'lucide-react';

export const PrintingManagementView: React.FC = () => {
  const {
    requests,
    operatorSendToKades,
    setLetterModalRequest,
    setSelectedRequest,
    uploadManualSignedFile,
    setPreviewSignedDoc
  } = useApp();

  const [filterMode, setFilterMode] = useState<'all' | 'diproses' | 'ttd_kades'>('all');
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const printingRequests = requests.filter(r => {
    if (filterMode === 'diproses') return r.status === 'diproses';
    if (filterMode === 'ttd_kades') return r.status === 'menunggu_ttd_kades';
    return r.status === 'diproses' || r.status === 'menunggu_ttd_kades';
  });

  const handleFileUpload = (req: CitizenRequest, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;
        uploadManualSignedFile(req.id, resultUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 sm:p-6 flex items-start justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-blue-950">
                Pencetakan Fisik & Tanda Tangan Basah Kepala Desa
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-200/70 text-blue-900 text-[10px] font-black uppercase tracking-wider">
                Verifikasi Offline
              </span>
            </div>
            <p className="text-xs text-blue-800 mt-1 max-w-3xl leading-relaxed">
              Cetak draf surat resmi desa (ruang tanda tangan telah dikosongkan), ajukan berkas fisik ke meja Kepala Desa untuk tanda tangan basah dan cap dinas. Setelah ditandatangani, Anda dapat langsung mengunggah scan berkas di bawah ini.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0 bg-white/80 px-4 py-2 rounded-2xl border border-blue-200 hidden sm:block">
          <span className="text-2xl font-black text-blue-700">
            {printingRequests.length}
          </span>
          <span className="text-[11px] text-blue-800 block font-medium">
            Dalam Antrean
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs ${
            filterMode === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Semua Antrean Cetak & TTD ({requests.filter(r => r.status === 'diproses' || r.status === 'menunggu_ttd_kades').length})
        </button>

        <button
          onClick={() => setFilterMode('diproses')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs ${
            filterMode === 'diproses'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          1. Cetak Draf Fisik ({requests.filter(r => r.status === 'diproses').length})
        </button>

        <button
          onClick={() => setFilterMode('ttd_kades')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs ${
            filterMode === 'ttd_kades'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          2. Di Meja Kades (Menunggu TTD) ({requests.filter(r => r.status === 'menunggu_ttd_kades').length})
        </button>
      </div>

      {printingRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 shadow-2xs">
          Tidak ada berkas dalam antrean pencetakan atau tanda tangan Kades saat ini.
        </div>
      ) : (
        <div className="space-y-4">
          {printingRequests.map(req => {
            const isWaitingKades = req.status === 'menunggu_ttd_kades';
            const scanAttachment = req.attachments.find(a => a.type === 'surat_selesai_scan');
            const hasSignedDoc = !!req.isManuallySigned || !!scanAttachment;
            const signedDocUrl = req.signedDocumentUrl || scanAttachment?.fileUrl;
            const signedDocName = req.signedDocumentName || scanAttachment?.name;

            return (
              <div
                key={req.id}
                className={`bg-white rounded-3xl border shadow-2xs p-5 sm:p-6 transition ${
                  isWaitingKades
                    ? 'border-purple-200 bg-purple-50/15'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {/* Hidden input for direct upload */}
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  ref={el => {
                    fileInputRefs.current[req.id] = el;
                  }}
                  onChange={e => handleFileUpload(req, e)}
                  className="hidden"
                />

                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                        {req.ticketNumber}
                      </span>
                      <StatusBadge status={req.status} size="sm" />
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {req.serviceType}
                      </span>

                      {/* Manual Signature Status Badge */}
                      {hasSignedDoc ? (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ✍️ Berkas Sudah Ditandatangani Manual
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-purple-800 bg-purple-100/70 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-600" />
                          Fisik Belum Selesai Ditandatangani
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-base text-slate-900 pt-1">
                      {req.namaLengkap}
                    </h4>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                      <span>
                        Nomor Surat:{' '}
                        <strong className="font-mono text-slate-900">
                          {req.nomorSuratDesa || '470/120/DS-SKM/2026'}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>NIK: <span className="font-mono">{req.nik}</span></span>
                      <span>•</span>
                      <span>RT {req.rt} / RW {req.rw} ({req.desa || 'Desa Kelayang'})</span>
                    </div>

                    <p className="text-xs text-slate-500 max-w-2xl">
                      Keperluan: <span className="italic">{req.keperluan}</span>
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setLetterModalRequest(req)}
                      className="px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Draf Surat Resmi</span>
                    </button>

                    {!isWaitingKades && (
                      <button
                        onClick={() => operatorSendToKades(req.id)}
                        className="px-3.5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Ajukan ke Meja TTD Kades</span>
                      </button>
                    )}

                    {/* Direct Upload / Preview Button */}
                    {hasSignedDoc && signedDocUrl ? (
                      <button
                        onClick={() =>
                          setPreviewSignedDoc({
                            url: signedDocUrl,
                            name: signedDocName || 'Scan_TTD_Manual.pdf',
                            request: req
                          })
                        }
                        className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Lihat Berkas Scan TTD</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[req.id]?.click()}
                        className="px-3.5 py-2 text-xs font-bold text-purple-900 bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        title="Upload file hasil scan/foto surat setelah ditandatangani manual oleh Kades"
                      >
                        <Upload className="w-3.5 h-3.5 text-purple-700" />
                        <span>+ Unggah Hasil TTD Kades</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Additional Notice if Signed */}
                {hasSignedDoc && (
                  <div className="mt-3.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Scan fisik bertanda tangan basah telah terlampir: <strong className="font-mono">{signedDocName}</strong>
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      Buka menu "3. Unggah Berkas & Selesai" untuk menerbitkan ke warga
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
