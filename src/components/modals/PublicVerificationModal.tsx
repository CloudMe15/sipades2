import React from 'react';
import { useApp } from '../../context/AppContext';
import { SERVICE_METAS, RAKIT_KULIM_VILLAGES } from '../../data/mockData';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Building2,
  FileCheck2,
  Lock,
  ExternalLink
} from 'lucide-react';

export const PublicVerificationModal: React.FC = () => {
  const { verificationModalRequest, setVerificationModalRequest, villages } = useApp();

  if (!verificationModalRequest) return null;

  const req = verificationModalRequest;
  const meta = SERVICE_METAS[req.serviceType];
  const desaName = req.desa || 'Desa Kelayang';
  const villageList = villages && villages.length > 0 ? villages : RAKIT_KULIM_VILLAGES;
  const villageInfo = villageList.find(
    v => v.name.toLowerCase() === desaName.toLowerCase()
  ) || villageList[0];
  const kadesName = villageInfo?.kades || 'Kepala Desa';
  const desaCode = desaName.replace('Desa ', '').toUpperCase().slice(0, 3);
  const nomorSurat = req.nomorSuratDesa || `470/120/DS-${desaCode}/X/2026`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-150">
        {/* Verification banner */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white p-6 text-center relative">
          <button
            onClick={() => setVerificationModalRequest(null)}
            className="absolute right-4 top-4 p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-9 h-9 text-emerald-300" />
          </div>

          <h3 className="font-black text-lg tracking-wide uppercase">
            Dokumen Resmi Terverifikasi
          </h3>
          <p className="text-xs text-emerald-100 mt-1">
            Sistem E-Verifikasi Keabsahan Administrasi {desaName} • Kec. Rakit Kulim
          </p>
        </div>

        {/* Verification Certificate Body */}
        <div className="p-6 space-y-4">
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              Status Integritas Dokumen
            </span>
            <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              ASLI, SAH & TEREGISTRASI DI BUKU REGISTER DESA
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Nomor Registrasi Surat:</span>
              <span className="font-mono font-bold text-slate-900">{nomorSurat}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Jenis Dokumen:</span>
              <span className="font-semibold text-slate-900">{meta?.fullName || req.serviceType}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Nama Pemohon:</span>
              <span className="font-bold text-slate-900 uppercase">{req.namaLengkap}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">NIK Pemohon:</span>
              <span className="font-mono text-slate-700">
                {req.nik.slice(0, 6)}******{req.nik.slice(-4)} (Tersamarkan)
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Instansi Penerbit:</span>
              <span className="font-medium text-slate-800">
                Pemerintah {desaName}, Kec. Rakit Kulim
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Pejabat Penandatangan:</span>
              <span className="font-medium text-slate-900">
                {kadesName} (Kepala {desaName})
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Keperluan:</span>
              <span className="text-slate-800 text-right max-w-[240px] font-medium">
                {req.keperluan}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Tanda tangan digital dan stempel desa ini dilindungi dengan enkripsi SHA-256. Dokumen ini sah tanpa tanda tangan basah sesuai UU ITE No. 11/2008.
            </span>
          </div>

          <button
            onClick={() => setVerificationModalRequest(null)}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer"
          >
            Tutup Lembar Verifikasi
          </button>
        </div>
      </div>
    </div>
  );
};
