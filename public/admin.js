window.initDashboard = () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const pageTitle = document.getElementById('page-title');
    const loading = document.getElementById('loading');
    const errorMsg = document.getElementById('error');
    const tableContainer = document.getElementById('table-container');
    const tableHead = document.getElementById('table-head');
    const tableBody = document.getElementById('table-body');

    let currentCategory = 'peserta';

    // Columns config for each category to ensure order and readability
    const columnsConfig = {
        'peserta': [
            { key: 'createdAt', label: 'Waktu Daftar' },
            { key: 'nama_lengkap', label: 'Nama Lengkap' },
            { key: 'nim', label: 'NIM' },
            { key: 'email', label: 'Email' },
            { key: 'jenis_kelamin', label: 'L/P' },
            { key: 'prodi', label: 'Prodi' },
            { key: 'fakultas', label: 'Fakultas' },
            { key: 'universitas', label: 'Universitas' },
            { key: 'tahun_masuk', label: 'Tahun Masuk' },
            { key: 'kelas', label: 'Kelas' },
            { key: 'semester', label: 'Semester' },
            { key: 'no_telepon', label: 'No WA' },
            { key: 'status_aktivitas', label: 'Status' },
            { key: 'alasan', label: 'Alasan' },
            { key: 'riwayat_penyakit', label: 'Penyakit' },
            { key: 'jenis_penyakit', label: 'Detail Penyakit' },
            { key: 'riwayat_alergi', label: 'Alergi' },
            { key: 'jenis_alergi', label: 'Detail Alergi' },
            { key: 'jenis_alergi_lain', label: 'Alergi Lainnya' },
            { key: 'riwayat_kesurupan', label: 'Kesurupan' },
            { key: 'nama_bank', label: 'Bank' },
            { key: 'no_rekening', label: 'No Rekening' },
            { key: 'izin_ortu', label: 'Izin Ortu' },
            { key: 'komitmen', label: 'Pernyataan Komitmen' },
            { key: 'foto_ktm_url', label: 'Foto KTM', isImg: true },
            { key: 'pas_foto_url', label: 'Pas Foto', isImg: true },
            { key: 'bukti_pembayaran_url', label: 'Pembayaran', isImg: true },
            { key: 'bukti_hmps_if_url', label: 'Bukti HMPS', isImg: true },
            { key: 'bukti_upu_url', label: 'Bukti UPU', isImg: true }
        ],
        'panitia': [
            { key: 'createdAt', label: 'Waktu Daftar' },
            { key: 'nama_lengkap', label: 'Nama Lengkap' },
            { key: 'nim', label: 'NIM' },
            { key: 'email', label: 'Email' },
            { key: 'jenis_kelamin', label: 'L/P' },
            { key: 'prodi', label: 'Prodi' },
            { key: 'fakultas', label: 'Fakultas' },
            { key: 'universitas', label: 'Universitas' },
            { key: 'tahun_masuk', label: 'Tahun Masuk' },
            { key: 'kelas', label: 'Kelas' },
            { key: 'semester', label: 'Semester' },
            { key: 'no_telepon', label: 'No WA' },
            { key: 'status_aktivitas', label: 'Status' },
            { key: 'alasan', label: 'Alasan' },
            { key: 'riwayat_penyakit', label: 'Penyakit' },
            { key: 'jenis_penyakit', label: 'Detail Penyakit' },
            { key: 'riwayat_alergi', label: 'Alergi' },
            { key: 'jenis_alergi', label: 'Detail Alergi' },
            { key: 'jenis_alergi_lain', label: 'Alergi Lainnya' },
            { key: 'riwayat_kesurupan', label: 'Kesurupan' },
            { key: 'nama_bank', label: 'Bank' },
            { key: 'no_rekening', label: 'No Rekening' },
            { key: 'izin_ortu', label: 'Izin Ortu' },
            { key: 'komitmen', label: 'Pernyataan Komitmen' },
            { key: 'foto_ktm_url', label: 'Foto KTM', isImg: true },
            { key: 'pas_foto_url', label: 'Pas Foto', isImg: true },
            { key: 'bukti_pembayaran_url', label: 'Pembayaran', isImg: true }
        ],
        'surat-izin': [
            { key: 'createdAt', label: 'Waktu Pengajuan' },
            { key: 'nama_lengkap', label: 'Nama Lengkap' },
            { key: 'nim', label: 'NIM' },
            { key: 'kelas', label: 'Kelas' },
            { key: 'tujuan_surat', label: 'Tujuan' },
            { key: 'detail_ortu', label: 'Detail Ortu' },
            { key: 'detail_dosen', label: 'Detail Dosen' },
            { key: 'detail_perusahaan', label: 'Detail Perusahaan' },
            { key: 'kontak_ortu', label: 'Kontak Ortu' },
            { key: 'foto_ktm_url', label: 'Foto KTM', isImg: true },
            { key: 'foto_ktp_mahasiswa_url', label: 'KTP Mhs', isImg: true },
            { key: 'foto_ktp_ortu_url', label: 'KTP Ortu', isImg: true },
            { key: 'foto_kk_url', label: 'Foto KK', isImg: true }
        ]
    };

    const fetchAndRender = async (category) => {
        loading.classList.remove('hidden');
        errorMsg.classList.add('hidden');
        tableContainer.classList.add('hidden');
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        try {
            const response = await fetch('/api/admin/' + category);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || result.message || 'Gagal mengambil data');
            }

            const data = result.data;
            if (data.length === 0) {
                errorMsg.textContent = 'Belum ada data untuk kategori ini.';
                errorMsg.classList.remove('hidden');
                loading.classList.add('hidden');
                return;
            }

            renderTable(category, data);
            loading.classList.add('hidden');
            tableContainer.classList.remove('hidden');
        } catch (err) {
            console.error(err);
            errorMsg.textContent = err.message;
            errorMsg.classList.remove('hidden');
            loading.classList.add('hidden');
        }
    };

    const deleteData = async (category, docId, rowEl) => {
        const confirmed = window.confirm('Yakin ingin menghapus data ini? Tindakan tidak dapat dibatalkan.');
        if (!confirmed) return;

        try {
            const response = await fetch('/api/admin/' + category + '/' + docId, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Gagal menghapus data');
            }

            // Remove the row from UI with animation
            rowEl.style.transition = 'opacity 0.3s, background 0.3s';
            rowEl.style.background = '#fee2e2';
            rowEl.style.opacity = '0';
            setTimeout(() => rowEl.remove(), 300);

            if (typeof window.showToast === 'function') {
                window.showToast('Data berhasil dihapus.', 'success');
            }
        } catch (err) {
            console.error(err);
            if (typeof window.showToast === 'function') {
                window.showToast('Gagal menghapus: ' + err.message, 'error');
            } else {
                alert('Gagal menghapus: ' + err.message);
            }
        }
    };

    const renderTable = (category, data) => {
        const columns = columnsConfig[category] || [];

        // Build Headers - add Aksi column at front
        let headerRow = '<tr><th>Aksi</th>';
        columns.forEach(col => {
            headerRow += '<th>' + col.label + '</th>';
        });
        headerRow += '</tr>';
        tableHead.innerHTML = headerRow;

        // Build Rows
        let rowsHtml = '';
        data.forEach(item => {
            const docId = item.id;
            let row = '<tr data-id="' + docId + '"><td><button class="btn-hapus" data-id="' + docId + '">🗑️ Hapus</button></td>';
            columns.forEach(col => {
                let cellValue = item[col.key] || '-';

                if (col.key === 'createdAt' && item[col.key]) {
                    cellValue = new Date(item[col.key]).toLocaleString('id-ID');
                }

                if (col.isImg && cellValue !== '-') {
                    row += '<td><a href="' + cellValue + '" target="_blank" class="img-link">Lihat Gambar</a></td>';
                } else {
                    const text = String(cellValue);
                    const displayText = text.length > 50 ? text.substring(0, 50) + '...' : text;
                    row += '<td title="' + text + '">' + displayText + '</td>';
                }
            });
            row += '</tr>';
            rowsHtml += row;
        });
        tableBody.innerHTML = rowsHtml;

        // Attach delete event listeners
        tableBody.querySelectorAll('.btn-hapus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const docId = btn.getAttribute('data-id');
                const rowEl = btn.closest('tr');
                deleteData(currentCategory, docId, rowEl);
            });
        });
    };

    // ========================
    // SETTINGS PANEL
    // ========================
    const panelData = document.getElementById('panel-data');
    const panelSettings = document.getElementById('panel-pengaturan');
    const deadlinePeserta = document.getElementById('deadline-peserta');
    const deadlinePanitia = document.getElementById('deadline-panitia');
    const statusPeserta = document.getElementById('status-peserta');
    const statusPanitia = document.getElementById('status-panitia');
    const hideKuotaPeserta = document.getElementById('hide-kuota-peserta');
    const statusKuotaPeserta = document.getElementById('status-kuota-peserta');
    const kuotaPeserta = document.getElementById('kuota-peserta');
    const hideKuotaPanitia = document.getElementById('hide-kuota-panitia');
    const statusKuotaPanitia = document.getElementById('status-kuota-panitia');
    const kuotaPanitia = document.getElementById('kuota-panitia');
    const btnSave = document.getElementById('btn-save-settings');

    const updateKuotaPesertaStatus = (isHidden) => {
        if (!statusKuotaPeserta) return;
        if (isHidden) {
            statusKuotaPeserta.textContent = '🔒 Status: Jumlah Disembunyikan & Pendaftaran Tanpa Batas (UNLIMITED)';
            statusKuotaPeserta.className = 'settings-status hidden-mode';
        } else {
            statusKuotaPeserta.textContent = '🌐 Status: Jumlah Ditampilkan & Kuota Dibatasi (PUBLIC)';
            statusKuotaPeserta.className = 'settings-status visible-mode';
        }
    };

    const updateKuotaPanitiaStatus = (isHidden) => {
        if (!statusKuotaPanitia) return;
        if (isHidden) {
            statusKuotaPanitia.textContent = '🔒 Status: Jumlah Disembunyikan & Pendaftaran Tanpa Batas (UNLIMITED)';
            statusKuotaPanitia.className = 'settings-status hidden-mode';
        } else {
            statusKuotaPanitia.textContent = '🌐 Status: Jumlah Ditampilkan & Kuota Dibatasi (PUBLIC)';
            statusKuotaPanitia.className = 'settings-status visible-mode';
        }
    };

    const autoSaveToggle = async (field, value, label) => {
        try {
            localStorage.setItem(field, value ? 'true' : 'false');
            if (typeof window.showToast === 'function') {
                window.showToast('Menyimpan perubahan...', 'info');
            }
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: Boolean(value) })
            });
            const result = await res.json();
            if (result.success) {
                if (typeof window.showToast === 'function') {
                    window.showToast(label + (value ? ' diaktifkan (ON)' : ' dimatikan (OFF)'), 'success');
                }
            } else {
                throw new Error(result.error || result.message || 'Gagal menyimpan');
            }
        } catch (err) {
            console.error('Auto-save error:', err);
            if (typeof window.showToast === 'function') {
                window.showToast('Gagal auto-save: ' + err.message, 'error');
            }
        }
    };

    if (hideKuotaPeserta) {
        hideKuotaPeserta.addEventListener('change', (e) => {
            updateKuotaPesertaStatus(e.target.checked);
            autoSaveToggle('hide_kuota_peserta', e.target.checked, 'Sembunyikan kuota peserta');
        });
    }

    if (hideKuotaPanitia) {
        hideKuotaPanitia.addEventListener('change', (e) => {
            updateKuotaPanitiaStatus(e.target.checked);
            autoSaveToggle('hide_kuota_panitia', e.target.checked, 'Sembunyikan kuota panitia');
        });
    }

    const loadSettings = async () => {
        // Fast UI response from localStorage cache
        const cachedHidePeserta = localStorage.getItem('hide_kuota_peserta');
        if (cachedHidePeserta !== null && hideKuotaPeserta) {
            hideKuotaPeserta.checked = cachedHidePeserta === 'true';
            updateKuotaPesertaStatus(hideKuotaPeserta.checked);
        }
        const cachedHidePanitia = localStorage.getItem('hide_kuota_panitia');
        if (cachedHidePanitia !== null && hideKuotaPanitia) {
            hideKuotaPanitia.checked = cachedHidePanitia === 'true';
            updateKuotaPanitiaStatus(hideKuotaPanitia.checked);
        }

        try {
            const res = await fetch('/api/settings');
            const result = await res.json();
            if (result.success && result.data) {
                const { deadline_peserta, deadline_panitia, hide_kuota_peserta, hide_kuota_panitia, kuota_peserta, kuota_panitia } = result.data;
                const toLocalDatetime = (isoStr) => {
                    const d = new Date(isoStr);
                    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                    return d.toISOString().slice(0,16);
                };
                if (deadline_peserta && deadlinePeserta) {
                    deadlinePeserta.value = toLocalDatetime(deadline_peserta);
                    const isClosed = new Date() > new Date(deadline_peserta);
                    statusPeserta.textContent = isClosed ? 'Status: DITUTUP' : 'Status: TERBUKA';
                    statusPeserta.className = 'settings-status ' + (isClosed ? 'closed' : 'open');
                }
                if (deadline_panitia && deadlinePanitia) {
                    deadlinePanitia.value = toLocalDatetime(deadline_panitia);
                    const isClosed = new Date() > new Date(deadline_panitia);
                    statusPanitia.textContent = isClosed ? 'Status: DITUTUP' : 'Status: TERBUKA';
                    statusPanitia.className = 'settings-status ' + (isClosed ? 'closed' : 'open');
                }
                if (hideKuotaPeserta) {
                    const isHidden = Boolean(hide_kuota_peserta);
                    hideKuotaPeserta.checked = isHidden;
                    localStorage.setItem('hide_kuota_peserta', isHidden ? 'true' : 'false');
                    updateKuotaPesertaStatus(isHidden);
                }
                if (kuotaPeserta) {
                    kuotaPeserta.value = kuota_peserta !== undefined ? kuota_peserta : 25;
                }
                if (hideKuotaPanitia) {
                    const isHiddenPanitia = Boolean(hide_kuota_panitia);
                    hideKuotaPanitia.checked = isHiddenPanitia;
                    localStorage.setItem('hide_kuota_panitia', isHiddenPanitia ? 'true' : 'false');
                    updateKuotaPanitiaStatus(isHiddenPanitia);
                }
                if (kuotaPanitia) {
                    kuotaPanitia.value = kuota_panitia !== undefined ? kuota_panitia : 20;
                }
            } else {
                updateKuotaPesertaStatus(false);
                updateKuotaPanitiaStatus(false);
            }
        } catch (e) {
            console.error('Gagal memuat pengaturan', e);
        }
    };

    btnSave.addEventListener('click', async () => {
        const dp = deadlinePeserta ? deadlinePeserta.value : '';
        const dpa = deadlinePanitia ? deadlinePanitia.value : '';

        const payload = {
            hide_kuota_peserta: hideKuotaPeserta ? hideKuotaPeserta.checked : false,
            hide_kuota_panitia: hideKuotaPanitia ? hideKuotaPanitia.checked : false,
            kuota_peserta: kuotaPeserta ? (parseInt(kuotaPeserta.value) || 25) : 25,
            kuota_panitia: kuotaPanitia ? (parseInt(kuotaPanitia.value) || 20) : 20
        };

        if (dp) payload.deadline_peserta = new Date(dp).toISOString();
        if (dpa) payload.deadline_panitia = new Date(dpa).toISOString();

        try {
            btnSave.disabled = true;
            btnSave.textContent = 'Menyimpan...';
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (result.success) {
                if (hideKuotaPeserta) {
                    localStorage.setItem('hide_kuota_peserta', hideKuotaPeserta.checked ? 'true' : 'false');
                }
                if (hideKuotaPanitia) {
                    localStorage.setItem('hide_kuota_panitia', hideKuotaPanitia.checked ? 'true' : 'false');
                }
                if (typeof window.showToast === 'function') window.showToast('Pengaturan berhasil disimpan!', 'success');
                loadSettings();
            } else {
                throw new Error(result.message || 'Gagal menyimpan');
            }
        } catch (e) {
            if (typeof window.showToast === 'function') window.showToast('Error: ' + e.message, 'error');
        } finally {
            btnSave.disabled = false;
            btnSave.textContent = '\uD83D\uDCBE Simpan Pengaturan';
        }
    });

    // ========================
    // NAV TAB LOGIC & RESTORE
    // ========================
    const savedTab = localStorage.getItem('admin_active_tab') || 'peserta';

    const switchTab = (targetCategory) => {
        currentCategory = targetCategory;
        localStorage.setItem('admin_active_tab', currentCategory);

        navLinks.forEach(nav => {
            if (nav.getAttribute('data-target') === currentCategory) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });

        if (currentCategory === 'pengaturan') {
            pageTitle.textContent = '⚙️ Pengaturan';
            panelData.classList.add('hidden');
            panelSettings.classList.remove('hidden');
            loadSettings();
        } else {
            const activeNav = Array.from(navLinks).find(n => n.getAttribute('data-target') === currentCategory);
            pageTitle.textContent = activeNav ? activeNav.textContent.trim() : 'Data Peserta';
            panelSettings.classList.add('hidden');
            panelData.classList.remove('hidden');
            fetchAndRender(currentCategory);
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = e.currentTarget.getAttribute('data-target');
            if (target) switchTab(target);
        });
    });

    // Load initial settings and restore tab
    loadSettings();
    switchTab(savedTab);
};
