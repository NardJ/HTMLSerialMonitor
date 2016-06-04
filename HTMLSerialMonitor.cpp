/*
  file   :  HTMLSerialMonitor.cpp
  created:  26 May 2016
  version:  27 May 2016
  author :  Nard Janssens
  license:  Attribution-NonCommercial-ShareAlike 2.5 Generic (CC BY-NC-SA 2.5)
*/

 #include "Arduino.h"
 #include "HTMLSerialMonitor.h"
 
  void HTMLSerialMonitor::waitForMonitor(){
	 monFnd=false;
	 while (!monFnd) {hndlRemoteCmd();}
  }

  int HTMLSerialMonitor::hndlRemoteCmd(){
	while (Serial.available()) {
	  hndlRemoteCmd(Serial.read());
	}      
  }

  int HTMLSerialMonitor::hndlRemoteCmd(int inByte){
	  char inChar=(char) inByte;
	  char outByte=-1;
	  inputString += inChar;
	  if (inChar=='[') inCmd=true;
	  if (!inCmd) outByte=inByte;
	  if (inChar == '\n') { //so all data after command close bracket up until \n is ignored and discarded
		inCmd=false;
		if (inputString.substring(0,7).equals("[reset]")) asm volatile ("  jmp 0");  
		if (inputString.substring(0,7).equals("[start]")) {monFnd=true;}
		if (inputString.substring(0,7).equals("[pause]")) {
		  Serial.flush();
		  inputString="";
		  while (!inputString.substring(0,7).equals("[play]")){
			if (Serial.available()) hndlRemoteCmd(Serial.read());
		  }
		}
		inputString="";
	  }    
	  //we should remove bytes belonging to cmd
	  return outByte;
  }

  boolean HTMLSerialMonitor::available(){        
	if (!Serial.available()) return false;        
	int newByte=Serial.peek();
	if ((inCmd) || (newByte=='[')) {
	  while ((inCmd) || (Serial.peek()=='[')) {
		hndlRemoteCmd(Serial.read()); 
	  }
	  return false;
	}
	return true;
  }
  int HTMLSerialMonitor::read(){
	return hndlRemoteCmd(Serial.read());
  }

  //following functions are for more complete replacement of Serial functions
  int  HTMLSerialMonitor::peek()             {return Serial.peek();}
  void HTMLSerialMonitor::begin(int baud)    {Serial.begin(baud);}
  void HTMLSerialMonitor::end()              {Serial.end();}
  
  void HTMLSerialMonitor::println(byte val)  {Serial.println(val);}
  void HTMLSerialMonitor::println(char val)  {Serial.println(val);}
  void HTMLSerialMonitor::println(int val)   {Serial.println(val);}
  void HTMLSerialMonitor::println(long val)  {Serial.println(val);}
  void HTMLSerialMonitor::println(float val) {Serial.println(val);}
  void HTMLSerialMonitor::println(double val){Serial.println(val);}
  void HTMLSerialMonitor::println(String val){Serial.println(val);}  
  void HTMLSerialMonitor::println()          {Serial.println();}
  void HTMLSerialMonitor::println(String id,String val) {
	  String cmd="[";
	  cmd+=id;
	  cmd+=":";
	  cmd+=val;
	  cmd+="]";
	  Serial.println(cmd);
  }
  void HTMLSerialMonitor::println(String id,String prop,String val){
	  String cmd="[";
	  cmd+=id;
	  cmd+=".";
	  cmd+=prop;
	  cmd+=":";
	  cmd+=val;
	  cmd+="]";
	  Serial.println(cmd);	  
  }
  
  void HTMLSerialMonitor::print(byte val)  {Serial.print(val);}
  void HTMLSerialMonitor::print(char val)  {Serial.print(val);}
  void HTMLSerialMonitor::print(int val)   {Serial.print(val);}
  void HTMLSerialMonitor::print(long val)  {Serial.print(val);}
  void HTMLSerialMonitor::print(float val) {Serial.print(val);}
  void HTMLSerialMonitor::print(double val){Serial.print(val);}
  void HTMLSerialMonitor::print(String val){Serial.print(val);}  
  void HTMLSerialMonitor::print(String id,String val) {
	  String cmd="[";
	  cmd+=id;
	  cmd+=":";
	  cmd+=val;
	  cmd+="]";
	  Serial.print(cmd);
  }
  void HTMLSerialMonitor::print(String id,String prop,String val){
	  String cmd="[";
	  cmd+=id;
	  cmd+=".";
	  cmd+=prop;
	  cmd+=":";
	  cmd+=val;
	  cmd+="]";
	  Serial.print(cmd);	  
  }
  
  