document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Create FormData object
    const formData = new FormData(form);

    // Disable button and show loading
    submitBtn.disabled = true;
    loadingOverlay.classList.remove('hidden');

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            body: formData // FormData will automatically set the Content-Type to multipart/form-data
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showToast('Pendaftaran berhasil!', 'success');
            
            const formContainer = document.querySelector('.form-container');
            formContainer.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; font-family: 'Inter', sans-serif;">
                    <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
                    <h2 style="color: #1f2937; margin-bottom: 16px; font-size: 24px; font-weight: 600;">Pendaftaran Berhasil!</h2>
                    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px; font-size: 15px;">
                        Terima kasih telah mendaftar pada kegiatan <strong>Malam Keakraban Prodi Informatika</strong>. Data pendaftaran beserta bukti pembayaran Anda telah berhasil kami terima.
                        <br><br>
                        Guna memudahkan koordinasi terkait jadwal, persiapan, dan informasi penting lainnya, <strong>seluruh peserta diwajibkan</strong> untuk bergabung ke dalam Grup WhatsApp resmi melalui tautan di bawah ini:
                    </p>
                    <a href="https://chat.whatsapp.com/FkBB20oRjVT2FINHi0DJjs" target="_blank" style="display: inline-block; background-color: #25D366; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; transition: background 0.3s; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);">
                        💬 Bergabung ke Grup WhatsApp
                    </a>
                </div>
            `;

        } else {
            showToast('Terjadi kesalahan: ' + (result.message || 'Gagal mendaftar.'), 'error');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showToast('Terjadi kesalahan koneksi atau server. Silakan coba lagi.', 'error');
    } finally {
        // Re-enable button and hide loading
        submitBtn.disabled = false;
        loadingOverlay.classList.add('hidden');
    }
});
