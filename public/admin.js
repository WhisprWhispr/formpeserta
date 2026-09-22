document.addEventListener('DOMContentLoaded', () => {
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
            { key: 'kelas', label: 'Kelas' },
            { key: 'semester', label: 'Semester' },
            { key: 'no_telepon', label: 'No WA' },
            { key: 'status_aktivitas', label: 'Status' },
            { key: 'riwayat_penyakit', label: 'Penyakit' },
            { key: 'riwayat_alergi', label: 'Alergi' },
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
            { key: 'kelas', label: 'Kelas' },
            { key: 'semester', label: 'Semester' },
            { key: 'no_telepon', label: 'No WA' },
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
        // UI reset
        loading.classList.remove('hidden');
        errorMsg.classList.add('hidden');
        tableContainer.classList.add('hidden');
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        try {
            const response = await fetch(`/api/admin/${category}`);
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

    const renderTable = (category, data) => {
        const columns = columnsConfig[category] || [];

        // Build Headers
        let headerRow = '<tr>';
        columns.forEach(col => {
            headerRow += `<th>${col.label}</th>`;
        });
        headerRow += '</tr>';
        tableHead.innerHTML = headerRow;

        // Build Rows
        let rowsHtml = '';
        data.forEach(item => {
            let row = '<tr>';
            columns.forEach(col => {
                let cellValue = item[col.key] || '-';
                
                if (col.key === 'createdAt' && item[col.key]) {
                    cellValue = new Date(item[col.key]).toLocaleString('id-ID');
                }

                if (col.isImg && cellValue !== '-') {
                    row += `<td><a href="${cellValue}" target="_blank" class="img-link">Lihat Gambar</a></td>`;
                } else {
                    // Truncate long text slightly for table view
                    const text = String(cellValue);
                    const displayText = text.length > 50 ? text.substring(0, 50) + '...' : text;
                    row += `<td title="${text}">${displayText}</td>`;
                }
            });
            row += '</tr>';
            rowsHtml += row;
        });
        tableBody.innerHTML = rowsHtml;
    };

    // Event Listeners for tabs
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active class from all
            navLinks.forEach(nav => nav.classList.remove('active'));
            // Add active to clicked
            e.target.classList.add('active');

            // Update title
            pageTitle.textContent = e.target.textContent;

            // Fetch data
            currentCategory = e.target.getAttribute('data-target');
            fetchAndRender(currentCategory);
        });
    });

    // Initial fetch
    fetchAndRender(currentCategory);
});
