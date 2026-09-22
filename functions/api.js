const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');
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
    { name: 'bukti_pembayaran', maxCount: 1 }
]), async (req, res) => {
    try {
        const formData = req.body; // All text data

        // Upload files to Cloudinary
        let bukti_hmps_if_url = '';
        let bukti_upu_url = '';
        let pas_foto_url = '';
        let bukti_pembayaran_url = '';

        if (req.files['bukti_hmps_if']) {
            const result = await uploadToCloudinary(req.files['bukti_hmps_if'][0].buffer, 'pendaftaran/bukti_hmps_if');
            bukti_hmps_if_url = result.secure_url;
        }
        if (req.files['bukti_upu']) {
            const result = await uploadToCloudinary(req.files['bukti_upu'][0].buffer, 'pendaftaran/bukti_upu');
            bukti_upu_url = result.secure_url;
        }
        if (req.files['pas_foto']) {
            const result = await uploadToCloudinary(req.files['pas_foto'][0].buffer, 'pendaftaran/pas_foto');
            pas_foto_url = result.secure_url;
        }
        if (req.files['bukti_pembayaran']) {
            const result = await uploadToCloudinary(req.files['bukti_pembayaran'][0].buffer, 'pendaftaran/bukti_pembayaran');
            bukti_pembayaran_url = result.secure_url;
        }

        // Save data to Firebase Firestore
        const docRef = await addDoc(collection(db, "pendaftar"), {
            ...formData,
            bukti_hmps_if_url,
            bukti_upu_url,
            pas_foto_url,
            bukti_pembayaran_url,
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
    { name: 'bukti_pembayaran', maxCount: 1 }
]), async (req, res) => {
    try {
        const formData = req.body;

        // Upload files to Cloudinary
        let bukti_hmps_if_url = '';
        let bukti_upu_url = '';
        let pas_foto_url = '';
        let bukti_pembayaran_url = '';

        if (req.files['bukti_hmps_if']) {
            const result = await uploadToCloudinary(req.files['bukti_hmps_if'][0].buffer, 'pendaftaran_panitia/bukti_hmps_if');
            bukti_hmps_if_url = result.secure_url;
        }
        if (req.files['bukti_upu']) {
            const result = await uploadToCloudinary(req.files['bukti_upu'][0].buffer, 'pendaftaran_panitia/bukti_upu');
            bukti_upu_url = result.secure_url;
        }
        if (req.files['pas_foto']) {
            const result = await uploadToCloudinary(req.files['pas_foto'][0].buffer, 'pendaftaran_panitia/pas_foto');
            pas_foto_url = result.secure_url;
        }
        if (req.files['bukti_pembayaran']) {
            const result = await uploadToCloudinary(req.files['bukti_pembayaran'][0].buffer, 'pendaftaran_panitia/bukti_pembayaran');
            bukti_pembayaran_url = result.secure_url;
        }

        // Save data to Firebase Firestore 'panitia' collection
        const docRef = await addDoc(collection(db, "panitia"), {
            ...formData,
            bukti_hmps_if_url,
            bukti_upu_url,
            pas_foto_url,
            bukti_pembayaran_url,
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

        // Upload files to Cloudinary
        let foto_ktm_url = '';
        let foto_ktp_mahasiswa_url = '';
        let foto_ktp_ortu_url = '';
        let foto_kk_url = '';

        if (req.files['foto_ktm']) {
            const result = await uploadToCloudinary(req.files['foto_ktm'][0].buffer, 'surat_izin/foto_ktm');
            foto_ktm_url = result.secure_url;
        }
        if (req.files['foto_ktp_mahasiswa']) {
            const result = await uploadToCloudinary(req.files['foto_ktp_mahasiswa'][0].buffer, 'surat_izin/foto_ktp_mahasiswa');
            foto_ktp_mahasiswa_url = result.secure_url;
        }
        if (req.files['foto_ktp_ortu']) {
            const result = await uploadToCloudinary(req.files['foto_ktp_ortu'][0].buffer, 'surat_izin/foto_ktp_ortu');
            foto_ktp_ortu_url = result.secure_url;
        }
        if (req.files['foto_kk']) {
            const result = await uploadToCloudinary(req.files['foto_kk'][0].buffer, 'surat_izin/foto_kk');
            foto_kk_url = result.secure_url;
        }

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

// Mount the router for Netlify Functions and local testing
app.use('/.netlify/functions/api', router);
app.use('/api', router);

// Export handler for Netlify Functions
module.exports.handler = serverless(app);
