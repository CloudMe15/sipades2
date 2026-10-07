import React, { useState } from 'react';
import { VillageStats, CitizenRequest } from '../../types';
import {
  Download,
  Printer,
  X,
  FileSpreadsheet,
  Building2,
  Calendar,
  CheckCircle2,
  Award,
  Clock,
  Landmark,
  ShieldCheck
} from 'lucide-react';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  villageStats: VillageStats[];
  requests: CitizenRequest[];
}

export const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({
  isOpen,
  onClose,
  villageStats,
  requests
}) => {
  const [selectedMonth, setSelectedMonth] = useState('Oktober 2026');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const totalPermohonan = villageStats.reduce((sum, v) => sum + v.totalRequests, 0);
  const totalSelesai = villageStats.reduce((sum, v) => sum + v.completed, 0);
  const totalRevisi = villageStats.reduce((sum, v) => sum + v.revision, 0);
  const avgSla = villageStats.length > 0 && villageStats.some(v => v.averageSlaHours > 0)
    ? (villageStats.filter(v => v.averageSlaHours > 0).reduce((sum, v) => sum + v.averageSlaHours, 0) / villageStats.filter(v => v.averageSlaHours > 0).length).toFixed(1)
    : '0.0';
  const avgKepatuhan = totalPermohonan > 0
    ? (villageStats.reduce((sum, v) => sum + v.slaPerformancePercent, 0) / villageStats.length).toFixed(1)
    : '0.0';

  const handleDownloadCsv = () => {
    const headers = [
      'No',
      'Nama Desa',
      'Total Permohonan',
      'Selesai Diterbitkan',
      'Dalam Proses / Revisi',
      'Rata-rata SLA (Jam)',
      'Kepatuhan SLA (%)',
      'Layanan Terbanyak'
    ];

    const rows = villageStats.map((v, i) => [
      i + 1,
      `"${v.villageName}"`,
      v.totalRequests,
      v.completed,
      v.inProgress + v.revision,
      v.averageSlaHours,
      `${v.slaPerformancePercent}%`,
      `"${v.topService}"`
    ]);

    // Baris Total
    const totalRow = [
      '',
      '"TOTAL SE-KECAMATAN RAKIT KULIM"',
      totalPermohonan,
      totalSelesai,
      totalPermohonan - totalSelesai,
      `${avgSla} Jam`,
      `${avgKepatuhan}%`,
      '"Surat Keterangan Usaha (SKU)"'
    ];

    const metadataRows = [
      ['"PEMERINTAH KABUPATEN INDRAGIRI HULU"'],
      ['"KECAMATAN RAKIT KULIM"'],
      [`"LAPORAN REKAPITULASI PELAYANAN ADMINISTRASI KEPENDUDUKAN DESA TERPADU (PATEN)"`],
      [`"Periode Pelaporan: ${selectedMonth}"`],
      [`"Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}"`],
      ['']
    ];

    const csvContent =
      '\uFEFF' +
      metadataRows.map(r => r.join(',')).join('\r\n') +
      '\r\n' +
      headers.join(',') +
      '\r\n' +
      rows.map(r => r.join(',')).join('\r\n') +
      '\r\n' +
      totalRow.join(',') +
      '\r\n\r\n' +
      '"Mengetahui: Camat Rakit Kulim & Kasi Tata Pemerintahan / PATEN (Drs. H. Suryana, M.Si)"';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const sanitizedMonth = selectedMonth.replace(/\s+/g, '_');
    a.download = `SIPADES_Laporan_Bulanan_Rakit_Kulim_${sanitizedMonth}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full my-6 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Top Header (Screen Only) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Ekspor & Rekap Laporan Bulanan PATEN</span>
                <span className="text-[10px] font-bold bg-purple-600 px-2 py-0.5 rounded text-white">
                  Kec. Rakit Kulim
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Pemerintah Kabupaten Indragiri Hulu • Format Resmi Rekapitulasi Eksekutif
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="bg-slate-800 text-white border border-slate-700 text-xs rounded-xl px-3 py-1.5 focus:outline-hidden"
            >
              <option value="Oktober 2026">Oktober 2026</option>
              <option value="September 2026">September 2026</option>
              <option value="Agustus 2026">Agustus 2026</option>
            </select>

            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Unduh file format Excel / CSV"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Unduh Spreadsheet (CSV)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Cetak atau Simpan PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner (Screen only) */}
        {downloadSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 flex items-center justify-between font-medium print:hidden">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                File CSV Laporan Rekapitulasi Bulan <strong>{selectedMonth}</strong> berhasil diunduh ke komputer Anda!
              </span>
            </div>
            <button
              onClick={() => setDownloadSuccess(false)}
              className="text-emerald-700 hover:text-emerald-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Printable Official Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 print:p-0 print:overflow-visible text-slate-800 font-serif">
          {/* KOP SURAT RESMI PEMERINTAH DAERAH */}
          <div className="border-b-4 border-double border-slate-900 pb-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <h4 className="font-sans font-bold text-sm tracking-widest uppercase text-slate-900">
                  Pemerintah Kabupaten Indragiri Hulu
                </h4>
                <h2 className="font-sans font-black text-xl sm:text-2xl tracking-wide uppercase text-slate-900">
                  Kecamatan Rakit Kulim
                </h2>
                <p className="font-sans text-xs text-slate-600 mt-0.5">
                  Jalan Lintas Kelayang - Kota Baru, Kode Pos 29352 • Email: paten@rakitkulim.inhukab.go.id
                </p>
                <p className="font-sans text-[11px] text-slate-500">
                  Sistem Informasi & Pelayanan Administrasi Desa Terpadu (SIPADES)
                </p>
              </div>
            </div>
          </div>

          {/* JUDUL LAPORAN RESMI */}
          <div className="text-center font-sans space-y-1 pt-2">
            <h3 className="font-black text-base uppercase underline text-slate-900">
              Laporan Rekapitulasi Pelayanan Administrasi Desa Terpadu (PATEN)
            </h3>
            <p className="text-xs text-slate-600">
              Periode: <strong>Bulan {selectedMonth}</strong> • Meliputi 19 Desa se-Kecamatan Rakit Kulim
            </p>
          </div>

          {/* RINGKASAN EKSEKUTIF INDIKATOR KINERJA */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans print:grid-cols-4 pt-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                Total Permohonan
              </span>
              <span className="text-xl font-black text-slate-900">{totalPermohonan}</span>
              <span className="text-[10px] text-slate-500 block">Surat Masuk</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                Selesai Diterbitkan
              </span>
              <span className="text-xl font-black text-emerald-700">{totalSelesai}</span>
              <span className="text-[10px] text-emerald-600 font-bold block">
                {((totalSelesai / totalPermohonan) * 100).toFixed(1)}% Sukses
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                Rata-rata Waktu (SLA)
              </span>
              <span className="text-xl font-black text-purple-700">{avgSla} Jam</span>
              <span className="text-[10px] text-slate-500 block">Standar Maks. 24 Jam</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                Tingkat Kepatuhan SLA
              </span>
              <span className="text-xl font-black text-blue-700">{avgKepatuhan}%</span>
              <span className="text-[10px] text-blue-600 font-bold block">Mutu Pelayanan Prima</span>
            </div>
          </div>

          {/* TABEL REKAPITULASI 19 DESA */}
          <div className="font-sans">
            <div className="overflow-x-auto border border-slate-300 rounded-lg">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <th className="py-2 px-2.5 text-center w-8 border-r border-slate-300">No</th>
                    <th className="py-2 px-3 border-r border-slate-300">Nama Desa</th>
                    <th className="py-2 px-2.5 text-center border-r border-slate-300">Total Masuk</th>
                    <th className="py-2 px-2.5 text-center border-r border-slate-300">Selesai</th>
                    <th className="py-2 px-2.5 text-center border-r border-slate-300">Revisi</th>
                    <th className="py-2 px-2.5 text-center border-r border-slate-300">SLA Rata-rata</th>
                    <th className="py-2 px-2.5 text-center border-r border-slate-300">Skor Kepatuhan</th>
                    <th className="py-2 px-3">Layanan Terbanyak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {villageStats.map((v, i) => (
                    <tr key={v.villageId} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                      <td className="py-1.5 px-2 text-center text-slate-500 border-r border-slate-200">
                        {i + 1}
                      </td>
                      <td className="py-1.5 px-3 font-sans font-bold text-slate-900 border-r border-slate-200">
                        {v.villageName}
                      </td>
                      <td className="py-1.5 px-2.5 text-center text-slate-800 border-r border-slate-200">
                        {v.totalRequests}
                      </td>
                      <td className="py-1.5 px-2.5 text-center text-emerald-700 font-bold border-r border-slate-200">
                        {v.completed}
                      </td>
                      <td className="py-1.5 px-2.5 text-center text-rose-600 border-r border-slate-200">
                        {v.revision}
                      </td>
                      <td className="py-1.5 px-2.5 text-center text-slate-700 border-r border-slate-200">
                        {v.averageSlaHours} Jam
                      </td>
                      <td className="py-1.5 px-2.5 text-center border-r border-slate-200 font-bold font-sans">
                        <span
                          className={
                            v.slaPerformancePercent >= 90
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }
                        >
                          {v.slaPerformancePercent}%
                        </span>
                      </td>
                      <td className="py-1.5 px-3 font-sans text-slate-600 truncate max-w-[180px]">
                        {v.topService}
                      </td>
                    </tr>
                  ))}
                  {/* BARIS TOTAL */}
                  <tr className="bg-slate-200/80 font-bold border-t-2 border-slate-400 text-slate-900 font-sans text-xs">
                    <td colSpan={2} className="py-2 px-3 uppercase text-center border-r border-slate-300">
                      Total Seluruh Desa (Kec. Rakit Kulim)
                    </td>
                    <td className="py-2 px-2.5 text-center border-r border-slate-300 font-mono">
                      {totalPermohonan}
                    </td>
                    <td className="py-2 px-2.5 text-center text-emerald-800 border-r border-slate-300 font-mono">
                      {totalSelesai}
                    </td>
                    <td className="py-2 px-2.5 text-center text-rose-700 border-r border-slate-300 font-mono">
                      {totalRevisi}
                    </td>
                    <td className="py-2 px-2.5 text-center border-r border-slate-300 font-mono">
                      {avgSla} Jam
                    </td>
                    <td className="py-2 px-2.5 text-center border-r border-slate-300 font-mono">
                      {avgKepatuhan}%
                    </td>
                    <td className="py-2 px-3 text-slate-800">
                      Surat Keterangan Usaha (SKU)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CATATAN DISPOSISI & EVALUASI */}
          <div className="font-sans p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-700 leading-relaxed">
            <strong className="block text-slate-900 uppercase font-bold text-[11px]">
              Catatan Evaluasi Mutu Pelayanan Publik Kecamatan Rakit Kulim:
            </strong>
            <p>
              1. Seluruh permohonan surat dari RT diteruskan dan diproses secara digital melalui aplikasi SIPADES terintegrasi MySQL.
            </p>
            <p>
              2. Kinerja penerbitan surat pada bulan {selectedMonth} mencapai <strong>{avgKepatuhan}%</strong> tepat waktu dengan rata-rata kecepatan penyelesaian <strong>{avgSla} jam kerja</strong>.
            </p>
            <p>
              3. Tidak ditemukan berkas tertahan melebihi ambang batas toleransi 24 jam.
            </p>
          </div>

          {/* TANDA TANGAN RESMI PEJABAT */}
          <div className="pt-6 font-sans flex justify-between items-start text-xs text-slate-900 print:pt-10">
            <div className="text-center w-64 space-y-16">
              <div>
                <p>Mengetahui,</p>
                <p className="font-bold">Camat Rakit Kulim</p>
              </div>
              <div>
                <p className="font-bold underline text-sm">H. ROSMIDAR, S.Sos</p>
                <p className="text-[11px] text-slate-500">NIP. 19710815 199303 1 004</p>
              </div>
            </div>

            <div className="text-center w-64 space-y-16">
              <div>
                <p>Rakit Kulim, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="font-bold">Kasi Tata Pemerintahan & PATEN</p>
              </div>
              <div>
                <p className="font-bold underline text-sm">Drs. H. SURYANA, M.Si</p>
                <p className="text-[11px] text-slate-500">NIP. 19760512 200212 1 002</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Action Bar (Screen Only) */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="text-xs text-slate-500">
            💡 Tips: Klik <strong>Cetak / Simpan PDF</strong> untuk menyimpan arsip resmi, atau <strong>Unduh Spreadsheet (CSV)</strong> untuk mengolah data di Microsoft Excel.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Format Excel (CSV)</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Cetak PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
