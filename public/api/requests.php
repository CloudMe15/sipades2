<?php
/**
 * SIPADES - Endpoint Manajemen Permohonan Surat Warga
 * Terkoneksi MariaDB / MySQL Terpusat
 */

require_once __DIR__ . '/config.php';

$jsonStorageFile = dirname(__DIR__) . '/api/requests_backup.json';

// Helper fallback file storage jika MySQL belum dikonfigurasi
function getLocalFallbackRequests() {
    global $jsonStorageFile;
    if (file_exists($jsonStorageFile)) {
        $content = file_get_contents($jsonStorageFile);
        return json_decode($content, true) ?: [];
    }
    return [];
}

function saveLocalFallbackRequests($data) {
    global $jsonStorageFile;
    file_put_contents($jsonStorageFile, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// ========================================================
// 1. GET: Ambil Semua Data Permohonan
// ========================================================
if ($method === 'GET') {
    if ($dbConnected && $pdo) {
        try {
            // Ambil dari MySQL
            $stmt = $pdo->query("SELECT * FROM requests ORDER BY created_timestamp DESC");
            $requests = $stmt->fetchAll();

            $result = [];
            foreach ($requests as $r) {
                // Ambil attachments
                $attStmt = $pdo->prepare("SELECT id, type, name, file_url as fileUrl, uploaded_at as uploadedAt, uploaded_by as uploadedBy, status, revision_note as revisionNote FROM attachments WHERE request_id = ?");
                $attStmt->execute([$r['id']]);
                $attachments = $attStmt->fetchAll();

                // Ambil timeline
                $tlStmt = $pdo->prepare("SELECT id, status, timestamp, actor, role, note FROM timelines WHERE request_id = ? ORDER BY created_timestamp ASC");
                $tlStmt->execute([$r['id']]);
                $timeline = $tlStmt->fetchAll();

                // Format sesuai CitizenRequest interface
                $result[] = [
                    'id' => $r['id'],
                    'ticketNumber' => $r['ticket_number'],
                    'nomorSuratDesa' => $r['nomor_surat_desa'] ?: null,
                    'nik' => $r['nik'],
                    'namaLengkap' => $r['nama_lengkap'],
                    'nomorWhatsapp' => $r['nomor_whatsapp'],
                    'nomorKk' => $r['nomor_kk'],
                    'tempatLahir' => $r['tempat_lahir'],
                    'tanggalLahir' => $r['tanggal_lahir'],
                    'jenisKelamin' => $r['jenis_kelamin'],
                    'agama' => $r['agama'],
                    'pekerjaan' => $r['pekerjaan'],
                    'alamat' => $r['alamat'],
                    'rt' => $r['rt'],
                    'rw' => $r['rw'],
                    'desa' => $r['desa'],
                    'serviceType' => $r['service_type'],
                    'keperluan' => $r['keperluan'],
                    'rincianTambahan' => $r['rincian_tambahan'] ? json_decode($r['rincian_tambahan'], true) : null,
                    'status' => $r['status'],
                    'rejectionReason' => $r['rejection_reason'] ?: null,
                    'estimatedCompletion' => $r['estimated_completion'],
                    'completedAt' => $r['completed_at'] ?: null,
                    'slaActualHours' => $r['sla_actual_hours'] ? floatval($r['sla_actual_hours']) : null,
                    'handover' => $r['handover_data'] ? json_decode($r['handover_data'], true) : null,
                    'createdAt' => $r['created_at'],
                    'updatedAt' => $r['updated_at'],
                    'attachments' => $attachments,
                    'timeline' => $timeline
                ];
            }

            jsonResponse(['success' => true, 'source' => 'mysql', 'data' => $result]);
        } catch (Exception $e) {
            // Jika ada error query, gunakan fallback lokal
        }
    }

    // Fallback file storage
    $local = getLocalFallbackRequests();
    jsonResponse(['success' => true, 'source' => 'local_storage', 'data' => $local]);
}

// ========================================================
// 2. POST: Buat / Update Permohonan
// ========================================================
if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (!$body) {
        jsonResponse(['success' => false, 'message' => 'Format payload JSON tidak valid.'], 400);
    }

    // A. Aksi: Tambah Pengajuan Baru dari RT
    if ($action === 'create' || empty($action)) {
        $req = $body;

        if ($dbConnected && $pdo) {
            try {
                $pdo->beginTransaction();

                $stmt = $pdo->prepare("INSERT INTO requests 
                    (id, ticket_number, nomor_surat_desa, nik, nama_lengkap, nomor_whatsapp, nomor_kk, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, pekerjaan, alamat, rt, rw, desa, service_type, keperluan, rincian_tambahan, status, created_at, updated_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

                $stmt->execute([
                    $req['id'],
                    $req['ticketNumber'],
                    $req['nomorSuratDesa'] ?? null,
                    $req['nik'],
                    $req['namaLengkap'],
                    $req['nomorWhatsapp'],
                    $req['nomorKk'] ?? null,
                    $req['tempatLahir'] ?? null,
                    $req['tanggalLahir'] ?? null,
                    $req['jenisKelamin'] ?? 'Laki-laki',
                    $req['agama'] ?? 'Islam',
                    $req['pekerjaan'] ?? null,
                    $req['alamat'] ?? null,
                    $req['rt'],
                    $req['rw'],
                    $req['desa'] ?? 'Desa Sukamaju',
                    $req['serviceType'],
                    $req['keperluan'],
                    !empty($req['rincianTambahan']) ? json_encode($req['rincianTambahan'], JSON_UNESCAPED_UNICODE) : null,
                    $req['status'] ?? 'menunggu_verifikasi',
                    $req['createdAt'],
                    $req['updatedAt']
                ]);

                // Simpan attachments
                if (!empty($req['attachments'])) {
                    $attStmt = $pdo->prepare("INSERT INTO attachments (id, request_id, type, name, file_url, uploaded_at, uploaded_by, status, revision_note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    foreach ($req['attachments'] as $att) {
                        $attStmt->execute([
                            $att['id'],
                            $req['id'],
                            $att['type'],
                            $att['name'],
                            $att['fileUrl'],
                            $att['uploadedAt'],
                            $att['uploadedBy'],
                            $att['status'] ?? 'pending',
                            $att['revisionNote'] ?? null
                        ]);
                    }
                }

                // Simpan timeline
                if (!empty($req['timeline'])) {
                    $tlStmt = $pdo->prepare("INSERT INTO timelines (id, request_id, status, timestamp, actor, role, note) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    foreach ($req['timeline'] as $tl) {
                        $tlStmt->execute([
                            $tl['id'],
                            $req['id'],
                            $tl['status'],
                            $tl['timestamp'],
                            $tl['actor'],
                            $tl['role'],
                            $tl['note'] ?? null
                        ]);
                    }
                }

                $pdo->commit();
                jsonResponse(['success' => true, 'message' => 'Pengajuan berhasil disimpan ke database MySQL.', 'data' => $req]);
            } catch (Exception $e) {
                $pdo->rollBack();
            }
        }

        // Fallback local file
        $existing = getLocalFallbackRequests();
        array_unshift($existing, $req);
        saveLocalFallbackRequests($existing);
        jsonResponse(['success' => true, 'message' => 'Pengajuan disimpan ke storage server.', 'data' => $req]);
    }

    // B. Aksi: Update Status (Terima, Tolak, TTD Kades, Selesai, Serah Terima)
    if (in_array($action, ['accept', 'reject', 'kades', 'complete', 'handover', 'revision', 'sync'])) {
        $requestId = $body['requestId'] ?? $body['id'] ?? '';

        if ($dbConnected && $pdo && $requestId) {
            try {
                if ($action === 'accept') {
                    $stmt = $pdo->prepare("UPDATE requests SET status = 'diproses', nomor_surat_desa = ?, updated_at = ? WHERE id = ?");
                    $stmt->execute([$body['nomorSuratDesa'], $body['updatedAt'], $requestId]);
                } elseif ($action === 'reject') {
                    $stmt = $pdo->prepare("UPDATE requests SET status = 'butuh_perbaikan', rejection_reason = ?, updated_at = ? WHERE id = ?");
                    $stmt->execute([$body['reason'], $body['updatedAt'], $requestId]);
                } elseif ($action === 'kades') {
                    $stmt = $pdo->prepare("UPDATE requests SET status = 'menunggu_ttd_kades', updated_at = ? WHERE id = ?");
                    $stmt->execute([$body['updatedAt'], $requestId]);
                } elseif ($action === 'complete') {
                    $stmt = $pdo->prepare("UPDATE requests SET status = 'selesai_siap_ambil', completed_at = ?, sla_actual_hours = ?, updated_at = ? WHERE id = ?");
                    $stmt->execute([$body['completedAt'], $body['slaActualHours'] ?? 4.5, $body['updatedAt'], $requestId]);

                    // Tambah attachment scan
                    if (!empty($body['scanAttachment'])) {
                        $att = $body['scanAttachment'];
                        $attStmt = $pdo->prepare("INSERT INTO attachments (id, request_id, type, name, file_url, uploaded_at, uploaded_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'valid')");
                        $attStmt->execute([$att['id'], $requestId, $att['type'], $att['name'], $att['fileUrl'], $att['uploadedAt'], $att['uploadedBy']]);
                    }
                } elseif ($action === 'handover') {
                    $stmt = $pdo->prepare("UPDATE requests SET status = 'sudah_diambil', handover_data = ?, updated_at = ? WHERE id = ?");
                    $stmt->execute([json_encode($body['handover'], JSON_UNESCAPED_UNICODE), $body['updatedAt'], $requestId]);
                } elseif ($action === 'revision') {
                    $stmt = $pdo->prepare("UPDATE requests SET status = 'menunggu_verifikasi', rejection_reason = NULL, updated_at = ? WHERE id = ?");
                    $stmt->execute([$body['updatedAt'], $requestId]);
                }

                // Tambahkan event timeline jika disertakan
                if (!empty($body['timelineEvent'])) {
                    $tl = $body['timelineEvent'];
                    $tlStmt = $pdo->prepare("INSERT INTO timelines (id, request_id, status, timestamp, actor, role, note) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    $tlStmt->execute([$tl['id'], $requestId, $tl['status'], $tl['timestamp'], $tl['actor'], $tl['role'], $tl['note'] ?? null]);
                }

                jsonResponse(['success' => true, 'message' => 'Status berhasil diperbarui di database MySQL.']);
            } catch (Exception $e) {
                // Lanjut ke fallback jika gagal
            }
        }

        // Fallback update file
        $existing = getLocalFallbackRequests();
        foreach ($existing as &$r) {
            if ($r['id'] === $requestId) {
                if ($action === 'accept') {
                    $r['status'] = 'diproses';
                    $r['nomorSuratDesa'] = $body['nomorSuratDesa'];
                } elseif ($action === 'reject') {
                    $r['status'] = 'butuh_perbaikan';
                    $r['rejectionReason'] = $body['reason'];
                } elseif ($action === 'kades') {
                    $r['status'] = 'menunggu_ttd_kades';
                } elseif ($action === 'complete') {
                    $r['status'] = 'selesai_siap_ambil';
                    $r['completedAt'] = $body['completedAt'];
                } elseif ($action === 'handover') {
                    $r['status'] = 'sudah_diambil';
                    $r['handover'] = $body['handover'];
                }
                if (!empty($body['timelineEvent'])) {
                    $r['timeline'][] = $body['timelineEvent'];
                }
                break;
            }
        }
        saveLocalFallbackRequests($existing);
        jsonResponse(['success' => true, 'message' => 'Status tersimpan di storage server.']);
    }

    // C. Aksi: Hapus Permohonan (Delete)
    if ($action === 'delete') {
        $requestId = $body['requestId'] ?? $body['id'] ?? '';
        if ($dbConnected && $pdo && $requestId) {
            try {
                $stmt = $pdo->prepare("DELETE FROM requests WHERE id = ?");
                $stmt->execute([$requestId]);
            } catch (Exception $e) {
                // Ignore fallback to file
            }
        }
        $existing = getLocalFallbackRequests();
        $filtered = array_filter($existing, function($r) use ($requestId) {
            return $r['id'] !== $requestId;
        });
        saveLocalFallbackRequests(array_values($filtered));
        jsonResponse(['success' => true, 'message' => 'Permohonan berhasil dihapus.']);
    }

    // D. Aksi: Bulk Sync Data dari frontend ke backend
    if ($action === 'sync_all' && !empty($body['requests'])) {
        saveLocalFallbackRequests($body['requests']);
        jsonResponse(['success' => true, 'message' => 'Seluruh data tersinkronisasi ke server.']);
    }

    // E. Aksi: Kosongkan Seluruh Data untuk Pengujian Baru (Reset)
    if ($action === 'clear_all') {
        if ($dbConnected && $pdo) {
            try {
                $pdo->exec("DELETE FROM attachments");
                $pdo->exec("DELETE FROM timelines");
                $pdo->exec("DELETE FROM requests");
            } catch (Exception $e) {}
        }
        saveLocalFallbackRequests([]);
        jsonResponse(['success' => true, 'message' => 'Semua data permohonan berhasil dikosongkan untuk pengujian baru.']);
    }
}

jsonResponse(['success' => false, 'message' => 'Aksi tidak dikenali.'], 400);
