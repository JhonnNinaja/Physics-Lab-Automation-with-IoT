#include <Arduino_JSON.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#define RXp2 16
#define TXp2 17

float frecuencia_sensor1; //obtenemos la Frecuencia de los pulsos en Hz
float caudal_L_m_sensor1; //calculamos el caudal en L/m
float frecuencia_sensor2; //obtenemos la Frecuencia de los pulsos en Hz
float caudal_L_m_sensor2; //calculamos el caudal en L/m

volatile int NumPulsos_sensor1; //variable para la cantidad de pulsos recibidos
int PinSensor_sensor1 = 5;    //Sensor para el de media pulgada
float factor_conversion_sensor1=7.5; //para convertir de frecuencia a caudal

//---Función que se ejecuta en interrupción---------------
void IRAM_ATTR ContarPulsos_sensor1 ()
{ 
  NumPulsos_sensor1++;  //incrementamos la variable de pulsos
} 

//---Función para obtener frecuencia de los pulsos--------
int ObtenerFrecuencia_sensor1() 
{
  int frecuencia;
  NumPulsos_sensor1 = 0;   //Ponemos a 0 el número de pulsos
  interrupts();    //Habilitamos las interrupciones
  delay(1000);   //muestra de 1 segundo
  noInterrupts(); //Desabilitamos las interrupciones
  frecuencia=NumPulsos_sensor1; //Hz(pulsos por segundo)
  return frecuencia;
}


volatile int NumPulsos_sensor2; //variable para la cantidad de pulsos recibidos
int PinSensor_sensor2 = 4;    //para el sensor de 1"
float factor_conversion_sensor2=3.5; //para convertir de frecuencia a caudal 

//---Función que se ejecuta en interrupción---------------
void IRAM_ATTR ContarPulsos_sensor2 ()
{ 
  NumPulsos_sensor2++;  //incrementamos la variable de pulsos
} 

//---Función para obtener frecuencia de los pulsos--------
int ObtenerFrecuencia_sensor2() 
{
  int frecuencia;
  NumPulsos_sensor2 = 0;   //Ponemos a 0 el número de pulsos
  interrupts();    //Habilitamos las interrupciones
  delay(1000);   //muestra de 1 segundo
  noInterrupts(); //Desabilitamos las interrupciones
  frecuencia=NumPulsos_sensor2; //Hz(pulsos por segundo)
  return frecuencia;
}

JSONVar realTimeValues; 

String setjsonvalues(){

  realTimeValues["freq1"] = frecuencia_sensor1;
  realTimeValues["caud1"] = caudal_L_m_sensor1;
  realTimeValues["freq2"] = frecuencia_sensor2;
  realTimeValues["caud2"] = caudal_L_m_sensor2;

  String jsonString = JSON.stringify(realTimeValues);
  return jsonString;
}

void setup()
{ 
  Serial.begin(115200); 
  pinMode(PinSensor_sensor1, INPUT); 
  attachInterrupt(digitalPinToInterrupt(PinSensor_sensor1),ContarPulsos_sensor1,RISING); //(Interrupcion 0(Pin2),funcion,Flanco de subida)
  pinMode(PinSensor_sensor2, INPUT); 
  attachInterrupt(digitalPinToInterrupt(PinSensor_sensor2),ContarPulsos_sensor2,RISING); //(Interrupcion 0(Pin2),funcion,Flanco de subida)

  Serial2.begin(115200, SERIAL_8N1, RXp2, TXp2);
} 

void loop ()    
{
  frecuencia_sensor1=ObtenerFrecuencia_sensor1(); //obtenemos la Frecuencia de los pulsos en Hz
  caudal_L_m_sensor1=frecuencia_sensor1/factor_conversion_sensor1; //calculamos el caudal en L/m
  //delay(300);
  frecuencia_sensor2=ObtenerFrecuencia_sensor2(); //obtenemos la Frecuencia de los pulsos en Hz
  caudal_L_m_sensor2=frecuencia_sensor2/factor_conversion_sensor2; //calculamos el caudal en L/m

  String mensaje = setjsonvalues();
  Serial2.println(mensaje);
  Serial.println (mensaje); 
  

}
