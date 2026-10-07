import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { SERVICE_METAS } from '../../data/mockData';
import {
  X,
  User,
  CreditCard,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Clock,
  Download,
  Send,
  Eye,
  AlertTriangle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const RequestDetailModal: React.FC = () => {
  const {
    selectedRequest,
    setSelectedRequest,
    currentUser,
    setLetterModalRequest,
    setVerificationModalRequest,
    sendManualWhatsApp,
    downloadDocument
  } = useApp();

  if (!selectedRequest) return null;

  const serviceMeta = SERVICE_METAS[selectedRequest.serviceType];

  const handleSendWaReminder = () => {
    const desa = selectedRequest.desa || 'Desa Kelayang';
    let msg = `Halo Bpk/Ibu ${selectedRequest.namaLengkap}, update permohonan surat ${selectedRequest.serviceType} (Tiket: ${selectedRequest.ticketNumber}) di ${desa}, Kec. Rakit Kulim: `;
    if (selectedRequest.status === 'selesai_siap_ambil') {
      msg += `Surat telah SELESAI ditandatangani Kepala ${desa}. Silakan ambil fisik surat di Kantor ${desa} dengan membawa KTP Asli.`;
    } else if (selectedRequest.status === 'butuh_perbaikan') {
      msg += `Memerlukan PERBAIKAN BERKAS: ${selectedRequest.rejectionReason || 'Mohon hubungi RT'}`;
    } else {
      msg += `Saat ini status berkas adalah '${selectedRequest.status.replace(/_/g, ' ')}'.`;
    }
    sendManualWhatsApp(selectedRequest.nomorWhatsapp, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  {selectedRequest.ticketNumber}
                </h3>
                <StatusBadge status={selectedRequest.status} size="sm" />
              </div>
              <p className="text-xs text-slate-400">
                {serviceMeta?.name || selectedRequest.serviceType} • Diajukan pada {selectedRequest.createdAt}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedRequest(null)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Rejection Alert if Butuh Perbaikan */}
          {selectedRequest.status === 'butuh_perbaikan' && selectedRequest.rejectionReason && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-rose-900">
                  Catatan Perbaikan dari Operator Desa
                </h4>
                <p className="text-xs mt-1 text-rose-700 font-medium">
                  "{selectedRequest.rejectionReason}"
                </p>
                <p className="text-[11px] text-rose-600 mt-1">
                  Pengurus RT dapat memperbarui berkas yang bersangkutan langsung melalui menu <strong>"Butuh Perbaikan"</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Citizen Identity */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                Data Pemohon (Warga)
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Nama Lengkap:</span>
                  <span className="font-bold text-slate-900">{selectedRequest.namaLengkap}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 font-mono">
                  <span className="text-slate-500 font-sans">NIK:</span>
                  <span className="font-semibold text-slate-900">{selectedRequest.nik}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 font-mono">
                  <span className="text-slate-500 font-sans">No. Kartu Keluarga:</span>
                  <span className="text-slate-800">{selectedRequest.nomorKk || '-'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Tempat, Tgl Lahir:</span>
                  <span className="text-slate-800">
                    {selectedRequest.tempatLahir}, {selectedRequest.tanggalLahir}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Jenis Kelamin / Agama:</span>
                  <span className="text-slate-800">
                    {selectedRequest.jenisKelamin} • {selectedRequest.agama}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Pekerjaan:</span>
                  <span className="text-slate-800">{selectedRequest.pekerjaan}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Alamat:</span>
                  <span className="text-slate-800 text-right max-w-[200px]">
                    {selectedRequest.alamat} (RT {selectedRequest.rt} / RW {selectedRequest.rw})
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500">WhatsApp:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-slate-900">
                      {selectedRequest.nomorWhatsapp}
                    </span>
                    <button
                      onClick={handleSendWaReminder}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3 h-3" /> Chat WA
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-700" />
                Rincian Surat Administrasi
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Jenis Layanan:</span>
                  <span className="font-bold text-blue-700">{selectedRequest.serviceType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Nomor Registrasi Surat:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedRequest.nomorSuratDesa || (
                      <span className="text-amber-600 italic">Dialokasikan saat diproses</span>
                    )}
                  </span>
                </div>
                <div className="py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 block mb-0.5">Keperluan Pembuatan:</span>
                  <p className="text-slate-800 font-medium bg-white p-2 rounded border border-slate-200">
                    {selectedRequest.keperluan}
                  </p>
                </div>

                {selectedRequest.rincianTambahan && (
                  <div className="py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 block mb-1">Rincian Tambahan:</span>
                    <div className="bg-white p-2 rounded border border-slate-200 space-y-1">
                      {Object.entries(selectedRequest.rincianTambahan).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-[11px]">
                          <span className="text-slate-500">{k}:</span>
                          <span className="font-medium text-slate-800">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRequest.handover && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 mt-2">
                    <div className="font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Fisik Surat Telah Diambil di Kantor Desa
                    </div>
                    <div className="text-[10px] text-emerald-800 mt-1">
                      Penerima: <strong>{selectedRequest.handover.pickedUpBy}</strong> ({selectedRequest.handover.relationToCitizen})
                      <br />
                      Waktu Pengambilan: {selectedRequest.handover.pickedUpAt}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Berkas & Dokumen Terlampir ({selectedRequest.attachments.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {selectedRequest.attachments.map(att => {
                const isScanOfficial = att.type === 'surat_selesai_scan';
                return (
                  <div
                    key={att.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between transition ${
                      isScanOfficial
                        ? 'border-emerald-300 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="truncate max-w-[170px] text-slate-800">
                          {att.name}
                        </span>
                        {isScanOfficial ? (
                          <span className="text-[9px] px-1.5 py-0.5 bg-emerald-700 text-white rounded font-bold">
                            SURAT RESMI
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded uppercase">
                            {att.type.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Diupload oleh: {att.uploadedBy}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <a
                        href={att.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </a>

                      <button
                        type="button"
                        onClick={() => downloadDocument(att.fileUrl, att.name)}
                        className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg flex items-center gap-1 cursor-pointer transition shadow-2xs"
                        title={`Unduh ${att.name}`}
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-600" /> Unduh
                      </button>

                      {isScanOfficial && (
                        <button
                          onClick={() => {
                            setSelectedRequest(null);
                            setLetterModalRequest(selectedRequest);
                          }}
                          className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Surat Resmi
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit Trail / Timeline Log */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-600" />
              Jejak Audit & Histori Alur Pelayanan (Timeline)
            </h4>
            <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
              {selectedRequest.timeline.map((event, idx) => (
                <div key={event.id || idx} className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1" />
                    {idx < selectedRequest.timeline.length - 1 && (
                      <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">
                        {event.actor}
                      </span>
                      <span className="text-[11px] text-slate-400">{event.timestamp}</span>
                    </div>
                    {event.note && (
                      <p className="text-slate-600 text-xs mt-0.5 bg-slate-50 p-2 rounded border border-slate-100">
                        {event.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setSelectedRequest(null)}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            {/* View Official Letter button */}
            <button
              onClick={() => {
                const target = selectedRequest;
                setSelectedRequest(null);
                setLetterModalRequest(target);
              }}
              className="px-4 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Lihat Format Cetak Surat Resmi</span>
            </button>

            {/* WA forward button */}
            <button
              onClick={handleSendWaReminder}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Update via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
