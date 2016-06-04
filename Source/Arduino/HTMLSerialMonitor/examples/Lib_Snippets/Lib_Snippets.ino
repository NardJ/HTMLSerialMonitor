/*
  Lib_ElementRedraw.ino   - Sample sketch part of HTMLSerialMonitor package
                            Demonstrates usage of html snippets contained in 
                            the controls.txt in the processing folder.
                            This minizes HTML strings in Arduino and leaves 
                            more memory.
  created:  26 May 2016
  version:  29 May 2016
  author :  Nard Janssens
  license:  Attribution-NonCommercial-ShareAlike 2.5 Generic (CC BY-NC-SA 2.5)
*/

#include <HTMLSerialMonitor.h>
HTMLSerialMonitor SerialM;

void setup(){
    SerialM.begin(9600);
    
    //We setup the gui and start by clearing the page with [cls] 
    SerialM.println("[cls]");

    //nice page title
    SerialM.print("<h1>Sample - Usage of Snippets</h1><hr>");

    //all snippets/controls are encased in divs for nice flow left to right in 2 columns
    String divStart1 ="<div style='float:left;width:110px;height:120px;border:0px solid black;text-align:center;'>";
    String divStart2 ="<div style='float:left;width:200px;height:120px;border:0px solid black;margin-right:20px;'>";
    String divEnd    ="</div>";
    String divNextRow="<div style='clear:both;height:20px;'></div>";
    
    //add controls in nice div boxes
    //to add a snippet/control use the format [snippet_name:your_unique_id] 
    SerialM.print(divNextRow);    
    SerialM.print(divStart1 + "[hslider:myHorSlid]"    + divEnd);
    SerialM.print(divStart1 + "[vslider:myVerSlid]"    + divEnd);
    SerialM.print(divStart1 + "[indicator:myInd]"      + divEnd);
    SerialM.print(divStart1 + "[turnbutton:myTButton]" + divEnd);    
    SerialM.print(divNextRow);    
    SerialM.print(divStart2 + "[yline:myY]"     + divEnd); //draw a log of last n values received.
    SerialM.print(divStart2 + "[xyline:myXY]"   + divEnd); //draws points and lines between them
    SerialM.print(divNextRow);    
    SerialM.print(divStart2 + "[bars:myBar]"    + divEnd); //draw specified nr of bars and let you adjusts height of bars
    SerialM.print(divStart2 + "[scatter:mySca]" + divEnd); //draws points but NO lines between them
    SerialM.println("");
    
    //resize all controls    
    SerialM.print("[myHorSlid.h:20]");
    SerialM.print("[myHorSlid.w:100]");
    SerialM.print("[myVerSlid.w:20]");
    SerialM.print("[myVerSlid.h:100]");
    SerialM.print("[myInd.w:50]");
    SerialM.print("[myInd.h:50]");
    SerialM.print("[myTButton.w:60]");
    SerialM.print("[myTButton.h:60]");
    SerialM.print("[myY.w:200]");  
    SerialM.print("[myY.h:100]");
    SerialM.print("[myXY.w:200]");
    SerialM.print("[myXY.h:100]");
    SerialM.print("[myBar.w:200]");
    SerialM.print("[myBar.h:100]");
    SerialM.print("[mySca.w:200]");
    SerialM.print("[mySca.h:100]");

    //set a common style property...font weight
    SerialM.print("[Log.s:font-weight:bold]");
        
    //label the controls
    SerialM.print("[myHorSlid.t:My slider]");
    SerialM.print("[myVerSlid.t:Up/down]");
    SerialM.print("[myInd.t:indicator]");
    SerialM.print("[myTButton.t:I turn]");
    SerialM.print("[myY.t:SIN+RND]");
    SerialM.print("[myXY.t:CIRCLE+RND]");
    SerialM.print("[myBar.t:SMOOTH RND]");
    SerialM.print("[mySca.t:RND]");
        
    //close print string to let monitor proces it
    SerialM.println("");
}

//some vars to animate controls
float i=0;
float x=0;
float y=0;
float s;
float c;
int bars[5];

void loop(){    
  i=i+20;
  if (i>1024) i=0;
  x=(x+analogRead(2))/2;
  y=(y+analogRead(4))/2;
  s=sin(i/1024.0*6.28);
  c=cos(i/1024.0*6.28);
  
  int iInd;//=digitalRead(3);
  iInd=random(5,15)/10;
  String vInd=String(iInd);  
  String cmd1="[myInd:"+vInd+"]";
  SerialM.print(cmd1);

  int iH;//=analogRead(1);    
  iH=i;
  String vH=String(iH);
  String cmd2="[myHorSlid:"+vH+"]";
  SerialM.print(cmd2);

  int iV;//=analogRead(2);    
  iV=i;
  String vV=String(iV);
  String cmd3="[myVerSlid:"+vV+"]";
  SerialM.print(cmd3);

  int iT;//=analogRead(3);
  iT=i;    
  String vT=String(iT);  
  String cmd4="[myTButton:"+vT+"]";
  SerialM.print(cmd4);

  int iY=448*(s+1)+random(0,128);
  String vY=String(iY);
  String cmd5="[myY:"+vY+"]";
  SerialM.print(cmd5);
  
  int iXy=s*random(300,900);
  int ixY=c*random(300,900);
  String vXy=String(iXy);
  String vxY=String(ixY);
  String cmd6="[myXY:"+vXy+" "+vxY+"]";
  SerialM.print(cmd6);

  int iSX=s*random(0,1024);
  int iSY=c*random(0,1024);
  String vSX=String(iSX);
  String vSY=String(iSY);
  String cmd7="[mySca:"+vSX+" "+vSY+"]";
  SerialM.print(cmd7);

  for (int i=0;i<5;i++){
    int iBar=bars[i]*0.65+0.35*random(0,1024);
    bars[i]=iBar;
    String vBar=String(iBar);
    String barNr=String(i);
    String cmd8="[myBar:"+barNr+" "+vBar+"]";
    SerialM.print(cmd8);
  }  

  //close print string to let monitor proces it    
  SerialM.println("");

  //we call hndlRemoteCmd to enable the control buttons (play/reset) at the top right of the monitor
  SerialM.hndlRemoteCmd(); //or call serialEvent if you need the input yourself
}


