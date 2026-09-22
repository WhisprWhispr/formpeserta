const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } = require('firebase/firestore');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'ihkusgsc',
    api_key: '222826564748812',
    api_secret: '-HjKBD2fljAQ3P1K4h-AaBQNwRs'
});

// Configure Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA-rkX-zwdDT6NRprMatMCbKbJy60ZCYno",
    authDomain: "from-daftar.firebaseapp.com",
    projectId: "from-daftar",
    storageBucket: "from-daftar.firebasestorage.app",
    messagingSenderId: "192205202622",
    appId: "1:192205202622:web:eae40bc97fcfa2801aaaef"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary helper
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (result) resolve(result); else reject(error);
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

// ========================
// ADMIN ROUTES
// ========================
app.get('/api/admin/peserta', async (req, res) => {
    try {
        const snap = await getDocs(collection(db, 'pendaftar'));
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/admin/panitia', async (req, res) => {
    try {
        const snap = await getDocs(collection(db, 'panitia'));
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.get('/api/admin/surat-izin', async (req, res) => {
    try {
        const snap = await getDocs(collection(db, 'surat_izin'));
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

const colMap = { peserta: 'pendaftar', panitia: 'panitia', 'surat-izin': 'surat_izin' };
app.delete('/api/admin/:category/:id', async (req, res) => {
    try {
        const col = colMap[req.params.category];
        if (!col) return res.status(400).json({ success: false, message: 'Kategori tidak valid' });
        await deleteDoc(doc(db, col, req.params.id));
        res.json({ success: true, message: 'Data berhasil dihapus' });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ========================
// SETTINGS ROUTES
// ========================
const { getDoc, setDoc } = require('firebase/firestore');

app.get('/api/settings', async (req, res) => {
    try {
        const snap = await getDoc(doc(db, 'settings', 'pendaftaran'));
        const data = snap.exists() ? snap.data() : {};
        res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.post('/api/settings', async (req, res) => {
    try {
        const { deadline_peserta, deadline_panitia } = req.body;
        await setDoc(doc(db, 'settings', 'pendaftaran'), { deadline_peserta, deadline_panitia }, { merge: true });
        res.json({ success: true, message: 'Pengaturan disimpan' });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ========================
// FORM ROUTES
// ========================
app.post('/api/register', upload.fields([
    { name: 'bukti_hmps_if', maxCount: 1 },
    { name: 'bukti_upu', maxCount: 1 },
    { name: 'pas_foto', maxCount: 1 },
    { name: 'bukti_pembayaran', maxCount: 1 }
]), async (req, res) => {
    try {
        const formData = req.body;
        let bukti_hmps_if_url = '', bukti_upu_url = '', pas_foto_url = '', bukti_pembayaran_url = '';
        if (req.files['bukti_hmps_if']) bukti_hmps_if_url = (await uploadToCloudinary(req.files['bukti_hmps_if'][0].buffer, 'pendaftaran/bukti_hmps_if')).secure_url;
        if (req.files['bukti_upu']) bukti_upu_url = (await uploadToCloudinary(req.files['bukti_upu'][0].buffer, 'pendaftaran/bukti_upu')).secure_url;
        if (req.files['pas_foto']) pas_foto_url = (await uploadToCloudinary(req.files['pas_foto'][0].buffer, 'pendaftaran/pas_foto')).secure_url;
        if (req.files['bukti_pembayaran']) bukti_pembayaran_url = (await uploadToCloudinary(req.files['bukti_pembayaran'][0].buffer, 'pendaftaran/bukti_pembayaran')).secure_url;
        const docRef = await addDoc(collection(db, 'pendaftar'), { ...formData, bukti_hmps_if_url, bukti_upu_url, pas_foto_url, bukti_pembayaran_url, createdAt: new Date().toISOString() });
        res.json({ success: true, message: 'Pendaftaran berhasil', id: docRef.id });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/register-panitia', upload.fields([
    { name: 'bukti_hmps_if', maxCount: 1 },
    { name: 'bukti_upu', maxCount: 1 },
    { name: 'pas_foto', maxCount: 1 },
    { name: 'bukti_pembayaran', maxCount: 1 }
]), async (req, res) => {
    try {
        const formData = req.body;
        let bukti_hmps_if_url = '', bukti_upu_url = '', pas_foto_url = '', bukti_pembayaran_url = '';
        if (req.files['bukti_hmps_if']) bukti_hmps_if_url = (await uploadToCloudinary(req.files['bukti_hmps_if'][0].buffer, 'panitia/bukti_hmps_if')).secure_url;
        if (req.files['bukti_upu']) bukti_upu_url = (await uploadToCloudinary(req.files['bukti_upu'][0].buffer, 'panitia/bukti_upu')).secure_url;
        if (req.files['pas_foto']) pas_foto_url = (await uploadToCloudinary(req.files['pas_foto'][0].buffer, 'panitia/pas_foto')).secure_url;
        if (req.files['bukti_pembayaran']) bukti_pembayaran_url = (await uploadToCloudinary(req.files['bukti_pembayaran'][0].buffer, 'panitia/bukti_pembayaran')).secure_url;
        const docRef = await addDoc(collection(db, 'panitia'), { ...formData, bukti_hmps_if_url, bukti_upu_url, pas_foto_url, bukti_pembayaran_url, createdAt: new Date().toISOString() });
        res.json({ success: true, message: 'Pendaftaran panitia berhasil', id: docRef.id });
    } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ========================
// STATIC FILES (terakhir)
// ========================
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;
app.listen(PORT, () => {
    console.log('');
    console.log('  \u2705 Server berjalan di:');
    console.log('  \uD83D\uDC49 http://localhost:' + PORT + '           (Form Peserta)');
    console.log('  \uD83D\uDC49 http://localhost:' + PORT + '/admin.html (Panel Admin)');
    console.log('  \uD83D\uDC49 http://localhost:' + PORT + '/panitia.html (Form Panitia)');
    console.log('');
});
