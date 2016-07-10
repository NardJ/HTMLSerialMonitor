/*
  Bare_DecoratedText.ino  - Sample sketch part of HTMLSerialMonitor package
                            No library used, demonstrates simple html text decoration 
  created:  26 May 2016
  version:  10 Jul 2016
  author :  Nard Janssens
  license:  Attribution-NonCommercial-ShareAlike 2.5 Generic (CC BY-NC-SA 2.5)
*/

const int analogPin=3;
void setup(){   
    Serial.begin(9600);
}

char red[]="Value is: <b style='color:red;'>";
char grn[]="Value is: <b style='color:green;'>";
char eol[]="</b>";

void loop(){
  int val = analogRead(analogPin);
  if (val<256)  Serial.print(red);
  if (val>=256) Serial.print(grn);
  Serial.print(val);
  Serial.println(eol);    
  delay (300);
}
