/*
  file   :  HTMLSerialMonitor
  created:  26 March 2016
  version:  04 June 2016
  author :  Nard Janssens
  license:  Attribution-NonCommercial-ShareAlike 2.5 Generic (CC BY-NC-SA 2.5)
*/

import javax.swing.ImageIcon;
import processing.net.*;
import processing.serial.*;
import java.io.InputStreamReader;
import java.nio.charset.*;
@SuppressWarnings("serial")

Server s;
Client c;
int nrWebPort=0;//default 8080
int webports[]={8080,8081,8082,8083,8084};
String HTTP_GET_REQUEST = "GET /";
String HTTP_HEADER = "HTTP/1.0 200 OK\r\nContent-Type: text/html\r\n\r\n";
String CSS_HEADER = "HTTP/1.0 200 OK\r\nContent-Type: text/css\r\n\r\n";
String JS_HEADER = "HTTP/1.0 200 OK\r\nContent-Type: application/javascript\r\n\r\n";
String PNG_HEADER = "HTTP/1.0 200 OK\r\nContent-Type: image/png\r\n\r\n";
String GIF_HEADER = "HTTP/1.0 200 OK\r\nContent-Type: image/gif\r\n\r\n";
String JPG_HEADER = "HTTP/1.0 200 OK\r\nContent-Type: image/jpeg\r\n\r\n";
String ICO_HEADER = "HTTP/1.0 200 OK\r\nContent-Type: image/x-icon\r\n\r\n";
String input;
String url;
String ext;
String pars;

Serial serialPort;
String strPort;
int baudrate;
boolean serialActive=false;
int lf=10; //ascii linefeed
String buffer="";

String autodisconnect="1";
String autoreconnect="1";

ArrayList<String> ctrlTemplates=new ArrayList<String>(); 
String ctrlLines[];
ArrayList<Integer>ctrlIdxFrom=new ArrayList<Integer>();
ArrayList<Integer>ctrlIdxTo=new ArrayList<Integer>();

String msgStart=Character.toString(char(2));//ASCII meaning: STX (start of text)
String msgEnd  =Character.toString(char(3));//ASCII meaning: ETX (end of text)

void readTemplates(){
  //load control templates
  ctrlTemplates.clear(); 
  ctrlIdxFrom.clear();
  ctrlIdxTo.clear();
  ctrlLines = loadStrings("controls.js");
  //make list of found controls
  
  for (int i = 0 ; i < ctrlLines.length; i++) {
    String line=ctrlLines[i];
    //println(line);
    if (line.indexOf("[")==0){
      if (line.indexOf("/")!=1){
        int close=line.indexOf("]");
        String ctrlId=line.substring(1,close);
        ctrlTemplates.add(ctrlId);
        ctrlIdxFrom.add(i);
      }else{
        ctrlIdxTo.add(i);
      }
    }
  }

}

void setup(){
  surface.setIcon(loadImage("icon64x64.png"));
    
  //setup canvas
  size(240,240);
  try {pixelDensity(2);}catch(Exception e){println(e);}//for retina displays
  
  background(255,255,255);
  fill(0,0,0);
  PImage banner=loadImage("pd_banner.png");
  image(banner,0,0,240,50);
  textSize(22);
  fill(255,255,255);
  text("HTML Monitor",74,34);
  
  textSize(12);
  fill(0,0,0);
  int lh=16;
  int o=60;
  text("Please open your browser",10,o+lh*1);
  text("... open adress 127.0.0.1:8080",10,o+lh*2);
  text("and leave this window open.",10,o+lh*3);
  println(dataPath(""));
  
  s = new Server(this, webports[nrWebPort]); // start server on http-alt

  System.out.println("Working Directory = " + System.getProperty("user.dir"));
  String d=System.getProperty("user.dir");
  text("--------------------------------",10,o+lh*4);
  text("user.dir:"+d,10,o+lh*5);
  text("cmdline args:",10,o+lh*6);
  if (args!=null){
    for (int i=0;i<args.length;i++){
      text(args[i],10,o+lh*6+(i+2)*lh);
    }
  }
  
  updateStatus();  
}

String extProp(String url, String prop){
  int iStart=url.indexOf(prop+"=");
  if (iStart==-1) return null;
  int iSep=url.indexOf("=",iStart);
  int iEnd=url.indexOf("&",iSep);
  if (iEnd==-1) iEnd=url.length();
  return url.substring(iSep+1,iEnd);
}


int nrBytesSend=0;
int nrDataUpdates=-1; 
int prevDataUpdate=-1000;
void updateStatus(){  
  nrDataUpdates++;
  nrBytesSend+=buffer.length();
  if ((millis()-prevDataUpdate)>1000){
        int d=millis()-prevDataUpdate;
        float tweak=d/1000;
        fill(200,200,255);
        stroke(200,200,255);
        rect(0,204,240,36);     
        fill(0,0,0);
        stroke(160,160,160);
        line(0,204,240,204);
        String FPS="Updates/sec: "+ int(nrDataUpdates*tweak+0.5);
        text(FPS,10,220);
        String DataRate="Bytes/sec: "+int(nrBytesSend*tweak+0.5);
        text(DataRate,10,236);
        nrDataUpdates=0;
        nrBytesSend=0;
        prevDataUpdate=millis();
  }  
}

int m0=millis();
String oldBuffer;
void draw(){
  // Receive data from client
 try{
  c = s.available();  
  if (c != null) {    
    input = c.readString();
    //println("time:"+(millis()-m0));

    //println("-------------------");
    //println(input);
    //println("-------------------");
    //println();
    
    //Extract URL
    if (input.indexOf("\n")>0){
      input = input.substring(0, input.indexOf("\n")); // Only up to the newline
      //println(">"+input+"<");
      if (input.length()>5) {
        if (input.indexOf("HTTP")>0){
          if (input.indexOf("GET")>-1)  url = input.substring(5, input.indexOf("HTTP")); // Only up to the newline
          if (input.indexOf("POST")>-1) url = input.substring(6, input.indexOf("HTTP")); // Only up to the newline
          url=trim(url);
          int dot=url.indexOf(".");
          ext="";
          int quest=url.indexOf("?");
          if (quest!=-1) pars=url.substring(quest+1);else pars="";          
          if (quest==-1) quest=url.length();
          if (dot!=-1) ext=url.substring(dot+1,quest).toLowerCase();
          /*if (!url.equals("serial.dat"))*/ println(">>"+url+"|"+ext+"|"+pars);          
        }
      }
    }
    
    //INDEX
    if ((url.equals(""))||
        (url.equals("index.htm")))
        { //index
      println("REQ: index.htm");
      //if we go back to index we could already have a connection, so stop it.
      try{
        serialStop();
      }catch (Exception e){
      }
      try{
        loadSettings();
        c.write(HTTP_HEADER);  // answer that we're ok with the request and are gonna send html    
        c.write(configPage(""));
        c.stop();
      }catch(Exception e){println(e);}
      return;          
      
    }
    
    //MONITOR
    if (url.length()>18){
      if (url.substring(0,13).equals("monitor.html?")){ //monitor page
        println("REQ: monitor.html");

        //store/save settings
        String save=extProp(url,"savesettings");
        if (save!=null){
          if (save.equals("true")){
            println("Saved settings");
            String val;            
            val=extProp(url,"autodisconnect");
            if (val!=null) autodisconnect="true";else autodisconnect="false";
            val=extProp(url,"autoreconnect");
            if (val!=null) autoreconnect="true";else autoreconnect="false";
            saveSettings();
          }
        }
        
        //retreive com and baud
        int iP=url.indexOf("port=");
        int iB=url.indexOf("baud=");
        int iC=url.indexOf("&",iB);
        if (iC==-1) iC=url.length();
        strPort=url.substring(iP+5,iB-1);
        baudrate=int(url.substring(iB+5,iC));
        println("EXTRACT port:baud: |"+strPort+":"+baudrate+"|");
        try{
          //make connection (new Serial(...)), which will cause Arduino to self reset itself!
          serialStart(strPort,baudrate);    
          buffer="";
          println("...connected to arduino (and reset)");          
          
          //refresh templates
          readTemplates();
          
          //send page
          try{
            c.write(HTTP_HEADER);  // answer that we're ok with the request and are gonna send html    
            c.write(monitorPage());
            c.stop();
          }catch(Exception e){println(e);}
          println ("...sent page.");
                         
        }catch (Exception e){
          println ("Error on connecting:"+e);
          c.write(HTTP_HEADER);  // answer that we're ok with the request and are gonna send html          
          c.write(configPage("<b>Connection to Arduino failed!</b><br><br>"+e.getMessage()));
          serialPort.stop();
        }
        return;
      }
    }

    //SERIAL.DAT
    if (url.length()>=10){
      if (url.substring(0,10).equals("serial.dat")){ //index
        if (pars!=null){
          if (pars.length()>0){
            //sndBuffer=oldBuffer;
            println("REQ: serial.dat - resend requested!");
            println("     prev.send: |"+oldBuffer+"|");
            println("     prev.rec : |"+pars+"|");
          }else{
            //sndBuffer=buffer;
            println("REQ: serial.dat");           
          }
        }//pars!=null
        updateStatus();
        try{
          c.write(HTTP_HEADER);  // answer that we're ok with the request and are gonna send html    
          //println("----Update---");
          //println(buffer+"|");        
          if (buffer.length()>0) c.write(msgStart+buffer+msgEnd);
          c.stop();
          //println("END: serial.dat");
          oldBuffer=buffer;
        }catch(Exception e){println("Serial.dat - Error:"+e);}
        //String t=testBuffer();
        //c.write(t);
        //println("|"+t+"|");
        buffer="";
        return;    
      }
    }
    
    //RESET.MSG
    if (url.equals("reset.msg")){ //reset
      println("MSG: RESET");      
      String reset="[reset]"+'\n';
      String cls="[cls]"+'\n';
      buffer="";
      serialPort.write(reset);
      buffer=cls;//"";
      c.stop();
      return;
    }
    
    //PAUSE.MSG
    if (url.equals("pause.msg")){ //reset
      println("MSG: PAUSE");      
      String pause="[pause]"+'\n';
      serialPort.write(pause);
      c.stop();
      return;
    }
    //PLAY.MSG
    if (url.equals("play.msg")){ //reset
      println("MSG: PLAY");      
      String play="[play]"+'\n';
      serialPort.write(play);
      c.stop();
      return;
    }

    //PROCESSING.MSG?jkhkhkjhdsa
    if (url.length()>15){
      println(url.substring(0,15)+"|");
      if (url.substring(0,15).equals("processing.msg?")){ //monitor page
        println("PRO:"+pars+"|");            
        if (pars.equals("disconnect")) {
          try{
            serialStop();
            buffer="[disconnect succes]\n";
          }catch(Exception e){
            buffer="[disconnect failed]\n";
          }
        }
        if (url.substring(15,24).equals("reconnect")){ //monitor page
          if (!serialActive){
            try{
              serialStart(strPort,baudrate);
              String start="[start]"+'\n';
              serialPort.write(start);
              //arduinoReset();
              buffer="[reconnect succes]\n";
            }catch(Exception e){
              buffer="[reconnect failed]\n";
            }
          }else{
            buffer="[reconnect succes]\n";
            println ("Already connected to Serial...");            
          }
        }
        return;        
      }
    }

    //ARDUINO.MSG?jkhkhkjhdsa
    if (url.length()>12){
      if (url.substring(0,12).equals("arduino.msg?")){ //monitor page
        println("ARD:"+pars+"|");            
        serialPort.write(pars+'\n');
        c.stop();        
        return;        
      }
    }

    //Handle all non specific pages 
    //
    String mime_header=null;
    if (ext.equals("htm"))  mime_header=HTTP_HEADER;
    if (ext.equals("html")) mime_header=HTTP_HEADER;
    if (ext.equals("ico"))  mime_header=ICO_HEADER;
    if (ext.equals("jpg"))  mime_header=JPG_HEADER;
    if (ext.equals("gif"))  mime_header=GIF_HEADER;
    if (ext.equals("png"))  mime_header=PNG_HEADER;
    if (ext.equals("css"))  mime_header=CSS_HEADER;
    if (ext.equals("js"))   mime_header=JS_HEADER;
    if (mime_header!=null){            
      println("REQ: "+url+" (of type "+ext+")");
      byte urlData[];
      if ( (ext.equals("htm")) || (ext.equals("html")) ) {
        String fullhtml = replaceIncludes(url);
        //fullhtml=makeCollapse(fullhtml);
        urlData = fullhtml.getBytes();    
      }else{
        urlData = loadBytes(url);      
      }
      if (urlData!=null){ 
        c.write(mime_header);  // answer that we're ok with the request and are gonna send png      
        for (int b=0;b<urlData.length;b++) c.write(urlData[b]);
        c.stop();
        return;
      }else{
        println("... not found!");
        //continu to NOT HANDLED
      }    
    }    

    try{
      c.write(HTTP_HEADER);  // answer that we're ok with the request and are gonna send html    
      c.write("<head><body><h3>The page '"+url+ "' was not found!</h3></body></html>");
      c.stop();
    }catch(Exception e){println(e);}
    println("REQUEST NOT HANDLED!");
    String orgUrl="";
    if (input.indexOf("GET")>-1)  orgUrl = input.substring(5, input.indexOf("HTTP")); // Only up to the newline
    if (input.indexOf("POST")>-1) orgUrl = input.substring(6, input.indexOf("HTTP")); // Only up to the newline
    //println(">>"+orgUrl);
    println(">>"+url+"|"+ext+"|"+pars);
          
  }
 }catch(Exception e){
    println("Error:"+e);
    c.stop();
 }
  
}

String replaceIncludes(String file){
   String html=join(loadStrings(file),"\n");   
   int includeIdx=html.lastIndexOf("%include:");
   while (includeIdx>-1){          
     int fileIdx=html.indexOf(":",includeIdx)+1;
     int fileEnd=html.indexOf("%",fileIdx);
     println(includeIdx+","+fileIdx+","+fileEnd);
     String fullInclude=html.substring(includeIdx,fileEnd+1);
     String filename=html.substring(fileIdx,fileEnd);
     String filetext=trim(join(loadStrings(filename),"\n"));
     println(fullInclude+","+filename);
     
     filetext=filetext.replace("&","&amp;");
     filetext=filetext.replace("<","&lt;");
     filetext=filetext.replace(">","&gt;");
     filetext=filetext.replace("\t","    ");//replace tabs with 4 white spaces
     
     filetext=makeCollapse(filetext);
     html=html.replace(fullInclude,filetext);
     //find second occurence
     includeIdx=html.lastIndexOf("%include:");
     println("end");
   
   }
   return html;    
}

String makeCollapse(String html){
   println("makeCollapse");
   String collapseBox ="<div class='collapsBox' onclick='toggle(this);' style='margin-left:%blockIndent%em;'>";
          collapseBox+= "<span class='cIndicatorP unselectable'>&plus;</span>";
          collapseBox+= "<span class='cIndicatorM unselectable'>&minus;</span>";
          collapseBox+= "<span class='cTitle unselectable'>%blockHeader%</span>";
          collapseBox+= "<div  class='cContent'>%blockContent%</div>";
          collapseBox+="</div>";

   int openIdx=html.lastIndexOf("//[");
   while (openIdx>-1){     
     int startOfBox=0;
     if (openIdx>0) startOfBox=html.substring(0,openIdx).lastIndexOf("\n")+1;     
     int indent=0;
     if (startOfBox<openIdx) indent=openIdx-startOfBox;
     int openEol=html.indexOf("\n",openIdx);
     int closeIdx=html.indexOf("//]",openIdx);     
     int closeEol=html.indexOf("\n",closeIdx);
     if (closeEol==-1) closeEol=html.length()-1;
     int contentEol=openEol+html.substring(openEol,closeIdx).lastIndexOf("\n");
     //println(indent+">"+startOfBox+","+openIdx+","+openEol);
     String blockHeader=html.substring(openIdx,openEol);
     String blockHeaderM=blockHeader.replace("//[","//");
     String blockContent=html.substring(openEol+1,contentEol);
     String blockContentM=unindentText(blockContent,indent);
     
     //String blockClose=html.substring(closeIdx,closeEol);     
     //String blockCloseM="";//blockClose.replace("//]","");     
     
     //println(blockHeader);
     String newHtml=collapseBox.replace("%blockIndent%",String.valueOf(indent/2));
            newHtml=newHtml.replace("%blockHeader%",blockHeaderM);
            newHtml=newHtml.replace("%blockContent%",blockContentM);
     int endOfPre=startOfBox;//-1;
     if (endOfPre<0) endOfPre=0;
     //one bug remains... two block without empty line are not correctly parsed yet
     //one bug remains... two block with empty line, the empty line is removed...
     //html=html.substring(0,endOfPre)+"{"+newHtml+"}"+html.substring(closeEol+1); //<>//
     html=html.substring(0,endOfPre)+newHtml+html.substring(closeEol+1);
     
     //find second occurence
     openIdx=html.lastIndexOf("//[");
   }
   //html=html.replaceAll("//]",collapseClose);
   return html;
}

String unindentText(String blockContent,int unindent){
     String[] linesContent=blockContent.split("\n");
     for (int i=0;i<linesContent.length;i++){
       if (linesContent[i].length()>=unindent)
         linesContent[i]=linesContent[i].substring(unindent);
     }
     return (join(linesContent,"\n"));  
}


void serialStop() throws Exception{
  try {
    serialPort.stop();
    serialPort=null;
    serialActive=false;
    println ("...stopped previous connection.");
  }catch(Exception e){
    println ("...no previous connection to stop.");
    throw e;
  }          
}
void serialStart(String strPort, int baudrate) throws Exception{
  //connect to com port
  println ("Try connecting Serial "+strPort+":"+baudrate+"...");        
  println ("...stopping previous connection...");  
  try{
    serialStop();
  }catch(Exception e){}
  println ("...starting new connection...");  
  try{
    serialPort = new Serial(this, strPort, baudrate);
    serialActive=true;
    //sPort.bufferUntil(lf);
    println ("...connected.");
  }catch(Exception e){
    println ("...connection attempt failed!");
    throw e;
  }                   
}

void loadSettings(){
   String[] settings=loadStrings("data/settings.txt");
   autodisconnect=settings[0];
   autoreconnect=settings[1];
}

void saveSettings(){
   String[] settings=new String[3];
   settings[0]=autodisconnect;
   settings[1]=autoreconnect;
   saveStrings("data/settings.txt",settings);
}

String configPage(String msg){
      String config=join(loadStrings("index.htm"),"\n");
      String[] ports = Serial.list();
      String portHTML="";
      for (int i=0;i<ports.length;i++){
        portHTML=portHTML+"<option value='"+ports[i]+"'>"+ports[i]+"</option>";
      }
      config=config.replace("%ports%",portHTML);
      String baudHTML="";
      int bauds[]={9600,19200,38400,57600,115200};
      for (int i=0;i<bauds.length;i++){
        baudHTML=baudHTML+"<option value='"+bauds[i]+"'>"+bauds[i]+"</option>";
      }
      config=config.replace("%baudrates%",baudHTML);
      config=config.replace("%message%",msg);
      //in HTML replace %...% with 'checked' 
      String val;
      if (autodisconnect.equals("true")) val="checked";else val="";
      config=config.replace("%autodisconnect%",val);
      if (autoreconnect.equals("true")) val="checked";else val="";
      config=config.replace("%autoreconnect%",val);
      return config;
}

String monitorPage (){
      String monitor=join(loadStringsEnc("monitor.html"),"\n");
      //in JAVASCRIPT replace %...% with 'true'
      String val;
      if (autodisconnect.equals("true")) val="true";else val="false";
      monitor=monitor.replace("%autodisconnect%",val);
      if (autoreconnect.equals("true")) val="true";else val="false";
      monitor=monitor.replace("%autoreconnect%",val);
      return monitor;
}

void serialEvent(Serial p){
  try{
    String newBuffer=p.readStringUntil(lf);
    //println("serialEvent");
    //println("readString:"+newBuffer+"|");
    if (newBuffer==null) return;
    if (newBuffer.length()>=12){
      if (newBuffer.substring(0,12).equals("[sketchpath:")) {
        String skPath=newBuffer.substring(12,newBuffer.indexOf("]"));
        String homePath=System.getProperty("user.home");
        String documentsPath=homePath+"\\Documents";
        String arduinoPath=documentsPath+"\\Arduino";
        skPath=skPath.replace("%documents%",documentsPath);
        skPath=skPath.replace("%home%",homePath);    
        skPath=skPath.replace("%arduino%",arduinoPath);
        //remove filename and make sure it ends with a slash
        skPath=pathFromFilePath(skPath);
        buffer="";
        newBuffer="[cls]";
        String skFilePath=skPath+"hsm_init.txt";
        newBuffer+=join(loadStrings(skFilePath),"\n");
        //println("Sketch file:"+skFilePath);
        //println("---DATA---");
        //println(buffer);
        //println("---EOF---");
      }
    }
    buffer=buffer+replaceBufferTemplates(newBuffer);
    //println("done templates");
    //println("Arduino In :|"+newBuffer+"|");
    //println("Mem. Buffer:|"+buffer+"|");
    //println("serialEvent END");
  }catch(Exception e){println("serialEvent: "+e);}
}

//isCmd checks if string contains command of format '[$$$:$$$$$$$$]'
int cmdOpen;
int cmdSep;
int cmdProp;
int cmdClose;
boolean cmdSlash=false;
boolean isCmd(String str,int i){
  cmdOpen=-1;
  cmdSep=-1;
  cmdProp=-1;
  cmdClose=-1;
  cmdSlash=false;
  int lvl=0;
  if (str.charAt(i)!='[') return false;
  cmdOpen=i;
  lvl=1;
  int chNr=i+1;
  if (str.charAt(chNr+1)=='/') {cmdSlash=true;return false;}   
  while (chNr<str.length()){
    if (str.charAt(chNr)=='[') lvl++;
    if (str.charAt(chNr)==']') lvl--;
    if ((cmdProp==-1) && (cmdSep==-1) && (str.charAt(chNr)=='.')) cmdProp=chNr;   
    if ((cmdSep ==-1) && (str.charAt(chNr)==':')) cmdSep=chNr;   
    if ((str.charAt(chNr)==']') && (lvl==0)) {
      cmdClose=chNr;
      if (cmdSep==-1) return false;
      return true;
    }
    chNr++;
  }    
  return false;
}

String replaceBufferTemplates(String rawBuffer){
  //buffer can contain, commands, html and javascript.
  //both commands and javascript use []-brackets (javascript for arrays)
  //[slider:slid1]
  //[slid1:100%]
  //[slid1.h:100%]
  //Replace commands [$1:$2] where $1 is a template with the corresponding control snippets
  int ch=rawBuffer.length()-1;
  //println(rawBuffer);
  while (ch>=0){
    if (isCmd(rawBuffer,ch)){
      String f=rawBuffer.substring(cmdOpen,cmdClose+1);
      String p1=rawBuffer.substring(cmdOpen+1,cmdSep);
      String p2=rawBuffer.substring(cmdSep+1,cmdClose);
      //println("Found cmd |"+p1+"|"+p2+"|");
      for (int i=0;i<ctrlTemplates.size();i++){
        if (ctrlTemplates.get(i).equals(p1)) {
//          println ("Found Snippet");
          String template="";
          for (int j=ctrlIdxFrom.get(i)+1;j<ctrlIdxTo.get(i)-1;j++)  template+=ctrlLines[j]+"\n";
          //replace %id% with p1
          template=template.replace("%id%",p2);
          println ("--template---");
          println (template);
          println ("-------------");
          rawBuffer=rawBuffer.replace(f,template);
        }//if
      }//for
    }//if isCmd
    ch--;
  }//while
  //println("----rawBuffer-----");
  //println(rawBuffer);
  //println("---------------");
  return rawBuffer;
}

String pathFromFilePath(String path){
  String skPath=path;
  String sChar;
  int bs=path.lastIndexOf('\\');
  int fs=path.lastIndexOf('/');
  int slash;
  if (bs>fs){
    slash=bs;
    sChar="\\";
  }else{
    slash=fs;
    sChar="/";
  }      
  if (path.substring(path.length()-4,path.length()).equals(".ino")){
     skPath = path.substring(0,slash+1);
     slash=max(path.lastIndexOf('\\'),path.lastIndexOf('/'));
  }
  if ((slash+1)!=skPath.length()) skPath=skPath+sChar;
  
  return skPath;
}

String[] loadStringsEnc(String filename){
  return loadStrings(filename);
  /*
  String[] lines = new String[0];
  
  File f = new File(dataPath(filename));
  
  if(f.exists()) {
    //lines = loadStrings(filename);

    try {
      // Open a stream to a File (in your data Folder) here 
      InputStream fi = createInput(filename);   
      // get a reader with your encoding 
      //InputStreamReader input = new InputStreamReader(fi, "iso-8859-1");
      InputStreamReader input = new InputStreamReader(fi, Charset.forName("UTF-8").newDecoder());
      BufferedReader reader = new BufferedReader(input);

      // read the file line by line
      String line;
      int counter = 0;
      while ((line = reader.readLine()) != null) {
        lines = append(lines, line);
        counter++; 
      }
      reader.close();
    } 
    catch (IOException e) {
      e.printStackTrace();
    }
  }
  return lines;
  */
}

void mouseClicked(){
  if (serialPort==null) return;
    /*
        String start="[reset]"+'\n';
        serialPort.clear();
        buffer="";
        //sPort.write(reset);
        delay(1000);
        serialPort.write(start);
        println("MouseDown");
        */
}