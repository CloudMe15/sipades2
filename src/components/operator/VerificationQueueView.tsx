import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CitizenRequest } from '../../types';
import { SERVICE_METAS } from '../../data/mockData';
import {
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  FileText,
  Clock,
  User,
  CreditCard,
  Phone,
  Send,
  ExternalLink,
  X,
  Download
} from 'lucide-react';

export const VerificationQueueView: React.FC = () => {
  const {
    requests,
    operatorAcceptRequest,
    operatorRequestRevision,
    setSelectedRequest,
    currentUser,
    downloadDocument,
    downloadAllDocuments
  } = useApp();

  // Requests that are pending verification
  const pendingRequests = requests.filter(r => r.status === 'menunggu_verifikasi');

  // Reject / Revision Modal state
  const [rejectingReq, setRejectingReq] = useState<CitizenRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  // Inspect Modal state
  const [inspectingReq, setInspectingReq] = useState<CitizenRequest | null>(null);

  const quickReasons = [
    'Foto Kartu Keluarga (KK) buram dan nomor NIK tidak terbaca. Mohon difoto ulang secara tegak lurus.',
    'Foto e-KTP terpotong bagian tanggal lahir dan masa berlaku. Mohon unggah scan KTP lengkap.',
    'Nama lengkap atau NIK yang diinput di formulir tidak sesuai dengan foto e-KTP terlampir.',
    'Surat Pengantar dari RT belum ditandatangani / distempel oleh Ketua RT.',
    'Foto tempat usaha tidak jelas. Mohon lampirkan foto tampak depan kios/tempat usaha.'
  ];

  const handleOpenReject = (req: CitizenRequest) => {
    setRejectingReq(req);
    setRejectionReason(quickReasons[0]);
    setRejectError('');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingReq) return;
    if (!rejectionReason.trim()) {
      setRejectError('Catatan alasan perbaikan wajib diisi agar RT tahu bagian mana yang harus diperbaiki.');
      return;
    }

    operatorRequestRevision(rejectingReq.id, rejectionReason.trim());
    setRejectingReq(null);
    setRejectionReason('');
    if (inspectingReq?.id === rejectingReq.id) {
      setInspectingReq(null);
    }
  };

  const handleAccept = (req: CitizenRequest) => {
    operatorAcceptRequest(req.id);
    if (inspectingReq?.id === req.id) {
      setInspectingReq(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-amber-950">
              Loket Verifikasi Berkas Masuk dari RT
            </h3>
            <p className="text-xs text-amber-800 mt-0.5">
              Operator memeriksa kelengkapan scan KTP, KK, dan data warga. Klik <strong>"Terima & Proses"</strong> untuk menerbitkan Nomor Surat Desa, atau <strong>"Tolak / Minta Revisi ke RT"</strong> jika berkas buram atau tidak valid.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-2xl font-black text-amber-700">
            {pendingRequests.length}
          </span>
          <span className="text-[11px] text-amber-800 block font-medium">
            Berkas Masuk
          </span>
        </div>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-2xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
          <h4 className="font-bold text-sm text-slate-800">Antrean Verifikasi Bersih</h4>
          <p className="text-xs text-slate-500 mt-1">
            Semua pengajuan yang masuk telah diproses oleh Operator Desa.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map(req => {
            const meta = SERVICE_METAS[req.serviceType];
            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 hover:border-amber-300 transition"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {req.ticketNumber}
                      </span>
                      <span className="font-bold text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                        {req.serviceType} • {meta?.name || req.serviceType}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Diajukan: {req.createdAt}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 mt-1.5">
                      {req.namaLengkap}
                    </h4>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1 font-mono">
                      <span>NIK: {req.nik}</span>
                      <span>No. KK: {req.nomorKk || '-'}</span>
                      <span className="font-sans">
                        Wilayah: <strong>RT {req.rt} / RW {req.rw}</strong>
                      </span>
                      <span className="font-sans text-emerald-700 font-medium">
                        WA: {req.nomorWhatsapp}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInspectingReq(req)}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Periksa Berkas</span>
                    </button>

                    <button
                      onClick={() => handleOpenReject(req)}
                      className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Kembalikan / Revisi ke RT</span>
                    </button>

                    <button
                      onClick={() => handleAccept(req)}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Terima & Proses</span>
                    </button>
                  </div>
                </div>

                {/* Purpose & Documents Thumbnails */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex-1 min-w-[280px]">
                    <span className="text-slate-500 font-medium">Keperluan:</span>{' '}
                    <span className="text-slate-800 font-medium">{req.keperluan}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-400 text-[11px]">Berkas Lampiran:</span>
                    {req.attachments.map(att => (
                      <button
                        key={att.id}
                        type="button"
                        onClick={() => downloadDocument(att.fileUrl, att.name)}
                        className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer transition shadow-2xs"
                        title={`Unduh ${att.name}`}
                      >
                        <Download className="w-3 h-3 text-emerald-600" />
                        <span>{att.type.toUpperCase()}</span>
                      </button>
                    ))}
                    {req.attachments.length > 0 && (
                      <button
                        type="button"
                        onClick={() => downloadAllDocuments(req)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs"
                        title="Unduh Semua Berkas Warga dari RT (KTP & KK)"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh Semua Berkas ({req.attachments.length})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inspect Modal (Side-by-side verification drawer) */}
      {inspectingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">
                  Verifikasi Berkas Masuk • {inspectingReq.ticketNumber}
                </h3>
                <p className="text-xs text-slate-400">
                  Pemohon: {inspectingReq.namaLengkap} ({inspectingReq.serviceType})
                </p>
              </div>
              <button
                onClick={() => setInspectingReq(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Form Data Recap */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">NIK:</span>
                  <span className="font-mono font-bold text-slate-900">{inspectingReq.nik}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Nama Lengkap:</span>
                  <span className="font-bold text-slate-900">{inspectingReq.namaLengkap}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tempat, Tgl Lahir:</span>
                  <span className="text-slate-800">
                    {inspectingReq.tempatLahir}, {inspectingReq.tanggalLahir}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Wilayah:</span>
                  <span className="text-slate-800">
                    RT {inspectingReq.rt} / RW {inspectingReq.rw}
                  </span>
                </div>
              </div>

              {/* Uploaded Documents Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Pratinjau Berkas Lampiran Warga:
                  </h4>
                  {inspectingReq.attachments.length > 0 && (
                    <button
                      type="button"
                      onClick={() => downloadAllDocuments(inspectingReq)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Semua Berkas ({inspectingReq.attachments.length})</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inspectingReq.attachments.map(att => (
                    <div
                      key={att.id}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{att.name}</span>
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                          {att.type}
                        </span>
                      </div>
                      <div className="aspect-4/3 rounded-lg overflow-hidden bg-white border border-slate-200 flex items-center justify-center">
                        <img
                          src={att.fileUrl}
                          alt={att.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
                        <span className="text-slate-400">Oleh: {att.uploadedBy}</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={att.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Lihat
                          </a>
                          <button
                            type="button"
                            onClick={() => downloadDocument(att.fileUrl, att.name)}
                            className="px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition shadow-2xs"
                            title="Unduh Berkas ke Laptop"
                          >
                            <Download className="w-3 h-3" /> Unduh File
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inspect Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setInspectingReq(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
              >
                Tutup
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenReject(inspectingReq)}
                  className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl cursor-pointer"
                >
                  Kembalikan ke RT
                </button>
                <button
                  onClick={() => handleAccept(inspectingReq)}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md cursor-pointer"
                >
                  Terima & Proses Surat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject / Revision Modal */}
      {rejectingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-rose-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-sm">
                  Kembalikan Berkas ke RT (Minta Revisi)
                </h3>
              </div>
              <button
                onClick={() => setRejectingReq(null)}
                className="p-1 rounded-lg bg-rose-800 text-rose-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="p-6 space-y-4">
              <div className="text-xs text-slate-600">
                Mengembalikan permohonan <strong>{rejectingReq.namaLengkap}</strong> (Tiket:{' '}
                <span className="font-mono">{rejectingReq.ticketNumber}</span>) ke pengurus RT{' '}
                {rejectingReq.rt}.
              </div>

              {rejectError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {rejectError}
                </div>
              )}

              {/* Template quick pills */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pilih Contoh Alasan Penolakan Cepat:
                </label>
                <div className="space-y-1.5">
                  {quickReasons.map((qr, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRejectionReason(qr)}
                      className="w-full text-left p-2 rounded-lg text-[11px] border border-slate-200 hover:bg-slate-50 transition text-slate-700 cursor-pointer"
                    >
                      "{qr}"
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Catatan Alasan Perbaikan (Wajib Diisi):
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="Ketik catatan persis agar RT tahu bagian mana yang harus diperbaiki..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Catatan ini akan otomatis masuk ke dashboard RT dan dikirimkan lewat WhatsApp Gateway ke warga & RT.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setRejectingReq(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Notifikasi Perbaikan ke RT</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
