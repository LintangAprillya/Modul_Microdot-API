document.addEventListener("DOMContentLoaded", function () {
    // ====== CHART.JS GRAFIK SENSOR ======
    const ctx = document.getElementById('sensorChart').getContext('2d');
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Kelembapan Tanah (%)',
                data: [],
                borderColor: 'blue',
                fill: false
            }, {
                label: 'pH Tanah',
                data: [],
                borderColor: 'green',
                fill: false
            }, {
                label: 'Curah Hujan (mm)',
                data: [],
                borderColor: 'purple',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // ====== UPDATE DATA SENSOR ======
    function updateData() {
        fetch('/data')
            .then(response => response.json())
            .then(data => {
                document.getElementById('soil-moisture').innerText = data.soil_moisture + ' %';
                document.getElementById('ph-level').innerText = data.ph_level;
                document.getElementById('rainfall').innerText = data.rainfall + ' mm';
                document.getElementById('wind-speed').innerText = data.wind_speed + ' km/h';

                // Update Grafik
                let time = new Date().toLocaleTimeString();
                chart.data.labels.push(time);
                chart.data.datasets[0].data.push(data.soil_moisture);
                chart.data.datasets[1].data.push(data.ph_level);
                chart.data.datasets[2].data.push(data.rainfall);

                if (chart.data.labels.length > 10) {
                    chart.data.labels.shift();
                    chart.data.datasets.forEach(dataset => dataset.data.shift());
                }

                chart.update();

                // Update Water Level
                updateWaterLevel(data.water_level);
                updateWaterTank(data.water_tank);
            });
    }

    updateData();
    setInterval(updateData, 5000);

    // ====== WATER LEVEL ANIMATION ======
    function updateWaterLevel(level) {
        let water = document.querySelector('.water');
        let text = document.querySelector('.water-text');
        if (water && text) {
            water.style.height = level + "%";
            text.innerText = level + "%";
        }
    }

    // ====== WATER TANK GAUGE ======
    const gaugeCanvas = document.getElementById("waterTankGauge");

    if (gaugeCanvas) {
        const gaugeCtx = gaugeCanvas.getContext("2d");

        const centerText = {
            id: 'centerTextPlugin',
            beforeDraw(chart) {
                const { width, height, ctx } = chart;
                ctx.save();
                ctx.font = "bold 20px Poppins";
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                const text = chart.data.datasets[0].data[0] + "%";
                const centerX = width / 2;
                const centerY = height / 2;

                ctx.fillText(text, centerX, centerY);
                ctx.restore();
            }
        };

        Chart.register(centerText);

        let gaugeChart = new Chart(gaugeCtx, {
            type: "doughnut",
            data: {
                labels: ["Air", "Kosong"],
                datasets: [{
                    data: [65, 35], // Data awal
                    backgroundColor: ["blue", "lightgray"],
                    borderWidth: 0
                }]
            },
            options: {
                cutout: "80%",
                responsive: true
            }
        });

        let currentTankLevel = 65; // Simpan nilai terakhir

        function updateWaterTank(level) {
            level = Math.max(0, Math.min(level, 100)); // Pastikan dalam rentang 0-100
            gaugeChart.data.datasets[0].data = [level, 100 - level];
            gaugeChart.update();
        }

        function refreshWaterTank() {
            let newLevel = Math.floor(Math.random() * 100); // Ambil nilai baru

            // Tampilkan nilai lama selama 5 detik sebelum diganti
            setTimeout(() => {
                updateWaterTank(newLevel); // Perbarui gauge setelah 5 detik
                currentTankLevel = newLevel; // Simpan nilai baru
            }, 5000);
        }

        // Jalankan update pertama kali
        refreshWaterTank();

        // Perbarui setiap 5 detik
        setInterval(refreshWaterTank, 5000);
    } else {
        console.error("Canvas untuk Water Tank tidak ditemukan.");
    }

// ====== GOOGLE MAPS ======
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log("🔵 Lokasi GPS:", userLocation);
                loadMap(userLocation);
            },
            function (error) {
                console.warn("⚠️ Geolocation gagal:", error.message);
                fetchLocationFromAPI(); // Coba ambil lokasi dari API
            },
            { enableHighAccuracy: true, timeout: 10000 } // Meningkatkan akurasi
        );
    } else {
        console.warn("🚨 Browser tidak mendukung Geolocation");
        fetchLocationFromAPI();
    }
}

// Ambil lokasi dari API jika Geolocation gagal
function fetchLocationFromAPI() {
    fetch("https://ipapi.co/json/")
        .then(response => response.json())
        .then(data => {
            let apiLocation = {
                lat: data.latitude,
                lng: data.longitude
            };
            console.log("🟡 Lokasi API (IP-Based):", apiLocation);
            loadMap(apiLocation);
        })
        .catch(error => {
            console.error("❌ Gagal mendapatkan lokasi dari API:", error);
            handleLocationError();
        });
}

// Buat peta berdasarkan lokasi yang diperoleh
function loadMap(location) {
    let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: location
    });

    new google.maps.Marker({
        position: location,
        map: map,
        title: "Lokasi Anda"
    });
}



    // ====== SLIDER INTERAKTIF ======
    const sliders = [
        { id: "water-level-slider", valueId: "water-level-value" },
        { id: "dew-point-slider", valueId: "dew-point-value" },
        { id: "co-slider", valueId: "co-value" },
        { id: "humidity-slider", valueId: "humidity-value" },
        { id: "temp-slider", valueId: "temp-value" },
        { id: "water-tank-slider", valueId: "water-tank-value" },
        { id: "sprinklers-slider", valueId: "sprinklers-value" }
    ];

    sliders.forEach(slider => {
        let input = document.getElementById(slider.id);
        let value = document.getElementById(slider.valueId);

        input.addEventListener("input", function () {
            value.textContent = input.value;
        });
    });
});
