  var canvas; 
  var ctx; 
  var interval;
  var xmlhttp=new XMLHttpRequest();
  var xmlhttpSend=new XMLHttpRequest();
  var log;
  var msgStart=2;//ASCII meaning: STX (start of text)
  var msgEnd  =3;//ASCII meaning: ETX (end of text)
  
  //WATCH THIS FUNCTION, THE LONGER THE LOG, THE SLOWER THE UPDATES!!!!
  function printConsole(msg){	  
      //if console is collapsed/minimized we do not register the console messages
	  if (cons.style.display=="") return;
	  
	  //check if user is viewing other lines than the bottom few and if so turn of autoscroll
	  var autoScroll=false;
	  if (cons.scrollHeight-cons.offsetHeight-cons.scrollTop <5) autoScroll=true;	  
	  
	  var caller=arguments.callee.caller.toString()+"\n";
	  var fName = arguments.callee.caller.name +"\n";
	  
      cons.innerText=cons.innerText+fName+msg+"\n";
	  var tmp=cons.innerText;
	  
	  //to much text in console will slow down the page, so we delete lines older than 128 ago 
	  var maxL=1024;
	  var nrL=0;
	  var maxL=128;	  
	  for (var i=tmp.length-5;i>0;i--){
		  if (tmp.charCodeAt(i)==13) nrL++;
		  if (tmp.charCodeAt(i)==10) nrL++;
		  if (nrL>=maxL) {
			// if not autoScroll than we may delete lines the user is watching
			if (autoScroll){  
			  tmp=tmp.substring(i,tmp.length);
			  cons.innerText=tmp;			  
			  i=-1;
			}
		  }
	  }	
	  
	  //depending on value of autoscroll we change background color and scroll to bottom line
	  if (!autoScroll) cons.style.backgroundColor="orange";
	  if (autoScroll) cons.style.backgroundColor="yellow";
	  if (autoScroll) cons.scrollTop = cons.scrollHeight;      
  }    
  
  document.addEventListener('DOMContentLoaded',initCanvas,false);
  function initCanvas(){    
    log=document.getElementById('Log');
	
	cons=document.getElementById('Console');
    //set console to bottom soo autoscroll is enabled initialy
    cons.scrollTop = cons.scrollHeight;
  	
    printConsole('initCanvas');
    refreshMONITOR();
    //"  document.addEventListener('keydown', keyDownTextField, false);
  }
  
  //isCmd checks if string contains command of format '[$$$:$$$$$$$$]'
  var cmdOpen;
  var cmdSep;
  var cmdProp;
  var cmdClose;
  var cmdSlash=false;
  function isCmd(str,i){
	  cmdOpen=-1;
	  cmdSep=-1;
	  cmdProp=-1;
	  cmdClose=-1;
	  cmdSlash=false;
	  var lvl=0;
	  if (str.charAt(i)!='[') return false;
	  cmdOpen=i;
	  lvl=1;
	  var chNr=i+1;
	  if (str.charAt(chNr+1)=='/') {cmdSlash=true;return false;}   
	  while (chNr<str.length){
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
  function nxtCmd(str,i){
	  for (var j=i;j<str.length;j++){
		  if (isCmd(str,j)) return j;
	  }
	  return -1;
  }
  
  function nxtScript(str,i){
	  return str.substring(i,str.length).indexOf("<script>");
  }
  function endScript(str,i){
	  return str.substring(i,str.length).indexOf("</script>");
  }
  var r=0;
  var scripts="";
  var evalScripts=false;
  var paused=false;
  var serialActive=true; //probably should set it on load, and not only change it on '[reconnect succes]' and '[disconnect succes]'
  function procesData(aB){
	//alert(aB);  
    printConsole('-------RECEIVED-------');
    printConsole('|'+aB+"|");
	printConsole('----------------------');	
    while (aB.length>0){
	  
	  //FIRST WE EVALUATE COMMANDS	  	  
	  if (aB.indexOf('[disconnect succes]')!=-1) {serialActive=false;aB=aB.substring(aB.indexOf('\n')+1,aB.length);}
	  if (aB.indexOf('[disconnect failed]')!=-1) {/* do nothing */   aB=aB.substring(aB.indexOf('\n')+1,aB.length);} 
	  if (aB.indexOf('[reconnect succes]')!=-1)  {serialActive=true; aB=aB.substring(aB.indexOf('\n')+1,aB.length);}
	  if (aB.indexOf('[reconnect failed]')!=-1)  {/* do nothing */   aB=aB.substring(aB.indexOf('\n')+1,aB.length);} 
	  //should implement '[connect failed/succes]' here and put in buffer from processing sketch
	  
	  while (aB.indexOf('[cls]')!=-1) { //check for and get last [cls]
		log.innerHTML='';
	    aB="<!--cls-->"+aB.substring(aB.indexOf('[cls]')+5,aB.length); 
		aB=aB.trim();
		printConsole("CLS");		  			  
	  }
	  if (isCmd(aB,0)) { //check for command e.g. [id.prop:10]
		  //printConsole('CMD');
		  //printConsole(aB.substring(cmdOpen,cmdClose+1));
		  //printConsole("> "+cmdOpen+","+cmdProp+","+cmdSep+","+cmdClose);
		  var id;
		  var val;
		  var propId='';
		  if (cmdProp!=-1) {
			  id=aB.substring(1,cmdProp);
			  propId=aB.substring(cmdProp+1,cmdProp+2);
		  }else{
			  id=aB.substring(1,cmdSep);
			  propId='';
		  }			  
		  val=aB.substring(cmdSep+1,cmdClose)
		  var elem=document.getElementById(id);
		  if (elem===null) {
			  printConsole("!! Element "+id+ " not found!");
			  alert("You try to change '"+propId+"' of '"+id+"', which does not exist!");
		  }else{
			  if (propId=='') { //no property so default property data-value is called
			    if (elem.hasAttribute("data-value")){
			      var ival=elem.getAttribute("data-value");
				  if (ival=="") {
					ival=val;
				  }else{					  
					ival=ival+";"+val;
				  }
				  elem.setAttribute("data-value",ival);			  
				  //if (elem.id=="osc") osc_handleVal(val);
				  printConsole("Queue of "+elem.id+":"+ival);				  				  
				}else{			//if property data-value not available then innerHTML is default
				  elem.innerHTML=val;
				}
			  }
			  if (propId=='t') centerLabel(id,val);
			  if (propId=='i') elem.innerHTML=val;
			  if (propId=='v') elem.visibility=val;
			  if (propId=='d') elem.display=val;
			  if (propId=='z') elem.style.zIndex=val;
			  if (propId=='f') elem.float=val;
			  if (propId=='s') elem.style=elem.getAttribute("style")+";"+val;			  
			  if (propId=='p') elem.style.position=val;
			  if (propId=='l') {
				coords=val.trim().split(' ');
				elem.style.position="absolute";
				elem.style.left  =coords[0];
				elem.style.top   =coords[1];
				elem.style.width =coords[2];
				elem.style.height=coords[3];			
			  }
			  if (propId=='w') {elem.style.width=val;elem.width=val;}//both width and style.width  to accomodate canvas
			  if (propId=='h') {elem.style.height=val;elem.height=val;}//both height and style.height  to accomodate canvas
			  if (propId=='n') elem.style.font=val;
			  if (propId=='c') elem.style.color=val;
			  if (propId=='r') elem.style.border=val;
			  if (propId=='b') elem.style.background=val;
			  //printConsole('-------CMD-------');
			  //printConsole('elem:'+elem.id);		  
			  //printConsole('|'+aB.substring(0,cmdClose+1)+"|");
			  //printConsole('-----------------');		  
		  }//if elem===null
		  aB=aB.substring(cmdClose+1,aB.length);
		  aB=aB.trim();
		  //printConsole('trunc2->'+aB);
	  }
	  //END OF EVALUATE COMMANDS
	  //THEN WE EVALUATE HTML
	  if (aB.length>0) {
		//printConsole('HTML');
		var nextCmd=nxtCmd(aB,0);
		var nextScript=nxtScript(aB,0);
		if (nextScript==-1) 	nextScript=aB.length+1;
		if (nextCmd==-1)    	nextCmd=aB.length+1;
		var endHTML=aB.length;		
		if (nextScript<endHTML) endHTML=nextScript;
		if (nextCmd<endHTML)    endHTML=nextCmd;
		  //endHTML=aB.length;
		  //if (nextCmd<endHTML)    endHTML=nextCmd;
		if (endHTML>0){
		  var eol=String.fromCharCode(13,10);
		  var ht=aB.substring(0,endHTML);
		  /*
		  printConsole('----ASCII  IN----');
		  var s="";
		  for (var i=0;i<ht.length;i++){s=s+pad(ht.charCodeAt(i))+" ";}
		  printConsole('|'+s+"|");
		  */
		  ht=ht.replaceAll(eol,"<br>"+eol);	  
		  if (ht.length>0) ht+="<br>";
		  ht=ht.replaceAll("<br>"+eol+"<br>","<br>"+eol);
		  if (ht.length>0) log.innerHTML=log.innerHTML+ht;//aB.substring(0,endHTML)+'<br>';		  
		  /*
		  printConsole('----ASCII OUT----');
		  s="";
		  for (var i=0;i<ht.length;i++){s=s+pad(ht.charCodeAt(i))+" ";}		  
		  printConsole('|'+s+"|");
		  printConsole('-----HTML OUT----');
		  printConsole(ht);
		  printConsole('-----------------');		  
		  */
		  aB=aB.substring(endHTML,aB.length);
		  aB=aB.trim();
		}
		//printConsole('trunc3->'+aB);
	  }
	  //END OF EVALUATE HTML
	  r++;
	  //LAST WE EVALUATE SCRIPT
	  if (aB.trim().length>0) {
		if (nxtScript(aB,0)==0){
		  var lastScript=endScript(aB,0);
		  var script=aB.substring(8,lastScript);
		  scripts=scripts+"\n"+script;
		  //alert(script);
		  aB=aB.substring(lastScript+9,aB.length);
		  aB=aB.trim();
		  evalScripts=true;
		  //eval(script); scripts should be build at once
		  //printConsole('-----SCRIPT------');
		  //printConsole('|'+script+"|");
		  //printConsole('-----------------');		  
		}
	  }	  
	  //END EVALUATE SCRIPT
	  
	}//WHILE
	if (evalScripts){
	  eval(scripts);
	  evalScripts=false;
	}
	//printConsole('-----SCRIPTS------');
	//printConsole('|'+scripts+"|");
	//printConsole('-----------------');		  	
	
		
	//check if page begins with cls	
	var src=log.innerHTML;
	//src=src.replaceAll("</td>","|||");
	document.getElementById("Source").innerText=src;
	
  }

  //sometimes refreshMonitor/xmlHTTP crashes. We monitor and restart if necessary
  var lastUpdate;
  updateChecker=setInterval(checkRefresh,500);
  function checkRefresh(){
	 var timeOut=3000;
	 var check; 
	 check=(new Date).getTime();
	 if ((check-lastUpdate)>timeOut){
		//alert ("RefreshMonitor not running!");
		lastUpdate=(new Date).getTime();
		refreshMONITOR();
	 }
  }
	
    
  //first some debug vars for refreshMonitor.
  var buffer="";  
  var d0=new Date();
  var m0=d0.getMilliseconds();  		
  //This is the main loop of this script, RefreshMonitor
  var reponseTimeout;
  function refreshMONITOR( ){	     
    xmlhttp.open('POST','serial.dat'+ack,true);
    xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send();
	//if we don't receive reply, we manually call refreshMonitor after timeout
	reponseTimeout=setTimeout(
	  function(){
		printConsole("No response received on data request!");		  
		refreshMONITOR();
	  }
	  ,400);
  }
  //sometimes we don't get a response so we wait and fire refreshMonitor again if needed
  //We set up the call back function if we receive something
  var ack="";
  var nrPartials=0;
  xmlhttp.onreadystatechange=function(){
      if (xmlhttp.readyState==4){ // && xmlhttp.status==200){
		clearTimeout(reponseTimeout);
        var aB=xmlhttp.responseText;
        if (aB.length>0) printConsole('full:'+aB+"|");
		//debug
		var d=new Date();
		var m=d.getMilliseconds()-m0;  
		lastUpdate=(new Date).getTime();
		buffer+="\n---"+m+"\n"+aB;
		if (buffer.length>500) buffer=buffer.substring(buffer.length-500);
		//
        if (aB) {
		  if (aB.length>0){
			var firstCharCode = aB.charCodeAt(0);
			var lastCharCode  = aB.charCodeAt(aB.length-1);
			if ( (firstCharCode != msgStart) || (lastCharCode != msgEnd)  ) {					
			     printConsole("Received incomplete message!");	
				 nrPartials++;
				 document.getElementById("NR").innerText=""+nrPartials;
				 document.getElementById("NR").style.backgroundColor="red";
				 //ack="?resend";				 
			     ack="?resend="+firstCharCode+","+lastCharCode+":"+aB;				 
			}else{
				printConsole("OK");	
				 aB=aB.substring(1,aB.length-1);
			     procesData(aB);
				 document.getElementById("NR").style.backgroundColor="gray";
			     ack="";
			}
		  }//if (aB.length>0)
		}//if (aB)
		setTimeout(refreshMONITOR,20);//leave some time for other things (100ms) 
      } //if+
  }; //onreadystatechange
  xmlhttp.onerror=function(){printConsole("Error on requesting serial.dat");};

  function keyDownTextField(e) {
    printConsole('keyDown: '+e.keyCode);
    var keyCode = e.keyCode;
    xmlhttp.open('GET','/KeyDown?key='+keyCode,true);
    xmlhttp.send();
    xmlhttp.onreadystatechange=function(){
      if (xmlhttp.readyState==4 && xmlhttp.status==200){
        setTimeout(refreshMONITOR,0);
      }//if readyState
    }//onreadystatechange=function
  }
  
  function centerLabel(id,text){	  
    try{
	  var lbl;
	  lbl=document.getElementById(id+"_label");
	  if (lbl==null){
		lbl = document.createElement("span");
        lbl.appendChild(document.createTextNode('text'));
	    document.getElementById("Log").appendChild(lbl);
	    lbl.id=id+"_label";
        lbl.style.display = "block";
	    lbl.style.position = "absolute";
	  }
      var cnt=document.getElementById(id);
	  lbl.innerText=text;
	  //lbl.style.border="1px solid black";
      var x=cnt.offsetLeft+cnt.offsetWidth/2-lbl.offsetWidth/2;
	  var y=cnt.offsetTop+cnt.offsetHeight;
	  //alert (cnt.offsetLeft+","+cnt.offsetWidth+","+lbl.offsetWidth+": "+id+":"+x+","+y);	  	  
	  lbl.style.left=x+"px";
	  lbl.style.top=y+"px";
	}catch(err){alert(id+":"+err);}	
  }
  
  function sendMsg(msg){
    xmlhttp.open('POST',msg.replace(" ","_")+'.msg',true);
    xmlhttp.send();
  }
  function sendArduino(msg){
    xmlhttp.open('POST',"arduino.msg?"+msg.replace(" ","_"),true);
    xmlhttp.send();
  }
  function sendProcessing(msg){  
    printConsole("processing.msg?"+msg.replace(" ","_"));
    xmlhttp.open('POST',"processing.msg?"+msg.replace(" ","_"),true);
    xmlhttp.send();
  }
    
  function scrollLog() {
    var Log = document.getElementById("Log");
    Log.scrollTop = Log.scrollHeight;	
  }
  setInterval(scrollLog, 200);
  
  function pad(num) {
    var s = "000" + num;
    return s.substr(s.length-3);
  }

  String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
  };

  
  
