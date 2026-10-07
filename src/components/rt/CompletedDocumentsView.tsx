import React from 'react';
import { useApp } from '../../context/AppContext';
import { CitizenRequest } from '../../types';
import { SERVICE_METAS } from '../../data/mockData';
import {
  CheckCircle2,
  Download,
  Send,
  Eye,
  FileCheck2,
  Phone,
  Building,
  User,
  ExternalLink
} from 'lucide-react';

export const CompletedDocumentsView: React.FC = () => {
  const {
    requests,
    setLetterModalRequest,
    setSelectedRequest,
    sendManualWhatsApp,
    setPreviewSignedDoc
  } = useApp();

  const completedRequests = requests.filter(
    r => r.status === 'selesai_siap_ambil' || r.status === 'sudah_diambil'
  );

  const handleSendWaNotification = (req: CitizenRequest) => {
    const meta = SERVICE_METAS[req.serviceType];
    const nomorSurat = req.nomorSuratDesa || req.ticketNumber;
    const desa = req.desa || 'Desa Kelayang';
    const msg = `Halo Bpk/Ibu ${req.namaLengkap}, Surat Resmi ${meta?.name || req.serviceType} (No: ${nomorSurat}) telah SELESAI ditandatangani oleh Kepala ${desa} dan distempel basah. Anda dapat mengambil fisik surat asli di Loket Pelayanan Kantor ${desa}, Kec. Rakit Kulim pada jam kerja (08.00 - 15.00 WIB) dengan membawa e-KTP Asli. Bukti soft-copy surat ini juga dapat Anda simpan. Terima kasih. (Pengurus RT ${req.rt}/RW ${req.rw})`;
    sendManualWhatsApp(req.nomorWhatsapp, msg);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-emerald-950">
              Dokumen Selesai & Terbit (Siap Diteruskan ke Warga)
            </h3>
            <p className="text-xs text-emerald-800 mt-0.5">
              Surat yang telah ditandatangani basah oleh Kepala Desa dan discan oleh Operator Desa.
              RT dapat mengunduh soft-copy dan meneruskannya ke WhatsApp warga sebagai bukti bahwa surat fisik asli siap diambil di kantor desa.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-2xl font-black text-emerald-700">
            {completedRequests.length}
          </span>
          <span className="text-[11px] text-emerald-800 block font-medium">
            Surat Terbit
          </span>
        </div>
      </div>

      {completedRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-2xs">
          Belum ada surat yang berstatus selesai.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedRequests.map(req => {
            const isPickedUp = req.status === 'sudah_diambil';
            const meta = SERVICE_METAS[req.serviceType];

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between hover:border-emerald-300 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {req.serviceType}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">
                        {req.namaLengkap}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500">
                        NIK: {req.nik} • RT {req.rt}/RW {req.rw}
                      </p>
                    </div>

                    <div className="text-right">
                      {isPickedUp ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-300">
                          SUDAH DIAMBIL WARGA
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 animate-pulse">
                          SIAP DIAMBIL DI DESA
                        </span>
                      )}
                      <span className="block text-[10px] text-slate-400 mt-1">
                        {req.ticketNumber}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5 text-xs text-slate-600 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">No. Surat Desa:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {req.nomorSuratDesa || '470/115/DS-SKM/2026'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Keperluan:</span>
                      <span className="text-slate-800 text-right truncate max-w-[200px]" title={req.keperluan}>
                        {req.keperluan}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">WhatsApp Warga:</span>
                      <span className="font-mono text-emerald-700 font-bold">
                        {req.nomorWhatsapp}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  {(req.signedDocumentUrl || req.attachments.find(a => a.type === 'surat_selesai_scan')?.fileUrl) && (
                    <button
                      onClick={() => {
                        const att = req.attachments.find(a => a.type === 'surat_selesai_scan');
                        setPreviewSignedDoc({
                          url: req.signedDocumentUrl || att?.fileUrl || '',
                          name: req.signedDocumentName || att?.name || 'Scan_Surat_Resmi_Signed.pdf',
                          request: req
                        });
                      }}
                      className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition"
                      title="Lihat berkas fisik scan surat bertanda tangan basah Kades & cap stempel"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Lihat Berkas Hasil Scan TTD Manual Kades</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLetterModalRequest(req)}
                      className="flex-1 py-2 px-3 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Format Draf</span>
                    </button>

                    <button
                      onClick={() => handleSendWaNotification(req)}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Teruskan WA</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
