import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { IncomingMessage, ServerResponse } from 'http';
import { INITIAL_REQUESTS, MOCK_USERS } from '../data/mockData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const backupFilePath = path.join(rootDir, 'public', 'api', 'requests_backup.json');
const usersBackupPath = path.join(rootDir, 'public', 'api', 'users_backup.json');
const uploadsDir = path.join(rootDir, 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(path.dirname(backupFilePath))) {
  fs.mkdirSync(path.dirname(backupFilePath), { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Seed initial backup file if missing
if (!fs.existsSync(backupFilePath)) {
  try {
    fs.writeFileSync(backupFilePath, JSON.stringify(INITIAL_REQUESTS, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to seed requests_backup.json:', err);
  }
}

// Seed initial users backup file if missing
if (!fs.existsSync(usersBackupPath)) {
  try {
    fs.writeFileSync(usersBackupPath, JSON.stringify(MOCK_USERS, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to seed users_backup.json:', err);
  }
}

function getStoredUsers(): any[] {
  try {
    if (fs.existsSync(usersBackupPath)) {
      const raw = fs.readFileSync(usersBackupPath, 'utf8');
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        // Enforce master admin credentials: Admin / CloudMe
        return list.map(u => {
          if (u.username && u.username.toLowerCase() === 'admin') {
            return { ...u, password: 'CloudMe', role: 'admin', status: 'active', emailVerified: true };
          }
          return u;
        });
      }
    }
  } catch (err) {
    console.error('Error reading backup users:', err);
  }
  return MOCK_USERS;
}

function saveStoredUsers(data: any[]) {
  try {
    fs.writeFileSync(usersBackupPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing backup users:', err);
  }
}

function getStoredRequests(): any[] {
  try {
    if (fs.existsSync(backupFilePath)) {
      const raw = fs.readFileSync(backupFilePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading backup requests:', err);
  }
  return INITIAL_REQUESTS;
}

function saveStoredRequests(data: any[]) {
  try {
    fs.writeFileSync(backupFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing backup requests:', err);
  }
}

// Helper to send JSON response
function sendJson(res: ServerResponse, data: any, statusCode = 200) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.end(JSON.stringify(data));
}

// Main API Handler for requests & uploads
export function handleApiRequest(
  req: IncomingMessage & { body?: any },
  res: ServerResponse,
  next?: () => void
) {
  const urlObj = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;
  const method = req.method?.toUpperCase() || 'GET';

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.end();
    return;
  }

  // 1. Static uploads serving fallback if not handled
  if (pathname.startsWith('/uploads/')) {
    const fileName = path.basename(pathname);
    const filePath = path.join(uploadsDir, fileName);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(fileName).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.pdf': 'application/pdf',
        '.svg': 'image/svg+xml'
      };
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // 2. Health & test endpoint
  if (pathname === '/api/test_db.php' || pathname === '/api/health') {
    const list = getStoredRequests();
    return sendJson(res, {
      success: true,
      service: 'SIPADES Kecamatan Rakit Kulim Database & Storage Engine',
      status: 'online',
      storage: 'active',
      totalRequests: list.length,
      timestamp: new Date().toISOString()
    });
  }

  // 2B. /api/users & /api/users.php (Authentication & Self Registration)
  if (pathname === '/api/users' || pathname === '/api/users.php') {
    const action = urlObj.searchParams.get('action') || '';

    if (method === 'GET') {
      const usersList = getStoredUsers();
      return sendJson(res, {
        success: true,
        source: 'server_database',
        data: usersList,
        count: usersList.length,
        timestamp: new Date().toISOString()
      });
    }

    if (method === 'POST') {
      const handleUserBody = (body: any) => {
        const act = action || body?.action || 'register';
        const usersList = getStoredUsers();

        if (act === 'register') {
          const newUser = body;
          // Check username duplicate
          const existing = usersList.find(
            u => u.username.toLowerCase() === (newUser.username || '').toLowerCase()
          );
          if (existing) {
            return sendJson(res, {
              success: false,
              message: `Username '${newUser.username}' sudah terdaftar.`
            }, 400);
          }

          usersList.unshift(newUser);
          saveStoredUsers(usersList);
          return sendJson(res, {
            success: true,
            message: 'Akun berhasil didaftarkan.',
            data: newUser
          });
        }

        if (act === 'approve' || act === 'approve_user') {
          const userId = body.userId || body.id;
          const idx = usersList.findIndex(u => u.id === userId);
          if (idx >= 0) {
            usersList[idx].status = 'active';
            saveStoredUsers(usersList);
            return sendJson(res, {
              success: true,
              message: 'Akun berhasil disetujui & diaktifkan.',
              data: usersList[idx]
            });
          }
          return sendJson(res, { success: false, message: 'Akun tidak ditemukan.' }, 404);
        }

        if (act === 'reject' || act === 'reject_user') {
          const userId = body.userId || body.id;
          const idx = usersList.findIndex(u => u.id === userId);
          if (idx >= 0) {
            usersList[idx].status = 'rejected';
            saveStoredUsers(usersList);
            return sendJson(res, {
              success: true,
              message: 'Akun telah ditolak.',
              data: usersList[idx]
            });
          }
          return sendJson(res, { success: false, message: 'Akun tidak ditemukan.' }, 404);
        }

        if (act === 'delete' || act === 'delete_user') {
          const userId = body?.userId || body?.id || urlObj.searchParams.get('id');
          const idx = usersList.findIndex(u => u.id === userId || u.username === userId);
          if (idx >= 0) {
            const removed = usersList.splice(idx, 1);
            saveStoredUsers(usersList);
            return sendJson(res, {
              success: true,
              message: 'Akun berhasil dihapus dari database & server.',
              data: removed[0]
            });
          }
          return sendJson(res, { success: false, message: 'Akun tidak ditemukan di database.' }, 404);
        }

        if (act === 'send_otp') {
          const { email, purpose, code } = body;
          const cleanEmail = (email || '').trim().toLowerCase();
          const otpCode = code || Math.floor(100000 + Math.random() * 900000).toString();
          console.log(`[SIPADES SERVER EMAIL] Dikirimkan ke: ${cleanEmail} | Subjek: [SIPADES] Kode Verifikasi (${purpose}) | Kode OTP: ${otpCode}`);
          return sendJson(res, {
            success: true,
            message: `Kode verifikasi 6 digit telah dikirimkan ke email: ${cleanEmail}`,
            email: cleanEmail,
            code: otpCode
          });
        }

        if (act === 'update_profile') {
          const userId = body.id;
          const idx = usersList.findIndex(u => u.id === userId);
          if (idx >= 0) {
            usersList[idx] = { ...usersList[idx], ...body };
            saveStoredUsers(usersList);
            return sendJson(res, {
              success: true,
              message: 'Profil berhasil diperbarui.',
              data: usersList[idx]
            });
          }
          return sendJson(res, { success: false, message: 'Pengguna tidak ditemukan.' }, 404);
        }

        if (act === 'reset_password') {
          const { emailOrUsername, newPassword } = body;
          const clean = (emailOrUsername || '').trim().toLowerCase();
          const target = usersList.find(
            u => u.username.toLowerCase() === clean || (u.email && u.email.toLowerCase() === clean)
          );
          if (target) {
            target.password = newPassword;
            saveStoredUsers(usersList);
            return sendJson(res, {
              success: true,
              message: 'Kata sandi berhasil direset.',
              data: { username: target.username, email: target.email }
            });
          }
          return sendJson(res, { success: false, message: 'Akun dengan email atau username tersebut tidak ditemukan.' }, 404);
        }

        if (act === 'verify_email') {
          const { email, username: uName } = body;
          const cleanEmail = (email || '').trim().toLowerCase();
          const cleanUsername = (uName || '').trim().toLowerCase();
          const target = usersList.find(
            u => (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail) ||
                 (cleanUsername && u.username.toLowerCase() === cleanUsername)
          );
          if (target) {
            target.emailVerified = true;
            target.status = 'active';
            saveStoredUsers(usersList);
            return sendJson(res, {
              success: true,
              message: 'Email berhasil diverifikasi dan akun aktif.',
              data: target
            });
          }
          return sendJson(res, { success: false, message: 'Akun tidak ditemukan.' }, 404);
        }

        return sendJson(res, { success: false, message: 'Aksi pengguna tidak dikenali.' }, 400);
      };

      if (req.body && typeof req.body === 'object') {
        return handleUserBody(req.body);
      }

      let bodyData = '';
      req.on('data', chunk => {
        bodyData += chunk;
      });
      req.on('end', () => {
        try {
          const parsed = bodyData ? JSON.parse(bodyData) : {};
          handleUserBody(parsed);
        } catch {
          return sendJson(res, { success: false, message: 'Format JSON payload tidak valid.' }, 400);
        }
      });
      return;
    }
  }

  // 3. /api/requests & /api/requests.php
  if (pathname === '/api/requests' || pathname === '/api/requests.php') {
    const action = urlObj.searchParams.get('action') || '';

    if (method === 'GET') {
      const list = getStoredRequests();
      return sendJson(res, {
        success: true,
        source: 'server_database',
        data: list,
        count: list.length,
        timestamp: new Date().toISOString()
      });
    }

    if (method === 'POST') {
      const handleBody = (body: any) => {
        const act = action || body?.action || 'create';
        const list = getStoredRequests();

        if (act === 'create' || !action) {
          const newReq = body;
          // Filter duplicate if already exists
          const existingIdx = list.findIndex(r => r.id === newReq.id || r.ticketNumber === newReq.ticketNumber);
          if (existingIdx >= 0) {
            list[existingIdx] = newReq;
          } else {
            list.unshift(newReq);
          }
          saveStoredRequests(list);
          return sendJson(res, {
            success: true,
            message: 'Permohonan warga berhasil disimpan ke database.',
            data: newReq
          });
        }

        if (act === 'delete') {
          const reqId = body.requestId || body.id;
          const filtered = list.filter(r => r.id !== reqId);
          saveStoredRequests(filtered);
          return sendJson(res, {
            success: true,
            message: 'Permohonan berhasil dihapus dari database.'
          });
        }

        if (act === 'clear_all' || act === 'reset_all') {
          saveStoredRequests([]);
          return sendJson(res, {
            success: true,
            message: 'Seluruh permohonan berhasil dikosongkan untuk pengujian baru.'
          });
        }

        if (['accept', 'reject', 'kades', 'complete', 'handover', 'revision', 'sync'].includes(act)) {
          const reqId = body.requestId || body.id;
          const target = list.find(r => r.id === reqId);
          if (target) {
            if (act === 'accept') {
              target.status = 'diproses';
              target.nomorSuratDesa = body.nomorSuratDesa;
            } else if (act === 'reject') {
              target.status = 'butuh_perbaikan';
              target.rejectionReason = body.reason;
            } else if (act === 'kades') {
              target.status = 'menunggu_ttd_kades';
            } else if (act === 'complete') {
              target.status = 'selesai_siap_ambil';
              target.completedAt = body.completedAt;
              target.slaActualHours = body.slaActualHours || 4.5;
              if (body.scanAttachment) {
                target.attachments = target.attachments || [];
                target.attachments.push(body.scanAttachment);
              }
            } else if (act === 'handover') {
              target.status = 'sudah_diambil';
              target.handover = body.handover;
            } else if (act === 'revision') {
              target.status = 'menunggu_verifikasi';
              target.rejectionReason = undefined;
              if (body.attachments) {
                target.attachments = body.attachments;
              }
            }

            if (body.updatedAt) {
              target.updatedAt = body.updatedAt;
            }
            if (body.timelineEvent) {
              target.timeline = target.timeline || [];
              target.timeline.push(body.timelineEvent);
            }

            saveStoredRequests(list);
            return sendJson(res, {
              success: true,
              message: `Status berhasil diupdate (${act}).`,
              data: target
            });
          }
        }

        if (act === 'sync_all' && Array.isArray(body.requests)) {
          saveStoredRequests(body.requests);
          return sendJson(res, {
            success: true,
            message: 'Seluruh permohonan berhasil disinkronkan ke server.'
          });
        }

        return sendJson(res, { success: false, message: 'Aksi tidak valid atau tidak dikenali.' }, 400);
      };

      // If body already parsed (e.g. Express)
      if (req.body && typeof req.body === 'object') {
        return handleBody(req.body);
      }

      // Collect request stream chunks in Connect / raw Node
      let bodyData = '';
      req.on('data', chunk => {
        bodyData += chunk;
      });
      req.on('end', () => {
        try {
          const parsed = bodyData ? JSON.parse(bodyData) : {};
          handleBody(parsed);
        } catch (err) {
          return sendJson(res, { success: false, message: 'Format JSON payload tidak valid.' }, 400);
        }
      });
      return;
    }
  }

  // 4. /api/upload & /api/upload.php
  if (pathname === '/api/upload' || pathname === '/api/upload.php') {
    if (method === 'POST') {
      let bodyData = '';
      req.on('data', chunk => {
        bodyData += chunk;
      });
      req.on('end', () => {
        try {
          const parsed = bodyData ? JSON.parse(bodyData) : {};
          if (parsed.base64 && parsed.name) {
            let base64 = parsed.base64;
            const originalName = path.basename(parsed.name);
            let ext = path.extname(originalName).replace('.', '').toLowerCase() || 'jpg';

            const match = base64.match(/^data:image\/(\w+);base64,/);
            if (match) {
              ext = match[1];
              base64 = base64.replace(/^data:image\/\w+;base64,/, '');
            } else if (base64.startsWith('data:application/pdf;base64,')) {
              ext = 'pdf';
              base64 = base64.replace(/^data:application\/pdf;base64,/, '');
            }

            const cleanName = path.basename(originalName, path.extname(originalName)).replace(/[^a-zA-Z0-9_-]/g, '_');
            const fileName = `${cleanName}_${Date.now()}.${ext}`;
            const destPath = path.join(uploadsDir, fileName);

            fs.writeFileSync(destPath, Buffer.from(base64, 'base64'));

            return sendJson(res, {
              success: true,
              message: 'Berkas berhasil disimpan di server.',
              fileName: originalName,
              fileUrl: `/uploads/${fileName}`,
              size: Buffer.from(base64, 'base64').length
            });
          }

          return sendJson(res, { success: false, message: 'Data berkas tidak lengkap.' }, 400);
        } catch (err) {
          return sendJson(res, { success: false, message: 'Gagal memproses unggahan file.' }, 500);
        }
      });
      return;
    }
  }

  if (next) {
    next();
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
}
