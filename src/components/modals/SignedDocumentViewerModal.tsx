import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  FileCheck2,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  Calendar,
  UserCheck,
  CheckCircle2,
  Building2
} from 'lucide-react';

export const SignedDocumentViewerModal: React.FC = () => {
  const { previewSignedDoc, setPreviewSignedDoc, downloadDocument } = useApp();

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!previewSignedDoc) return null;

  const { url, name, request } = previewSignedDoc;
  const isPdf = url.toLowerCase().endsWith('.pdf') || url.includes('application/pdf');

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col border border-slate-200 overflow-hidden my-4 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Pratinjau Berkas Fisik Bertanda Tangan Basah
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-[10px] font-black uppercase tracking-wider">
                  ✓ SAH & TERVERIFIKASI
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate max-w-md sm:max-w-xl font-mono">
                {name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadDocument(url, name)}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh Berkas</span>
            </button>

            <button
              onClick={() => {
                setPreviewSignedDoc(null);
                handleReset();
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer"
              title="Tutup Pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Verification Summary Banner */}
        <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Bukti Fisik Tanda Tangan:</strong> Berkas ini adalah scan resmi surat yang telah dibubuhi tanda tangan manual Kepala Desa dan cap stempel basah.
            </span>
          </div>

          {request && (
            <div className="flex items-center gap-3 text-[11px] font-medium text-emerald-800">
              <span>Pemohon: <strong>{request.namaLengkap}</strong></span>
              <span>•</span>
              <span>Tiket: <strong className="font-mono">{request.ticketNumber}</strong></span>
              {request.signedByKadesName && (
                <>
                  <span>•</span>
                  <span>Kades: <strong>{request.signedByKadesName}</strong></span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Viewer Toolbar */}
        {!isPdf && (
          <div className="px-6 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 cursor-pointer"
                title="Perkecil"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-bold w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 cursor-pointer"
                title="Perbesar"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRotate}
                className="p-1.5 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 cursor-pointer flex items-center gap-1"
                title="Putar 90 Derajat"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="text-[10px]">Putar</span>
              </button>
              {(zoom !== 1 || rotation !== 0) && (
                <button
                  onClick={handleReset}
                  className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-[10px] font-bold cursor-pointer"
                >
                  Reset Tampilan
                </button>
              )}
            </div>

            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Gunakan kontrol di kiri untuk memperbesar detail tanda tangan dan cap stempel
            </span>
          </div>
        )}

        {/* Content Viewer Body */}
        <div className="flex-1 overflow-auto p-4 bg-slate-900/10 flex items-center justify-center min-h-[420px] max-h-[68vh]">
          {isPdf ? (
            <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-2xl p-4 shadow-inner">
              <iframe
                src={url}
                title={name}
                className="w-full h-[60vh] rounded-xl border border-slate-300"
              />
              <div className="mt-3 flex items-center gap-3">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka PDF di Tab Baru</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="overflow-auto max-w-full max-h-full flex items-center justify-center p-2">
              <img
                src={url}
                alt={name}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.15s ease-out',
                  maxWidth: zoom <= 1 ? '100%' : 'none',
                  maxHeight: zoom <= 1 ? '62vh' : 'none'
                }}
                className="rounded-xl shadow-lg border border-slate-300 object-contain bg-white"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>SIPADES Kecamatan Rakit Kulim • Sistem Arsip & Validasi Fisik Surat Desa</span>
          </div>

          <button
            onClick={() => {
              setPreviewSignedDoc(null);
              handleReset();
            }}
            className="px-4 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold cursor-pointer text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
