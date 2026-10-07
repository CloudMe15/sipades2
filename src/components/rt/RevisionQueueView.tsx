import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CitizenRequest, DocumentAttachment } from '../../types';
import {
  AlertTriangle,
  Upload,
  CheckCircle2,
  RefreshCw,
  Send,
  Eye,
  FileText,
  User
} from 'lucide-react';

export const RevisionQueueView: React.FC = () => {
  const { requests, rtSubmitRevision, setSelectedRequest } = useApp();

  const revisionRequests = requests.filter(r => r.status === 'butuh_perbaikan');

  // Currently editing revision
  const [activeReqId, setActiveReqId] = useState<string | null>(null);
  const [replacementDoc, setReplacementDoc] = useState<{
    targetAttId: string;
    name: string;
    url: string;
  } | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const activeReq = revisionRequests.find(r => r.id === activeReqId);

  const handleSimulateQuickFix = (req: CitizenRequest, attId: string) => {
    setActiveReqId(req.id);
    setReplacementDoc({
      targetAttId: attId,
      name: `Scan_Perbaikan_Baru_${req.namaLengkap.replace(/\s+/g, '_')}_Jelas.jpg`,
      url: 'https://placehold.co/600x400/047857/ffffff?text=SCAN+KK+BARU+SUDAH+JELAS+TERANG+(REVISI+SUKSES)'
    });
    setRevisionNotes('Foto Kartu Keluarga telah diperbarui dengan pencahayaan terang dan NIK terlihat jelas.');
  };

  const handleReuploadSubmit = (req: CitizenRequest) => {
    if (!replacementDoc) return;

    const updatedAttachments = req.attachments.map(att => {
      if (att.id === replacementDoc.targetAttId) {
        return {
          ...att,
          name: replacementDoc.name,
          fileUrl: replacementDoc.url,
          status: 'pending' as const,
          revisionNote: undefined,
          uploadedAt: 'Revisi diunggah baru saja'
        };
      }
      return att;
    });

    rtSubmitRevision(req.id, updatedAttachments, revisionNotes);
    setActiveReqId(null);
    setReplacementDoc(null);
    setRevisionNotes('');
    setSuccessMsg(
      `Dokumen revisi untuk ${req.namaLengkap} (${req.ticketNumber}) berhasil dikirimkan kembali ke Operator Desa!`
    );
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Alert Header */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-rose-900">
              Menu Perbaikan Dokumen (Revisi Berkas)
            </h3>
            <p className="text-xs text-rose-700 mt-0.5">
              Daftar berkas warga yang dikembalikan oleh Operator Kantor Desa karena buram, tidak lengkap, atau tidak terbaca.
              RT dapat langsung memperbarui dokumen terkait <strong>tanpa perlu mengisi ulang formulir dari awal</strong>.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-2xl font-black text-rose-700">
            {revisionRequests.length}
          </span>
          <span className="text-[11px] text-rose-600 block font-medium">
            Berkas Perlu Revisi
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Revision Items */}
      {revisionRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-sm text-slate-800">
            Tidak Ada Berkas yang Membutuhkan Revisi
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Semua pengajuan dari RT Anda telah berstatus lengkap atau sedang dalam proses penerbitan surat resmi.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {revisionRequests.map(req => {
            const isEditing = activeReqId === req.id;

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-rose-200 shadow-sm overflow-hidden"
              >
                {/* Header Card */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-50/60 to-white border-b border-rose-100 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-rose-900">
                        {req.ticketNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300">
                        BUTUH PERBAIKAN
                      </span>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {req.serviceType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                      <strong className="text-slate-900">{req.namaLengkap}</strong> • NIK:{' '}
                      <span className="font-mono">{req.nik}</span> • RT {req.rt}/RW {req.rw}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Formulir Lengkap</span>
                  </button>
                </div>

                {/* Operator Rejection Note Callout */}
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                      Catatan Penolakan dari Operator Desa:
                    </span>
                    <p className="text-xs font-semibold text-rose-950 mt-1 italic">
                      "{req.rejectionReason || 'Foto berkas kurang jelas atau terpotong.'}"
                    </p>
                  </div>

                  {/* List of Attachments with status indicator */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Pilih Dokumen yang Ingin Diperbarui:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {req.attachments.map(att => {
                        const isInvalid = att.status === 'invalid' || req.rejectionReason?.toLowerCase().includes(att.type);
                        return (
                          <div
                            key={att.id}
                            className={`p-3 rounded-xl border flex flex-col justify-between transition ${
                              isInvalid
                                ? 'border-rose-400 bg-rose-50/50 ring-2 ring-rose-400/20'
                                : 'border-slate-200 bg-slate-50'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between text-xs font-bold mb-1">
                                <span className="truncate max-w-[170px] text-slate-800">
                                  {att.name}
                                </span>
                                {isInvalid ? (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold">
                                    BURAM / SALAH
                                  </span>
                                ) : (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-medium">
                                    SESUAI
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500">
                                Tipe: {att.type.toUpperCase()}
                              </p>
                            </div>

                            <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                              <a
                                href={att.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" /> Pratinjau
                              </a>

                              <button
                                type="button"
                                onClick={() => handleSimulateQuickFix(req, att.id)}
                                className="text-xs px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition shadow-2xs"
                              >
                                <RefreshCw className="w-3 h-3" /> Perbarui File Ini
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Re-upload Panel if selected */}
                  {isEditing && replacementDoc && (
                    <div className="mt-4 p-4 rounded-xl bg-amber-50/80 border border-amber-300 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          File Pengganti Siap Dikirim:
                        </span>
                        <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {replacementDoc.name}
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                          Catatan Balasan ke Operator (Opsional):
                        </label>
                        <input
                          type="text"
                          value={revisionNotes}
                          onChange={e => setRevisionNotes(e.target.value)}
                          placeholder="Contoh: Berkas KK telah difoto ulang dengan jelas dan pencahayaan terang."
                          className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg focus:outline-hidden"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveReqId(null);
                            setReplacementDoc(null);
                          }}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-amber-100 rounded-lg cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReuploadSubmit(req)}
                          className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Kirim Ulang Dokumen ke Operator Desa</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
