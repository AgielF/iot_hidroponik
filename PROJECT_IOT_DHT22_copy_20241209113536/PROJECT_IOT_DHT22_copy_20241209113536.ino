#include <WiFi.h>
#include <HTTPClient.h>
#include <WebSocketsClient.h>
#include <DHT.h>

// Konfigurasi WiFi
const char* ssid = "Ss1";
const char* password = "asdqwezxc";

// Konfigurasi DHT22
#define DHTPIN 32
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Endpoint REST API
const char* dht22Endpoint = "http://192.168.201.102:3000/api/sensor-dht22";
const char* ecEndpoint = "http://192.168.201.102:3000/api/sensor-ec";
const char* ldrEndpoint = "http://192.168.201.102:3000/api/sensor-ldr";

// WebSocket
WebSocketsClient webSocket;

// Konfigurasi TDS Sensor
#define TdsSensorPin 35         // Pin sensor TDS
#define VREF 3.3                // Tegangan referensi ADC (Volt)
#define SCOUNT 30               // Jumlah sampel
uint16_t analogBuffer[SCOUNT];  // Array nilai ADC
uint16_t analogBufferTemp[SCOUNT];
uint8_t analogBufferIndex = 0;

// Konfigurasi LDR
#define LDRPin 34              // Pin sensor LDR
int kecerahan = 0;             // Nilai kecerahan dari LDR

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(TdsSensorPin, INPUT);
  pinMode(LDRPin, INPUT);

  // Sambungkan ke WiFi
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  // Inisialisasi WebSocket
  webSocket.begin("192.168.201.102", 3000, "/");
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  static unsigned long lastRestSend = 0;
  static unsigned long lastWebSocketSend = 0;

  // Kirim data ke REST API setiap 5 menit
  if (millis() - lastRestSend >= 300000) { // 5 menit = 300000 ms
    lastRestSend = millis();
    if (WiFi.status() == WL_CONNECTED) {
      sendSensorDataToRest();
    } else {
      Serial.println("WiFi disconnected, reconnecting...");
      WiFi.begin(ssid, password);
    }
  }

  // Kirim data ke WebSocket setiap 10 detik
  if (millis() - lastWebSocketSend >= 10000) { // 10 detik
    lastWebSocketSend = millis();
    sendSensorDataToWebSocket();
  }
  // Membaca kecerahan dari LDR
  kecerahan = analogRead(LDRPin);
  Serial.print(kecerahan);
  Serial.print(" (");

  // WebSocket loop
  webSocket.loop();
}





//beberapa func yg digunakan diatas
void sendSensorDataToRest() {
  float suhu = dht.readTemperature();
  float kelembaban = dht.readHumidity();
  int ldrValue = analogRead(LDRPin); // Membaca data LDR
  float tdsValue = readTdsValue(suhu); // Membaca data TDS

  if (isnan(suhu) || isnan(kelembaban)) {
    Serial.println("Failed to read from DHT22 sensor!");
    return;
  }

  HTTPClient http;

  // Kirim data ke REST API untuk DHT22
  http.begin(dht22Endpoint);
  http.addHeader("Content-Type", "application/json");
  String payload = "{\"suhu\":" + String(suhu) + ",\"kelembaban\":" + String(kelembaban) + "}";
  int httpResponseCode = http.POST(payload);
  Serial.print("POST Response Code DHT22: ");
  Serial.println(httpResponseCode);
  http.end();

  // Kirim data ke REST API untuk EC
  http.begin(ecEndpoint);
  http.addHeader("Content-Type", "application/json");
  payload = "{\"tdsValue\":" + String(tdsValue) + "}";
  httpResponseCode = http.POST(payload);
  Serial.print("POST Response Code TDS: ");
  Serial.println(httpResponseCode);
  http.end();

  // Kirim data ke REST API untuk LDR
  http.begin(ldrEndpoint);
  http.addHeader("Content-Type", "application/json");
  payload = "{\"ldrValue\":" + String(ldrValue) + "}";
  httpResponseCode = http.POST(payload);
  Serial.print("POST Response Code LDR: ");
  Serial.println(httpResponseCode);
  http.end();
}

void sendSensorDataToWebSocket() {
  float suhu = dht.readTemperature();
  float kelembaban = dht.readHumidity();
  int ldrValue = analogRead(LDRPin);
  float tdsValue = readTdsValue(suhu);

  if (isnan(suhu) || isnan(kelembaban)) {
    Serial.println("Failed to read from DHT22 sensor!");
    return;
  }

  String jsonPayload = "{\"suhu\":" + String(suhu) + ",\"kelembaban\":" + String(kelembaban) +
                       ",\"ldrValue\":" + String(ldrValue) + ",\"tdsValue\":" + String(tdsValue) + "}";
  webSocket.sendTXT(jsonPayload);
  Serial.print("WebSocket Sent: ");
  Serial.println(jsonPayload);
}

float readTdsValue(float suhu) {
  analogBuffer[analogBufferIndex] = analogRead(TdsSensorPin);
  analogBufferIndex = (analogBufferIndex + 1) % SCOUNT;

  for (uint8_t i = 0; i < SCOUNT; i++) {
    analogBufferTemp[i] = analogBuffer[i];
  }

  float averageVoltage = getMedianNum(analogBufferTemp, SCOUNT) * (float)VREF / 4096.0;
  float compensationCoefficient = 1.0 + 0.02 * (suhu - 25.0);
  float compensationVoltage = averageVoltage / compensationCoefficient;

  return (133.42 * compensationVoltage * compensationVoltage * compensationVoltage
          - 255.86 * compensationVoltage * compensationVoltage
          + 857.39 * compensationVoltage) * 0.5;
}

uint16_t getMedianNum(uint16_t bArray[], uint8_t iFilterLen) {
  uint16_t bTab[iFilterLen];
  for (uint8_t i = 0; i < iFilterLen; i++) {
    bTab[i] = bArray[i];
  }
  for (uint8_t j = 0; j < iFilterLen - 1; j++) {
    for (uint8_t i = 0; i < iFilterLen - j - 1; i++) {
      if (bTab[i] > bTab[i + 1]) {
        uint16_t bTemp = bTab[i];
        bTab[i] = bTab[i + 1];
        bTab[i + 1] = bTemp;
      }
    }
  }
  return (iFilterLen & 1) ? bTab[iFilterLen / 2]
                          : (bTab[iFilterLen / 2] + bTab[iFilterLen / 2 - 1]) / 2;
}

void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_CONNECTED:
      Serial.println("WebSocket Connected");
      webSocket.sendTXT("{\"message\": \"ESP32 Connected\"}");
      break;
    case WStype_DISCONNECTED:
      Serial.println("WebSocket Disconnected");
      break;
    case WStype_TEXT:
      Serial.printf("WebSocket Received: %s\n", payload);
      break;
    default:
      break;
  }
}
