import requests
import pandas as pd
import matplotlib.pyplot as plt

# Endpoint REST API
url = "http://localhost:3000/api/sensor-dht22"

try:
    # Fetch data dari API
    response = requests.get(url)
    response.raise_for_status()  # Cek error HTTP

    # Parse data JSON ke DataFrame
    data = response.json()
    df = pd.DataFrame(data)
    
    # Hapus kolom id_Dht22
    if 'ID_dht22' in df.columns:
        df = df.drop(columns=['ID_dht22'])
    
    # Konversi kolom timestamp ke datetime dan format ulang
    df['timestamp'] = pd.to_datetime(df['timestamp']).dt.strftime('%Y-%m-%d')
    
    print("Data berhasil diambil:")
    print(df)

except requests.exceptions.RequestException as e:
    print(f"Error saat mengambil data: {e}")

# Statistik dasar
print("informasi statistika dasar:")
print(df.describe())

# Plot suhu dan kelembapan
plt.figure(figsize=(10, 8))
plt.plot(df['timestamp'], df['temp'], label='Temperature (°C)', color='red')
plt.plot(df['timestamp'], df['humid'], label='Humidity (%)', color='blue')

# Tambahkan detail grafik
plt.title('Temperature and Humidity Trends')
plt.xlabel('Date')
plt.ylabel('Values')
plt.legend()
plt.grid()
plt.show()

# Tambahkan moving average
df['temp_moving_avg'] = df['temp'].rolling(window=3).mean()
df['humid_moving_avg'] = df['humid'].rolling(window=3).mean()

print("avg moving data temp")
print(df['temp_moving_avg'])

print("avg moving data humid")
print(df['temp_moving_avg'])


# Prediksi nilai berikutnya
next_temp = df['temp_moving_avg'].iloc[-1]
next_humid = df['humid_moving_avg'].iloc[-1]



print("nilai prediksi berdasarkan moving avarage")
print(f"Prediksi suhu berikutnya: {next_temp:.2f}°C")
print(f"Prediksi kelembapan berikutnya: {next_humid:.2f}%")

# Validasi status API
response = requests.get(url, timeout=5)

if response.status_code == 200:
    print("Data berhasil diambil")
else:
    print(f"Error: {response.status_code}")
