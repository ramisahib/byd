import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeDatabase, getDb } from './database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;
const SECRET_KEY = process.env.JWT_SECRET || 'byd-secret-key';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Initialize DB
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});

// Auth Route
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const db = getDb();
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { username: user.username } });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Middleware for Auth
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Apps Routes
app.get('/api/apps', async (req, res) => {
    const db = getDb();
    const apps = await db.all('SELECT * FROM apps ORDER BY uploadDate DESC');
    res.json(apps);
});

app.post('/api/apps/upload', authenticate, upload.single('apk'), async (req, res) => {
    const { name, version, developer, category, description, size, iconUrl } = req.body;
    const db = getDb();
    const result = await db.run(
        `INSERT INTO apps (name, version, developer, category, description, size, uploadDate, status, iconUrl, filename) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, version, developer, category, description, size, new Date().toLocaleDateString(), 'Verified', iconUrl, req.file.filename]
    );
    res.json({ id: result.lastID, message: 'App uploaded successfully' });
});

app.delete('/api/apps/:id', authenticate, async (req, res) => {
    const db = getDb();
    await db.run('DELETE FROM apps WHERE id = ?', [req.params.id]);
    res.json({ message: 'App deleted' });
});

app.put('/api/apps/:id', authenticate, async (req, res) => {
    try {
        const { name, version, developer, category, description, size, iconUrl } = req.body;
        const db = getDb();
        await db.run(
            `UPDATE apps SET name = ?, version = ?, developer = ?, category = ?, description = ?, size = ?, iconUrl = ?
             WHERE id = ?`,
            [name, version, developer, category, description, size, iconUrl, parseInt(req.params.id)]
        );
        res.json({ message: 'App updated successfully' });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Internal server error during update' });
    }
});

app.get('/api/apps/:id/download', async (req, res) => {
    const db = getDb();
    const app = await db.get('SELECT * FROM apps WHERE id = ?', [req.params.id]);
    if (app) {
        const filePath = path.join(uploadDir, app.filename);
        res.download(filePath, app.filename);
    } else {
        res.status(404).json({ error: 'App not found' });
    }
});
