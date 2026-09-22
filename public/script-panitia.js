// =============================================
// CEK BATAS PENDAFTARAN PANITIA DARI SETTINGS
// =============================================
(function() {
    var formatTanggal = function(isoStr) {
        var d = new Date(isoStr);
        var opsi = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' };
        return d.toLocaleDateString('id-ID', opsi) + ' WIB';
    };

    fetch('/api/settings')
        .then(function(r) { return r.json(); })
        .then(function(result) {
            if (result.success && result.data && result.data.deadline_panitia) {
                var deadline = new Date(result.data.deadline_panitia);
                var spanBatas = document.getElementById('batas-pembayaran');
                if (spanBatas) spanBatas.textContent = formatTanggal(result.data.deadline_panitia);

                if (new Date() > deadline) {
                    var banner = document.getElementById('form-closed-banner');
                    if (banner) banner.style.display = 'block';
                    var submitBtn = document.getElementById('submitBtn');
                    if (submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.style.opacity = '0.5';
                        submitBtn.style.cursor = 'not-allowed';
                        submitBtn.textContent = 'Pendaftaran Ditutup';
                    }
                    var inputs = document.querySelectorAll('#registrationForm input, #registrationForm textarea, #registrationForm select');
                    inputs.forEach(function(el) { el.disabled = true; });
                }
            } else {
                var spanBatas = document.getElementById('batas-pembayaran');
                if (spanBatas) spanBatas.textContent = '20 September 2026, pukul 23.59 WIB';
            }
        })
        .catch(function() {
            var spanBatas = document.getElementById('batas-pembayaran');
            if (spanBatas) spanBatas.textContent = '20 September 2026, pukul 23.59 WIB';
        });
}());

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
        const response = await fetch('/api/register-panitia', {
            method: 'POST',
            body: formData // FormData will automatically set the Content-Type to multipart/form-data
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showToast('Pendaftaran berhasil! Terima kasih telah mendaftar.', 'success');
            form.reset(); // Reset form
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
