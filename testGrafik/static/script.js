document.addEventListener("DOMContentLoaded", function () {
    fetchWeather();
    fetchSensorData();
    fetchInventory();
    fetchMachineData();
});

// API Cuaca
async function fetchWeather() {
    try {
        const response = await fetch('/api/weather');
        const data = await response.json();
        console.log("Data cuaca diterima:", data);

        if (data.error) throw new Error(data.error);

        let weatherIconClass = "bi bi-question-circle";
        if (data.description.includes("clear")) weatherIconClass = "bi bi-sun";
        else if (data.description.includes("cloud")) weatherIconClass = "bi bi-cloud-fill";
        else if (data.description.includes("rain")) weatherIconClass = "bi bi-cloud-rain";
        else if (data.description.includes("thunderstorm")) weatherIconClass = "bi bi-cloud-lightning-rain";
        else if (data.description.includes("snow")) weatherIconClass = "bi bi-snow";

        document.getElementById('city').textContent = data.city;
        document.getElementById('weather-desc').textContent = data.description;
        document.getElementById('temperature').textContent = data.temperature;
        document.getElementById('wind-speed').textContent = data.wind_speed;
        document.getElementById('weather-icon').className = weatherIconClass;
    } catch (error) {
        console.error('Gagal mengambil data cuaca:', error);
        document.getElementById('weather-info').innerHTML = `<i class="bi bi-exclamation-triangle"></i> Cuaca tidak tersedia`;
    }
}
setInterval(fetchWeather, 10000);

// Data Sensor
function fetchSensorData() {
    fetch('/sensor/data')
        .then(response => response.json())
        .then(data => {
            document.getElementById("temp").textContent = data.temp;
            document.getElementById("humidity").textContent = data.humidity;
            document.getElementById("air_pressure").textContent = data.air_pressure;
            document.getElementById("altitude").textContent = data.altitude;

            document.getElementById("temp2").textContent = data.temp2;
            document.getElementById("humidity2").textContent = data.humidity2;
            document.getElementById("air_pressure2").textContent = data.air_pressure2;
            document.getElementById("altitude2").textContent = data.altitude2;
        })
        .catch(error => console.error('Error fetching sensor data:', error));
}
setInterval(fetchSensorData, 5000);

// Grafik Mesin 1 & 2
const ctxMesin1 = document.getElementById("chartMesin1").getContext("2d");
const ctxMesin2 = document.getElementById("chartMesin2").getContext("2d");

let chartMesin1 = new Chart(ctxMesin1, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            { label: "Suhu (°C)", data: [], borderColor: "red", fill: false },
            { label: "Kelembapan (%)", data: [], borderColor: "blue", fill: false },
            { label: "Tekanan (hPa)", data: [], borderColor: "green", fill: false },
            { label: "Ketinggian (m)", data: [], borderColor: "purple", fill: false }
        ]
    },
    options: { responsive: true }
});

let chartMesin2 = new Chart(ctxMesin2, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            { label: "Suhu (°C)", data: [], borderColor: "red", fill: false },
            { label: "Kelembapan (%)", data: [], borderColor: "blue", fill: false },
            { label: "Tekanan (hPa)", data: [], borderColor: "green", fill: false },
            { label: "Ketinggian (m)", data: [], borderColor: "purple", fill: false }
        ]
    },
    options: { responsive: true }
});

function updateGraph() {
    fetch("/sensor/data")
        .then(response => response.json())
        .then(data => {
            const time = new Date().toLocaleTimeString();

            chartMesin1.data.labels.push(time);
            chartMesin1.data.datasets[0].data.push(data.temp);
            chartMesin1.data.datasets[1].data.push(data.humidity);
            chartMesin1.data.datasets[2].data.push(data.air_pressure);
            chartMesin1.data.datasets[3].data.push(data.altitude);

            chartMesin2.data.labels.push(time);
            chartMesin2.data.datasets[0].data.push(data.temp2);
            chartMesin2.data.datasets[1].data.push(data.humidity2);
            chartMesin2.data.datasets[2].data.push(data.air_pressure2);
            chartMesin2.data.datasets[3].data.push(data.altitude2);

            if (chartMesin1.data.labels.length > 10) {
                chartMesin1.data.labels.shift();
                chartMesin1.data.datasets.forEach(dataset => dataset.data.shift());
            }
            if (chartMesin2.data.labels.length > 10) {
                chartMesin2.data.labels.shift();
                chartMesin2.data.datasets.forEach(dataset => dataset.data.shift());
            }

            chartMesin1.update();
            chartMesin2.update();
        })
        .catch(error => console.error("Error fetching sensor data:", error));
}
setInterval(updateGraph, 5000);

// Data Mesin
async function fetchMachineData() {
    try {
        const response = await fetch('/api/machine_data');
        const data = await response.json();

        const currentTime = new Date().toLocaleTimeString();

        chartMesin1.data.labels.push(currentTime);
        chartMesin1.data.datasets[0].data.push(data.mesin1);
        if (chartMesin1.data.labels.length > 10) {
            chartMesin1.data.labels.shift();
            chartMesin1.data.datasets[0].data.shift();
        }
        chartMesin1.update();

        chartMesin2.data.labels.push(currentTime);
        chartMesin2.data.datasets[0].data.push(data.mesin2);
        if (chartMesin2.data.labels.length > 10) {
            chartMesin2.data.labels.shift();
            chartMesin2.data.datasets[0].data.shift();
        }
        chartMesin2.update();
    } catch (error) {
        console.error("❌ Gagal mengambil data mesin:", error);
    }
}
setInterval(fetchMachineData, 5000);

// Data Inventaris
async function fetchInventory() {
    try {
        const response = await fetch('/api/inventory');
        const data = await response.json();

        const inventoryList = document.getElementById("inventory-list");
        inventoryList.innerHTML = "";

        data.forEach(item => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `📦 ${item.nama}: <strong>${item.jumlah}</strong>`;
            inventoryList.appendChild(listItem);
        });

    } catch (error) {
        console.error("❌ Error:", error);
    }
}
setInterval(fetchInventory, 10000);