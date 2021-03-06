/*
  Bare_PageRedraw.ino     - Sample sketch part of HTMLSerialMonitor package
                            No library used, demonstrates simple animation
                            by redrawing page each loop
  created:  26 May 2016
  version:  29 May 2016
  author :  Nard Janssens
  license:  Attribution-NonCommercial-ShareAlike 2.5 Generic (CC BY-NC-SA 2.5)
*/

String divTitle  ="<div style='width:490px;line-height:48px;text-align:center;font-size:32px'>Arduino Weather Station</div>";
String divBlock  ="<div style='width:200px;height:200px;margin:16px;padding:8px; background-color:#2222AA;float:left;color:#EEEEFF;font-family:Tahoma;'>";
String divBHeader="<div style='line-height:32px; font-size:32px'>";
String divBBody  ="<div style='text-align:center;line-height:136px;font-size:64px;color:white'>";
String divBFooter="<div style='text-align:right;line-height:32px; font-size:32px' >";
String divClose  ="</div>";
String nextRow   ="<div style='clear:both;'></div>";
String symbSunny ="&#9728";
String symbCloudy="&#9729";
String symbUp    ="&#8673";
String symbDown  ="&#8675";
String symbDeg   ="&deg;C";
unsigned long hrOff=10;
unsigned long minOff=12;
unsigned long secOff=56;

void setup(){   
    Serial.begin(9600);    
}

void loop(){
  //Time would have to be set at start of arduino, or you could use a clock sensor.
  //Without this implemented, we make up a time below   
  int speedup=60; //for demonistration we make time faster/more dynamic
  unsigned long s=millis()/1000*speedup;
  unsigned long offset=hrOff*3600+minOff*60+secOff;
  s=s+offset;
  unsigned long hours=s/3600;
  hours=hours % 24; 
  s=s-hours*3600;  
  unsigned long  minutes=s/60;
  s=s-minutes*60;
  unsigned long  seconds=s;  
  String timef=dblDig(hours)+":"+dblDig(minutes);

  int temp=7; // you would read this from your pressure sensor
  int prevPressure=1000; // this would be the pressure of a day ago or something like that
  int pressure=1001;     // you would read this from your pressure sensor

  //forecast is very simplistic and probably false, but for demonstration purposes...
  String trend=symbDown;
  String forecast=symbCloudy;
  if (pressure>prevPressure) {
    trend=symbUp;
    forecast=symbSunny;
  }

  //we print html using Serial.print.
  //only if end of line (Serial.println) is received, the html is processed.

  //page header
  Serial.print("[cls]");    
  Serial.print(divTitle);  
  
  //time
  Serial.print(divBlock);  
    Serial.print(divBHeader+"TIME"+divClose);
    Serial.print(divBBody+timef+divClose);  
    Serial.print(divBFooter+divClose);  
  Serial.print(divClose);  

  //temp
  Serial.print(divBlock);  
    Serial.print(divBHeader+"OUTSIDE"+divClose);
    Serial.print(divBBody+temp+symbDeg+divClose);  
    Serial.print(divBFooter+divClose);  
  Serial.print(divClose);  

  //next row
  Serial.print(nextRow);
  
  //pressure
  Serial.print(divBlock);  
    Serial.print(divBHeader+"PRESSURE"+divClose);
    Serial.print(divBBody+pressure+trend+divClose);  
    Serial.print(divBFooter+"bar"+divClose);  
  Serial.print(divClose);  

  //forecast
  Serial.print(divBlock);  
    Serial.print(divBHeader+"FORECAST"+divClose);
    Serial.print(divBBody+"<big><big><big><big>"+forecast+"</big></big></big></big>"+divClose);  
    Serial.print(divBFooter+divClose);  
  Serial.print(divClose);  
  
  //explanation regarding refreshrate
  Serial.print(nextRow);
  Serial.print("<i><h4><b>Refreshrate</b>: <small>This page updates much slower than the refreshrate of the data. <br>");
  Serial.print("The page is refreshed fully on each data update which takes a lot of time.</small></h4></i>");  
  Serial.println("");
  
  //when refreshing whole pages the browser needs to have time to keep up,
  //so we loop only each each five second.  
  delay (5000);
}

String dblDig(int s){
  String out="0"+String(s);
  out=out.substring(out.length()-2,out.length());
  return out;
} 


