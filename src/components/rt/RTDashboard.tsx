import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RequestTrackingTable } from './RequestTrackingTable';
import { RevisionQueueView } from './RevisionQueueView';
import { CompletedDocumentsView } from './CompletedDocumentsView';
import { NewRequestModal } from './NewRequestModal';
import {
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  PlusCircle,
  FileSpreadsheet,
  FileCheck2,
  Users,
  Send,
  Building2
} from 'lucide-react';

export const RTDashboard: React.FC = () => {
  const { requests, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'revision' | 'completed'>('all');
  const [newRequestOpen, setNewRequestOpen] = useState(false);

  // Counters
  const countWaiting = requests.filter(r => r.status === 'menunggu_verifikasi').length;
  const countInProgress = requests.filter(
    r => r.status === 'diproses' || r.status === 'menunggu_ttd_kades'
  ).length;
  const countRevision = requests.filter(r => r.status === 'butuh_perbaikan').length;
  const countCompleted = requests.filter(
    r => r.status === 'selesai_siap_ambil' || r.status === 'sudah_diambil'
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Summary Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold">
              <Users className="w-3.5 h-3.5" />
              <span>Portal Frontline Pelayanan Warga • {currentUser?.identifier || 'RT 01 / RW 03'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Selamat Bertugas, Pak/Bu {currentUser?.name || 'Ketua RT'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
              Warga tidak perlu antre manual di balai desa. Cukup sampaikan permohonan ke RT, sistem SIPADES meneruskannya ke operator kantor desa secara digital.
            </p>
          </div>

          <button
            onClick={() => setNewRequestOpen(true)}
            className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-slate-950" />
            <span>+ Buat Pengajuan Warga Baru</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Waiting */}
        <div
          onClick={() => setActiveTab('all')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Menunggu Verifikasi
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{countWaiting}</span>
            <span className="text-xs text-slate-400">Berkas baru</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Sedang ditinjau oleh operator
          </div>
        </div>

        {/* In Progress */}
        <div
          onClick={() => setActiveTab('all')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sedang Diproses
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600">{countInProgress}</span>
            <span className="text-xs text-slate-400">Sedang diproses</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Cetak fisik & TTD Kades
          </div>
        </div>

        {/* Needs Revision */}
        <div
          onClick={() => setActiveTab('revision')}
          className={`p-5 rounded-2xl border shadow-2xs transition cursor-pointer ${
            countRevision > 0
              ? 'bg-rose-50/50 border-rose-300 hover:border-rose-400 ring-2 ring-rose-300/40'
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              Butuh Perbaikan
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600">{countRevision}</span>
            <span className="text-xs text-rose-700 font-medium">Perlu upload ulang</span>
          </div>
          <div className="mt-1 text-[11px] text-rose-600 font-medium">
            {countRevision > 0 ? '⚠️ Ada berkas buram/salah' : 'Tidak ada kendala'}
          </div>
        </div>

        {/* Completed */}
        <div
          onClick={() => setActiveTab('completed')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Selesai & Siap Diambil
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{countCompleted}</span>
            <span className="text-xs text-slate-400">Surat terbit</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Soft-copy siap diteruskan ke WA
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex items-center gap-1 shadow-2xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Daftar Pengajuan (Google Sheets Layout)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-200">
            {requests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('revision')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'revision'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Menu Perbaikan Dokumen (Revisi)</span>
          {countRevision > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white text-rose-700 font-black animate-pulse">
              {countRevision}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Unduh Surat Selesai & Teruskan WA</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-800 text-emerald-100">
            {countCompleted}
          </span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'all' && (
        <RequestTrackingTable onOpenNewRequest={() => setNewRequestOpen(true)} />
      )}

      {activeTab === 'revision' && <RevisionQueueView />}

      {activeTab === 'completed' && <CompletedDocumentsView />}

      {/* Modal New Request */}
      <NewRequestModal
        isOpen={newRequestOpen}
        onClose={() => setNewRequestOpen(false)}
      />
    </div>
  );
};
