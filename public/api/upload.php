<?php
/**
 * SIPADES - Upload Handler Berkas Warga
 * Menyimpan file scan KTP, KK, dan Surat ke folder /uploads/
 */

require_once __DIR__ . '/config.php';

$uploadDir = dirname(__DIR__) . '/uploads';

// Pastikan direktori uploads tersedia dan writable
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// 1. Upload via multipart/form-data
if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['file']['tmp_name'];
    $originalName = basename($_FILES['file']['name']);
    $fileSize = $_FILES['file']['size'];
    $fileExtension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

    // Batasi ekstensi yang diizinkan untuk keamanan
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'webp'];
    if (!in_array($fileExtension, $allowedExtensions)) {
        jsonResponse([
            'success' => false,
            'message' => 'Format file tidak didukung. Harap upload gambar (JPG, PNG, WEBP) atau PDF.'
        ], 400);
    }

    // Nama file unik di server
    $cleanName = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
    $newFileName = $cleanName . '_' . time() . '.' . $fileExtension;
    $destination = $uploadDir . '/' . $newFileName;

    if (move_uploaded_file($fileTmpPath, $destination)) {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $fileUrl = '/uploads/' . $newFileName;

        jsonResponse([
            'success' => true,
            'message' => 'Berkas berhasil diunggah ke server',
            'fileName' => $originalName,
            'fileUrl' => $fileUrl,
            'fullUrl' => $protocol . $host . $fileUrl,
            'size' => $fileSize
        ]);
    } else {
        jsonResponse(['success' => false, 'message' => 'Gagal memindahkan file ke direktori server.'], 500);
    }
}

// 2. Upload via Base64 JSON
$input = json_decode(file_get_contents('php://input'), true);
if (!empty($input['base64']) && !empty($input['name'])) {
    $base64Data = $input['base64'];
    $originalName = basename($input['name']);
    $fileExtension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION)) ?: 'jpg';

    // Bersihkan prefix data:image/...;base64,
    if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $type)) {
        $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
        $fileExtension = strtolower($type[1]);
    }

    $decoded = base64_decode($base64Data);
    if ($decoded !== false) {
        $cleanName = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
        $newFileName = $cleanName . '_' . time() . '.' . $fileExtension;
        $destination = $uploadDir . '/' . $newFileName;

        if (file_put_contents($destination, $decoded)) {
            $fileUrl = '/uploads/' . $newFileName;
            jsonResponse([
                'success' => true,
                'message' => 'Berkas base64 berhasil disimpan di server',
                'fileName' => $originalName,
                'fileUrl' => $fileUrl
            ]);
        }
    }
}

jsonResponse(['success' => false, 'message' => 'Tidak ada file yang diunggah.'], 400);
