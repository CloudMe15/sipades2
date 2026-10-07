import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MonthlyReportModal } from './MonthlyReportModal';
import {
  Landmark,
  BarChart3,
  Clock,
  Award,
  AlertCircle,
  FileText,
  Download,
  Calendar,
  Building2,
  TrendingUp,
  CheckCircle2,
  PieChart,
  ArrowUpRight
} from 'lucide-react';

export const KecamatanDashboard: React.FC = () => {
  const { villageStats, requests, currentUser } = useApp();

  const [selectedVillage, setSelectedVillage] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState('Oktober 2026');
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Aggregated totals
  const totalSubmissions = villageStats.reduce((sum, v) => sum + v.totalRequests, 0);
  const totalCompleted = villageStats.reduce((sum, v) => sum + v.completed, 0);
  const averageSlaDistrict = (
    villageStats.reduce((sum, v) => sum + v.averageSlaHours, 0) / villageStats.length
  ).toFixed(1);

  // Service distribution breakdown data
  const serviceDistribution = [
    { type: 'Surat Keterangan Usaha (SKU)', count: 162, percent: 34, color: 'bg-blue-500' },
    { type: 'Surat Keterangan Tidak Mampu (SKTM)', count: 124, percent: 26, color: 'bg-emerald-500' },
    { type: 'Surat Pengantar SKCK', count: 96, percent: 20, color: 'bg-amber-500' },
    { type: 'Surat Keterangan Domisili (SKD)', count: 58, percent: 12, color: 'bg-purple-500' },
    { type: 'Surat Pengantar Nikah (SPN)', count: 42, percent: 8, color: 'bg-rose-500' }
  ];

  const handleExportReport = () => {
    setReportModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-purple-200 text-xs font-semibold">
              <Landmark className="w-3.5 h-3.5" />
              <span>Kantor Kecamatan Rakit Kulim • Pengawasan Mutu & Pelayanan Publik PATEN</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Sistem Monitoring & Evaluasi Kinerja 19 Desa Terpadu
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 max-w-2xl">
              Memantau kecepatan SLA (Service Level Agreement), volume permohonan surat, dan tren kebutuhan warga lintas 19 desa se-Kecamatan Rakit Kulim, Kab. Indragiri Hulu tanpa mengintervensi alur kerja internal desa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportReport}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Rekap Laporan Bulanan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top SLA & Key Performance Indicator Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Services */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Surat Diterbitkan
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalCompleted}</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Dari {totalSubmissions} pengajuan bulan {selectedMonth}
          </p>
        </div>

        {/* SLA Speed Indicator */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Indikator Kecepatan SLA
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">
              {averageSlaDistrict} Jam
            </span>
            <span className="text-xs text-slate-400">Rata-rata</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            ✓ Di bawah batas standar SLA Kecamatan (Batas: 24 Jam)
          </p>
        </div>

        {/* On-Time Performance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tingkat Ketepatan Waktu
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600">92.4%</span>
            <span className="text-xs text-slate-400">Tepat Waktu</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Target kinerja pelayanan publik tercapai
          </p>
        </div>

        {/* Desa Terbaik SLA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Desa Paling Responsif
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-black text-slate-900 block truncate">
              Desa Kelayang (Ibukota Kec)
            </span>
            <span className="text-xs text-emerald-700 font-bold">
              SLA: 4.2 Jam • Skor 96.5%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Peringkat 1 dari 19 Desa di Kecamatan Rakit Kulim
          </p>
        </div>
      </div>

      {/* Main Section: Comparative Statistics Across Villages & SLA Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Comparative Volume & SLA Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span>Statistik Komparasi Pelayanan Antar-Desa</span>
              </h3>
              <p className="text-xs text-slate-500">
                Perbandingan volume permohonan dan kecepatan penyelesaian berkas
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Periode:</span>
              <span className="font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                {selectedMonth}
              </span>
            </div>
          </div>

          {/* Comparative Bars Visualizer */}
          <div className="space-y-4 pt-2">
            {villageStats.map((v, i) => {
              const maxVal = Math.max(...villageStats.map(x => x.totalRequests));
              const widthPct = Math.round((v.totalRequests / maxVal) * 100);

              return (
                <div key={v.villageId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                        #{i + 1}
                      </span>
                      <strong className="text-slate-900">{v.villageName}</strong>
                      <span className="text-slate-400 text-[11px]">
                        (Layanan Terbanyak: {v.topService})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-600">
                        <strong className="text-slate-900">{v.completed}</strong> / {v.totalRequests} surat
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          v.averageSlaHours <= 6
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        SLA: {v.averageSlaHours} Jam
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        i === 0
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* SLA Evaluation Table */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Tabel Rekapitulasi Evaluasi Kinerja Aparatur Desa:
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Nama Desa</th>
                    <th className="py-2.5 px-3 text-center">Permohonan</th>
                    <th className="py-2.5 px-3 text-center">Selesai</th>
                    <th className="py-2.5 px-3 text-center">Revisi RT</th>
                    <th className="py-2.5 px-3 text-center">Rata-rata SLA</th>
                    <th className="py-2.5 px-3 text-center">Skor Kepatuhan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {villageStats.map(v => (
                    <tr key={v.villageId} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-sans font-bold text-slate-900">
                        {v.villageName}
                      </td>
                      <td className="py-2 px-3 text-center text-slate-700">{v.totalRequests}</td>
                      <td className="py-2 px-3 text-center text-emerald-700 font-bold">{v.completed}</td>
                      <td className="py-2 px-3 text-center text-rose-600">{v.revision}</td>
                      <td className="py-2 px-3 text-center text-slate-800 font-bold">
                        {v.averageSlaHours} Jam
                      </td>
                      <td className="py-2 px-3 text-center font-sans">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            v.slaPerformancePercent >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {v.slaPerformancePercent}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Service Type Recapitulation & Community Trends */}
        <div className="space-y-6">
          {/* Trend Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-600" />
                <span>Rekapitulasi Kebutuhan Warga (Jenis Surat)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pemetaan tren administrasi masyarakat di wilayah kecamatan
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {serviceDistribution.map(item => (
                <div key={item.type} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-800">{item.type}</span>
                    <span className="font-bold text-slate-900">
                      {item.count} surat ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Strategic Insight Box for Sub-District */}
            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 space-y-1 mt-4">
              <span className="font-bold text-[11px] uppercase tracking-wider block text-purple-950">
                💡 Insight Strategis Kecamatan:
              </span>
              <p className="leading-relaxed">
                "Bulan ini terjadi lonjakan permohonan <strong>Surat Keterangan Usaha (SKU)</strong> sebesar 34% di Desa Kelayang dan Kota Baru seiring pembukaan kuota Kredit Usaha Rakyat (KUR) BRI, serta lonjakan <strong>SKTM</strong> di Desa Bukit Indah dan Kuantan Tenang untuk pendaftaran beasiswa KIP Kuliah."
              </p>
            </div>
          </div>

          {/* Governance Notice */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Prinsip RBAC Tingkat Kecamatan
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Sesuai Permendagri No. 4/2016 tentang Pelayanan Administrasi Terpadu Kecamatan (PATEN), peran Kecamatan bertindak sebagai pengawas mutu (Quality Control) dan evaluator efisiensi birokrasi tanpa membebani operator desa.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Ekspor & Cetak Rekap Laporan Bulanan */}
      <MonthlyReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        villageStats={villageStats}
        requests={requests}
      />
    </div>
  );
};
