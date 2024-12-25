#include <WiFi.h>
#include <HTTPClient.h>
#include <WebSocketsClient.h>

// Konfigurasi WiFi
const char* ssid = "Ss1";
const char* password = "asdqwezxc";

// Konfigurasi REST API
const char* serverUrl = "http://192.168.201.102:3000/api/ldr"; // URL REST API

// Konfigurasi WebSocket
WebSocketsClient webSocket;
const char* webSocketHost = "192.168.201.102"; // IP server Anda
const uint16_t webSocketPort = 3000;             // Port server
const char* webSocketPath = "/ws";             // Path endpoint WebSocket

// Konfigurasi LDR
#define LDRPin 25
#define LEDPin 12
int kecerahan = 0;

// Timer untuk pengiriman ke REST API
unsigned long lastApiSendTime = 0;
const unsigned long apiInterval = 300000; // 5 menit dalam milidetik

void setup() {
  Serial.begin(9600);

  // Inisialisasi LDR dan LED
  pinMode(LDRPin, INPUT);
  pinMode(LEDPin, OUTPUT);

  // Hubungkan ke WiFi
  Serial.print("Menghubungkan ke WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nWiFi terhubung!");

  // Inisialisasi WebSocket
  webSocket.begin(webSocketHost, webSocketPort, webSocketPath);
  webSocket.onEvent(webSocketEvent);
  Serial.println("WebSocket diinisialisasi!");
}

void loop() {
  // Membaca kecerahan dari LDR
  kecerahan = analogRead(LDRPin);

  // Deskripsi tingkat kecerahan
  String keteranganCahaya = getKeteranganCahaya(kecerahan);

  // Tampilkan data ke Serial Monitor
  Serial.print("Kecerahan: ");
  Serial.print(kecerahan);
  Serial.print(" (");
  Serial.print(keteranganCahaya);
  Serial.println(")");

  // Gunakan LED sebagai indikator
  if (kecerahan >= 3000) {
    digitalWrite(LEDPin, HIGH);
  } else {
    digitalWrite(LEDPin, LOW);
  }

  // Kirim data ke WebSocket untuk real-time monitoring
  sendDataToWebSocket(kecerahan, keteranganCahaya);

  // Kirim data ke REST API setiap 5 menit sekali
  if (millis() - lastApiSendTime >= apiInterval) {
    lastApiSendTime = millis();
    sendDataToRestApi(kecerahan, keteranganCahaya);
  }

  webSocket.loop(); // WebSocket handler
  delay(1000); // Delay 1 detik
}

// Fungsi untuk mendapatkan deskripsi tingkat kecerahan
String getKeteranganCahaya(int kecerahan) {
  if (kecerahan >= 3000) {
    return "Gelap";
  } else if (kecerahan >= 1000 && kecerahan < 3000) {
    return "Terang";
  } else {
    return "Sangat Terang";
  }
}

// Fungsi untuk mengirim data ke REST API
void sendDataToRestApi(int kecerahan, String keteranganCahaya) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);

    // Data JSON untuk dikirim
    String jsonData = "{\"kecerahan\": " + String(kecerahan) + ", \"keterangan\": \"" + keteranganCahaya + "\"}";
    http.addHeader("Content-Type", "application/json");

    // Kirim data POST
    int httpResponseCode = http.POST(jsonData);
    if (httpResponseCode > 0) {
      Serial.println("Data terkirim ke REST API!");
    } else {
      Serial.print("Gagal mengirim data ke REST API. Kode: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi tidak terhubung!");
  }
}

// Fungsi untuk mengirim data ke WebSocket
void sendDataToWebSocket(int kecerahan, String keteranganCahaya) {
  if (webSocket.isConnected()) {
    String jsonData = "{\"kecerahan\": " + String(kecerahan) + ", \"keterangan\": \"" + keteranganCahaya + "\"}";
    webSocket.sendTXT(jsonData);
  } else {
    Serial.println("WebSocket belum terhubung!");
  }
}

// Event handler untuk WebSocket
void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("WebSocket terputus.");
      break;
    case WStype_CONNECTED:
      Serial.println("WebSocket terhubung!");
      break;
    case WStype_TEXT:
      Serial.printf("Pesan WebSocket: %s\n", payload);
      break;
  }
}
