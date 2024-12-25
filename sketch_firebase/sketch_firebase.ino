#include <WiFi.h>
#include <FirebaseESP32.h>
#include "DHT.h"

#define FIREBASE_HOST "https://realtimeesp32-c811b-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH ""
#define WIFI_SSID "Ss1"
#define WIFI_PASSWORD "asdqwezxc"

#define DHTPIN 4  // Pin untuk sensor DHT22
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);
FirebaseData firebaseData;

void setup() {
    Serial.begin(9600);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to Wi-Fi");
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(1000);
    }
    Serial.println("Connected");

    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
    Firebase.reconnectWiFi(true);

    dht.begin();
}

void loop() {
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    if (isnan(temperature) || isnan(humidity)) {
        Serial.println("Failed to read from DHT sensor!");
        return;
    }

    if (Firebase.pushFloat(firebaseData, "/temperature", temperature)) {
        Serial.println("Temperature sent");
    } else {
        Serial.println("Failed to send temperature");
    }

    if (Firebase.pushFloat(firebaseData, "/humidity", humidity)) {
        Serial.println("Humidity sent");
    } else {
        Serial.println("Failed to send humidity");
    }

    delay(2000);  // Kirim data setiap 2 detik
}
