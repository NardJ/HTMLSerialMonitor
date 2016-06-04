/*
  Bare_DecoratedText.ino  - Sample sketch part of HTMLSerialMonitor package
                            No library used, demonstrates simple html text decoration 
  created:  26 May 2016
  version:  27 May 2016
  author :  Nard Janssens
  license:  Attribution-NonCommercial-ShareAlike 2.5 Generic (CC BY-NC-SA 2.5)
*/

void setup(){   
    Serial.begin(9600);
}

void loop(){
  int valueD3=random(0,1024); // randomfrom 0 to 1024 
  String red="Value is: <b style='color:red;'>";
  String grn="Value is: <b style='color:green;'>";
  String eol="</b>";
  if (valueD3<512)  Serial.println(red+valueD3+eol);    
  if (valueD3>=512) Serial.println(grn+valueD3+eol);    
  delay (300);
}


