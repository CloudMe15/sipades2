import React, { useState } from 'react';
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
  Filter
} from 'lucide-react';

export const PrintingManagementView: React.FC = () => {
  const {
    requests,
    operatorSendToKades,
    setLetterModalRequest,
    setSelectedRequest
  } = useApp();

  const [filterMode, setFilterMode] = useState<'all' | 'diproses' | 'ttd_kades'>('all');

  const printingRequests = requests.filter(r => {
    if (filterMode === 'diproses') return r.status === 'diproses';
    if (filterMode === 'ttd_kades') return r.status === 'menunggu_ttd_kades';
    return r.status === 'diproses' || r.status === 'menunggu_ttd_kades';
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-blue-950">
              Manajemen Pencetakan & Tanda Tangan Kades
            </h3>
            <p className="text-xs text-blue-800 mt-0.5">
              Kelola pencetakan draf surat fisik dengan Kop Surat resmi desa se-Kecamatan Rakit Kulim dan pengajuan ke meja Kepala Desa untuk tanda tangan basah serta stempel dinas.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
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
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filterMode === 'all'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Semua Antrean Cetak & TTD
        </button>

        <button
          onClick={() => setFilterMode('diproses')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filterMode === 'diproses'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Sedang Diketik / Cetak Draf
        </button>

        <button
          onClick={() => setFilterMode('ttd_kades')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filterMode === 'ttd_kades'
              ? 'bg-purple-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Menunggu TTD Kades (Di Meja Kades)
        </button>
      </div>

      {printingRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-2xs">
          Tidak ada berkas dalam antrean pencetakan atau tanda tangan Kades saat ini.
        </div>
      ) : (
        <div className="space-y-4">
          {printingRequests.map(req => {
            const meta = SERVICE_METAS[req.serviceType];
            const isWaitingKades = req.status === 'menunggu_ttd_kades';

            return (
              <div
                key={req.id}
                className={`bg-white rounded-2xl border shadow-2xs p-5 transition ${
                  isWaitingKades
                    ? 'border-purple-200 bg-purple-50/20'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                        {req.ticketNumber}
                      </span>
                      <StatusBadge status={req.status} size="sm" />
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {req.serviceType}
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 mt-2">
                      {req.namaLengkap}
                    </h4>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3 mt-1">
                      <span>
                        Nomor Surat:{' '}
                        <strong className="font-mono text-slate-900">
                          {req.nomorSuratDesa || '470/120/DS-SKM/2026'}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        NIK: <span className="font-mono">{req.nik}</span>
                      </span>
                      <span>•</span>
                      <span>RT {req.rt} / RW {req.rw}</span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                      Keperluan: {req.keperluan}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLetterModalRequest(req)}
                      className="px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Draf Surat Resmi</span>
                    </button>

                    {!isWaitingKades && (
                      <button
                        onClick={() => operatorSendToKades(req.id)}
                        className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Ajukan ke Meja TTD Kades</span>
                      </button>
                    )}

                    {isWaitingKades && (
                      <div className="px-3 py-2 rounded-xl bg-purple-100 text-purple-800 text-xs font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                        <span>Fisik Berada di Meja Kades</span>
                      </div>
                    )}
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
