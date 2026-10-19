document.getElementById('izinForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = loadingOverlay ? loadingOverlay.querySelector('p') : null;

    // Disable button and show loading
    submitBtn.disabled = true;
    if (loadingText) loadingText.textContent = 'Memproses & mengompres foto...';
    loadingOverlay.classList.remove('hidden');

    try {
        // Create FormData object
        const formData = new FormData(form);

        // Kompres setiap file gambar sebelum dikirim
        const compressFn = window.compressImageFile || function(file) { return Promise.resolve(file); };
        const fileInputs = form.querySelectorAll('input[type="file"]');
        for (const input of fileInputs) {
            if (input.files && input.files[0]) {
                const originalFile = input.files[0];
                if (originalFile.type && originalFile.type.startsWith('image/')) {
                    if (loadingText) loadingText.textContent = 'Mengompres foto (' + (input.name || 'file') + ')...';
                    const compressed = await compressFn(originalFile, 1280, 1280, 0.75);
                    formData.set(input.name, compressed, compressed.name || (input.name + '.jpg'));
                }
            }
        }

        if (loadingText) loadingText.textContent = 'Mengunggah pengajuan surat izin...';

        const response = await fetch('/api/register-izin', {
            method: 'POST',
            body: formData
        });

        let result = null;
        const responseText = await response.text();
        try {
            result = JSON.parse(responseText);
        } catch (jsonErr) {
            result = null;
        }

        if (response.ok && result && result.success) {
            showToast('Pengajuan Surat Izin berhasil! Terima kasih.', 'success');
            form.reset(); // Reset form
        } else {
            let errorMsg = 'Gagal mengirim pengajuan.';
            if (result && result.message) {
                errorMsg = result.message;
            } else if (response.status === 413) {
                errorMsg = 'Ukuran file foto terlalu besar (melebihi batas server). Silakan gunakan foto yang lebih kecil.';
            } else if (response.status === 504 || response.status === 502) {
                errorMsg = 'Server sedang sibuk atau timeout. Silakan coba kirim ulang.';
            } else if (!response.ok) {
                errorMsg = 'Server merespons error (' + response.status + ').';
            }
            showToast('Terjadi kesalahan: ' + errorMsg, 'error');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showToast('Terjadi kesalahan koneksi atau server: ' + (error.message || 'Silakan coba lagi.'), 'error');
    } finally {
        // Re-enable button and hide loading
        submitBtn.disabled = false;
        if (loadingText) loadingText.textContent = 'Mengirim data...';
        loadingOverlay.classList.add('hidden');
    }
});

