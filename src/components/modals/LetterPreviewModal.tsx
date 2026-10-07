import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SERVICE_METAS, RAKIT_KULIM_VILLAGES } from '../../data/mockData';
import {
  X,
  Printer,
  Send,
  ShieldCheck,
  Building,
  QrCode
} from 'lucide-react';

export const LetterPreviewModal: React.FC = () => {
  const {
    letterModalRequest,
    setLetterModalRequest,
    setVerificationModalRequest,
    sendManualWhatsApp,
    villages
  } = useApp();

  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!letterModalRequest) return null;

  const req = letterModalRequest;
  const meta = SERVICE_METAS[req.serviceType];
  const desaName = req.desa || 'Desa Kelayang';
  const villageList = villages && villages.length > 0 ? villages : RAKIT_KULIM_VILLAGES;
  const villageInfo = villageList.find(
    v => v.name.toLowerCase() === desaName.toLowerCase()
  ) || villageList[0];
  const kadesName = villageInfo?.kades || 'Kepala Desa';
  const desaCode = desaName.replace('Desa ', '').toUpperCase().slice(0, 3);
  const nomorSurat = req.nomorSuratDesa || `470/120/DS-${desaCode}/X/2026`;

  const handlePrint = () => {
    window.print();
  };

  const handleForwardWhatsApp = () => {
    const waText = `Yth. Bpk/Ibu ${req.namaLengkap}, soft-copy ${meta?.name || req.serviceType} (Nomor Surat: ${nomorSurat}) telah SELESAI ditandatangani Kepala ${desaName}. Anda dapat mengambil fisik surat asli di Kantor ${desaName}, Kec. Rakit Kulim pada jam kerja dengan membawa KTP Asli. Terima kasih. (Pelayanan Kantor ${desaName})`;
    sendManualWhatsApp(req.nomorWhatsapp, waText);
  };

  // Specific letter body text based on service type
  const renderLetterBody = () => {
    switch (req.serviceType) {
      case 'SKU':
        return (
          <div className="space-y-3 leading-relaxed text-justify">
            <p>
              Menerangkan dengan sebenarnya bahwa orang tersebut di atas adalah benar-benar penduduk yang bertempat tinggal di wilayah {desaName}, Kecamatan Rakit Kulim, Kabupaten Indragiri Hulu, Riau, dan berdasarkan data yang ada pada kami serta survei lapangan, yang bersangkutan benar memiliki kegiatan usaha sebagai berikut:
            </p>
            <div className="bg-slate-50/70 p-3 rounded border border-slate-200 text-xs space-y-1.5 ml-4 mr-4 font-mono">
              <div className="flex">
                <span className="w-36 font-sans font-semibold">Nama Usaha:</span>
                <span className="font-bold">{req.rincianTambahan?.['Nama Usaha'] || 'Warung Kelontong / Usaha Mikro Berkah'}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-sans font-semibold">Bidang Usaha:</span>
                <span>{req.rincianTambahan?.['Bidang Usaha'] || 'Perdagangan & Usaha Mikro'}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-sans font-semibold">Lokasi Usaha:</span>
                <span>{req.rincianTambahan?.['Lokasi Usaha'] || req.alamat}</span>
              </div>
            </div>
            <p>
              Surat Keterangan Usaha ini diberikan kepada yang bersangkutan untuk keperluan:{' '}
              <strong className="underline underline-offset-2">{req.keperluan}</strong>.
            </p>
          </div>
        );

      case 'SKCK':
        return (
          <div className="space-y-3 leading-relaxed text-justify">
            <p>
              Menerangkan dengan sebenarnya bahwa orang tersebut di atas adalah benar-benar penduduk {desaName}, Kec. Rakit Kulim dan berdasarkan catatan administrasi desa kami:
            </p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Berkelakuan baik serta tidak pernah terlibat dalam tindakan kriminalitas / kejahatan apapun;</li>
              <li>Tidak sedang dalam proses perkara hukum atau menjadi buronan kepolisian;</li>
              <li>Bukan anggota dari organisasi terlarang menurut ketentuan perundang-undangan yang berlaku.</li>
            </ol>
            <p>
              Surat Pengantar ini diterbitkan sebagai kelengkapan permohonan penerbitan <strong>Surat Keterangan Catatan Kepolisian (SKCK)</strong> di Kepolisian Sektor (Polsek) Kelayang / Rakit Kulim untuk keperluan:{' '}
              <strong className="underline underline-offset-2">{req.keperluan}</strong>.
            </p>
          </div>
        );

      case 'SKTM':
        return (
          <div className="space-y-3 leading-relaxed text-justify">
            <p>
              Menerangkan dengan sebenarnya bahwa orang tersebut di atas adalah benar-benar penduduk {desaName}, Kecamatan Rakit Kulim, dan berdasarkan verifikasi lapangan serta basis data terpadu kesejahteraan sosial, keluarga bersangkutan tergolong dalam keluarga:
            </p>
            <div className="p-2.5 bg-slate-100 rounded text-center font-bold text-slate-800">
              BERPENGHASILAN RENDAH / KURANG MAMPU (DESIL SOSIAL EKONOMI RENDAH)
            </div>
            <p>
              Surat Keterangan ini dibuat dan diberikan kepada yang bersangkutan untuk dipergunakan sebagai persyaratan:{' '}
              <strong className="underline underline-offset-2">{req.keperluan}</strong>.
            </p>
          </div>
        );

      case 'SKD':
        return (
          <div className="space-y-3 leading-relaxed text-justify">
            <p>
              Menerangkan dengan sebenarnya bahwa orang tersebut di atas adalah benar-benar berdomisili dan menetap di wilayah {desaName}, Kecamatan Rakit Kulim pada alamat tersebut di atas sejak beberapa tahun terakhir hingga saat surat keterangan ini diterbitkan.
            </p>
            <p>
              Surat Keterangan Domisili ini dibuat untuk dipergunakan sebagai:{' '}
              <strong className="underline underline-offset-2">{req.keperluan}</strong>.
            </p>
          </div>
        );

      default:
        return (
          <div className="space-y-3 leading-relaxed text-justify">
            <p>
              Menerangkan dengan sebenarnya bahwa orang tersebut di atas adalah benar-benar warga penduduk {desaName}, Kecamatan Rakit Kulim, Kabupaten Indragiri Hulu, Riau.
            </p>
            <p>
              Surat keterangan ini diberikan kepada yang bersangkutan untuk kelengkapan administrasi permohonan:{' '}
              <strong className="underline underline-offset-2">{req.keperluan}</strong>.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[96vh] flex flex-col border border-slate-200 overflow-hidden my-4 animate-in zoom-in-95 duration-150">
        {/* Top Control Bar (Hidden on actual print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-white">
                Pratinjau Draf Cetak Surat Resmi Desa
              </h3>
              <p className="text-[11px] text-slate-400">
                Format Kop Surat Standar Pemerintah {desaName} • Kec. Rakit Kulim, Indragiri Hulu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setVerificationModalRequest(req);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cek E-Verifikasi QR</span>
            </button>

            <button
              onClick={handleForwardWhatsApp}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim ke WA Warga</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={() => setLetterModalRequest(null)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Document Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200/60 flex justify-center">
          <div
            ref={printAreaRef}
            className="bg-white text-slate-900 shadow-xl border border-slate-300 max-w-[210mm] w-full p-8 sm:p-12 text-[12.5px] leading-normal font-serif relative"
            style={{ minHeight: '297mm' }}
          >
            {/* Kop Surat Resmi */}
            <div className="flex items-center justify-between border-b-[3px] border-black pb-3 mb-1">
              <div className="w-20 h-20 shrink-0 flex items-center justify-center p-1">
                <div className="w-16 h-16 rounded-full border-2 border-slate-900 flex flex-col items-center justify-center text-center p-1 bg-amber-50/40">
                  <span className="text-[7.5px] font-sans font-bold tracking-tighter uppercase">KABUPATEN</span>
                  <span className="text-[11px] font-serif font-black leading-none">INHU</span>
                  <span className="text-[7px] font-sans text-slate-600">★ RIAU ★</span>
                </div>
              </div>

              <div className="flex-1 text-center font-serif px-2">
                <h4 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-700">
                  PEMERINTAH KABUPATEN INDRAGIRI HULU
                </h4>
                <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-slate-800">
                  KECAMATAN RAKIT KULIM
                </h3>
                <h2 className="text-lg font-sans font-black tracking-wider text-black">
                  KANTOR KEPALA {desaName.toUpperCase()}
                </h2>
                <p className="text-[10px] font-sans text-slate-600 mt-0.5">
                  Alamat: Kantor Kepala {desaName}, Kec. Rakit Kulim, Kab. Indragiri Hulu, Kode Pos 29352
                  <br />
                  Laman: rakitkulim.desa.id • Pos-el: pelayanan.{desaName.toLowerCase().replace(/[^a-z0-9]/g, '')}@rakitkulim.desa.id
                </p>
              </div>

              <div className="w-20 shrink-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border border-slate-300 rounded bg-slate-50 flex flex-col items-center justify-center p-1 text-[8px] font-sans text-slate-500 text-center">
                  <QrCode className="w-8 h-8 text-slate-800" />
                  <span className="mt-0.5 font-mono text-[7px]">VERIFIKASI</span>
                </div>
              </div>
            </div>
            {/* Garis batas tipis kedua untuk kop resmi */}
            <div className="border-b border-black mb-6" />

            {/* Document Title & Number */}
            <div className="text-center mb-6">
              <h3 className="font-sans font-bold text-sm tracking-wider underline uppercase">
                {meta?.fullName || `SURAT KETERANGAN ${req.serviceType}`}
              </h3>
              <p className="font-sans text-xs font-medium text-slate-700 mt-1">
                Nomor: <span className="font-mono font-bold">{nomorSurat}</span>
              </p>
            </div>

            {/* Opening Paragraph */}
            <p className="text-justify mb-4 indent-8 leading-relaxed">
              Yang bertanda tangan di bawah ini, Kepala {desaName}, Kecamatan Rakit Kulim, Kabupaten Indragiri Hulu, Provinsi Riau, dengan ini menerangkan bahwa:
            </p>

            {/* Citizen Data Table */}
            <div className="mb-4 pl-6 pr-4 space-y-1.5 font-sans text-xs">
              <div className="flex">
                <span className="w-48 text-slate-600">1. Nama Lengkap</span>
                <span className="w-3">:</span>
                <span className="font-bold text-slate-900 uppercase">{req.namaLengkap}</span>
              </div>
              <div className="flex">
                <span className="w-48 text-slate-600">2. NIK (No. KTP)</span>
                <span className="w-3">:</span>
                <span className="font-mono font-bold text-slate-800">{req.nik}</span>
              </div>
              <div className="flex">
                <span className="w-48 text-slate-600">3. Tempat, Tgl. Lahir</span>
                <span className="w-3">:</span>
                <span>
                  {req.tempatLahir}, {req.tanggalLahir}
                </span>
              </div>
              <div className="flex">
                <span className="w-48 text-slate-600">4. Jenis Kelamin</span>
                <span className="w-3">:</span>
                <span>{req.jenisKelamin}</span>
              </div>
              <div className="flex">
                <span className="w-48 text-slate-600">5. Agama</span>
                <span className="w-3">:</span>
                <span>{req.agama}</span>
              </div>
              <div className="flex">
                <span className="w-48 text-slate-600">6. Pekerjaan</span>
                <span className="w-3">:</span>
                <span>{req.pekerjaan}</span>
              </div>
              <div className="flex">
                <span className="w-48 text-slate-600">7. Alamat Domisili</span>
                <span className="w-3">:</span>
                <span>
                  {req.alamat}, RT {req.rt} / RW {req.rw}, {desaName}, Kec. Rakit Kulim, Kab. Indragiri Hulu, Riau
                </span>
              </div>
            </div>

            {/* Letter Dynamic Body */}
            {renderLetterBody()}

            {/* Closing Paragraph */}
            <p className="text-justify my-4 indent-8 leading-relaxed">
              Demikian surat keterangan ini kami buat dengan sebenarnya dan tanpa ada paksaan dari pihak manapun, agar dapat dipergunakan sebagaimana mestinya oleh yang berkepentingan.
            </p>

            {/* Signature Section */}
            <div className="flex justify-between items-end pt-4">
              {/* Left Side: Citizen Signature or QR */}
              <div className="w-56 text-center font-sans text-xs">
                <p className="text-[11px] text-slate-500 mb-1">Tanda Tangan Pemohon,</p>
                <div className="h-20" />
                <p className="font-bold border-b border-black pb-0.5 inline-block min-w-[140px] uppercase">
                  {req.namaLengkap}
                </p>
              </div>

              {/* Right Side: Village Head Signature Area (Dikosongkan untuk TTD Manual & Stempel Basah) */}
              <div className="w-72 text-center font-sans text-xs">
                <p className="text-[11px] text-slate-700 leading-snug">
                  Ditetapkan di: {desaName.replace('Desa ', '')}<br />
                  Pada tanggal: {req.createdAt.split(',')[0] || '06 Oktober 2026'}
                </p>
                <p className="font-bold text-slate-900 mt-1 uppercase tracking-wider">
                  KEPALA {desaName.toUpperCase()}
                </p>

                {/* Ruang Kosong untuk Tanda Tangan Basah Manual & Stempel Fisik */}
                <div className="h-24 w-full flex items-center justify-center" aria-label="Ruang tanda tangan manual">
                  {/* Dikosongkan untuk tanda tangan basah dan cap stempel manual */}
                </div>

                <div className="text-slate-900 font-sans">
                  <p className="font-bold uppercase underline underline-offset-2">
                    {kadesName}
                  </p>
                </div>
              </div>
            </div>

            {/* Official Footer Note */}
            <div className="mt-12 pt-3 border-t border-slate-200 flex items-center justify-between font-sans text-[9px] text-slate-500">
              <div className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  Pemerintah {desaName} • Kecamatan Rakit Kulim, Kabupaten Indragiri Hulu, Riau
                </span>
              </div>
              <span>Format Cetak Draf Resmi Pelayanan Administrasi Desa Terpadu (SIPADES)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
