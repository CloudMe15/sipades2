import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleApiRequest } from './src/server/apiHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');
const uploadsPath = path.join(__dirname, 'public', 'uploads');

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(uploadsPath));
app.use(express.static(distPath));

// API handler middleware for /api/* and /uploads/*
app.use((req, res, next) => {
  const url = req.url || '';
  if (url.startsWith('/api/') || url.startsWith('/uploads/')) {
    handleApiRequest(req, res, next);
  } else {
    next();
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'SIPADES Desa Sukamaju',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// SPA fallback: any other request serves index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[SIPADES] Server berjalan di port ${PORT}`);
});
