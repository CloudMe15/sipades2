<?php
/**
 * SIPADES - Konfigurasi Koneksi Database MySQL / MariaDB
 * DirectAdmin Hosting - Kecamatan Rakit Kulim, Kab. Indragiri Hulu, Riau
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ========================================================
// PENGATURAN KREDENSIAL DATABASE MYSQL / MARIADB
// DirectAdmin Hosting: desasukamaju.my.id (Hostdata.id)
// ========================================================
$DB_HOST = 'localhost';
$DB_NAME = 'desasuka_sipades'; // Nama database di DirectAdmin
$DB_USER = 'desasuka_sipades'; // Username database di DirectAdmin
$DB_PASS = 'Sipades2026!#';    // Password database DirectAdmin Hostdata.id

// Cek apakah ada file override config local
$configFile = __DIR__ . '/db_credentials.php';
if (file_exists($configFile)) {
    include_once $configFile;
}

$pdo = null;
$dbConnected = false;

try {
    $dsn = "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);
    $dbConnected = true;
} catch (PDOException $e) {
    // Database MySQL belum diatur atau kredensial belum diisi
    $dbConnected = false;
    $dbError = $e->getMessage();
}

// Helper respond json
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}
