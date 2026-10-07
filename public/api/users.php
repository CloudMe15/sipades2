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
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $body = json_decode($rawInput, true);

    if (!$body) {
        jsonResponse(['success' => false, 'message' => 'Format payload JSON tidak valid.'], 400);
    }

    if (empty($action) && isset($body['action'])) {
        $action = $body['action'];
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
            'phone' => $phone
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

    // E. Hapus Akun
    if ($action === 'delete') {
        $id = $_GET['id'] ?? $body['userId'] ?? $body['id'] ?? '';
        if ($dbConnected && $pdo && $id) {
            try {
                $stmt = $pdo->prepare("DELETE FROM users WHERE id=?");
                $stmt->execute([$id]);
            } catch (Exception $e) {}
        }
        $existing = getLocalFallbackUsers();
        $existing = array_values(array_filter($existing, function($u) use ($id) {
            return $u['id'] !== $id;
        }));
        saveLocalFallbackUsers($existing);
        jsonResponse(['success' => true, 'message' => 'Akun berhasil dihapus.']);
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

    jsonResponse(['success' => false, 'message' => 'Aksi tidak dikenali.'], 400);
}
