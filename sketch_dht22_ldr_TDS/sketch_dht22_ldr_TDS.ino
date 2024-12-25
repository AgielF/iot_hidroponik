#include <WiFi.h>
#include <HTTPClient.h>
#include <WebSocketsClient.h>
#include <DHT.h>

// Konfigurasi WiFi
const char* ssid = "Ss1";
const char* password = "asdqwezxc";

// Endpoint REST API
const char* dht22Endpoint = "http://192.168.201.102:3000/api/sensor-dht22";
const char* ecEndpoint = "http://192.168.201.102:3000/api/sensor-ec";
const char* ldrEndpoint = "http://192.168.201.102:3000/api/sensor-ldr";

// Konfigurasi Sensor DHT22
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Konfigurasi Sensor LDR
#define LDRPIN 25  // Pin analog untuk LDR

// Konfigurasi Sensor TDS
#define TDSPIN 26  // Pin analog untuk TDS
const float VREF = 3.3;    // Tegangan referensi ESP32
const int ADC_RES = 4095;  // Resolusi ADC ESP32
const float TDS_FACTOR = 0.5; // Faktor kalibrasi TDS

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("WiFi connected.");

  dht.begin();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    float suhu = dht.readTemperature();
    float kelembaban = dht.readHumidity();
    int ldrValue = analogRead(LDRPIN);
    int tdsValue = analogRead(TDSPIN);
    float voltage = (tdsValue * VREF) / ADC_RES;
    float tds = (voltage * 1000) / TDS_FACTOR;

    sendDHT22Data(suhu, kelembaban);
    sendECData(tds);
    sendLDRData(ldrValue);
  } else {
    Serial.println("WiFi not connected.");
  }

  delay(10000); // Kirim data setiap 10 detik
}

void sendDHT22Data(float suhu, float kelembaban) {
  if (!isnan(suhu) && !isnan(kelembaban)) {
    HTTPClient http;
    http.begin(dht22Endpoint);
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"suhu\":" + String(suhu, 2) + ",\"kelembaban\":" + String(kelembaban, 2) + "}";
    int httpResponseCode = http.POST(payload);
    Serial.print("POST Response Code DHT22: ");
    Serial.println(httpResponseCode);

    http.end();
  } else {
    Serial.println("Failed to read from DHT22 sensor.");
  }
}

void sendECData(float tdsValue) {
  HTTPClient http;
  http.begin(ecEndpoint);
  http.addHeader("Content-Type", "application/json");

  String payload = "{\"tdsValue\":" + String(tdsValue, 2) + "}";
  int httpResponseCode = http.POST(payload);
  Serial.print("POST Response Code TDS: ");
  Serial.println(httpResponseCode);

  http.end();
}

void sendLDRData(int ldrValue) {
  HTTPClient http;
  http.begin(ldrEndpoint);
  http.addHeader("Content-Type", "application/json");

  String payload = "{\"ldrValue\":" + String(ldrValue) + "}";
  int httpResponseCode = http.POST(payload);
  Serial.print("POST Response Code LDR: ");
  Serial.println(httpResponseCode);

  http.end();
}
