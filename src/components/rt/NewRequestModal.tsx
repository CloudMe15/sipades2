import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceType, DocumentAttachment } from '../../types';
import { SERVICE_METAS } from '../../data/mockData';
import {
  X,
  Upload,
  FileText,
  User,
  CreditCard,
  Phone,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewRequestModal: React.FC<NewRequestModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentUser, createRequest } = useApp();

  const [serviceType, setServiceType] = useState<ServiceType>('SKU');
  const [nik, setNik] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nomorWhatsapp, setNomorWhatsapp] = useState('');
  const [nomorKk, setNomorKk] = useState('');
  const [tempatLahir, setTempatLahir] = useState('Bogor');
  const [tanggalLahir, setTanggalLahir] = useState('1995-04-18');
  const [jenisKelamin, setJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [agama, setAgama] = useState('Islam');
  const [pekerjaan, setPekerjaan] = useState('Wiraswasta');
  const [alamat, setAlamat] = useState('Kp. Babakan RT 01 / RW 03');
  const [rtVal, setRtVal] = useState(currentUser?.identifier.includes('02') ? '02' : '01');
  const [rwVal, setRwVal] = useState('03');
  const [keperluan, setKeperluan] = useState('');

  // SKU specific fields
  const [namaUsaha, setNamaUsaha] = useState('');
  const [bidangUsaha, setBidangUsaha] = useState('');

  // Uploaded docs state
  const [ktpDoc, setKtpDoc] = useState<{ name: string; url: string } | null>(null);
  const [kkDoc, setKkDoc] = useState<{ name: string; url: string } | null>(null);
  const [additionalDoc, setAdditionalDoc] = useState<{ name: string; url: string } | null>(null);

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentServiceMeta = SERVICE_METAS[serviceType];

  // Auto-Fill sample data for quick demo testing
  const handleAutoFillDemo = (type: 'andi' | 'siti' | 'reza') => {
    if (type === 'andi') {
      setServiceType('SKU');
      setNik('3201141804950005');
      setNamaLengkap('Andi Wijaya');
      setNomorWhatsapp('081299112233');
      setNomorKk('3201140901120007');
      setTempatLahir('Bogor');
      setTanggalLahir('1995-04-18');
      setJenisKelamin('Laki-laki');
      setAgama('Islam');
      setPekerjaan('Wiraswasta / Pemilik Kios');
      setAlamat('Kp. Babakan Tengah No. 22');
      setKeperluan('Syarat pengajuan modal usaha tambahan Kredit Usaha Rakyat (KUR) BRI.');
      setNamaUsaha('Kedai Kopi & Kuliner Nusantara');
      setBidangUsaha('Kuliner & Minuman Olahan');
      setKtpDoc({
        name: 'KTP_Andi_Wijaya_Asli.jpg',
        url: 'https://placehold.co/600x400/0f766e/ffffff?text=KTP+ANDI+WIJAYA+(ASLI)'
      });
      setKkDoc({
        name: 'KK_Keluarga_Wijaya.jpg',
        url: 'https://placehold.co/600x400/0f766e/ffffff?text=KK+KELUARGA+WIJAYA'
      });
    } else if (type === 'siti') {
      setServiceType('SKTM');
      setNik('3201146206010008');
      setNamaLengkap('Nurul Hidayah');
      setNomorWhatsapp('085788990011');
      setNomorKk('3201141505100004');
      setTempatLahir('Sukabumi');
      setTanggalLahir('2001-06-22');
      setJenisKelamin('Perempuan');
      setAgama('Islam');
      setPekerjaan('Pelajar / Mahasiswa');
      setAlamat('Gang Melati No. 05, RT 01');
      setKeperluan('Pengajuan Keringanan Biaya Uang Kuliah Tunggal (UKT) Semester 5 di Universitas Djuanda.');
      setKtpDoc({
        name: 'KTP_Nurul_Hidayah.jpg',
        url: 'https://placehold.co/600x400/1e3a8a/ffffff?text=KTP+NURUL+HIDAYAH'
      });
      setKkDoc({
        name: 'KK_Keluarga_Nurul.jpg',
        url: 'https://placehold.co/600x400/1e3a8a/ffffff?text=KK+KELUARGA+NURUL'
      });
      setAdditionalDoc({
        name: 'Pengantar_RT_01_Valid.jpg',
        url: 'https://placehold.co/600x400/1e3a8a/ffffff?text=PENGANTAR+RT+01'
      });
    } else {
      setServiceType('SKCK');
      setNik('3201140909020003');
      setNamaLengkap('Reza Farhan Pratama');
      setNomorWhatsapp('087812344321');
      setNomorKk('3201142203110002');
      setTempatLahir('Bogor');
      setTanggalLahir('2002-09-09');
      setJenisKelamin('Laki-laki');
      setAgama('Islam');
      setPekerjaan('Belum Bekerja');
      setAlamat('Kp. Babakan Hilir No. 17');
      setKeperluan('Persyaratan seleksi penerimaan karyawan PT. Indocement Tunggal Prakarsa.');
      setKtpDoc({
        name: 'KTP_Reza_Farhan.jpg',
        url: 'https://placehold.co/600x400/4c1d95/ffffff?text=KTP+REZA+FARHAN'
      });
      setKkDoc({
        name: 'KK_Keluarga_Reza.jpg',
        url: 'https://placehold.co/600x400/4c1d95/ffffff?text=KK+KELUARGA+REZA'
      });
    }
    setErrorMsg('');
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'ktp' | 'kk' | 'additional'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const resultUrl = reader.result as string;
        if (type === 'ktp') {
          setKtpDoc({ name: file.name, url: resultUrl });
        } else if (type === 'kk') {
          setKkDoc({ name: file.name, url: resultUrl });
        } else {
          setAdditionalDoc({ name: file.name, url: resultUrl });
        }

        // Send to backend /api/upload.php to persist in /uploads/
        try {
          const formData = new FormData();
          formData.append('file', file);
          fetch('/api/upload.php', { method: 'POST', body: formData })
            .then(r => r.json())
            .then(data => {
              if (data && data.success && data.fileUrl) {
                if (type === 'ktp') setKtpDoc({ name: file.name, url: data.fileUrl });
                else if (type === 'kk') setKkDoc({ name: file.name, url: data.fileUrl });
                else setAdditionalDoc({ name: file.name, url: data.fileUrl });
              }
            })
            .catch(() => {});
        } catch {
          // Keep base64 fallback
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik || nik.length < 16) {
      setErrorMsg('Nomor Induk Kependudukan (NIK) wajib 16 digit angka.');
      return;
    }
    if (!namaLengkap.trim()) {
      setErrorMsg('Nama lengkap warga wajib diisi.');
      return;
    }
    if (!nomorWhatsapp.trim()) {
      setErrorMsg('Nomor WhatsApp warga wajib diisi agar notifikasi otomatis terkirim.');
      return;
    }
    if (!keperluan.trim()) {
      setErrorMsg('Keperluan pengajuan surat wajib diisi.');
      return;
    }

    const attachments: DocumentAttachment[] = [];

    // KTP
    attachments.push({
      id: `att-ktp-${Date.now()}`,
      type: 'ktp',
      name: ktpDoc?.name || `KTP_${namaLengkap.replace(/\s+/g, '_')}.jpg`,
      fileUrl:
        ktpDoc?.url ||
        'https://placehold.co/600x400/0f766e/ffffff?text=SCAN+KTP+ASLI+' +
          encodeURIComponent(namaLengkap),
      uploadedAt: 'Baru saja diunggah',
      uploadedBy: currentUser ? `${currentUser.name} (${currentUser.identifier})` : 'Petugas RT Rakit Kulim',
      status: 'pending'
    });

    // KK
    attachments.push({
      id: `att-kk-${Date.now()}`,
      type: 'kk',
      name: kkDoc?.name || `KK_${namaLengkap.replace(/\s+/g, '_')}.jpg`,
      fileUrl:
        kkDoc?.url ||
        'https://placehold.co/600x400/0f766e/ffffff?text=SCAN+KK+' +
          encodeURIComponent(namaLengkap),
      uploadedAt: 'Baru saja diunggah',
      uploadedBy: currentUser ? `${currentUser.name} (${currentUser.identifier})` : 'Petugas RT Rakit Kulim',
      status: 'pending'
    });

    // Additional
    if (additionalDoc) {
      attachments.push({
        id: `att-add-${Date.now()}`,
        type: 'dokumen_pendukung',
        name: additionalDoc.name,
        fileUrl: additionalDoc.url,
        uploadedAt: 'Baru saja diunggah',
        uploadedBy: currentUser ? `${currentUser.name} (${currentUser.identifier})` : 'Petugas RT Rakit Kulim',
        status: 'pending'
      });
    }

    const rincian: Record<string, string> = {};
    if (serviceType === 'SKU') {
      if (namaUsaha) rincian['Nama Usaha'] = namaUsaha;
      if (bidangUsaha) rincian['Bidang Usaha'] = bidangUsaha;
    }

    createRequest({
      nik,
      namaLengkap,
      nomorWhatsapp,
      nomorKk: nomorKk || '1402010101990001',
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      agama,
      pekerjaan,
      alamat,
      rt: rtVal,
      rw: rwVal,
      desa: currentUser?.village || 'Desa Kelayang',
      serviceType,
      keperluan,
      rincianTambahan: Object.keys(rincian).length > 0 ? rincian : undefined,
      attachments
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug">
                Formulir Pengajuan Surat Warga
              </h3>
              <p className="text-xs text-emerald-100">
                Diinput oleh Pengurus {currentUser?.identifier || 'RT Setempat'} • Warga tidak perlu datang antre
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast Autofill Bar */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Isi Cepat Data Contoh (Demo):</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAutoFillDemo('andi')}
              className="text-xs px-2.5 py-1 rounded-md bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/70 font-medium transition cursor-pointer shadow-2xs"
            >
              + Contoh SKU (Andi)
            </button>
            <button
              type="button"
              onClick={() => handleAutoFillDemo('siti')}
              className="text-xs px-2.5 py-1 rounded-md bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/70 font-medium transition cursor-pointer shadow-2xs"
            >
              + Contoh SKTM (Nurul)
            </button>
            <button
              type="button"
              onClick={() => handleAutoFillDemo('reza')}
              className="text-xs px-2.5 py-1 rounded-md bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/70 font-medium transition cursor-pointer shadow-2xs"
            >
              + Contoh SKCK (Reza)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Jenis Surat */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              1. Pilih Jenis Surat Administrasi
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(SERVICE_METAS) as ServiceType[]).map(typeKey => {
                const meta = SERVICE_METAS[typeKey];
                const isSelected = serviceType === typeKey;
                return (
                  <button
                    key={typeKey}
                    type="button"
                    onClick={() => setServiceType(typeKey)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>{typeKey}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                      {meta.name}
                    </div>
                  </button>
                );
              })}
            </div>
            {currentServiceMeta && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">{currentServiceMeta.fullName}:</span>{' '}
                {currentServiceMeta.description}
                <div className="mt-1 text-[11px] text-slate-500">
                  <strong className="text-slate-700">Persyaratan Wajib:</strong>{' '}
                  {currentServiceMeta.requiredDocs.join(', ')} • Target SLA:{' '}
                  <strong className="text-emerald-700">± {currentServiceMeta.slaHours} Jam</strong>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Data Pemohon (Warga) */}
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Data Identitas Warga (Pemohon)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nomor Induk Kependudukan (NIK) *
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    maxLength={16}
                    value={nik}
                    onChange={e => setNik(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Contoh: 3201141205930002"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Wajib 16 digit sesuai e-KTP</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap Sesuai KTP *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={namaLengkap}
                    onChange={e => setNamaLengkap(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nomor WhatsApp Warga (Untuk Notifikasi Real-time) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={nomorWhatsapp}
                    onChange={e => setNomorWhatsapp(e.target.value)}
                    placeholder="Contoh: 081287654321"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                    required
                  />
                </div>
                <p className="text-[10px] text-emerald-700 mt-0.5">
                  ✓ Sistem akan otomatis kirim notifikasi saat surat selesai
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nomor Kartu Keluarga (KK)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={nomorKk}
                  onChange={e => setNomorKk(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Contoh: 3201142508110005"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tempat & Tanggal Lahir
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={tempatLahir}
                    onChange={e => setTempatLahir(e.target.value)}
                    placeholder="Bogor"
                    className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <input
                    type="date"
                    value={tanggalLahir}
                    onChange={e => setTanggalLahir(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Jenis Kelamin & Agama
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={jenisKelamin}
                    onChange={e => setJenisKelamin(e.target.value as 'Laki-laki' | 'Perempuan')}
                    className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  <select
                    value={agama}
                    onChange={e => setAgama(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pekerjaan
                </label>
                <input
                  type="text"
                  value={pekerjaan}
                  onChange={e => setPekerjaan(e.target.value)}
                  placeholder="Contoh: Wiraswasta / Karyawan Swasta"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Wilayah Domisili (RT / RW)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500">RT:</span>
                    <input
                      type="text"
                      value={rtVal}
                      onChange={e => setRtVal(e.target.value)}
                      className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg text-center"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500">RW:</span>
                    <input
                      type="text"
                      value={rwVal}
                      onChange={e => setRwVal(e.target.value)}
                      className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Alamat Lengkap KTP
              </label>
              <input
                type="text"
                value={alamat}
                onChange={e => setAlamat(e.target.value)}
                placeholder="Contoh: Kp. Babakan No. 12, RT 01 / RW 03"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Additional details for SKU */}
          {serviceType === 'SKU' && (
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div className="text-xs font-bold text-amber-900">
                Detail Usaha Pemohon (Khusus Surat Keterangan Usaha)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-amber-900 mb-1">
                    Nama Usaha / Toko
                  </label>
                  <input
                    type="text"
                    value={namaUsaha}
                    onChange={e => setNamaUsaha(e.target.value)}
                    placeholder="Contoh: Toko Berkah Barokah"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-amber-900 mb-1">
                    Bidang / Jenis Usaha
                  </label>
                  <input
                    type="text"
                    value={bidangUsaha}
                    onChange={e => setBidangUsaha(e.target.value)}
                    placeholder="Contoh: Warung Sembako & Kelontong"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Keperluan */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              3. Maksud / Keperluan Pembuatan Surat *
            </label>
            <textarea
              rows={2}
              value={keperluan}
              onChange={e => setKeperluan(e.target.value)}
              placeholder="Contoh: Persyaratan pengajuan modal usaha Kredit Usaha Rakyat (KUR) di Bank BRI Unit Kelayang / Rakit Kulim."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Section 4: Unggah Berkas Persyaratan */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                4. Lampiran Berkas / Dokumen Persyaratan
              </label>
              <button
                type="button"
                onClick={() => {
                  setKtpDoc({
                    name: 'KTP_Auto_' + (namaLengkap || 'Warga') + '.jpg',
                    url: 'https://placehold.co/600x400/0f766e/ffffff?text=FOTO+KTP+ASLI+TERVERIFIKASI'
                  });
                  setKkDoc({
                    name: 'KK_Auto_' + (namaLengkap || 'Warga') + '.jpg',
                    url: 'https://placehold.co/600x400/0f766e/ffffff?text=FOTO+KK+TERVERIFIKASI'
                  });
                }}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer underline"
              >
                + Lampirkan Sampel Dokumen KTP & KK Sekaligus
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* KTP Upload */}
              <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700">Foto / Scan e-KTP *</span>
                  {ktpDoc ? (
                    <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terunggah
                    </span>
                  ) : (
                    <span className="text-[10px] text-rose-600">Wajib</span>
                  )}
                </div>
                {ktpDoc ? (
                  <div className="text-xs text-slate-600 flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                    <span className="truncate max-w-[180px] font-mono text-[11px]">
                      {ktpDoc.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setKtpDoc(null)}
                      className="text-rose-600 hover:text-rose-800 text-[10px] cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:border-slate-400 cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pilih Foto KTP</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={e => handleFileUpload(e, 'ktp')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* KK Upload */}
              <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700">Foto / Scan KK *</span>
                  {kkDoc ? (
                    <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terunggah
                    </span>
                  ) : (
                    <span className="text-[10px] text-rose-600">Wajib</span>
                  )}
                </div>
                {kkDoc ? (
                  <div className="text-xs text-slate-600 flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                    <span className="truncate max-w-[180px] font-mono text-[11px]">
                      {kkDoc.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setKkDoc(null)}
                      className="text-rose-600 hover:text-rose-800 text-[10px] cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:border-slate-400 cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pilih Foto KK</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={e => handleFileUpload(e, 'kk')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md shadow-emerald-700/20 transition cursor-pointer flex items-center gap-2"
            >
              <span>Kirim Pengajuan ke Operator Desa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
