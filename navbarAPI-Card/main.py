from microdot import Microdot, Response, send_file
import requests
import random

app = Microdot()
Response.default_content_type = 'application/json'

# API Cuaca dari OpenWeather
API_KEY = "bd472ce43fd35be91ff07757957ad714"
CITY = "Malang"
WEATHER_URL = f"https://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API_KEY}&units=metric"

# data mesin random 1
@app.route('/sensor/data')
def get_sensor_data(request):
    data = {
        "temp": round(random.uniform(20, 35), 1),  # Suhu dalam °C
        "humidity": round(random.uniform(40, 90), 1),  # Kelembaban dalam %
        "air_pressure": round(random.uniform(980, 1050), 1),  # Tekanan dalam hPa
        "altitude": round(random.uniform(0, 500), 1),  # Ketinggian dalam meter

        "temp2": round(random.uniform(20, 35), 1),  # Suhu dalam °C
        "humidity2": round(random.uniform(40, 90), 1),  # Kelembaban dalam %
        "air_pressure2": round(random.uniform(980, 1050), 1),  # Tekanan dalam hPa
        "altitude2": round(random.uniform(0, 500), 1)  # Ketinggian dalam meter
    }
    return data

@app.route('/')
def index(request):
    return send_file('templates/index.html')  # Pastikan file index.html ada di folder templates

@app.route('/static/<path:path>')
def static_files(request, path):
    return send_file('static/' + path)  # Agar bisa akses CSS & JS

@app.route('/api/weather')
def get_weather(request):
    try:
        response = requests.get(WEATHER_URL)
        data = response.json()

        weather_data = {
            "city": data.get("name"),
            "temperature": data["main"].get("temp"),
            "humidity": data["main"].get("humidity"),
            "wind_speed": data["wind"].get("speed"),
            "description": data["weather"][0].get("description")
        }
        return weather_data

    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == '__main__':
    app.run(host='127.0.0.2', port=5001, debug=True)
