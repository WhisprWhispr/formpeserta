const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc, setDoc } = require('firebase/firestore');
const path = require('path');

// Initialize Express
const app = express();
const port = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());

const router = express.Router();

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
    appId: "1:192205202622:web:eae40bc97fcfa2801aaaef",
    measurementId: "G-L5MG9WPGGE"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Configure Multer (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: folder },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

// API Endpoint for Registration
router.post('/register', upload.fields([
    { name: 'bukti_hmps_if', maxCount: 1 },
    { name: 'bukti_upu', maxCount: 1 },
    { name: 'pas_foto', maxCount: 1 },
    { name: 'bukti_pembayaran', maxCount: 1 },
    { name: 'foto_ktm', maxCount: 1 }
]), async (req, res) => {
    try {
        const formData = req.body; // All text data
        const files = req.files || {};

        // Upload files to Cloudinary in parallel
        const uploadTasks = [
            files['bukti_hmps_if'] ? uploadToCloudinary(files['bukti_hmps_if'][0].buffer, 'pendaftaran/bukti_hmps_if') : Promise.resolve(null),
            files['bukti_upu'] ? uploadToCloudinary(files['bukti_upu'][0].buffer, 'pendaftaran/bukti_upu') : Promise.resolve(null),
            files['pas_foto'] ? uploadToCloudinary(files['pas_foto'][0].buffer, 'pendaftaran/pas_foto') : Promise.resolve(null),
            files['bukti_pembayaran'] ? uploadToCloudinary(files['bukti_pembayaran'][0].buffer, 'pendaftaran/bukti_pembayaran') : Promise.resolve(null),
            files['foto_ktm'] ? uploadToCloudinary(files['foto_ktm'][0].buffer, 'pendaftaran/foto_ktm') : Promise.resolve(null)
        ];

        const [
            bukti_hmps_if_res,
            bukti_upu_res,
            pas_foto_res,
            bukti_pembayaran_res,
            foto_ktm_res
        ] = await Promise.all(uploadTasks);

        const bukti_hmps_if_url = bukti_hmps_if_res ? bukti_hmps_if_res.secure_url : '';
        const bukti_upu_url = bukti_upu_res ? bukti_upu_res.secure_url : '';
        const pas_foto_url = pas_foto_res ? pas_foto_res.secure_url : '';
        const bukti_pembayaran_url = bukti_pembayaran_res ? bukti_pembayaran_res.secure_url : '';
        const foto_ktm_url = foto_ktm_res ? foto_ktm_res.secure_url : '';

        // Save data to Firebase Firestore
        const docRef = await addDoc(collection(db, "pendaftar"), {
            ...formData,
            bukti_hmps_if_url,
            bukti_upu_url,
            pas_foto_url,
            bukti_pembayaran_url,
            foto_ktm_url,
            createdAt: new Date().toISOString()
        });

        res.status(200).json({ success: true, message: 'Pendaftaran berhasil', id: docRef.id });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server', error: error.message });
    }
});

// API Endpoint for Panitia Registration
router.post('/register-panitia', upload.fields([
    { name: 'bukti_hmps_if', maxCount: 1 },
    { name: 'bukti_upu', maxCount: 1 },
    { name: 'pas_foto', maxCount: 1 },
    { name: 'bukti_pembayaran', maxCount: 1 },
    { name: 'foto_ktm', maxCount: 1 }
]), async (req, res) => {
    try {
        const formData = req.body;
        const files = req.files || {};

        // Upload files to Cloudinary in parallel
        const uploadTasks = [
            files['bukti_hmps_if'] ? uploadToCloudinary(files['bukti_hmps_if'][0].buffer, 'pendaftaran_panitia/bukti_hmps_if') : Promise.resolve(null),
            files['bukti_upu'] ? uploadToCloudinary(files['bukti_upu'][0].buffer, 'pendaftaran_panitia/bukti_upu') : Promise.resolve(null),
            files['pas_foto'] ? uploadToCloudinary(files['pas_foto'][0].buffer, 'pendaftaran_panitia/pas_foto') : Promise.resolve(null),
            files['bukti_pembayaran'] ? uploadToCloudinary(files['bukti_pembayaran'][0].buffer, 'pendaftaran_panitia/bukti_pembayaran') : Promise.resolve(null),
            files['foto_ktm'] ? uploadToCloudinary(files['foto_ktm'][0].buffer, 'pendaftaran_panitia/foto_ktm') : Promise.resolve(null)
        ];

        const [
            bukti_hmps_if_res,
            bukti_upu_res,
            pas_foto_res,
            bukti_pembayaran_res,
            foto_ktm_res
        ] = await Promise.all(uploadTasks);

        const bukti_hmps_if_url = bukti_hmps_if_res ? bukti_hmps_if_res.secure_url : '';
        const bukti_upu_url = bukti_upu_res ? bukti_upu_res.secure_url : '';
        const pas_foto_url = pas_foto_res ? pas_foto_res.secure_url : '';
        const bukti_pembayaran_url = bukti_pembayaran_res ? bukti_pembayaran_res.secure_url : '';
        const foto_ktm_url = foto_ktm_res ? foto_ktm_res.secure_url : '';

        // Save data to Firebase Firestore 'panitia' collection
        const docRef = await addDoc(collection(db, "panitia"), {
            ...formData,
            bukti_hmps_if_url,
            bukti_upu_url,
            pas_foto_url,
            bukti_pembayaran_url,
            foto_ktm_url,
            createdAt: new Date().toISOString()
        });

        res.status(200).json({ success: true, message: 'Pendaftaran panitia berhasil', id: docRef.id });

    } catch (error) {
        console.error('Error during panitia registration:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server', error: error.message });
    }
});

// API Endpoint for Surat Izin
router.post('/register-izin', upload.fields([
    { name: 'foto_ktm', maxCount: 1 },
    { name: 'foto_ktp_mahasiswa', maxCount: 1 },
    { name: 'foto_ktp_ortu', maxCount: 1 },
    { name: 'foto_kk', maxCount: 1 }
]), async (req, res) => {
    try {
        const formData = req.body;
        const files = req.files || {};

        // Upload files to Cloudinary in parallel
        const uploadTasks = [
            files['foto_ktm'] ? uploadToCloudinary(files['foto_ktm'][0].buffer, 'surat_izin/foto_ktm') : Promise.resolve(null),
            files['foto_ktp_mahasiswa'] ? uploadToCloudinary(files['foto_ktp_mahasiswa'][0].buffer, 'surat_izin/foto_ktp_mahasiswa') : Promise.resolve(null),
            files['foto_ktp_ortu'] ? uploadToCloudinary(files['foto_ktp_ortu'][0].buffer, 'surat_izin/foto_ktp_ortu') : Promise.resolve(null),
            files['foto_kk'] ? uploadToCloudinary(files['foto_kk'][0].buffer, 'surat_izin/foto_kk') : Promise.resolve(null)
        ];

        const [
            foto_ktm_res,
            foto_ktp_mahasiswa_res,
            foto_ktp_ortu_res,
            foto_kk_res
        ] = await Promise.all(uploadTasks);

        const foto_ktm_url = foto_ktm_res ? foto_ktm_res.secure_url : '';
        const foto_ktp_mahasiswa_url = foto_ktp_mahasiswa_res ? foto_ktp_mahasiswa_res.secure_url : '';
        const foto_ktp_ortu_url = foto_ktp_ortu_res ? foto_ktp_ortu_res.secure_url : '';
        const foto_kk_url = foto_kk_res ? foto_kk_res.secure_url : '';

        // Save data to Firebase Firestore 'surat_izin' collection
        const docRef = await addDoc(collection(db, "surat_izin"), {
            ...formData,
            foto_ktm_url,
            foto_ktp_mahasiswa_url,
            foto_ktp_ortu_url,
            foto_kk_url,
            createdAt: new Date().toISOString()
        });

        res.status(200).json({ success: true, message: 'Pengajuan surat izin berhasil', id: docRef.id });

    } catch (error) {
        console.error('Error during surat izin registration:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server', error: error.message });
    }
});

// API Endpoint untuk cek jumlah pendaftar (batas kuota)
router.get('/count/peserta', async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "pendaftar"));
        res.status(200).json({ success: true, count: querySnapshot.size });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/count/panitia', async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "panitia"));
        res.status(200).json({ success: true, count: querySnapshot.size });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API Endpoints for Admin Panel
router.get('/admin/peserta', async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "pendaftar"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/admin/panitia', async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "panitia"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/admin/surat-izin', async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "surat_izin"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API Endpoint DELETE data
const collectionMap = {
    'peserta': 'pendaftar',
    'panitia': 'panitia',
    'surat-izin': 'surat_izin'
};

router.delete('/admin/:category/:id', async (req, res) => {
    try {
        const { category, id } = req.params;
        const colName = collectionMap[category];
        if (!colName) {
            return res.status(400).json({ success: false, message: 'Kategori tidak valid' });
        }
        await deleteDoc(doc(db, colName, id));
        res.status(200).json({ success: true, message: 'Data berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Settings endpoints
router.get('/settings', async (req, res) => {
    try {
        const snap = await getDoc(doc(db, 'settings', 'pendaftaran'));
        const data = snap.exists() ? snap.data() : {};
        res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.post('/settings', async (req, res) => {
    try {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch (e) { body = {}; }
        }
        body = body || {};

        const updateData = {};
        if (body.deadline_peserta !== undefined) updateData.deadline_peserta = body.deadline_peserta;
        if (body.deadline_panitia !== undefined) updateData.deadline_panitia = body.deadline_panitia;
        if (body.hide_kuota_peserta !== undefined) updateData.hide_kuota_peserta = Boolean(body.hide_kuota_peserta);
        if (body.hide_kuota_panitia !== undefined) updateData.hide_kuota_panitia = Boolean(body.hide_kuota_panitia);
        if (body.kuota_peserta !== undefined) updateData.kuota_peserta = Number(body.kuota_peserta) || 25;
        if (body.kuota_panitia !== undefined) updateData.kuota_panitia = Number(body.kuota_panitia) || 20;

        await setDoc(doc(db, 'settings', 'pendaftaran'), updateData, { merge: true });
        res.json({ success: true, message: 'Pengaturan disimpan' });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// Mount the router for Netlify Functions and local testing
app.use('/.netlify/functions/api', router);
app.use('/api', router);

// Export handler for Netlify Functions
module.exports.handler = serverless(app);
// Export app for local dev server
module.exports.app = app;
