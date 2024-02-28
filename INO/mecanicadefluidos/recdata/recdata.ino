#include <ArduinoJson.h>


#define RXp2 16
#define TXp2 17

DynamicJsonDocument doc(1024);
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial2.begin(115200, SERIAL_8N1, RXp2, TXp2);

}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println("Message Received: ");
  //Serial.println(Serial2.readString());
  String receive = Serial2.readString();
  deserializeJson(doc, receive);
  JsonObject realTimeValues = doc.as<JsonObject>();
  
  String sensor = realTimeValues["freq1"];

  
  
  Serial.println(typeof(sensor));

}
