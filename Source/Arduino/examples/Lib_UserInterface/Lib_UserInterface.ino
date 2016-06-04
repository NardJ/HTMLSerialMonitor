/*
  Lib_UserInterface.ino   - Sample sketch part of HTMLSerialMonitor package
                            Demonstrates loading external file with all html
                            to minimize memory usage of Arduino.
  created:  29 May 2016
  version:  30 May 2016
  author :  Nard Janssens
  license:  Attribution-NonCommercial-ShareAlike 2.5 Generic (CC BY-NC-SA 2.5)
*/

#include <HTMLSerialMonitor.h>
HTMLSerialMonitor SerialM;

void setup(){
    SerialM.begin(9600);

    //We setup the gui and start by clearing the page with [cls] 
    SerialM.println("[cls]");

    //We setup the gui and start by clearing the page with [cls]
    SerialM.println("[sketchpath:"+String(__FILE__)+"]");

    //Setup the pins
    for (int i=2;i<14;i++) pinMode(i,INPUT);
}

String logPin="A0";

void loop(){
  //Digital pins
  for (int i=2;i<14;i++) {
    int dR=digitalRead(i);
    String id="pD"+String(i);    
    String col="red";
    if (dR==1) col="green";
    SerialM.print (id,String(dR));
    SerialM.print (id,"b",col);

    id=String(i);
    if (id.equals(logPin)){
      SerialM.print("osc",String(255+512*dR));
    }
  }

  //Analog pins
  for (int i=0;i<8;i++) {
    String id="pA"+String(i);    
    int aR=analogRead(i);
    String val="rgb(200,200,";
    val+=String(255-aR/4);
    val+=")";
    SerialM.print (id,String(round(aR/103)));
    SerialM.print (id,"b",val);

    id="A"+String(i);    
    if (id.equals(logPin)){
      SerialM.print("osc",String(aR));
    }
    
  }
  SerialM.println();
  delay(300);
}

//If you use SerialEvent to intercept messages you need to 
//use the available and read method from the HTMLSerialMonitor library 
String inputString="";
void serialEvent() {
  while (SerialM.available()) {
      char inChar=(char) SerialM.read();
      inputString += inChar;
      if (inChar == '\n') { 
        logPin=inputString.substring(0,inputString.length()-1);
        inputString="";
      }          
  }
}

