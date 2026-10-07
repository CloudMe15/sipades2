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
  ArrowUpRight,
  ShieldCheck,
  UserCheck,
  RotateCcw
} from 'lucide-react';

export const KecamatanDashboard: React.FC = () => {
  const {
    villageStats,
    requests,
    currentUser,
    users,
    setAdminApprovalModalOpen,
    clearComparisonData,
    setManageVillagesModalOpen
  } = useApp();

  const [selectedVillage, setSelectedVillage] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState('Oktober 2026');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const pendingUsers = users.filter(u => u.status === 'pending');

  // Aggregated totals
  const totalSubmissions = villageStats.reduce((sum, v) => sum + v.totalRequests, 0);
  const totalCompleted = villageStats.reduce((sum, v) => sum + v.completed, 0);
  const averageSlaDistrict = (
    villageStats.filter(v => v.averageSlaHours > 0).length > 0
      ? villageStats.filter(v => v.averageSlaHours > 0).reduce((sum, v) => sum + v.averageSlaHours, 0) / villageStats.filter(v => v.averageSlaHours > 0).length
      : 0
  ).toFixed(1);

  const avgCompliance = totalSubmissions > 0
    ? Math.round((totalCompleted / totalSubmissions) * 100)
    : 0;

  const topResponsiveVillage = [...villageStats]
    .filter(v => v.totalRequests > 0)
    .sort((a, b) => b.slaPerformancePercent - a.slaPerformancePercent || b.totalRequests - a.totalRequests)[0];

  // Dynamic service distribution breakdown data based on live requests
  const serviceDistribution = React.useMemo(() => {
    const total = requests.length;
    const types = [
      { code: 'SKU', type: 'Surat Keterangan Usaha (SKU)', color: 'bg-blue-500' },
      { code: 'SKTM', type: 'Surat Keterangan Tidak Mampu (SKTM)', color: 'bg-emerald-500' },
      { code: 'SKCK', type: 'Surat Pengantar SKCK', color: 'bg-amber-500' },
      { code: 'SKD', type: 'Surat Keterangan Domisili (SKD)', color: 'bg-purple-500' },
      { code: 'SPN', type: 'Surat Pengantar Nikah (SPN)', color: 'bg-rose-500' }
    ];
    return types.map(t => {
      const count = requests.filter(r => r.serviceType === t.code).length;
      const percent = total > 0 ? Math.round((count / total) * 100) : 0;
      return { type: t.type, count, percent, color: t.color };
    });
  }, [requests]);

  const handleExportReport = () => {
    setReportModalOpen(true);
  };

  const handleResetForTesting = async () => {
    if (window.confirm('Kosongkan semua data permohonan dan komparasi pelayanan untuk memulai pengujian dari 0?')) {
      setIsResetting(true);
      await clearComparisonData();
      setIsResetting(false);
    }
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

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setManageVillagesModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-2 border border-white/20 transition cursor-pointer"
              title="Kelola 19 Desa dan Nama Kepala Desa se-Kecamatan Rakit Kulim"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Kelola 19 Desa & Kades</span>
            </button>
            <button
              onClick={handleResetForTesting}
              disabled={isResetting}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-2 border border-white/20 transition cursor-pointer"
              title="Kosongkan seluruh data untuk uji coba dari 0"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span>Reset Data Pengujian</span>
            </button>
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

      {/* Super Admin Master Account Management Banner */}
      {currentUser?.role === 'admin' && (
        <div className="bg-gradient-to-r from-amber-50 via-amber-100/60 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  👑 Akses Akun Master (Super Admin)
                </span>
                {pendingUsers.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse">
                    {pendingUsers.length} Pendaftaran Menunggu
                  </span>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                Panel Persetujuan & Konfirmasi Akun Petugas Desa / RT
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {pendingUsers.length > 0
                  ? `Terdapat ${pendingUsers.length} akun baru yang telah memverifikasi email dan menunggu persetujuan Anda untuk dapat masuk ke sistem.`
                  : 'Semua akun aparatur telah disetujui. Setiap akun baru yang mendaftar akan muncul di panel ini untuk konfirmasi.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setAdminApprovalModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer shrink-0"
          >
            <UserCheck className="w-4 h-4" />
            <span>Buka Panel Persetujuan Akun</span>
          </button>
        </div>
      )}

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
            <span className="text-3xl font-black text-blue-600">{avgCompliance}%</span>
            <span className="text-xs text-slate-400">Tepat Waktu</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {totalSubmissions > 0 ? 'Target kinerja pelayanan publik dihitung dinamis' : 'Menunggu data pengujian permohonan'}
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
              {topResponsiveVillage ? topResponsiveVillage.villageName : 'Belum Ada Data Pengujian'}
            </span>
            <span className="text-xs text-emerald-700 font-bold">
              {topResponsiveVillage
                ? `SLA: ${topResponsiveVillage.averageSlaHours} Jam • Skor ${topResponsiveVillage.slaPerformancePercent}%`
                : 'SLA: 0 Jam • Siap diuji coba'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {topResponsiveVillage
              ? 'Peringkat responsif teratas di Kecamatan Rakit Kulim'
              : 'Otomatis dihitung saat permohonan surat dibuat'}
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
            {totalSubmissions === 0 ? (
              <div className="py-8 px-4 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                  Data Komparasi Pelayanan Antar-Desa Siap untuk Pengujian
                </h4>
                <p className="text-[11px] text-slate-500 max-w-lg mx-auto leading-relaxed">
                  Semua data komparasi antar-desa telah dikosongkan (0 permohonan). Saat Anda melakukan uji coba pengajuan surat dari petugas RT atau Operator Desa, grafik komparasi volume, SLA, dan kepatuhan 19 desa akan langsung terakumulasi otomatis secara real-time.
                </p>
              </div>
            ) : (
              villageStats.map((v, i) => {
                const maxVal = Math.max(...villageStats.map(x => x.totalRequests), 1);
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
              })
            )}
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
                💡 Status Pengujian Terpadu PATEN:
              </span>
              <p className="leading-relaxed">
                {totalSubmissions > 0
                  ? `Saat ini tercatat ${totalSubmissions} berkas permohonan aktif pada pengujian. Sistem secara langsung menghitung kecepatan SLA dan akurasi pelayanan antar-desa.`
                  : 'Seluruh data komparasi telah dikosongkan (0 permohonan). Silakan lakukan pengujian pengajuan surat melalui akun RT atau Operator Desa, dan periksa pembaruan otomatisnya pada panel ini.'}
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
