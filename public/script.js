// =============================================
// CEK BATAS PENDAFTARAN DARI FIREBASE SETTINGS
// =============================================
(function() {
    var formatTanggal = function(isoStr) {
        var d = new Date(isoStr);
        var opsi = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' };
        return d.toLocaleDateString('id-ID', opsi) + ' WIB';
    };

    var tutupForm = function(pesanJudul, pesanDetail) {
        var banner = document.getElementById('form-closed-banner');
        if (banner) {
            banner.style.display = 'block';
            var judulEl = banner.querySelector('p:first-child');
            var detailEl = banner.querySelector('p:last-child');
            if (judulEl) judulEl.innerHTML = pesanJudul;
            if (detailEl) detailEl.innerHTML = pesanDetail;
        }
        var submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
            submitBtn.textContent = 'Pendaftaran Ditutup';
        }
        var inputs = document.querySelectorAll('#registrationForm input, #registrationForm textarea, #registrationForm select');
        inputs.forEach(function(el) { el.disabled = true; });
    };

    // Cek kuota dan deadline dari settings
    Promise.all([
        fetch('/api/settings').then(function(r) { return r.json(); }).catch(function() { return {}; }),
        fetch('/api/count/peserta').then(function(r) { return r.json(); }).catch(function() { return {}; })
    ]).then(function(results) {
        var settingsRes = results[0];
        var countRes = results[1];
        var settings = (settingsRes && settingsRes.success && settingsRes.data) ? settingsRes.data : {};
        var bannerEl = document.getElementById('slot-info-banner');
        var slotEl = document.getElementById('slot-tersisa');
        var isHidden = Boolean(settings.hide_kuota_peserta);
        var maks = settings.kuota_peserta ? parseInt(settings.kuota_peserta) : 25;

        // Update batasan kuota di tampilan jika banner aktif
        var slotTotalStrong = document.querySelector('#slot-info-banner .slot-total strong');
        if (slotTotalStrong) {
            slotTotalStrong.textContent = maks;
        }

        // Jika fitur hidden ON, sembunyikan banner kuota & batasan peserta
        if (isHidden) {
            if (bannerEl) {
                bannerEl.classList.add('slot-banner-hidden');
                bannerEl.style.setProperty('display', 'none', 'important');
            }
        } else {
            if (bannerEl) {
                bannerEl.classList.remove('slot-banner-hidden');
                bannerEl.style.display = 'flex';
            }
        }

        // Cek kuota terisi
        if (countRes && countRes.success) {
            var terisi = countRes.count || 0;
            var sisa = maks - terisi;
            if (sisa < 0) sisa = 0;

            if (slotEl) slotEl.textContent = sisa + ' slot';

            // Ubah warna banner jika slot hampir habis atau habis (hanya bila banner tidak di-hide)
            if (!isHidden && bannerEl) {
                if (sisa === 0) {
                    bannerEl.style.background = 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)';
                    bannerEl.style.borderLeftColor = '#ef4444';
                    if (slotEl) slotEl.style.color = '#f87171';
                } else if (sisa <= 5) {
                    bannerEl.style.background = 'linear-gradient(135deg, #431407 0%, #7c2d12 100%)';
                    bannerEl.style.borderLeftColor = '#f97316';
                    if (slotEl) slotEl.style.color = '#fb923c';
                }
            }

            // Jika fitur hidden ON, BATASAN KUOTA TIDAK BERLAKU (Pendaftaran tanpa batas/unlimited)
            // Kuota hanya dicek dan menutup formulir jika fitur hidden OFF
            if (!isHidden && terisi >= maks) {
                tutupForm(
                    '&#128680; Kuota Pendaftaran Penuh',
                    'Kuota peserta sebanyak <strong>' + maks + ' orang</strong> telah terpenuhi. Pendaftaran ditutup.'
                );
            }
        }

        // Cek deadline dari settings
        if (settings.deadline_peserta) {
            var deadline = new Date(settings.deadline_peserta);
            var spanBatas = document.getElementById('batas-pembayaran');
            if (spanBatas) spanBatas.textContent = formatTanggal(settings.deadline_peserta);

            // Jika sudah lewat deadline, tutup form
            if (new Date() > deadline) {
                tutupForm(
                    '&#128680; Pendaftaran Telah Ditutup',
                    'Batas waktu pendaftaran telah berakhir. Form tidak dapat diisi lagi.'
                );
            }
        } else {
            var spanBatas = document.getElementById('batas-pembayaran');
            if (spanBatas) spanBatas.textContent = '20 September 2026, pukul 23.59 WIB';
        }
    }).catch(function(err) {
        console.error('Error loading settings or count:', err);
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
        const response = await fetch('/api/register', {
            method: 'POST',
            body: formData // FormData will automatically set the Content-Type to multipart/form-data
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Redirect ke halaman sukses dengan link grup WA
            window.location.href = '/success.html';
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
