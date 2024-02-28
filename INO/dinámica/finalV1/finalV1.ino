#include <WiFi.h>
#include <Firebase_ESP_Client.h>
/* 1. Define the WiFi credentials */
//#define WIFI_SSID "TGB"
//#define WIFI_PASSWORD "dragonnarutito1234_tarma"

//#define WIFI_SSID "Portachuelo"
//#define WIFI_PASSWORD "HumGuz2711"
//#define WIFI_SSID "A32D9A6"
//#define WIFI_PASSWORD "dhio9090"

//#define WIFI_SSID "Galaxy"
//#define WIFI_PASSWORD "txgu4927"

#define WIFI_SSID "HOLA2"
#define WIFI_PASSWORD "lance1234"

/* 2. Define the API Key */
#define API_KEY "AIzaSyCGoJ3FfW1OuggPsJT4u8TCXW3IE2hwpUc"
//#define API_KEY "AIzaSyC7hU_CuFeD6m0uPj2-9ZZRPze1Rw1f07M"
/* 3. Define the RTDB URL */
#define DATABASE_URL "https://psiphilabo-default-rtdb.firebaseio.com/" 
//#define DATABASE_URL "https://console.firebase.google.com/project/esp32-data-ba2f7/database/esp32-data-ba2f7-default-rtdb/data/~2F?hl=es" 
/* 4. Define the user Email and password that alreadey registerd or added in your project */
#define USER_EMAIL "gian.ucb@gmail.com"
#define USER_PASSWORD "gianucb"


//#define USER_EMAIL "giancarlopezbustos@gmail.com"
//#define USER_PASSWORD "firebase"

// Define Firebase Data object
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
unsigned long sendDataPrevMillis = 0;
unsigned long count = 0;
//String nodo="/Masa "+String(n)+":";

/*
int pinpuls1 = 2;
int pinpuls2 = 4;
int pinpuls3 = 26;
int pinpuls4 = 23;


*/
  int incli;
int FCI = 22;
int FCS = 23;

int pinpuls1 = 2;
int pinpuls2 = 4; 
int pinpuls3 = 34; //este añade datos
int pinpuls4 = 35; //este crea el nuevo nodo
int pin_inclination = 19;

int statopuls1=HIGH;
int statopuls2=HIGH;
int statopuls3=HIGH;
int statopuls4=HIGH;
unsigned long tempo_base;
unsigned long tempo_cronometrato = 0;
unsigned long tempo_congelato;
unsigned long temposec;
unsigned long Ttranscurrido, terminado;
float h, m, s, ms;
int flag = 1;
int counter=1;
int counter_m=1;
float sum_time_p=0;
float tp=0;


#define dirPin 18
#define stepPin 15
#define stepsPerRevolution 200
float turns;
int degrees[1000];
int cont = 1;
int valor = 0;
void setup()
{
  Serial.begin(115200);
  pinMode (pinpuls1, INPUT);
  pinMode (pinpuls2, INPUT);
  pinMode (pinpuls3, INPUT_PULLUP);
  pinMode (pinpuls4, INPUT_PULLUP);
  pinMode (pin_inclination, INPUT_PULLUP);
  pinMode (FCI, INPUT_PULLUP);
  pinMode (FCS, INPUT_PULLUP);
  pinMode(stepPin, OUTPUT);
  pinMode(dirPin, OUTPUT);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Waiting");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  /* Assign the api key (required) */
  config.api_key = API_KEY;

  /* Assign the user sign in credentials */
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;


  Firebase.begin(&config, &auth);

  Firebase.reconnectWiFi(true);

  Firebase.setDoubleDigits(5);

  reset_position();

}
void loop()
{


 //----------------------------------------------- Abel --------------------------------------------------
   
   if ((digitalRead (pin_inclination) == LOW)){
    Serial.println("LEYO LA INCLINACIÓN CORRECTAMENTE");
    Firebase.RTDB.getInt(&fbdo,"/inclination",&incli);
    
    
    
  
    degrees[cont] = int(incli);  //Aqui deberia entrar el valor de la pagina web, (int)
  
    if (valor >= 0 && valor <= 10)
    {
      if (cont < 1)
      {
        if (degrees[cont] > 0 && degrees[cont] != degrees[cont - 1])
        {
        //Serial.println(degrees[cont]);
        cont = cont + 1; 
        }
      }
      else
      {
        if (degrees[cont] != degrees[cont - 1])
        {
        //Serial.println(degrees[cont]);
        cont = cont + 1; 
        inclinacion(degrees, cont);
        } 
      } 
    }
    else
    {
      Serial.println("Incorrect Value");
    } 
   }
   


  //-----------------------------------------------------------------------------------
  statopuls1 = digitalRead (pinpuls1);
  statopuls2 = digitalRead (pinpuls2);
  statopuls3 = digitalRead (pinpuls3);
  statopuls4 = digitalRead (pinpuls4);

  
  if ((statopuls1 == LOW) && (flag < 2))
  {
    tempo_base = millis();
    flag = 0;
  }
  if ((statopuls1 == LOW) && (flag == 2))
  {
    flag = 0;
  }

  if ((statopuls3 == LOW) && (flag == 2))
  {
    Firebase.RTDB.setFloat(&fbdo, "/dynamic/MASA" + String(counter_m+1)+"/T"+String(counter), Ttranscurrido);
    //String str_aux = "MASA" + String(counter_m+1);
    //Firebase.RTDB.setString(&fbdo, "/dynamic/MASA" + String(counter_m+1)+"/ID",str_aux);
    counter++;
    sum_time_p=sum_time_p+Ttranscurrido;
    Serial.println("Dato recibido_1");
  }
  
  if ((statopuls4 == LOW) && (counter>0))
  { 
    Firebase.RTDB.setFloat(&fbdo, "/dynamic/MASA" + String(counter_m+1)+"/masa", float(0));
    //Firebase.RTDB.setFloat(&fbdo, "MASA " + String(counter_m)+"/T"+String(counter),"");
    counter_m++;
    Serial.println("Dato recibido");
    sum_time_p=0;
    counter=1;
  }

  
  
  if (flag == 0)
  {
    
    Ttranscurrido = millis() - tempo_base;

    h = int(Ttranscurrido / 3600000);
    terminado = Ttranscurrido % 3600000; 
    m = int(terminado / 60000);
    terminado = terminado % 60000;
    s = int(terminado / 1000);
    ms = terminado % 1000; 

    Serial.print("Tiempo transcurrido: ");
    Serial.println(Ttranscurrido);
    //Serial.println(",");
    //Serial.print("Tiempo transcurrido detallado: ");
    /*
    Serial.print(h, 0);
    Serial.print("h ");
    Serial.print(m, 0);
    Serial.print("m ");
    Serial.print(s, 0);
    Serial.print("s ");
    Serial.print(ms, 0);
    Serial.println("ms");*/
    
  }
  if (statopuls2 == LOW)
  {
    flag = 2;
  }
  
}

void reset_position(){
  down(1000.0);
  Serial.println("volvió a la posicición inicial");
}


void inclinacion(int degrees[], int cont)
{
  int value = 0;
  int current_value = 0;
  int previous_value = 0;
  current_value = degrees[cont - 1];
  previous_value = degrees[cont - 2];
  
  if (current_value > previous_value)
  {
    value = current_value - previous_value;  
    Serial.print("Valor: ");  
    Serial.println(value);
    Serial.println("de subida");
    turns = (((tan((value*3.14)/180))*160)/8)*10;
    up(turns);     
  }
  else
  {
    value = previous_value - current_value;  
    Serial.print("Valor: ");  
    Serial.println(value);
    Serial.println("de bajada");
    turns = (((tan((value*3.14)/180))*160)/8)*10;
    down(turns);
  }  
  Serial.print("Dato anterior :");  
  Serial.println(previous_value);
  Serial.print("Dato actual :");
  Serial.println(current_value); 
}

void up(float turns)
{
  digitalWrite(dirPin, LOW);
  
  for (int i = 0; i < int(stepsPerRevolution * turns); i++) {
 
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(1000);
    digitalWrite(stepPin, LOW);
    delayMicroseconds(1000);
    if(digitalRead (FCS) == LOW){
      break;
    }
  }
  Serial.print("Turns of up: ");
  Serial.println(turns);
  delay(1000); 
}

void down(float turns)
{
  digitalWrite(dirPin, HIGH);
  
  for (int i = 0; i < int(stepsPerRevolution * turns); i++) {
 
    digitalWrite(stepPin, HIGH);   
    delayMicroseconds(1000);
    digitalWrite(stepPin, LOW);
    delayMicroseconds(1000);
    if(digitalRead (FCI) == LOW){
      break;
    }
    
  }
  Serial.print("Turns of down: ");
  Serial.println(turns);
  delay(1000); 
}
