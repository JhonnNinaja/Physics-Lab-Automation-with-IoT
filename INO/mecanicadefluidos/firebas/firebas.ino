#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <Wire.h>
#include <ArduinoJson.h>

#include "time.h"
#include <LiquidCrystal_I2C.h>

// Provide the token generation process info.
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// Insert your network credentials
#define WIFI_SSID "UCB"
#define WIFI_PASSWORD ""

// Insert Firebase project API Key
#define API_KEY "AIzaSyCGoJ3FfW1OuggPsJT4u8TCXW3IE2hwpUc"

// Insert Authorized Email and Corresponding Password
#define USER_EMAIL "fmechanics@gmail.com"
#define USER_PASSWORD "fmechanics75321"

// Insert RTDB URLefine the RTDB URL
#define DATABASE_URL "https://psiphilabo-default-rtdb.firebaseio.com"
#define RXp2 16
#define TXp2 17
//LCD
// if you don't know your display address, run an I2C scanner sketch
LiquidCrystal_I2C lcd(0x27, 20, 4);  
LiquidCrystal_I2C lcdmini(0x26, 16, 2);  

// Define Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Variable to save USER UID
String uid;

// Database main path (to be updated in setup with the user UID)
String databasePath;
// Database child nodes

// Parent Node (to be updated in every loop)
String parentPath;

int timestamp;
FirebaseJson json;

const char* ntpServer = "pool.ntp.org";


// Timer variables (send new readings every three minutes)
unsigned long sendDataPrevMillis = 0;
unsigned long timerDelay = 180000;


// Initialize WiFi
void initWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
  Serial.println();
}

// Function that gets current epoch time
unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    //Serial.println("Failed to obtain time");
    return(0);
  }
  time(&now);
  return now;
}
DynamicJsonDocument doc(1024);

String frecuencia1 = "/freq1";
String caudal1 = "/caud1";
String frecuencia2 = "/freq2";
String caudal2 = "/caud2";


//---------------------LCD--------------------------
void LCDinit() {
lcd.init();             // ininica LCD
lcd.backlight();        // iLUMINA EL FONDO
lcdmini.init();             // ininica LCD mini
lcdmini.backlight();        // iLUMINA EL FONDO
 
lcd.setCursor(7, 1);
lcd.print("PSIPHI ");
lcdmini.setCursor(5, 0);
lcdmini.print("PSIPHI ");
delay(5000);
lcd.clear();
lcdmini.clear();

lcd.setCursor(4,1);
lcd.print("INGENIERIA");
lcdmini.setCursor(3,0);
lcdmini.print("INGENIERIA");

lcd.setCursor(4,2);
lcd.print("MECATRONICA");
lcdmini.setCursor(3,1);
lcdmini.print("MECATRONICA");
delay(5000);
lcd.clear();
lcdmini.clear();
}

void PrintData(float data1,float data2){
lcd.setCursor(0,0);
lcd.print("FLUJOMETRO 2");
//lcd.setCursor(8,2);
//lcd.print("   ");
lcd.setCursor(4,2);
lcd.print(data1);
lcd.setCursor(13,2);
lcd.print("L/min"); 

lcdmini.setCursor(0,0);
lcdmini.print("FLUJOMETRO 1");
//lcd.setCursor(6,1);
//lcd.print("   "); 
lcdmini.setCursor(2,1);
lcdmini.print(data2);
lcdmini.setCursor(10,1);
lcdmini.print("L/min"); 
}


//---------------------LCD--------------------------
void setup(){
  LCDinit();
  Serial.begin(115200);
  Serial2.begin(115200, SERIAL_8N1, RXp2, TXp2);
  // Initialize BME280 sensor
  
  initWiFi();
  configTime(0, 0, ntpServer);

  // Assign the api key (required)
  config.api_key = API_KEY;

  // Assign the user sign in credentials
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  // Assign the RTDB URL (required)
  config.database_url = DATABASE_URL;

  Firebase.reconnectWiFi(true);
  fbdo.setResponseSize(4096);

  // Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h

  // Assign the maximum retry of token generation
  config.max_token_generation_retry = 5;

  // Initialize the library with the Firebase authen and config
  Firebase.begin(&config, &auth);

  // Getting the user UID might take a few seconds
  Serial.println("Getting User UID");
  while ((auth.token.uid) == "") {
    Serial.print('.');
    delay(1000);
  }
  // Print user UID
  uid = auth.token.uid.c_str();
  Serial.print("User UID: ");
  Serial.println(uid);

  // Update database path
  databasePath = "/fmechanics";
}

void loop(){
    
    String receive = Serial2.readString();
    deserializeJson(doc, receive);
    JsonObject realTimeValues = doc.as<JsonObject>();
     
    //Get current timestamp
    timestamp = getTime();
    Serial.print ("time: ");
    Serial.println (timestamp);

    parentPath= databasePath + "/" + String(timestamp);
    float uno = realTimeValues["freq1"];
    float dos = realTimeValues["caud1"];
    float tres = realTimeValues["freq2"];
    float cuatro = realTimeValues["caud2"];
    PrintData(cuatro,dos);
    
    
    json.set(frecuencia1.c_str(), uno);
    json.set(caudal1.c_str(), dos);
    json.set(frecuencia2.c_str(), tres);
    json.set(caudal2.c_str(), cuatro);
    Serial.printf("Set json... %s\n", Firebase.RTDB.setJSON(&fbdo, parentPath.c_str(), &json) ? "ok" : fbdo.errorReason().c_str());
    //delay(1000);
  
}
