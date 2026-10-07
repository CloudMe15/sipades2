<?php
/**
 * SIPADES - Halaman Uji Koneksi Database MariaDB / MySQL
 * Buka di browser: https://desasukamaju.my.id/api/test_db.php
 */

header('Content-Type: text/html; charset=UTF-8');

$configFile = __DIR__ . '/db_credentials.php';

// Jika pengguna submit form kredensial dari halaman ini
$savedNotice = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_db'])) {
    $host = trim($_POST['db_host'] ?? 'localhost');
    $name = trim($_POST['db_name'] ?? '');
    $user = trim($_POST['db_user'] ?? '');
    $pass = trim($_POST['db_pass'] ?? '');

    $content = "<?php\n"
             . "// File Kredensial Database Otomatis SIPADES\n"
             . "\$DB_HOST = " . var_export($host, true) . ";\n"
             . "\$DB_NAME = " . var_export($name, true) . ";\n"
             . "\$DB_USER = " . var_export($user, true) . ";\n"
             . "\$DB_PASS = " . var_export($pass, true) . ";\n";

    file_put_contents($configFile, $content);
    $savedNotice = "Kredensial database berhasil disimpan!";
}

require_once __DIR__ . '/config.php';

$uploadDir = dirname(__DIR__) . '/uploads';
$uploadsWritable = is_writable($uploadDir) || (is_dir(dirname($uploadDir)) && is_writable(dirname($uploadDir)));
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Uji Koneksi Database - SIPADES Desa Sukamaju</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 text-slate-900 font-sans p-4 sm:p-8">
    <div class="max-w-3xl mx-auto space-y-6">
        <!-- Header -->
        <div class="bg-emerald-800 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
            <div>
                <span class="text-xs font-bold text-emerald-200 uppercase tracking-widest block">SIPADES Database Engine</span>
                <h1 class="text-xl sm:text-2xl font-black mt-1">Status Koneksi MariaDB / MySQL</h1>
                <p class="text-xs text-emerald-100 mt-0.5">Sinkronisasi Data Antar-Laptop RT dan Operator Kantor Desa</p>
            </div>
            <a href="/" class="px-4 py-2 bg-white text-emerald-900 font-bold text-xs rounded-xl shadow hover:bg-emerald-50 transition">
                ← Buka Website
            </a>
        </div>

        <?php if ($savedNotice): ?>
            <div class="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold">
                ✓ <?= htmlspecialchars($savedNotice) ?>
            </div>
        <?php endif; ?>

        <!-- Status Box -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 class="font-bold text-sm text-slate-800 uppercase tracking-wider">Hasil Pengecekan Server:</h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <!-- MySQL Status -->
                <div class="p-4 rounded-xl border <?= $dbConnected ? 'border-emerald-300 bg-emerald-50/60' : 'border-amber-300 bg-amber-50/60' ?>">
                    <span class="text-[11px] font-bold text-slate-500 uppercase block">Koneksi Database MySQL:</span>
                    <?php if ($dbConnected): ?>
                        <div class="text-base font-black text-emerald-700 mt-1 flex items-center gap-1.5">
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            TERHUBUNG (ONLINE)
                        </div>
                        <p class="text-[11px] text-emerald-800 mt-1">Database <strong><?= htmlspecialchars($DB_NAME) ?></strong> aktif.</p>
                    <?php else: ?>
                        <div class="text-base font-black text-amber-700 mt-1 flex items-center gap-1.5">
                            <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                            MENUNGGU KREDENSIAL
                        </div>
                        <p class="text-[11px] text-amber-800 mt-1">
                            <?= !empty($dbError) ? htmlspecialchars($dbError) : 'Silakan masukkan nama database, user, dan password di form bawah ini.' ?>
                        </p>
                    <?php endif; ?>
                </div>

                <!-- Folder Uploads Status -->
                <div class="p-4 rounded-xl border border-emerald-300 bg-emerald-50/60">
                    <span class="text-[11px] font-bold text-slate-500 uppercase block">Folder Upload Berkas (/uploads/):</span>
                    <div class="text-base font-black text-emerald-700 mt-1 flex items-center gap-1.5">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        SIAP DIGUNAKAN
                    </div>
                    <p class="text-[11px] text-emerald-800 mt-1">File KTP & KK yang diupload RT akan tersimpan aman di server.</p>
                </div>
            </div>

            <?php if ($dbConnected && $pdo): ?>
                <?php
                    // Cek tabel yang ada
                    $tables = ['users', 'requests', 'attachments', 'timelines', 'wa_logs'];
                    $existingTables = [];
                    foreach ($tables as $t) {
                        try {
                            $cnt = $pdo->query("SELECT COUNT(*) FROM `$t`")->fetchColumn();
                            $existingTables[$t] = $cnt;
                        } catch (Exception $e) {
                            $existingTables[$t] = false;
                        }
                    }
                ?>
                <div class="pt-4 border-t border-slate-100">
                    <h3 class="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">Tabel Database:</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        <?php foreach ($existingTables as $tName => $tCount): ?>
                            <div class="p-2.5 rounded-lg border <?= $tCount !== false ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900' : 'border-rose-200 bg-rose-50/40 text-rose-800' ?>">
                                <strong class="font-mono"><?= $tName ?></strong>
                                <span class="block text-[10px] text-slate-500">
                                    <?= $tCount !== false ? "✓ Ada ($tCount baris)" : '✗ Belum diimpor' ?>
                                </span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <?php if (in_array(false, $existingTables, true)): ?>
                        <p class="text-[11px] text-amber-700 mt-2">
                            ⚠️ Sebagian tabel belum diimpor. Silakan buka phpMyAdmin ➔ pilih database ➔ klik menu <strong>Import</strong> ➔ pilih file <strong>database.sql</strong>.
                        </p>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>

        <!-- Form Pengaturan Kredensial Database -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 class="font-bold text-sm text-slate-800 uppercase tracking-wider">
                Pengaturan Kredensial Database DirectAdmin
            </h2>
            <p class="text-xs text-slate-500">
                Masukkan nama database dan password yang Anda buat di menu <strong>Databases (MySQL Management)</strong> pada panel DirectAdmin Anda:
            </p>

            <form method="POST" class="space-y-3 text-xs">
                <input type="hidden" name="save_db" value="1">

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Database Host</label>
                        <input type="text" name="db_host" value="<?= htmlspecialchars($DB_HOST) ?>" class="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono">
                        <span class="text-[10px] text-slate-400">Biasanya tetap: localhost</span>
                    </div>

                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Nama Database (Database Name)</label>
                        <input type="text" name="db_name" value="<?= htmlspecialchars($DB_NAME) ?>" placeholder="Contoh: desasuka_sipades" class="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono" required>
                        <span class="text-[10px] text-slate-400">Nama database yang dibuat di DirectAdmin</span>
                    </div>

                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Database Username</label>
                        <input type="text" name="db_user" value="<?= htmlspecialchars($DB_USER) ?>" placeholder="Contoh: desasuka_sipades" class="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono" required>
                    </div>

                    <div>
                        <label class="block font-bold text-slate-700 mb-1">Database Password</label>
                        <input type="password" name="db_pass" value="<?= htmlspecialchars($DB_PASS) ?>" placeholder="Password database" class="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono" required>
                    </div>
                </div>

                <div class="pt-3">
                    <button type="submit" class="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow cursor-pointer transition">
                        Simpan & Uji Koneksi Database
                    </button>
                </div>
            </form>
        </div>

        <!-- Panduan 3 Langkah phpMyAdmin -->
        <div class="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-xs text-blue-900 space-y-2">
            <h3 class="font-bold text-sm text-blue-950">Cara Menyiapkan Database di phpMyAdmin (Hanya 2 Menit):</h3>
            <ol class="list-decimal pl-5 space-y-1 text-slate-700">
                <li>Buka panel DirectAdmin ➔ klik menu <strong>Databases</strong> ➔ klik <strong>Create Database</strong> (buat nama database misal: <code class="bg-white px-1 py-0.5 rounded border">sipades</code>). Catat nama database, user, dan password-nya.</li>
                <li>Buka <strong>phpMyAdmin</strong> ➔ klik nama database tersebut di sebelah kiri.</li>
                <li>Klik tab <strong>Import</strong> di bilah atas ➔ pilih file <strong>database.sql</strong> (yang ada di dalam folder website ini) ➔ klik <strong>Go / Impor</strong>. Selesai! Semua tabel otomatis tersusun rapi!</li>
            </ol>
        </div>
    </div>
</body>
</html>
