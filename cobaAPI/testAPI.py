#mengambil cuaca berdasarkan titik koordinat
from microdot import Microdot, send_file
import requests

app = Microdot()

API_KEY = "afa79ffd71888465344a0e3d51cdd059"

@app.route("/")
def index(request):
    return send_file("templates/index.html")

@app.route("/weather/<lat>/<lon>")
def weather(request, lat, lon):
    URL = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    response = requests.get(URL)
    data = response.json()

    if response.status_code == 200 and "main" in data:
        weather_data = {
            "Kota": data.get("name", "Unknown"),
            "Negara": data["sys"].get("country", "Unknown"),
            "Deskripsi Cuaca": data["weather"][0].get("description", "").capitalize(),
            "Suhu": f"{data['main'].get('temp', 'N/A')}°C",
            "Kelembapan": f"{data['main'].get('humidity', 'N/A')}%",
            "Kecepatan Angin": f"{data['wind'].get('speed', 'N/A')} m/s"
        }
        return weather_data
    else:
        return {"error": "Gagal mengambil data cuaca"}, 500

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5001, debug=True)


# #prakiraan cuaca
# from microdot import Microdot, send_file
# import requests
#
# app = Microdot()
#
# API_KEY = "afa79ffd71888465344a0e3d51cdd059"
# CITY = "Malang"
#
# @app.route("/")
# def index(request):
#     return send_file("templates/index.html")
#
# @app.route("/forecast")
# def forecast(request):
#     URL_FORECAST = f"https://api.openweathermap.org/data/2.5/forecast?q={CITY}&appid={API_KEY}&units=metric"
#     response = requests.get(URL_FORECAST)
#     data = response.json()
#
#     if response.status_code == 200 and "list" in data:
#         forecast_list = []
#         for item in data["list"][:5]:  # Ambil 5 data prakiraan pertama
#             forecast_list.append({
#                 "Waktu": item["dt_txt"],
#                 "Suhu": f"{item['main']['temp']}°C",
#                 "Cuaca": item["weather"][0]["description"].capitalize()
#             })
#
#         return {"forecast": forecast_list}
#     else:
#         return {"error": "Gagal mengambil data prakiraan cuaca"}, 500
#
# if __name__ == "__main__":
#     app.run(host='127.0.0.1', port=5001, debug=True)



# #cuaca saat ini
# from microdot import Microdot, send_file
# import requests
#
# app = Microdot()
#
# API_KEY = "afa79ffd71888465344a0e3d51cdd059" #masukkan sesuai API Key kita
# CITY = "Malang" #masukkan sesuai kota yang kita inginkan
#
# @app.route("/")
# def index(request):
#     return send_file("templates/index.html")
#
# @app.route("/weather")
# def weather(request):
#     URL = f"https://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API_KEY}&units=metric"
#     response = requests.get(URL)
#     data = response.json()
#
#     if response.status_code == 200 and "main" in data:
#         weather_data = {
#             "Kota": data.get("name", "Unknown"),
#             "Negara": data["sys"].get("country", "Unknown"),
#             "Deskripsi Cuaca": data["weather"][0].get("description", "").capitalize(),
#             "Suhu": f"{data['main'].get('temp', 'N/A')}°C",
#             "Kelembapan": f"{data['main'].get('humidity', 'N/A')}%",
#             "Kecepatan Angin": f"{data['wind'].get('speed', 'N/A')} m/s"
#         }
#         return weather_data
#     else:
#         return {"error": "Gagal mengambil data cuaca"}, 500
#
# if __name__ == "__main__":
#     app.run(host='127.0.0.1', port=5001, debug=True)

# import requests
#
# API_KEY = "afa79ffd71888465344a0e3d51cdd059"
# #masukkan nilai sesuai API key kita
#
# CITY = "Malang"
# #masukkan inputan kota yang kita inginkan
#
# URL = f"https://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API_KEY}&units=metric"
#
# response = requests.get(URL)
# data = response.json()
#
# print(data)
# #Menampilkan data cuaca dalam format JSON