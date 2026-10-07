import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CitizenRequest } from '../../types';
import { SERVICE_METAS } from '../../data/mockData';
import {
  Upload,
  CheckCircle2,
  FileCheck2,
  Eye,
  Camera,
  Download,
  Clock,
  Sparkles,
  FileText,
  Trash2,
  AlertCircle,
  Check
} from 'lucide-react';

interface UploadedFileInfo {
  name: string;
  url: string;
  size?: string;
  uploadedAt: string;
}

export const CompletionUploadView: React.FC = () => {
  const {
    requests,
    operatorCompleteRequest,
    setLetterModalRequest,
    setSelectedRequest,
    setWaModalOpen,
    setPreviewSignedDoc
  } = useApp();

  const awaitingCompletionRequests = requests.filter(
    r => r.status === 'menunggu_ttd_kades' || r.status === 'diproses'
  );

  const [uploadMap, setUploadMap] = useState<Record<string, UploadedFileInfo>>({});
  const [successNote, setSuccessNote] = useState('');
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Hidden file input refs
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleProcessFile = (req: CitizenRequest, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const resultUrl = reader.result as string;
      const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      setUploadMap(prev => ({
        ...prev,
        [req.id]: {
          name: file.name,
          url: resultUrl,
          size: formatFileSize(file.size),
          uploadedAt: nowStr
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (req: CitizenRequest, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleProcessFile(req, files[0]);
    }
  };

  const handleDrop = (req: CitizenRequest, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverId(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(req, e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = (reqId: string) => {
    setUploadMap(prev => {
      const copy = { ...prev };
      delete copy[reqId];
      return copy;
    });
  };

  const handleComplete = (req: CitizenRequest) => {
    const uploaded = uploadMap[req.id];
    const existingScan = req.attachments.find(a => a.type === 'surat_selesai_scan');

    const finalUrl = uploaded?.url || existingScan?.fileUrl || 'https://placehold.co/600x800/047857/ffffff?text=SURAT+RESMI+TERTANDATANGANI+BASAH+KADES+%2B+CAP+DESA';
    const finalName = uploaded?.name || existingScan?.name || `Scan_Surat_Resmi_${req.serviceType}_${req.namaLengkap.replace(/\s+/g, '_')}_Signed_Stempel.pdf`;

    operatorCompleteRequest(req.id, finalUrl, finalName);

    setSuccessNote(
      `Permohonan ${req.namaLengkap} (${req.ticketNumber}) berhasil diselesaikan dengan berkas scan TTD manual! Notifikasi WhatsApp otomatis telah dikirimkan ke warga (${req.nomorWhatsapp}).`
    );
    setTimeout(() => setSuccessNote(''), 7000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 sm:p-6 flex items-start justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-700/20">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-emerald-950">
                Penyelesaian & Upload Berkas TTD Manual
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 text-[10px] font-black uppercase tracking-wider">
                Alur TTD Fisik Kades
              </span>
            </div>
            <p className="text-xs text-emerald-800 mt-1 max-w-3xl leading-relaxed">
              Setelah surat fisik asli dicetak, ditandatangani basah oleh Kepala Desa, dan dibubuhi stempel dinas, unggah foto/scan berkas fisik tersebut di bawah ini. Sistem akan menerbitkan status <strong>"Selesai & Siap Diambil"</strong> serta otomatis mengirimkan notifikasi WhatsApp kepada warga.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0 bg-white/80 px-4 py-2 rounded-2xl border border-emerald-200 hidden sm:block">
          <span className="text-2xl font-black text-emerald-700">
            {awaitingCompletionRequests.length}
          </span>
          <span className="text-[11px] text-emerald-800 block font-medium">
            Siap Diselesaikan
          </span>
        </div>
      </div>

      {successNote && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between gap-2 shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span className="font-bold">{successNote}</span>
          </div>
          <button
            onClick={() => setWaModalOpen(true)}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-2xs transition"
          >
            Buka Log WhatsApp Gateway
          </button>
        </div>
      )}

      {awaitingCompletionRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 shadow-2xs">
          <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-slate-600">Tidak ada berkas yang menunggu tanda tangan manual atau penyelesaian saat ini.</p>
          <p className="text-xs text-slate-400 mt-1">Semua surat yang diproses telah ditandatangani atau berada pada tahap permohonan lain.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {awaitingCompletionRequests.map(req => {
            const uploaded = uploadMap[req.id];
            const existingScan = req.attachments.find(a => a.type === 'surat_selesai_scan');
            const hasFile = !!uploaded || !!existingScan;
            const currentFileName = uploaded?.name || existingScan?.name || '';
            const currentFileUrl = uploaded?.url || existingScan?.fileUrl || '';
            const isDragOver = dragOverId === req.id;

            return (
              <div
                key={req.id}
                onDragOver={e => {
                  e.preventDefault();
                  setDragOverId(req.id);
                }}
                onDragLeave={() => setDragOverId(null)}
                onDrop={e => handleDrop(req, e)}
                className={`bg-white rounded-3xl border p-5 sm:p-6 transition shadow-2xs ${
                  isDragOver
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/30'
                    : hasFile
                    ? 'border-emerald-300 bg-emerald-50/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Hidden File Input for Real Upload */}
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  ref={el => (fileInputRefs.current[req.id] = el)}
                  onChange={e => handleFileInputChange(req, e)}
                  className="hidden"
                />

                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
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
                      {hasFile ? (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" /> File TTD Siap
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" /> Menunggu Unggah Scan TTD
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-base text-slate-900 pt-1">
                      {req.namaLengkap}
                    </h4>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                      <span>NIK: <strong className="font-mono text-slate-700">{req.nik}</strong></span>
                      <span>•</span>
                      <span>RT {req.rt} / RW {req.rw} ({req.desa || 'Desa Kelayang'})</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">
                        WA: {req.nomorWhatsapp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 pt-0.5">
                      Keperluan: <span className="italic">{req.keperluan}</span>
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setLetterModalRequest(req)}
                      className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      title="Lihat format draf surat resmi untuk dicetak fisik"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Draf Cetak Fisik</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[req.id]?.click()}
                      className={`px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                        hasFile
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{hasFile ? 'Ganti Berkas Scan TTD' : '+ Upload File Scan TTD Manual'}</span>
                    </button>

                    <button
                      onClick={() => handleComplete(req)}
                      className="px-4 py-2 text-xs font-black text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md shadow-emerald-700/20 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selesai & Siap Diambil (Kirim WA)</span>
                    </button>
                  </div>
                </div>

                {/* Upload Status Detail Card */}
                {hasFile ? (
                  <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold font-mono text-emerald-950 flex items-center gap-1.5">
                          <span>{currentFileName}</span>
                          {uploaded?.size && (
                            <span className="text-[10px] font-sans font-normal text-emerald-700">
                              ({uploaded.size})
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          ✓ File scan bertanda tangan basah & stempel Kepala Desa siap diterbitkan ke warga
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setPreviewSignedDoc({
                            url: currentFileUrl,
                            name: currentFileName,
                            request: req
                          })
                        }
                        className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pratinjau File TTD</span>
                      </button>

                      {uploaded && (
                        <button
                          onClick={() => handleRemoveFile(req.id)}
                          className="p-1.5 rounded-xl hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                          title="Batalkan file ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRefs.current[req.id]?.click()}
                    className="mt-4 p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-400 bg-slate-50/60 hover:bg-emerald-50/30 transition cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500"
                  >
                    <div className="flex items-center gap-2.5">
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span>
                        Tarik & lepas file foto/PDF scan surat bertanda tangan basah di sini, atau <strong className="text-emerald-700 underline">klik untuk memilih file</strong>
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      Format didukung: PDF, JPG, PNG, WEBP
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
