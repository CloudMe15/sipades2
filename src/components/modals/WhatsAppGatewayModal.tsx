import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Send,
  Settings,
  MessageSquare,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  RefreshCw,
  Sliders
} from 'lucide-react';

export const WhatsAppGatewayModal: React.FC = () => {
  const {
    waModalOpen,
    setWaModalOpen,
    waLogs,
    waGatewayConfig,
    updateWaGatewayConfig,
    sendManualWhatsApp
  } = useApp();

  const [activeTab, setActiveTab] = useState<'outbox' | 'config' | 'test'>('outbox');
  const [testPhone, setTestPhone] = useState('081234567890');
  const [testMessage, setTestMessage] = useState(
    'Halo Bpk/Ibu, ini adalah uji coba pesan otomatis dari WhatsApp Gateway SIPADES Kecamatan Rakit Kulim.'
  );

  if (!waModalOpen) return null;

  const handleTestSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone || !testMessage) return;
    sendManualWhatsApp(testPhone, testMessage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-200">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-snug">
                  WhatsApp Gateway Engine
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/40 text-emerald-100 border border-emerald-400 font-mono font-bold">
                  ONLINE • LIVE DISPATCH
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Otomatisasi Notifikasi Pengajuan, Perbaikan Berkas, dan Pengambilan Surat Warga
              </p>
            </div>
          </div>
          <button
            onClick={() => setWaModalOpen(false)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex items-center gap-4 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('outbox')}
            className={`py-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition ${
              activeTab === 'outbox'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Riwayat Pesan Terkirim ({waLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition ${
              activeTab === 'config'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Konfigurasi & Webhook API</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`py-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition ${
              activeTab === 'test'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Tes Kirim Manual</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'outbox' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Semua notifikasi WhatsApp yang terkirim otomatis saat alur surat berpindah status:
                </p>
                <span className="text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Total Terkirim: {waLogs.length} Pesan
                </span>
              </div>

              {waLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  Belum ada log pesan WhatsApp terkirim.
                </div>
              ) : (
                <div className="space-y-3">
                  {waLogs.map(log => {
                    const badgeType =
                      log.messageType === 'SIAP_DIAMBIL'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : log.messageType === 'PERMINTAAN_REVISI'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-blue-100 text-blue-800 border-blue-300';

                    return (
                      <div
                        key={log.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">
                              {log.recipientName}
                            </span>
                            <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {log.recipientPhone}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badgeType}`}
                            >
                              {log.messageType.replace(/_/g, ' ')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {log.timestamp}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> DELIVERED
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-sans leading-relaxed">
                          "{log.content}"
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400 font-mono">
                            Tiket: {log.ticketNumber}
                          </span>
                          <a
                            href={log.directWaLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                          >
                            <span>Buka Chat di WhatsApp Web/App</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'config' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Penyedia Gateway & API Service
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      'Fonnte WA Gateway',
                      'Direct WA Gateway',
                      'Wablas API',
                      'Twilio API'
                    ] as const
                  ).map(prov => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => updateWaGatewayConfig({ provider: prov })}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition cursor-pointer ${
                        waGatewayConfig.provider === prov
                          ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {prov}
                      <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                        {prov === 'Direct WA Gateway'
                          ? 'Kirim langsung via protokol Web WA server desa'
                          : 'Koneksi REST API resmi dengan API Token'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    API Secret / Token Provider
                  </label>
                  <input
                    type="password"
                    value={waGatewayConfig.apiKey}
                    onChange={e => updateWaGatewayConfig({ apiKey: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp Perangkat Pengirim (Sender Number)
                  </label>
                  <input
                    type="text"
                    value={waGatewayConfig.senderPhone}
                    onChange={e => updateWaGatewayConfig({ senderPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Pemicu Otomatisasi Pesan (Triggers)
                </h4>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={waGatewayConfig.autoSendOnSubmission}
                    onChange={e =>
                      updateWaGatewayConfig({ autoSendOnSubmission: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Kirim saat Pengajuan Baru dibuat oleh RT
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Memberitahukan nomor tiket dan bahwa berkas sedang diverifikasi oleh operator.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={waGatewayConfig.autoSendOnRevision}
                    onChange={e =>
                      updateWaGatewayConfig({ autoSendOnRevision: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Kirim saat Operator Mengembalikan Berkas (Butuh Perbaikan)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Mengirimkan catatan persis mengenai berkas apa yang buram/salah dan perlu direvisi.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={waGatewayConfig.autoSendOnReady}
                    onChange={e =>
                      updateWaGatewayConfig({ autoSendOnReady: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Kirim saat Surat Selesai & Siap Diambil di Kantor Desa
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Memberitahukan bahwa tanda tangan Kades & stempel telah selesai, dengan instruksi membawa KTP asli.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'test' && (
            <form onSubmit={handleTestSend} className="max-w-xl space-y-4">
              <p className="text-xs text-slate-600">
                Kirim pesan manual langsung ke nomor WhatsApp warga untuk pengetesan:
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Tujuan WhatsApp
                </label>
                <input
                  type="tel"
                  value={testPhone}
                  onChange={e => setTestPhone(e.target.value)}
                  placeholder="081287654321"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teks Pesan WhatsApp
                </label>
                <textarea
                  rows={4}
                  value={testMessage}
                  onChange={e => setTestMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Buka & Kirim Pesan Uji Coba</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
