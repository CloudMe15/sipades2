import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CitizenRequest, RequestStatus, ServiceType } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Search,
  Filter,
  Eye,
  Send,
  FileText,
  AlertCircle,
  Download,
  Calendar,
  User,
  ArrowUpDown,
  FileCheck2,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface RequestTrackingTableProps {
  onOpenNewRequest: () => void;
  filterStatusDefault?: RequestStatus | 'all';
}

export const RequestTrackingTable: React.FC<RequestTrackingTableProps> = ({
  onOpenNewRequest,
  filterStatusDefault = 'all'
}) => {
  const {
    requests,
    setSelectedRequest,
    setLetterModalRequest,
    sendManualWhatsApp,
    currentUser,
    setPreviewSignedDoc
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(filterStatusDefault);
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'name' | 'status'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter requests
  const filteredRequests = requests.filter(req => {
    // Search match
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !searchQuery ||
      req.namaLengkap.toLowerCase().includes(q) ||
      req.nik.includes(q) ||
      req.ticketNumber.toLowerCase().includes(q) ||
      (req.nomorSuratDesa && req.nomorSuratDesa.toLowerCase().includes(q));

    // Status filter
    const matchStatus = statusFilter === 'all' || req.status === statusFilter;

    // Service filter
    const matchService = serviceFilter === 'all' || req.serviceType === serviceFilter;

    return matchSearch && matchStatus && matchService;
  });

  // Sort
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortField === 'name') {
      return sortAsc
        ? a.namaLengkap.localeCompare(b.namaLengkap)
        : b.namaLengkap.localeCompare(a.namaLengkap);
    }
    if (sortField === 'status') {
      return sortAsc
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    // Date
    return sortAsc
      ? a.id.localeCompare(b.id)
      : b.id.localeCompare(a.id);
  });

  const handleSendWa = (req: CitizenRequest) => {
    const desa = req.desa || 'Desa Kelayang';
    let msg = `Halo Bpk/Ibu ${req.namaLengkap}, update permohonan surat ${req.serviceType} (Tiket: ${req.ticketNumber}) di ${desa}, Kec. Rakit Kulim: `;
    if (req.status === 'selesai_siap_ambil') {
      msg += `Surat telah SELESAI ditandatangani Kepala ${desa}. Silakan ambil fisik surat di Kantor ${desa} dengan membawa KTP Asli.`;
    } else if (req.status === 'butuh_perbaikan') {
      msg += `Memerlukan PERBAIKAN BERKAS: "${req.rejectionReason || 'Mohon cek berkas KK/KTP'}"`;
    } else {
      msg += `Saat ini status berkas: ${req.status.replace(/_/g, ' ')}.`;
    }
    sendManualWhatsApp(req.nomorWhatsapp, msg);
  };

  return (
    <div className="space-y-4">
      {/* Control Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan Nama, NIK, No. Tiket, No. Surat..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
          >
            <option value="all">Semua Status Permohonan</option>
            <option value="menunggu_verifikasi">🟡 Menunggu Verifikasi</option>
            <option value="diproses">🔵 Diproses Operator</option>
            <option value="menunggu_ttd_kades">🟣 Menunggu TTD Kades</option>
            <option value="butuh_perbaikan">🔴 Butuh Perbaikan</option>
            <option value="selesai_siap_ambil">🟢 Selesai / Siap Diambil</option>
            <option value="sudah_diambil">⚪ Sudah Diambil (Arsip)</option>
          </select>

          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={e => setServiceFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
          >
            <option value="all">Semua Jenis Layanan</option>
            <option value="SKU">Surat Keterangan Usaha (SKU)</option>
            <option value="SKCK">Surat Pengantar SKCK</option>
            <option value="SKTM">Surat Keterangan Tidak Mampu</option>
            <option value="SKD">Surat Keterangan Domisili</option>
            <option value="SPN">Surat Pengantar Nikah (N1-N4)</option>
            <option value="SKP">Surat Keterangan Pindah</option>
            <option value="SKK">Surat Kelahiran / Kematian</option>
          </select>

          {/* New Request Button */}
          <button
            onClick={onOpenNewRequest}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-700/20 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>+ Buat Pengajuan Baru</span>
          </button>
        </div>
      </div>

      {/* Google Sheets / Spreadsheet Style Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 font-bold border-b border-slate-200 select-none">
                <th className="py-3 px-4 w-12 text-center text-slate-400">#</th>
                <th
                  onClick={() => {
                    setSortField('date');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>No. Tiket & Tgl</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => {
                    setSortField('name');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Identitas Pemohon (Warga)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Jenis Surat & Keperluan</th>
                <th
                  onClick={() => {
                    setSortField('status');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Status Pelayanan</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">No. Surat Desa</th>
                <th className="py-3 px-4 text-center">Aksi Pelayanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada permohonan yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                sortedRequests.map((req, idx) => {
                  const isRevision = req.status === 'butuh_perbaikan';
                  const isCompleted = req.status === 'selesai_siap_ambil';
                  const isHandedOver = req.status === 'sudah_diambil';
                  const scanAttachment = req.attachments.find(a => a.type === 'surat_selesai_scan');
                  const isSigned = !!req.isManuallySigned || !!scanAttachment || isCompleted || isHandedOver;
                  const signedDocUrl = req.signedDocumentUrl || scanAttachment?.fileUrl;
                  const signedDocName = req.signedDocumentName || scanAttachment?.name;

                  // Row background styling
                  let rowBg = 'hover:bg-slate-50/80';
                  if (isRevision) rowBg = 'bg-rose-50/30 hover:bg-rose-50/60';
                  if (isCompleted) rowBg = 'bg-emerald-50/20 hover:bg-emerald-50/50';

                  return (
                    <tr key={req.id} className={`transition ${rowBg}`}>
                      {/* Index */}
                      <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      {/* Ticket & Date */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="font-mono font-bold text-slate-900 hover:text-emerald-700 transition cursor-pointer text-left block"
                        >
                          {req.ticketNumber}
                        </button>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{req.createdAt.split(',')[0]}</span>
                        </div>
                      </td>

                      {/* Citizen */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="font-bold text-slate-900 hover:text-emerald-700 transition text-left cursor-pointer"
                        >
                          {req.namaLengkap}
                        </button>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                          NIK: {req.nik}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          RT {req.rt} / RW {req.rw} • WA: {req.nomorWhatsapp}
                        </div>
                      </td>

                      {/* Service & Purpose */}
                      <td className="py-3.5 px-4 max-w-[260px]">
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {req.serviceType}
                        </span>
                        <p className="text-[11px] text-slate-600 truncate mt-1" title={req.keperluan}>
                          {req.keperluan}
                        </p>
                      </td>

                      {/* Status & TTD Indikator */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={req.status} size="sm" />

                        {/* Physical signature badge indicator */}
                        {isSigned ? (
                          <div className="mt-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewSignedDoc({
                                  url: signedDocUrl || 'https://placehold.co/600x800/065f46/ffffff?text=SURAT+RESMI+TERTANDATANGANI+KADES+%2B+CAP+DESA',
                                  name: signedDocName || `Scan_Surat_${req.serviceType}_Signed.pdf`,
                                  request: req
                                });
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 transition cursor-pointer shadow-2xs"
                              title="Dokumen telah ditandatangani manual oleh Kepala Desa. Klik untuk melihat berkas scan."
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>✍️ Sudah TTD Manual</span>
                            </button>
                          </div>
                        ) : req.status === 'menunggu_ttd_kades' ? (
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                              <Clock className="w-3 h-3 text-purple-600 shrink-0" />
                              <span>⏳ Di Meja Kades</span>
                            </span>
                          </div>
                        ) : null}

                        {isRevision && req.rejectionReason && (
                          <div
                            className="mt-1 text-[10px] text-rose-700 font-medium truncate max-w-[200px]"
                            title={req.rejectionReason}
                          >
                            Perlu revisi: {req.rejectionReason}
                          </div>
                        )}
                      </td>

                      {/* Nomor Surat Desa */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {req.nomorSuratDesa ? (
                          <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                            {req.nomorSuratDesa}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Belum terbit</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Detail Button */}
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            title="Buka Detail & Jejak Audit"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* View Signed Document Button if signed */}
                          {isSigned && (
                            <button
                              onClick={() =>
                                setPreviewSignedDoc({
                                  url: signedDocUrl || 'https://placehold.co/600x800/065f46/ffffff?text=SURAT+RESMI+TERTANDATANGANI+KADES+%2B+CAP+DESA',
                                  name: signedDocName || `Scan_Surat_${req.serviceType}_Signed.pdf`,
                                  request: req
                                })
                              }
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 transition cursor-pointer"
                              title="Lihat Berkas Hasil Scan TTD Basah Kades"
                            >
                              <FileCheck2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Print/Preview Letter Button if ready or processed */}
                          <button
                            onClick={() => setLetterModalRequest(req)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition cursor-pointer"
                            title="Format Surat Resmi Desa"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* WhatsApp Action Button */}
                          <button
                            onClick={() => handleSendWa(req)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition cursor-pointer"
                            title="Kirim Notifikasi via WhatsApp"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan <strong className="text-slate-800">{sortedRequests.length}</strong> dari{' '}
            <strong className="text-slate-800">{requests.length}</strong> total permohonan warga
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Menunggu
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Diproses
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Butuh Perbaikan
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Selesai
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
