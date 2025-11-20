document.addEventListener('DOMContentLoaded', () => {
    // API Key diabaikan karena hanya simulasi data
    const apiKey = ""; 
    let currentChart = null; // Variabel untuk menyimpan instance Chart.js

    // ==========================================================
    // 1. DATA DUMMY UNTUK SIMULASI LENGKAP
    // ==========================================================

    const allSectors = [
        { name: 'Industri Pengolahan', intensity: 0.384, tax_collected: 50, emission_mt: 340.71, trend: [16.0, 18.0, 18.2, 18.5, 17.9] },
        { name: 'Listrik & Gas', intensity: 0.335, tax_collected: 44.3, emission_mt: 297.22, trend: [13.0, 14.5, 14.0, 14.2, 14.5] },
        { name: 'Pertanian/Hutan/Perikanan', intensity: 0.0975, tax_collected: 12.9, emission_mt: 86.5, trend: [11.8, 11.0, 11.2, 11.5, 11.0] },
        { name: 'Transportasi', intensity: 0.0914, tax_collected: 12, emission_mt: 81.08, trend: [10.5, 12.0, 12.8, 13.0, 13.4] },
        { name: 'Pengelolaan Air Limbah', intensity: 0.0347, tax_collected: 4.6, emission_mt: 30.84, trend: [3.7, 3.4, 3.5, 3.5, 3.6] },
        { name: 'Pertambangan', intensity: 0.033, tax_collected: 4.3, emission_mt: 29.28, trend: [4.0, 4.5, 4.6, 4.8, 4.5] },
        { name: 'Lainnya', intensity: 0.0243, tax_collected: 3.2, emission_mt: 21.6, trend: [4.0, 4.5, 4.6, 4.8, 4.5] }
    ];
    // Pastikan total emisi sektor sesuai dengan total emisi nasional
    const totalNationalEmission = allSectors.reduce((sum, s) => sum + s.emission_mt, 0);

    const sectorColors = ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#9CA3AF']; // Merah, Amber, Hijau, Biru, Violet, Abu-abu

    const KlasterData = [
      { region_name: "Pacitan", cluster_id: 1, carbon_valuation: 9922.96, ipm: 70.19, pdrb: 33149, tpak: 81.64 },
      { region_name: "Ponorogo", cluster_id: 1, carbon_valuation: 8570.24, ipm: 72.5, pdrb: 26314, tpak: 75.88 },
      { region_name: "Trenggalek", cluster_id: 1, carbon_valuation: 8412.67, ipm: 71.73, pdrb: 30681, tpak: 80.72 },
      { region_name: "Tulungagung", cluster_id: 1, carbon_valuation: 6534.50, ipm: 74.61, pdrb: 43297, tpak: 74.7 },
      { region_name: "Blitar", cluster_id: 3, carbon_valuation: 10882.16, ipm: 72.49, pdrb: 35812, tpak: 73.5 },
      { region_name: "Kediri", cluster_id: 3, carbon_valuation: 8355.30, ipm: 73.96, pdrb: 30193, tpak: 68.74 },
      { region_name: "Malang", cluster_id: 3, carbon_valuation: 25017.96, ipm: 72.16, pdrb: 47272, tpak: 70.66 },
      { region_name: "Lumajang", cluster_id: 3, carbon_valuation: 12657.32, ipm: 67.87, pdrb: 35178, tpak: 68.49 },
      { region_name: "Jember", cluster_id: 3, carbon_valuation: 23504.42, ipm: 68.64, pdrb: 36837, tpak: 72.3 },
      { region_name: "Banyuwangi", cluster_id: 1, carbon_valuation: 26056.29, ipm: 72.61, pdrb: 58086, tpak: 79.04 },
      { region_name: "Bondowoso", cluster_id: 3, carbon_valuation: 10359.48, ipm: 67.99, pdrb: 31432, tpak: 74.39 },
      { region_name: "Situbondo", cluster_id: 1, carbon_valuation: 10125.78, ipm: 69.16, pdrb: 36190, tpak: 75.28 },
      { region_name: "Probolinggo", cluster_id: 3, carbon_valuation: 10322.54, ipm: 67.79, pdrb: 36006, tpak: 69.48 },
      { region_name: "Pasuruan", cluster_id: 3, carbon_valuation: 7656.90, ipm: 70.29, pdrb: 113683, tpak: 71.21 },
      { region_name: "Sidoarjo", cluster_id: 2, carbon_valuation: 2300.51, ipm: 81.55, pdrb: 127382, tpak: 69.62 },
      { region_name: "Mojokerto", cluster_id: 2, carbon_valuation: 4060.96, ipm: 75.53, pdrb: 91112, tpak: 72.51 },
      { region_name: "Jombang", cluster_id: 3, carbon_valuation: 4585.48, ipm: 74.6, pdrb: 36991, tpak: 71.91 },
      { region_name: "Nganjuk", cluster_id: 3, carbon_valuation: 5614.54, ipm: 73.71, pdrb: 29917, tpak: 66.89 },
      { region_name: "Madiun", cluster_id: 3, carbon_valuation: 5285.97, ipm: 72.97, pdrb: 31588, tpak: 72.49 },
      { region_name: "Magetan", cluster_id: 1, carbon_valuation: 3391.90, ipm: 75.41, pdrb: 33627, tpak: 78.48 },
      { region_name: "Ngawi", cluster_id: 3, carbon_valuation: 5839.93, ipm: 72.47, pdrb: 27619, tpak: 69.43 },
      { region_name: "Bojonegoro", cluster_id: 1, carbon_valuation: 8156.74, ipm: 70.85, pdrb: 74242, tpak: 74.29 },
      { region_name: "Tuban", cluster_id: 1, carbon_valuation: 6266.77, ipm: 70.34, pdrb: 67176, tpak: 74.73 },
      { region_name: "Lamongan", cluster_id: 1, carbon_valuation: 5496.04, ipm: 74.53, pdrb: 35726, tpak: 75.08 },
      { region_name: "Gresik", cluster_id: 2, carbon_valuation: 4193.82, ipm: 77.98, pdrb: 130527, tpak: 70.12 },
      { region_name: "Bangkalan", cluster_id: 3, carbon_valuation: 4585.46, ipm: 65.75, pdrb: 25408, tpak: 71.49 },
      { region_name: "Sampang", cluster_id: 3, carbon_valuation: 4335.43, ipm: 64.13, pdrb: 23978, tpak: 73.54 },
      { region_name: "Pamekasan", cluster_id: 1, carbon_valuation: 2948.40, ipm: 67.96, pdrb: 23842, tpak: 77.14 },
      { region_name: "Sumenep", cluster_id: 1, carbon_valuation: 8601.20, ipm: 68.61, pdrb: 37474, tpak: 78.86 },
      { region_name: "Kota Kediri", cluster_id: 2, carbon_valuation: 335.51, ipm: 80.44, pdrb: 541068, tpak: 71.83 },
      { region_name: "Kota Blitar", cluster_id: 2, carbon_valuation: 171.05, ipm: 80.63, pdrb: 55523, tpak: 72.26 },
      { region_name: "Kota Malang", cluster_id: 2, carbon_valuation: 632.96, ipm: 83.39, pdrb: 107542, tpak: 67.58 },
      { region_name: "Kota Probolinggo", cluster_id: 2, carbon_valuation: 256.33, ipm: 75.43, pdrb: 57885, tpak: 70.61 },
      { region_name: "Kota Pasuruan", cluster_id: 1, carbon_valuation: 156.74, ipm: 77.17, pdrb: 48058, tpak: 75.65 },
      { region_name: "Kota Mojokerto", cluster_id: 2, carbon_valuation: 65.66, ipm: 80.07, pdrb: 59061, tpak: 72.5 },
      { region_name: "Kota Madiun", cluster_id: 2, carbon_valuation: 143.54, ipm: 82.71, pdrb: 86285, tpak: 69.29 },
      { region_name: "Surabaya", cluster_id: 2, carbon_valuation: 859.45, ipm: 83.45, pdrb: 245685, tpak: 68.73 },
      { region_name: "Batu", cluster_id: 1, carbon_valuation: 1246.09, ipm: 78.18, pdrb: 93214, tpak: 78.99 }
    ];

    const CentroidData = {
        1: { 
            name: 'Klaster 1: Fokus Keseimbangan', 
            description: 'Klaster ini menunjukkan valuasi karbon dan PDRB menengah, namun memiliki TPAK (Partisipasi Angkatan Kerja) yang sangat tinggi. Perlu menjaga keseimbangan antara pertumbuhan ekonomi dan pelestarian lingkungan.',
            color: '#3B82F6', // carbon-blue
            values: { ekonomi_karbon: 7563.31, ipm: 72.42, pdrb: 45791.14, tpak: 77.81 } 
        },
        2: { 
            name: 'Klaster 2: Berdaya Saing Tinggi', 
            description: 'Terdiri dari Kota-Kota besar dengan IPM tertinggi dan PDRB yang sangat besar, namun valuasi karbonnya rendah. Ini mengindikasikan efisiensi ekonomi yang tinggi. Klaster ini adalah pemimpin dalam pembangunan berkelanjutan.',
            color: '#10B981', // carbon-green
            values: { ekonomi_karbon: 1301.98, ipm: 80.12, pdrb: 150207.00, tpak: 70.50 } 
        },
        3: { 
            name: 'Klaster 3: Emisi/Valuasi Tinggi', 
            description: 'Klaster ini dicirikan oleh Valuasi Karbon (Emisi) yang sangat tinggi, IPM rendah, dan PDRB rendah. Ini menunjukkan tekanan lingkungan yang besar dan potensi risiko kegagalan ekonomi karbon.',
            color: '#EF4444', // carbon-red
            values: { ekonomi_karbon: 9928.78, ipm: 70.34, pdrb: 38078.14, tpak: 71.04 } 
        }
    };

    const regionData = [
    {
        name: 'Bangkalan',
        emission_ton: 30.73,
        carbon_valuation: 4203.30,
        emission_history: [29.12, 28.12, 26.72, 30.73]
    },
    {
        name: 'Banyuwangi',
        emission_ton: 174.65,
        carbon_valuation: 23884.68,
        emission_history: [157.93, 147.86, 133.81, 174.65]
    },
    {
        name: 'Blitar',
        emission_ton: 72.94,
        carbon_valuation: 9975.20,
        emission_history: [69.50, 65.15, 59.93, 72.94]
    },
    {
        name: 'Bojonegoro',
        emission_ton: 54.67,
        carbon_valuation: 7476.93,
        emission_history: [57.26, 57.07, 55.95, 54.67]
    },
    {
        name: 'Bondowoso',
        emission_ton: 69.44,
        carbon_valuation: 9496.09,
        emission_history: [66.82, 63.26, 59.83, 69.44]
    },
    {
        name: 'Gresik',
        emission_ton: 28.11,
        carbon_valuation: 3844.30,
        emission_history: [26.90, 25.49, 24.95, 28.11]
    },
    {
        name: 'Jember',
        emission_ton: 157.54,
        carbon_valuation: 21545.49,
        emission_history: [147.11, 137.22, 127.77, 157.54]
    },
    {
        name: 'Jombang',
        emission_ton: 30.74,
        carbon_valuation: 4203.31,
        emission_history: [31.92, 30.91, 30.40, 30.74]
    },
    {
        name: 'Kediri',
        emission_ton: 56.00,
        carbon_valuation: 7658.95,
        emission_history: [56.78, 53.77, 50.06, 56.00]
    },
    {
        name: 'Lamongan',
        emission_ton: 36.84,
        carbon_valuation: 5037.99,
        emission_history: [36.97, 35.87, 36.40, 36.84]
    },
    {
        name: 'Lumajang',
        emission_ton: 84.84,
        carbon_valuation: 11602.42,
        emission_history: [79.42, 74.48, 69.25, 84.84]
    },
    {
        name: 'Madiun',
        emission_ton: 35.43,
        carbon_valuation: 4845.42,
        emission_history: [36.25, 35.91, 34.22, 35.43]
    },
    {
        name: 'Magetan',
        emission_ton: 22.73,
        carbon_valuation: 3109.21,
        emission_history: [23.15, 22.19, 21.18, 22.73]
    },
    {
        name: 'Malang',
        emission_ton: 167.69,
        carbon_valuation: 22932.88,
        emission_history: [157.76, 147.92, 136.42, 167.69]
    },
    {
        name: 'Mojokerto',
        emission_ton: 27.22,
        carbon_valuation: 3722.51,
        emission_history: [28.62, 27.43, 26.98, 27.22]
    },
    {
        name: 'Nganjuk',
        emission_ton: 37.63,
        carbon_valuation: 5146.61,
        emission_history: [38.56, 38.02, 36.68, 37.63]
    },
    {
        name: 'Ngawi',
        emission_ton: 39.14,
        carbon_valuation: 5353.21,
        emission_history: [40.74, 40.53, 39.30, 39.14]
    },
    {
        name: 'Pacitan',
        emission_ton: 66.51,
        carbon_valuation: 9095.95,
        emission_history: [58.64, 55.67, 49.83, 66.51]
    },
    {
        name: 'Pamekasan',
        emission_ton: 19.76,
        carbon_valuation: 2702.67,
        emission_history: [18.46, 17.35, 16.82, 19.76]
    },
    {
        name: 'Pasuruan',
        emission_ton: 51.32,
        carbon_valuation: 7018.75,
        emission_history: [50.70, 48.15, 46.90, 51.32]
    },
    {
        name: 'Ponorogo',
        emission_ton: 57.44,
        carbon_valuation: 7855.97,
        emission_history: [55.12, 52.32, 48.26, 57.44]
    },
    {
        name: 'Probolinggo',
        emission_ton: 69.19,
        carbon_valuation: 9462.23,
        emission_history: [68.83, 64.35, 61.79, 69.19]
    },
    {
        name: 'Sampang',
        emission_ton: 29.06,
        carbon_valuation: 3974.10,
        emission_history: [27.33, 26.19, 25.35, 29.06]
    },
    {
        name: 'Sidoarjo',
        emission_ton: 15.42,
        carbon_valuation: 2108.78,
        emission_history: [16.17, 15.18, 14.69, 15.42]
    },
    {
        name: 'Situbondo',
        emission_ton: 67.87,
        carbon_valuation: 9281.86,
        emission_history: [63.70, 60.81, 58.11, 67.87]
    },
    {
        name: 'Sumenep',
        emission_ton: 57.65,
        carbon_valuation: 7884.35,
        emission_history: [50.64, 46.75, 44.73, 57.65]
    },
    {
        name: 'Trenggalek',
        emission_ton: 56.39,
        carbon_valuation: 7711.53,
        emission_history: [50.21, 47.24, 42.15, 56.39]
    },
    {
        name: 'Tuban',
        emission_ton: 42.00,
        carbon_valuation: 5744.48,
        emission_history: [42.43, 41.37, 41.02, 42.00]
    },
    {
        name: 'Tulungagung',
        emission_ton: 43.80,
        carbon_valuation: 5989.89,
        emission_history: [41.59, 38.66, 35.18, 43.80]
    },
    {
        name: 'Batu',
        emission_ton: 8.35,
        carbon_valuation: 1142.24,
        emission_history: [8.32, 7.93, 7.55, 8.35]
    },
    {
        name: 'Kota Blitar',
        emission_ton: 1.15,
        carbon_valuation: 156.79,
        emission_history: [1.16, 1.06, 0.98, 1.15]
    },
    {
        name: 'Kota Kediri',
        emission_ton: 2.25,
        carbon_valuation: 307.55,
        emission_history: [2.33, 2.21, 2.03, 2.25]
    },
    {
        name: 'Kota Madiun',
        emission_ton: 0.96,
        carbon_valuation: 131.57,
        emission_history: [0.98, 0.92, 0.88, 0.96]
    },
    {
        name: 'Kota Malang',
        emission_ton: 4.24,
        carbon_valuation: 580.21,
        emission_history: [4.41, 4.21, 3.89, 4.24]
    },
    {
        name: 'Kota Mojokerto',
        emission_ton: 0.44,
        carbon_valuation: 60.18,
        emission_history: [0.47, 0.46, 0.43, 0.44]
    },
    {
        name: 'Kota Pasuruan',
        emission_ton: 1.05,
        carbon_valuation: 143.68,
        emission_history: [1.01, 0.98, 0.92, 1.05]
    },
    {
        name: 'Kota Probolinggo',
        emission_ton: 1.72,
        carbon_valuation: 234.96,
        emission_history: [1.73, 1.60, 1.57, 1.72]
    },
    {
        name: 'Surabaya',
        emission_ton: 5.76,
        carbon_valuation: 787.82,
        emission_history: [5.99, 5.68, 5.65, 5.76]
    }
    ];


    // Data Harga Karbon dan Kurs (BARU)
    const carbonPriceData = [
        { year: 2015, price: 11.17, exchange: 13392 },
        { year: 2016, price: 6.62, exchange: 13307 },
        { year: 2017, price: 6.60, exchange: 13384 },
        { year: 2018, price: 6.11, exchange: 14246 },
        { year: 2019, price: 5.76, exchange: 14146 },
        { year: 2020, price: 6.81, exchange: 14572 },
        { year: 2021, price: 4.83, exchange: 14312 },
        { year: 2022, price: 6.56, exchange: 14871 },
        { year: 2023, price: 9.78, exchange: 15255 },
        { year: 2024, price: 8.63, exchange: 15847 },
    ].sort((a, b) => a.year - b.year); 

    const nationalSummary = {
        total_emission_mt: 675,
        emission_vs_last_year: 2.7,
        total_companies: 887.32,
        avg_emission_per_company: 12031.92, 
        emission_trend: [
            { year: 2020, emission: 43.55 },
            { year: 2021, emission: 41.32 },
            { year: 2022, emission: 38.91 },
            { year: 2023, emission: 45.49 }, // Data terkini
        ],
        new_headline_value: '400 ribu ton',
        new_headline_year: 'di 2025',
        carbon_price_trend: carbonPriceData, // Tambahkan data harga karbon
        source_url1: 'https://www.cnbcindonesia.com/news/20250527190219-4-636756/target-penurunan-emisi-karbon-naik-jadi-400-ribu-ton-di-2025',
        source_url2: 'https://databoks.katadata.co.id/lingkungan/statistik/b0d4d2a1d9aaa4c/ini-industri-penyumbang-emisi-gas-rumah-kaca-terbesar-di-indonesia',
        source_url3: 'https://www.theglobaleconomy.com/Indonesia/carbon_dioxide_emissions/?utm_source=chatgpt.com',
        source_url4: 'https://carbonpricingdashboard.worldbank.org/',
        source_url_carbon_price_chart: 'https://carbonpricingdashboard.worldbank.org/compliance/price', // Sumber untuk chart baru
        source_url_npp: 'https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD17A3HGF'
    };

    // ==========================================================
    // 2. FUNGSI UTILITAS
    // ==========================================================

    function formatRupiah(number) {
        if (typeof number !== 'number' || isNaN(number)) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    }

    function formatNumber(number) {
        if (typeof number !== 'number' || isNaN(number)) return '--';
        return number.toLocaleString('id-ID', { maximumFractionDigits: 1 });
    }

    // Fungsi untuk menghapus Chart lama sebelum membuat yang baru
    function destroyChart(chartId) {
        const existingChart = Chart.getChart(chartId);
        if (existingChart) {
            existingChart.destroy();
        }
    }
    
    // ==========================================================
    // 3. LOGIKA PAGE SWITCHING & DARK MODE
    // ==========================================================

    const htmlElement = document.documentElement;
    const bodyElement = document.body; // Menggunakan body untuk class dark
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    
    // Fungsi untuk inisialisasi tema dari localStorage
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
    }

    function setTheme(theme) {
        if (theme === 'dark') {
            bodyElement.classList.add('dark');
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        } else {
            bodyElement.classList.remove('dark');
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        }
        localStorage.setItem('theme', theme);
        updateChartColors(); 
    }

    function toggleDarkMode() {
        const currentTheme = bodyElement.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }
    
    // Fungsi untuk memperbarui warna teks pada Chart.js saat mode berubah
    function updateChartColors() {
        const isDark = bodyElement.classList.contains('dark');
        const textColor = isDark ? '#E0E0E0' : '#1F2937';
        
        // Tambahkan 'carbon-price-chart' ke daftar chart yang perlu diupdate
        const chartsToUpdate = ['emisi-line-chart', 'carbon-price-chart', 'emisi-comparison-chart', 'trend-comparison-chart', 'sector-contribution-chart', 'sector-trend-chart'];
        
        chartsToUpdate.forEach(chartId => {
             const chart = Chart.getChart(chartId);
             if (chart) {
                 // Update warna skala, judul, dan legend
                 const options = chart.options;
                 options.scales.x.ticks.color = textColor;
                 options.scales.y.ticks.color = textColor;
                // Khusus untuk chart 2-sumbu, update y1 dan y2
                if (options.scales.y1) options.scales.y1.ticks.color = textColor;
                if (options.scales.y2) options.scales.y2.ticks.color = textColor;

                 options.scales.x.title.color = textColor;
                 options.scales.y.title.color = textColor;
                 options.plugins.legend.labels.color = textColor;
                 if(options.plugins.title) {
                     options.plugins.title.color = textColor;
                 }
                 chart.update();
             }
        });
    }

    // Listener untuk Dark Mode
    themeToggle.addEventListener('click', toggleDarkMode);


    const pageContents = document.querySelectorAll('.page-content');
    const navItems = document.querySelectorAll('.nav-item');

    function switchPage(pageId) {
        // Hapus kelas 'active' dari semua tombol dan sembunyikan semua konten
        navItems.forEach(item => {
             item.classList.remove('active', 'text-carbon-dark');
             item.classList.add('text-gray-500');
        });
        pageContents.forEach(content => content.classList.add('hidden'));

        // Tampilkan konten yang diminta
        const activePage = document.getElementById(pageId);
        if (activePage) activePage.classList.remove('hidden');

        // Atur tombol aktif
        const activeBtn = document.querySelector(`[data-page="${pageId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active', 'text-carbon-dark');
            activeBtn.classList.remove('text-gray-500');
        }

        // Panggil fungsi render untuk halaman yang diaktifkan
        if (pageId === 'page-dashboard-nasional') {
            renderNationalSummary();
            renderCarbonPriceChart(); // Panggil chart harga karbon baru
            renderLineChart();
        } else if (pageId === 'page-perbandingan-provinsi') {
            renderComparisonPage();
        } else if (pageId === 'page-sektor-industri') {
            renderIndustryPage();
        } else if (pageId === 'page-simulasi-pajak') {
            renderSimulationPage();
        } else if (pageId === 'page-analisis-klaster') { // BARU
            renderClusterPage();
        }
    }

    // Pasang Event Listener untuk navigasi
    navItems.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.getAttribute('data-page');
            switchPage(pageId);
        });
    });

    // ==========================================================
    // 4. RENDER DASHBOARD UTAMA (Fungsi Eksisting)
    // ==========================================================

    function renderNationalSummary() {
        const { total_emission_mt, emission_vs_last_year, total_companies, avg_emission_per_company, new_headline_value, new_headline_year, source_url1, source_url2, source_url3, source_url4, } = nationalSummary;
        //card 1
        document.getElementById('emisi-value').textContent = `${formatNumber(total_emission_mt)} juta ton`;
        const badgeEmisi = document.getElementById('emisi-badge');
        const isEmisiUp = emission_vs_last_year > 0;
        const colorClass = isEmisiUp ? 'text-carbon-red bg-red-100' : 'text-carbon-green bg-green-100';
        const arrow = isEmisiUp ? '↑' : '↓';
        badgeEmisi.className = `mt-3 text-sm font-semibold flex items-center p-1 px-2 rounded-full ${colorClass}`;
        badgeEmisi.innerHTML = `${arrow} ${Math.abs(emission_vs_last_year)}% vs Tahun Lalu`;

        const sourceLinkCard1 = document.getElementById('emisi-source-link');
        sourceLinkCard1.href = source_url3;
        sourceLinkCard1.textContent = 'Sumber: The Global Economy';
        sourceLinkCard1.classList.add('font-bold');

        //card 2
        document.getElementById('pajak-value').textContent = `${new_headline_value} ${new_headline_year}`;
        const sourceLink = document.getElementById('pajak-source-link');

        sourceLink.href = source_url1;
        sourceLink.textContent = 'Sumber: CNBC Indonesia';
        sourceLink.classList.remove('text-carbon-green', 'font-semibold');
        sourceLink.classList.add('text-gray-500', 'text-xs', 'hover:text-carbon-blue');

        //card3
        document.getElementById('perusahaan-value').textContent = `${formatNumber(total_companies)} juta ton co2`;

        const sourceLinkCard3 = document.getElementById('perusahaan-source-link');
        sourceLinkCard3.href = source_url2;
        sourceLinkCard3.textContent = 'Sumber: Databooks Katadata Indonesia';
        sourceLinkCard3.classList.remove('text-carbon-green', 'font-semibold');
        sourceLinkCard3.classList.add('text-gray-500', 'text-xs', 'hover:text-carbon-blue', 'font-bold');

        const perusahaanTooltip = document.getElementById('perusahaan-tooltip');
        const dummySectorBreakdown = [
            { sector: 'Industri Pengolahan', count: 340.71 },
            { sector: 'Listrik dan Gas', count: 297.22 },
            { sector: 'Pertanian/Perikanan', count: 86.5 },
            { sector: 'Transportasi', count: 81.08 },
            { sector: 'Lainnya', count: 81.72 },
        ];
        perusahaanTooltip.innerHTML = dummySectorBreakdown.map(s =>
            `<p class="text-xs">${s.sector}: ${formatNumber(s.count)} Juta</p>`
        ).join('');

        const sektorBreakdownSpan = document.getElementById('sektor-breakdown');
        // Hapus listener lama sebelum menambahkan yang baru
        sektorBreakdownSpan.removeEventListener('mouseover', () => { perusahaanTooltip.classList.remove('hidden'); });
        sektorBreakdownSpan.removeEventListener('mouseout', () => { perusahaanTooltip.classList.add('hidden'); });
        
        sektorBreakdownSpan.addEventListener('mouseover', () => { perusahaanTooltip.classList.remove('hidden'); });
        sektorBreakdownSpan.addEventListener('mouseout', () => { perusahaanTooltip.classList.add('hidden'); });

        //card 4
        const sourceLinkCard4 = document.getElementById('harga-karbon-source-link');
        sourceLinkCard4.href = source_url4;
        sourceLinkCard4.textContent = 'Sumber: World Bank (Data Rata-Rata)';
        sourceLinkCard4.classList.add('font-bold'); 
        sourceLinkCard4.classList.remove('text-carbon-green', 'font-semibold');
        sourceLinkCard4.classList.add('text-gray-500', 'text-xs', 'hover:text-carbon-blue');
        document.getElementById('rata-emisi-value').textContent = `${formatNumber(nationalSummary.avg_emission_per_company)} Rupiah`;
    }

    function showDashboard() {
        const loginPage = document.getElementById('login-page');
        const dashboardContent = document.getElementById('dashboard-content');
        
        // Sembunyikan halaman login dan tampilkan dashboard
        if (loginPage && dashboardContent) {
            loginPage.classList.add('hidden');
            dashboardContent.classList.remove('hidden');
        }

        // Panggil inisialisasi tema dan dashboard setelah berhasil login
        initializeTheme(); 
        // Pastikan dashboard dimulai dari halaman pertama
        switchPage('page-dashboard-nasional'); 
    }

    function handleLogin(event) {
        event.preventDefault(); // Mencegah form submit default
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('login-error-message');

        // SIMULASI LOGIN: Cukup cek apakah ada input
        if (username && password) {
            errorMessage.classList.add('hidden');
            showDashboard();
        } else {
            errorMessage.classList.remove('hidden');
        }
    }

    // ==========================================================
    // 5. RENDER CHART HARGA KARBON (BARU)
    // ==========================================================
    
    function renderCarbonPriceChart() {
        const { source_url_carbon_price_chart, source_url_npp } = nationalSummary;
        destroyChart('carbon-price-chart');
        const ctx = document.getElementById('carbon-price-chart').getContext('2d');
        const data = nationalSummary.carbon_price_trend;
        const isDark = bodyElement.classList.contains('dark');
        const textColor = isDark ? '#E0E0E0' : '#1F2937';

        const sourceLinkCard5 = document.getElementById('karbon-price-source-link');
        sourceLinkCard5.href = source_url_carbon_price_chart;
        sourceLinkCard5.textContent = 'Sumber: World Bank Carbon Pricing Dashboard';
        sourceLinkCard5.classList.add('font-bold'); 
        sourceLinkCard5.classList.remove('text-carbon-green', 'font-semibold');
        sourceLinkCard5.classList.add('text-gray-500', 'text-xs', 'hover:text-carbon-blue');

        const sourceLinkCard6 = document.getElementById('npp-source-link');
        sourceLinkCard6.href = source_url_npp;
        sourceLinkCard6.textContent = 'Sumber: Google Earth Engine';
        sourceLinkCard6.classList.add('font-bold'); 
        sourceLinkCard6.classList.remove('text-carbon-green', 'font-semibold');
        sourceLinkCard6.classList.add('text-gray-500', 'text-xs', 'hover:text-carbon-blue');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => item.year),
                datasets: [
                    {
                        label: 'Harga Karbon (USD/ton)',
                        data: data.map(item => item.price),
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        yAxisID: 'y1',
                        tension: 0.4,
                        pointRadius: 4,
                    },
                    {
                        label: 'Nilai Tukar (IDR/USD)',
                        data: data.map(item => item.exchange),
                        borderColor: '#3B82F6', // carbon-blue
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        yAxisID: 'y2',
                        tension: 0.4,
                        pointRadius: 4,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        labels: { color: textColor } 
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = formatNumber(context.parsed.y);
                                return context.dataset.yAxisID === 'y1' 
                                    ? `Harga Karbon: $${value}/ton`
                                    : `Nilai Tukar: Rp ${value}`;
                            }
                        }
                    }
                },
                scales: {
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Harga Karbon (USD/ton)', color: textColor },
                        ticks: { color: textColor, callback: (value) => `$${formatNumber(value)}` },
                        grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
                    },
                    y2: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Nilai Tukar (IDR/USD)', color: textColor },
                        ticks: { color: textColor, callback: (value) => `Rp ${formatNumber(value)}` },
                        grid: { drawOnChartArea: false } // Jangan gambar grid untuk sumbu kanan
                    },
                    x: {
                        title: { display: true, text: 'Tahun', color: textColor },
                        ticks: { color: textColor, stepSize: 1 }
                    }
                }
            }
        });
    }

    function renderLineChart() {
        destroyChart('emisi-line-chart');
        const ctx = document.getElementById('emisi-line-chart').getContext('2d');
        const data = nationalSummary.emission_trend;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => item.year),
                datasets: [{
                    label: 'Emisi CO₂ (Juta Ton)',
                    data: data.map(item => item.emission),
                    borderColor: '#3B82F6', 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#3B82F6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label || ''}: ${formatNumber(context.parsed.y)} juta ton`
                        }
                    }
                },
                scales: {
                    y: { title: { display: true, text: 'Emisi (Juta Ton)' }, beginAtZero: true },
                    x: { title: { display: true, text: 'Tahun' } }
                }
            }
        });
        updateChartColors(); // Panggil update warna setelah inisialisasi
    }

    // ==========================================================
    // 5. RENDER HALAMAN PERBANDINGAN PROVINSI
    // ==========================================================

    function renderComparisonPage() {
        renderRegionSelectors();
        renderRankingTables();
        // Reset grafik
        destroyChart('emisi-comparison-chart');
        destroyChart('trend-comparison-chart');
        document.getElementById('sector-comparison-table').innerHTML = '<p class="text-gray-500">Pilih region untuk menampilkan perbandingan.</p>';
        updateChartColors();
    }
    
    function renderRegionSelectors() { // Mengganti nama fungsi
        const container = document.getElementById('provinsi-select-container');
        container.innerHTML = '';
        
        // Buat 5 dropdown selector
        for (let i = 0; i < 5; i++) {
            const select = document.createElement('select');
            select.id = `province-select-${i}`;
            // Tambahkan kelas dark mode yang relevan
            select.className = 'w-full p-2 border border-gray-300 rounded-lg focus:ring-carbon-blue focus:border-carbon-blue transition duration-150';
            select.onchange = updateComparisonResults;

            let optionsHTML = '<option value="">-- Pilih Kabupaten/Kota --</option>'; // Ubah label
            regionData.forEach(p => { // Menggunakan regionData
                optionsHTML += `<option value="${p.name}">${p.name}</option>`; // Menggunakan name sebagai ID sementara
            });
            select.innerHTML = optionsHTML;
            container.appendChild(select);
        }
    }

    function getSelectedProvinces() {
        const selectedNames = new Set();
        for (let i = 0; i < 5; i++) {
            const select = document.getElementById(`province-select-${i}`);
            if (select && select.value && !selectedNames.has(select.value)) {
                selectedNames.add(select.value);
            }
        }
        return regionData.filter(p => selectedNames.has(p.name)); // Menggunakan regionData
    }

    function updateComparisonResults() {
        const selectedRegions = getSelectedProvinces(); // Menggunakan fungsi yang dimodifikasi

        if (selectedRegions.length >= 2) {
            renderComparisonCharts(selectedRegions);
        } else {
            destroyChart('emisi-comparison-chart');
            destroyChart('trend-comparison-chart');
            // Menghapus tabel perbandingan sektor karena tidak ada datanya di regionData
        }
    }

    function renderComparisonCharts(regions) { // Mengganti nama variabel
        // Bar Chart (Perbandingan Total Emisi - EMISSION_TON)
        destroyChart('emisi-comparison-chart');
        const ctxBar = document.getElementById('emisi-comparison-chart').getContext('2d');
        const barData = {
            labels: regions.map(p => p.name),
            datasets: [{
                label: 'Total Emisi CO₂ (Juta Ton)',
                data: regions.map(p => p.emission_ton),
                backgroundColor: regions.map((p, i) => sectorColors[i % sectorColors.length]),
                borderColor: regions.map((p, i) => sectorColors[i % sectorColors.length]),
                borderWidth: 1
            }]
        };
        new Chart(ctxBar, {
            type: 'bar',
            data: barData,
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, title: { display: true, text: 'Emisi (Juta Ton)' } } }
            }
        });

        // Line Chart (Tren Emisi 4 Tahun - EMISSION_HISTORY)
        destroyChart('trend-comparison-chart');
        const ctxLine = document.getElementById('trend-comparison-chart').getContext('2d');
        const years = [2020, 2021, 2022, 2023]; // Disesuaikan dengan data 4 tahun

        const lineDatasets = regions.map((p, index) => ({
            label: p.name,
            data: p.emission_history, // Menggunakan emission_history (4 tahun)
            borderColor: sectorColors[index % sectorColors.length],
            backgroundColor: sectorColors[index % sectorColors.length] + '40', 
            fill: false, tension: 0.4, pointRadius: 4
        }));
        new Chart(ctxLine, {
            type: 'line',
            data: { labels: years, datasets: lineDatasets },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { y: { title: { display: true, text: 'Emisi (Juta Ton)' } } }
            }
        });
        updateChartColors();
    }

    document.getElementById('export-data').addEventListener('click', () => {
        // Hanya export data yang relevan
        const exportableData = regionData.map(r => ({
            Nama_Region: r.name,
            Emisi_Juta_Ton_CO2: r.emission_ton,
            Valuasi_Karbon_Miliar_Rp: r.carbon_valuation,
            Histori_Emisi_2020: r.emission_history[0],
            Histori_Emisi_2021: r.emission_history[1],
            Histori_Emisi_2022: r.emission_history[2],
            Histori_Emisi_2023: r.emission_history[3],
        }));
        exportToCSV(exportableData, 'data_pajak_karbon_region.csv');
        console.log("Data Region berhasil diexport.");
    });
    // ==========================================================
    // 6. RENDER HALAMAN SEKTOR INDUSTRI
    // ==========================================================

    function renderIndustryPage() {
        renderSectorPieChart();
        renderSectorTrendChart();
        renderHeatmapSimulation();
        updateChartColors();
    }

    function renderSectorPieChart() {
        destroyChart('sector-contribution-chart');
        const ctx = document.getElementById('sector-contribution-chart').getContext('2d');

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: allSectors.map(s => s.name),
                datasets: [{
                    label: 'Kontribusi Emisi (Juta Ton)',
                    data: allSectors.map(s => s.emission_mt),
                    backgroundColor: sectorColors,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' },
                    title: { display: true, text: `Total Emisi Nasional: ${formatNumber(totalNationalEmission)} JT` }
                }
            }
        });
    }

    function renderSectorTrendChart() {
        destroyChart('sector-trend-chart');
        const ctx = document.getElementById('sector-trend-chart').getContext('2d');
        
        // Data yang digunakan adalah allSectors
        const datasets = [{
            label: 'Valuasi Pajak (Miliar Rp)',
            data: allSectors.map(s => s.tax_collected),
            backgroundColor: allSectors.map((s, index) => sectorColors[index]), // Warna per sektor
            borderColor: allSectors.map((s, index) => sectorColors[index]),
            borderWidth: 1
        }];

        new Chart(ctx, {
            type: 'bar', // DIUBAH dari 'line' menjadi 'bar'
            data: { 
                labels: allSectors.map(s => s.name), // Label sumbu X adalah NAMA SEKTOR
                datasets: datasets 
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { 
                        display: true, 
                        text: 'Valuasi Pajak Tahunan Per Sektor (Triliun Rp)' // Judul disesuaikan
                    },
                    tooltip: {
                        callbacks: {
                            // Menampilkan nilai dalam Miliar Rp
                            label: (context) => `${context.dataset.label || ''}: ${formatNumber(context.parsed.y)} Triliun Rp`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Valuasi Pajak (Triliun Rp)' } // Label sumbu Y
                    }
                }
            }
        });
    }

    function renderHeatmapSimulation() {
        const container = document.getElementById('sector-heatmap-content');
        let tableHTML = `<table class="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sektor Industri</th>
                    <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Intensitas Emisi</th>
                    <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Pajak Karbon (Triliun Rp)</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">`;

        allSectors.forEach(s => {
            const intensityColor = s.intensity > 0.3 ? 'bg-carbon-red text-white' : (s.intensity > 0.08 ? 'bg-carbon-yellow text-gray-800' : 'bg-carbon-green text-white');
            const taxColor = s.tax_collected > 100 ? 'text-carbon-red font-bold' : (s.tax_collected > 50 ? 'text-carbon-yellow font-medium' : 'text-carbon-green');

            tableHTML += `<tr>
                <td class="px-4 py-2 text-sm font-semibold text-carbon-dark">${s.name}</td>
                <td class="px-4 py-2 text-center">
                    <span class="inline-block px-3 py-1 rounded-full ${intensityColor}">${(s.intensity * 100).toFixed(0)}%</span>
                </td>
                <td class="px-4 py-2 text-center text-sm ${taxColor}">${formatNumber(s.tax_collected)} T</td>
            </tr>`;
        });

        tableHTML += `</tbody></table>`;
        container.innerHTML = tableHTML;
    }

    // ==========================================================
    // 7. LOGIKA HALAMAN SIMULASI PAJAK KARBON
    // ==========================================================

    function renderSimulationPage() {
        // Isi dropdown Jenis Industri
        const select = document.getElementById('industry-type');
        select.innerHTML = '';
        allSectors.forEach(s => {
            const option = document.createElement('option');
            option.value = s.name;
            option.textContent = s.name;
            select.appendChild(option);
        });

        // Hapus listener lama sebelum menambahkan yang baru
        const form = document.getElementById('tax-simulation-form');
        form.onsubmit = null;
        form.addEventListener('submit', calculateTax);
        
        // Render hasil awal
        document.getElementById('tax-simulation-result').innerHTML = `
            <p>Masukkan parameter di sebelah kiri untuk melihat hasil simulasi.</p>
        `;
    }

    function calculateTax(event) {
        event.preventDefault();
        const emisi = parseFloat(document.getElementById('emission-input').value);
        const taxRate = parseFloat(document.getElementById('tax-rate-input').value);
        const industry = document.getElementById('industry-type').value;
        
        const resultDiv = document.getElementById('tax-simulation-result');

        if (isNaN(emisi) || isNaN(taxRate) || emisi < 0 || taxRate < 0) {
            resultDiv.innerHTML = `<p class="text-carbon-red font-bold">Kesalahan: Masukkan nilai Emisi dan Tarif Pajak yang valid (angka non-negatif).</p>`;
            return;
        }

        // Formula Sederhana: Pajak = Emisi * Harga
        const totalTax = emisi * taxRate;
        
        resultDiv.innerHTML = `
            <h4 class="text-xl font-semibold mb-2">Simulasi untuk Sektor ${industry}</h4>
            <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <p class="text-lg text-gray-700 dark:text-gray-300">Total Emisi Dihitung: <span class="font-bold">${formatNumber(emisi)} Ton CO₂</span></p>
                <p class="text-lg text-gray-700 dark:text-gray-300">Tarif Pajak Diterapkan: <span class="font-bold">${formatRupiah(taxRate)}/Ton</span></p>
                <div class="mt-4 border-t pt-4 border-gray-300 dark:border-gray-600">
                    <p class="text-2xl font-bold text-gray-700 dark:text-gray-300">PAJAK KARBON TERUTANG:</p>
                    <p class="text-5xl font-extrabold text-carbon-red mt-1">${formatRupiah(totalTax)}</p>
                </div>
            </div>
            <p class="mt-4 text-sm text-gray-500">Simulasi ini berdasarkan formula dasar (Emisi x Tarif) dan tidak memperhitungkan mekanisme offset atau batas emisi spesifik industri.</p>
        `;
    }

    // ==========================================================
// 8. RENDER HALAMAN ANALISIS KLASTER ML (BARU)
// ==========================================================

function renderClusterPage() {
    renderClusterDescriptionCards();
    renderClusterRegionTable('all'); // Tampilkan semua secara default
    renderClusterCentroidChart();

    const select = document.getElementById('cluster-select');
    // Hapus listener lama sebelum menambahkan yang baru
    select.onchange = null;
    select.addEventListener('change', (e) => renderClusterRegionTable(e.target.value));
    
    updateChartColors();
}

function renderClusterDescriptionCards() {
    const container = document.getElementById('cluster-description-cards');
    container.innerHTML = '';
    
    Object.keys(CentroidData).forEach(key => {
        const data = CentroidData[key];
        const cardColor = data.color;
        
        const cardHTML = `
            <div class="p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-md transition duration-300 hover:shadow-lg" style="border-left: 5px solid ${cardColor};">
                <h4 class="text-lg font-bold mb-2" style="color: ${cardColor};">${data.name}</h4>
                <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">${data.description}</p>
                <div class="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <p>Valuasi Karbon (Rata-rata): <span class="font-semibold">${formatNumber(data.values.ekonomi_karbon)}</span></p>
                    <p>IPM (Rata-rata): <span class="font-semibold">${formatNumber(data.values.ipm)}</span></p>
                    <p>PDRB (Rata-rata): <span class="font-semibold">${formatNumber(data.values.pdrb)}</span></p>
                    <p>TPAK (Rata-rata): <span calss="font-semibold">${formatNumber(data.values.tpak)}</span></p>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

function renderClusterRegionTable(clusterId) {
    const tableContainer = document.getElementById('cluster-region-table');
    const regionCountSpan = document.getElementById('region-count');
    
    let filteredData;
    if (clusterId === 'all') {
        filteredData = KlasterData;
    } else {
        filteredData = KlasterData.filter(r => r.cluster_id == clusterId);
    }
    
    regionCountSpan.textContent = `Total: ${filteredData.length} Region`;

    let tableHTML = `<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Region</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Klaster ID</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Valuasi Karbon (Milliar Rupiah)</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">IPM</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">PDRB</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">TPAK</th>
            </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">`;

    filteredData.forEach(r => {
        const clusterColor = CentroidData[r.cluster_id].color;
        tableHTML += `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-semibold text-carbon-dark dark:text-white">${r.region_name}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-right">
                    <span class="inline-block px-3 py-1 text-xs font-bold rounded-full text-white" style="background-color: ${clusterColor};">
                        C${r.cluster_id}
                    </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">${formatNumber(r.carbon_valuation)}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">${formatNumber(r.ipm)}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">${formatNumber(r.pdrb)}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">${formatNumber(r.tpak)}</td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    tableContainer.innerHTML = tableHTML;
}

function renderClusterCentroidChart() {
    destroyChart('cluster-centroid-chart');
    const ctx = document.getElementById('cluster-centroid-chart').getContext('2d');
    
    // Normalisasi data Centroid untuk grafik Radar
    const labels = ['Valuasi Karbon', 'IPM', 'PDRB', 'TPAK'];
    const clusterKeys = Object.keys(CentroidData);
    
    // Mendapatkan nilai maksimum untuk normalisasi (agar grafik radar tidak terlalu kecil)
    const maxValues = {
        ekonomi_karbon: Math.max(...clusterKeys.map(k => CentroidData[k].values.ekonomi_karbon)),
        ipm: Math.max(...clusterKeys.map(k => CentroidData[k].values.ipm)),
        pdrb: Math.max(...clusterKeys.map(k => CentroidData[k].values.pdrb)),
        tpak: Math.max(...clusterKeys.map(k => CentroidData[k].values.tpak))
    };

    const datasets = clusterKeys.map(key => {
        const data = CentroidData[key].values;
        return {
            label: CentroidData[key].name,
            data: [
                // Normalisasi nilai relatif terhadap maksimum
                (data.ekonomi_karbon / maxValues.ekonomi_karbon) * 100,
                (data.ipm / maxValues.ipm) * 100,
                (data.pdrb / maxValues.pdrb) * 100,
                (data.tpak / maxValues.tpak) * 100
            ],
            backgroundColor: CentroidData[key].color + '40', // Transparan
            borderColor: CentroidData[key].color,
            borderWidth: 2,
            pointBackgroundColor: CentroidData[key].color,
            pointBorderColor: '#fff'
        };
    });

    new Chart(ctx, {
        type: 'radar',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            },
            scales: {
                r: {
                    angleLines: { color: 'rgba(150, 150, 150, 0.5)' },
                    grid: { color: 'rgba(150, 150, 150, 0.5)' },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    pointLabels: {
                        font: { size: 14 }
                    },
                    ticks: {
                        display: false // Sembunyikan label skala nilai (0, 20, 40, ...)
                    }
                }
            }
        }
    });
}

    // ==========================================================
    // 8. LOGIKA EXPORT DATA (CSV)
    // ==========================================================
    function exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            console.warn("Tidak ada data untuk diexport.");
            return;
        }

        const headers = Object.keys(data[0]);
        let csvContent = headers.join(";") + "\n"; // Gunakan semicolon sebagai delimiter

        data.forEach(row => {
            const values = headers.map(header => {
                let value = row[header];
                if (typeof value === 'object' && value !== null) {
                    // Serialisasi objek/array nested (contoh: sector_breakdown)
                    value = JSON.stringify(value).replace(/"/g, '""'); // Escaping quotes
                    value = `"${value}"`;
                } else if (typeof value === 'string' && value.includes(',')) {
                    value = `"${value}"`;
                }
                return value;
            });
            csvContent += values.join(";") + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    document.getElementById('export-data').addEventListener('click', () => {
        exportToCSV(provinceData, 'data_pajak_karbon_provinsi.csv');
        console.log("Data Provinsi berhasil diexport.");
    });


    // ==========================================================
    // 9. INITIALISASI DASHBOARD
    // ==========================================================
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    } else {
        // Fallback jika tidak ada halaman login (misalnya untuk pengujian langsung)
        initializeTheme();
        switchPage('page-dashboard-nasional');
    }
});
