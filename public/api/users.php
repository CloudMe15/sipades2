<?php
/**
 * SIPADES - API Pengelolaan Pengguna & Akun (Users)
 * Kecamatan Rakit Kulim, Kabupaten Indragiri Hulu, Riau
 */

require_once __DIR__ . '/config.php';

$backupFile = __DIR__ . '/users_backup.json';

function getLocalFallbackUsers() {
    global $backupFile;
    if (file_exists($backupFile)) {
        $content = file_get_contents($backupFile);
        $data = json_decode($content, true);
        if (is_array($data)) return $data;
    }
    return [];
}

function saveLocalFallbackUsers($data) {
    global $backupFile;
    file_put_contents($backupFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// ----------------------------------------------------
// GET: Ambil Daftar Akun Pengguna
// ----------------------------------------------------
if ($method === 'GET') {
    if ($dbConnected && $pdo) {
        try {
            $stmt = $pdo->query("SELECT id, username, email, name, role, identifier, village, avatar, phone FROM users ORDER BY role ASC, name ASC");
            $rows = $stmt->fetchAll();
            jsonResponse([
                'success' => true,
                'source' => 'mysql',
                'data' => $rows,
                'count' => count($rows)
            ]);
        } catch (PDOException $e) {
            // fallback
        }
    }

    $fallback = getLocalFallbackUsers();
    jsonResponse([
        'success' => true,
        'source' => 'local_storage',
        'data' => $fallback,
        'count' => count($fallback)
    ]);
}

// ----------------------------------------------------
// POST: Register Akun Mandiri atau Edit Profil
// ----------------------------------------------------
if ($method === 'POST' || $method === 'DELETE') {
    $rawInput = file_get_contents('php://input');
    $body = json_decode($rawInput, true);
    if (!is_array($body)) {
        $body = [];
    }

    if (empty($action)) {
        if ($method === 'DELETE') {
            $action = 'delete';
        } elseif (isset($body['action'])) {
            $action = $body['action'];
        }
    }

    // A. Registrasi Mandiri Akun Baru
    if ($action === 'register') {
        $id = !empty($body['id']) ? $body['id'] : 'user-' . round(microtime(true) * 1000);
        $username = trim($body['username'] ?? '');
        $password = $body['password'] ?? 'password123';
        $email = $body['email'] ?? ($username . '@rakitkulim.desa.id');
        $name = trim($body['name'] ?? 'Petugas RT');
        $role = $body['role'] ?? 'rt';
        $identifier = $body['identifier'] ?? 'Ketua RT 01';
        $village = $body['village'] ?? 'Desa Kelayang';
        $avatar = $body['avatar'] ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
        $phone = $body['phone'] ?? '';

        if (empty($username) || empty($name)) {
            jsonResponse(['success' => false, 'message' => 'Username dan Nama Lengkap wajib diisi.'], 400);
        }

        if ($dbConnected && $pdo) {
            try {
                // Cek username duplikat
                $check = $pdo->prepare("SELECT id FROM users WHERE username = ?");
                $check->execute([$username]);
                if ($check->fetch()) {
                    jsonResponse(['success' => false, 'message' => 'Username ' . $username . ' sudah digunakan. Silakan pilih username lain.'], 400);
                }

                $stmt = $pdo->prepare("INSERT INTO users (id, username, password, email, name, role, identifier, village, avatar, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$id, $username, $password, $email, $name, $role, $identifier, $village, $avatar, $phone]);

                jsonResponse([
                    'success' => true,
                    'message' => 'Akun berhasil didaftarkan di database MySQL.',
                    'data' => [
                        'id' => $id,
                        'username' => $username,
                        'email' => $email,
                        'name' => $name,
                        'role' => $role,
                        'identifier' => $identifier,
                        'village' => $village,
                        'avatar' => $avatar,
                        'phone' => $phone
                    ]
                ]);
            } catch (PDOException $e) {
                // fallback
            }
        }

        // Local fallback
        $existing = getLocalFallbackUsers();
        foreach ($existing as $u) {
            if (strtolower($u['username']) === strtolower($username)) {
                jsonResponse(['success' => false, 'message' => 'Username ' . $username . ' sudah terdaftar.'], 400);
            }
        }

        $newUser = [
            'id' => $id,
            'username' => $username,
            'password' => $password,
            'email' => $email,
            'name' => $name,
            'role' => $role,
            'identifier' => $identifier,
            'village' => $village,
            'avatar' => $avatar,
            'phone' => $phone,
            'status' => 'pending',
            'emailVerified' => true
        ];
        array_unshift($existing, $newUser);
        saveLocalFallbackUsers($existing);

        jsonResponse([
            'success' => true,
            'message' => 'Akun berhasil didaftarkan di penyimpanan server.',
            'data' => $newUser
        ]);
    }

    // B. Perbarui Profil Pengguna
    if ($action === 'update_profile') {
        $id = $body['id'] ?? '';
        if (empty($id)) {
            jsonResponse(['success' => false, 'message' => 'ID pengguna diperlukan untuk update profil.'], 400);
        }

        $name = trim($body['name'] ?? '');
        $identifier = $body['identifier'] ?? '';
        $village = $body['village'] ?? '';
        $avatar = $body['avatar'] ?? '';
        $phone = $body['phone'] ?? '';
        $email = $body['email'] ?? '';
        $password = !empty($body['password']) ? $body['password'] : null;

        if ($dbConnected && $pdo) {
            try {
                if ($password) {
                    $stmt = $pdo->prepare("UPDATE users SET name=?, identifier=?, village=?, avatar=?, phone=?, email=?, password=? WHERE id=?");
                    $stmt->execute([$name, $identifier, $village, $avatar, $phone, $email, $password, $id]);
                } else {
                    $stmt = $pdo->prepare("UPDATE users SET name=?, identifier=?, village=?, avatar=?, phone=?, email=? WHERE id=?");
                    $stmt->execute([$name, $identifier, $village, $avatar, $phone, $email, $id]);
                }

                jsonResponse([
                    'success' => true,
                    'message' => 'Profil berhasil diperbarui di database MySQL.'
                ]);
            } catch (PDOException $e) {
                // fallback
            }
        }

        // Local fallback
        $existing = getLocalFallbackUsers();
        foreach ($existing as &$u) {
            if ($u['id'] === $id) {
                if ($name) $u['name'] = $name;
                if ($identifier) $u['identifier'] = $identifier;
                if ($village) $u['village'] = $village;
                if ($avatar) $u['avatar'] = $avatar;
                if ($phone) $u['phone'] = $phone;
                if ($email) $u['email'] = $email;
                if ($password) $u['password'] = $password;
                break;
            }
        }
        saveLocalFallbackUsers($existing);

        jsonResponse([
            'success' => true,
            'message' => 'Profil berhasil diperbarui di penyimpanan server.'
        ]);
    }

    // C. Persetujuan Akun oleh Super Admin Master
    if ($action === 'approve') {
        $id = $body['userId'] ?? $body['id'] ?? '';
        if ($dbConnected && $pdo && $id) {
            try {
                $stmt = $pdo->prepare("UPDATE users SET status='active' WHERE id=?");
                $stmt->execute([$id]);
            } catch (Exception $e) {}
        }
        $existing = getLocalFallbackUsers();
        foreach ($existing as &$u) {
            if ($u['id'] === $id) {
                $u['status'] = 'active';
                break;
            }
        }
        saveLocalFallbackUsers($existing);
        jsonResponse(['success' => true, 'message' => 'Akun berhasil disetujui dan diaktifkan.']);
    }

    // D. Penolakan Akun
    if ($action === 'reject') {
        $id = $body['userId'] ?? $body['id'] ?? '';
        if ($dbConnected && $pdo && $id) {
            try {
                $stmt = $pdo->prepare("UPDATE users SET status='rejected' WHERE id=?");
                $stmt->execute([$id]);
            } catch (Exception $e) {}
        }
        $existing = getLocalFallbackUsers();
        foreach ($existing as &$u) {
            if ($u['id'] === $id) {
                $u['status'] = 'rejected';
                break;
            }
        }
        saveLocalFallbackUsers($existing);
        jsonResponse(['success' => true, 'message' => 'Akun berhasil ditolak.']);
    }

    // E. Hapus Akun Permanen (Database MySQL & Backup Storage)
    if ($action === 'delete' || $action === 'delete_user') {
        $id = $_GET['id'] ?? $body['userId'] ?? $body['id'] ?? '';
        if (empty($id)) {
            jsonResponse(['success' => false, 'message' => 'ID akun pengguna tidak ditentukan.'], 400);
        }

        $deletedFromDb = false;
        if ($dbConnected && $pdo) {
            try {
                $stmt = $pdo->prepare("DELETE FROM users WHERE id = ? OR username = ?");
                $stmt->execute([$id, $id]);
                if ($stmt->rowCount() > 0) {
                    $deletedFromDb = true;
                }
            } catch (Exception $e) {
                error_log("Gagal menghapus user dari MySQL: " . $e->getMessage());
            }
        }

        $existing = getLocalFallbackUsers();
        $existing = array_values(array_filter($existing, function($u) use ($id) {
            return ($u['id'] ?? '') !== $id && ($u['username'] ?? '') !== $id;
        }));
        saveLocalFallbackUsers($existing);

        jsonResponse([
            'success' => true,
            'message' => 'Akun berhasil dihapus secara permanen dari database.',
            'deletedFromDb' => $deletedFromDb,
            'id' => $id
        ]);
    }

    // F. Reset Password via Email
    if ($action === 'reset_password') {
        $identifier = strtolower(trim($body['emailOrUsername'] ?? ''));
        $newPassword = $body['newPassword'] ?? '';
        if (empty($identifier) || strlen($newPassword) < 6) {
            jsonResponse(['success' => false, 'message' => 'Data tidak lengkap atau password minimal 6 karakter.'], 400);
        }

        if ($dbConnected && $pdo) {
            try {
                $stmt = $pdo->prepare("UPDATE users SET password=? WHERE LOWER(username)=? OR LOWER(email)=?");
                $stmt->execute([$newPassword, $identifier, $identifier]);
            } catch (Exception $e) {}
        }

        $existing = getLocalFallbackUsers();
        $found = false;
        foreach ($existing as &$u) {
            if (strtolower($u['username']) === $identifier || (isset($u['email']) && strtolower($u['email']) === $identifier)) {
                $u['password'] = $newPassword;
                $found = true;
                break;
            }
        }
        if ($found) {
            saveLocalFallbackUsers($existing);
            jsonResponse(['success' => true, 'message' => 'Kata sandi berhasil direset.']);
        }
        jsonResponse(['success' => false, 'message' => 'Akun tidak ditemukan.'], 404);
    }

    // G. Verifikasi Email Pendaftaran Aktif
    if ($action === 'verify_email') {
        $email = strtolower(trim($body['email'] ?? ''));
        $username = strtolower(trim($body['username'] ?? ''));
        $existing = getLocalFallbackUsers();
        $found = false;
        foreach ($existing as &$u) {
            if ((!empty($email) && isset($u['email']) && strtolower($u['email']) === $email) ||
                (!empty($username) && strtolower($u['username']) === $username)) {
                $u['emailVerified'] = true;
                $u['status'] = 'active';
                $found = true;
                break;
            }
        }
        if ($found) {
            saveLocalFallbackUsers($existing);
            jsonResponse(['success' => true, 'message' => 'Email diverifikasi dan akun aktif.']);
        }
        jsonResponse(['success' => false, 'message' => 'Akun tidak ditemukan.'], 404);
    }

    // H. Kirim Kode OTP Verifikasi Resmi ke Email
    if ($action === 'send_otp') {
        $email = trim($body['email'] ?? '');
        $purpose = trim($body['purpose'] ?? 'pendaftaran');
        $code = trim($body['code'] ?? '');
        if (empty($code)) {
            $code = strval(rand(100000, 999999));
        }

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse(['success' => false, 'message' => 'Alamat email tidak valid.'], 400);
        }

        // Simpan OTP ke cache server
        $otpCacheFile = __DIR__ . '/otp_cache.json';
        $otps = file_exists($otpCacheFile) ? json_decode(file_get_contents($otpCacheFile), true) : [];
        if (!is_array($otps)) $otps = [];
        $otps[strtolower($email)] = [
            'code' => $code,
            'expires' => time() + 900
        ];
        file_put_contents($otpCacheFile, json_encode($otps));

        // Subjek & Isi Email Resmi HTML
        $isReset = ($purpose === 'reset_password');
        $subject = $isReset
            ? "[SIPADES] Kode Verifikasi Reset Kata Sandi"
            : "[SIPADES] Kode Verifikasi Pendaftaran Akun Aparatur";

        $message = "
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset='UTF-8'>
          <title>{$subject}</title>
        </head>
        <body style='margin: 0; padding: 24px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;'>
          <div style='max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.07);'>
            <div style='background: linear-gradient(135deg, #065f46 0%, #047857 100%); padding: 28px 24px; text-align: center; color: #ffffff;'>
              <h1 style='margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;'>SIPADES Kec. Rakit Kulim</h1>
              <p style='margin: 6px 0 0; font-size: 12px; color: #a7f3d0;'>Sistem Pelayanan Administrasi Desa Terpadu • Kab. Indragiri Hulu, Riau</p>
            </div>
            <div style='padding: 32px 24px;'>
              <h2 style='margin: 0 0 12px; font-size: 16px; color: #0f172a;'>Yth. Calon Pengguna / Petugas,</h2>
              <p style='margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #475569;'>
                Berikut adalah 6 digit Kode Verifikasi OTP Anda untuk " . ($isReset ? "mereset kata sandi akun" : "konfirmasi pendaftaran akun") . " di sistem SIPADES:
              </p>
              <div style='background-color: #ecfdf5; border: 2px dashed #059669; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;'>
                <span style='font-family: Courier New, Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 10px; color: #065f46;'>{$code}</span>
              </div>
              <p style='margin: 0; font-size: 12px; line-height: 1.6; color: #64748b;'>
                • Kode ini berlaku selama <strong>15 menit</strong> sejak dikirimkan.<br>
                • Rahasiakan kode ini dan jangan berikan kepada pihak mana pun.<br>
                • Jika Anda tidak merasa meminta kode ini, mohon abaikan email ini.
              </p>
            </div>
            <div style='background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center;'>
              <p style='margin: 0; font-size: 11px; color: #94a3b8;'>
                Kantor Pelayanan Terpadu Kecamatan Rakit Kulim • Kabupaten Indragiri Hulu, Riau<br>
                Email Otomatis Sistem — Mohon tidak membalas email ini langsung.
              </p>
            </div>
          </div>
        </body>
        </html>
        ";

        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: SIPADES Rakit Kulim <noreply@desasukamaju.my.id>\r\n";
        $headers .= "Reply-To: pelayanan@rakitkulim.desa.id\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        // Kirim email via server MTA / Postfix / Exim di DirectAdmin
        @mail($email, $subject, $message, $headers);

        jsonResponse([
            'success' => true,
            'message' => 'Kode OTP 6-digit berhasil dikirimkan ke email: ' . $email
        ]);
    }

    jsonResponse(['success' => false, 'message' => 'Aksi tidak dikenali.'], 400);
}
