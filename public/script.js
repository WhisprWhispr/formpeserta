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
            alert('Pendaftaran berhasil! Terima kasih telah mendaftar.');
            form.reset(); // Reset form
        } else {
            alert('Terjadi kesalahan: ' + (result.message || 'Gagal mendaftar.'));
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Terjadi kesalahan koneksi atau server. Silakan coba lagi.');
    } finally {
        // Re-enable button and hide loading
        submitBtn.disabled = false;
        loadingOverlay.classList.add('hidden');
    }
});
