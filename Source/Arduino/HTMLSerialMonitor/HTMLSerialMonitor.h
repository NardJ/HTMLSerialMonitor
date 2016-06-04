/*
  file   :  HTMLSerialMonitor.h
  created:  26 May 2016
  version:  27 May 2016
  author :  Nard Janssens
  license:  Attribution-NonCommercial-ShareAlike 2.5 Generic (CC BY-NC-SA 2.5)
*/
#ifndef HTMLSerialMonitor_h
#define HTMLSerialMonitor_h

#include "Arduino.h"

class HTMLSerialMonitor{
   private:
      String inputString="";         
      boolean monFnd=true;      
      boolean inCmd=false;
      
   public:
   
      void waitForMonitor();

      int hndlRemoteCmd();

      int hndlRemoteCmd(int inByte);

      boolean available();
	  
      int read();

      //following functions are for more complete replacement of Serial functions
      int peek();
      void begin(int baud);
      void end();
      
      void println(byte val);
	  void println(char val);
	  void println(int val);
	  void println(long val);
	  void println(float val);
	  void println(double val);
	  void println(String val);
	  void println(String id,String val);
	  void println(String id,String prop,String val);
	  void println();
	  
      void print(byte val);
	  void print(char val);
	  void print(int val);
	  void print(long val);
	  void print(float val);
	  void print(double val);
	  void print(String val);
	  void print(String id,String val);
	  void print(String id,String prop,String val);
	        
};

#endif
