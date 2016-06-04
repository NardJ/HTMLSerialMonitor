//For some css shapes to incorporate into your controls: see https://css-tricks.com/examples/ShapesOfCSS/

//========================================================================================
//Horizontal progress bar (slider) 
//if data-value="min max" then scale is set
//if data-value="val" (no spaces) then progress is set
//default range is 0 to 1024
[hslider]
<div id="%id%" 
	data-value="512" 
	style="width:50px;height:10px;border:1px solid black;position:relative;display:inline-block;">
	<div id="%id%bar" style="width:50%;height:100%;background:#0000FF;"> 
	</div>
</div>

<script>
  var %id%_min=0;
  var %id%_max=1024;  
  var %id%_val=512;  
  function %id%_handleVal(val){
    var sc=val.trim().split(" ");
	if (sc.length==2) {
	  //alert("scale");
	  %id%_min=parseFloat(sc[0]);  
	  %id%_max=parseFloat(sc[1]);  
	  return;
	}
	%id%_val=val;  
	%id%_redraw();
  }

  function %id%_redraw(){
	var rel=100*(%id%_val-%id%_min)/(%id%_max-%id%_min);  
	if (rel<0) rel=0;
	if (rel>100) rel=100;
	var fChild=document.getElementById('%id%bar');	  
	fChild.style.width=rel+"%";
  }

    //https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  var slider_%id% = document.getElementById("%id%");
  var observer_%id% = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
	  var val=slider_%id%.getAttribute("data-value");
	  if (val.trim()=="") return; //following will call this function with empty val
	  slider_%id%.setAttribute("data-value","");
	  var vals=val.split(";");
	  //only last value matters
	  %id%_handleVal(vals[vals.length-1]);
    });    
  });
  var config_%id% = { attributes: true, 
					  attributeFilter: ["data-value"],
					  childList: false, 
					  characterData: false };
  observer_%id%.observe(slider_%id%, config_%id%);
  // observer.disconnect();
  // apply initial set value in initial.txt
  slider_%id%.setAttribute("data-value",slider_%id%.getAttribute("data-value"));
  
</script>

[/hslider]

//========================================================================================
//Vertical progress bar (slider) 
//if data-value="min max" then scale is set
//if data-value="val" (no spaces) then progress is set
//default range is 0 to 1024
[vslider]
<div style="display:inline-block;">
  <div id="%id%" 
	 data-value="60%" 
	 style="width:10px;height:50px;border:1px solid black;position:relative;display:table-cell;vertical-align:bottom">
    <div id="%id%bar" style="width:100%;height:50%;background:#0000FF;"> 
    </div>
  </div>
</div>
  
<script>

  function resizeParent(el){
	  alert("n");
	 el.parentElement.style.width=el.style.width;
	 el.parentElement.style.height=el.style.height;
  }
  var %id%_min=0;
  var %id%_max=1024;  
  var %id%_val=512;  
  function %id%_handleVal(val){
    var sc=val.trim().split(" ");
	if (sc.length==2) {
	  //alert("scale");
	  %id%_min=parseFloat(sc[0]);  
	  %id%_max=parseFloat(sc[1]);  
	  return;
	}
	%id%_val=val;  
	%id%_redraw();
  }

  function %id%_redraw(){
	var rel=100*(%id%_val-%id%_min)/(%id%_max-%id%_min);  
	if (rel<0) rel=0;
	if (rel>100) rel=100;
	var fChild=document.getElementById('%id%bar');	  
	fChild.style.height=rel+"%";
  }

  //https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  var slider_%id% = document.getElementById("%id%");
  var observer_%id% = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
	  var fChild=document.getElementById('%id%bar');
	  var val=slider_%id%.getAttribute("data-value");
	  if (val.trim()=="") return; //following will call this function with empty val
	  slider_%id%.setAttribute("data-value","");
	  var vals=val.split(";");
	  //only last value matters
	  %id%_handleVal(vals[vals.length-1]);
    });    
  });
  var config_%id% = { attributes: true, 
					  attributeFilter: ["data-value"],
					  childList: false, 
					  characterData: false };
  observer_%id%.observe(slider_%id%, config_%id%);
  // observer.disconnect();
  // apply initial set value in initial.txt
  slider_%id%.setAttribute("data-value",slider_%id%.getAttribute("data-value"));

</script>

[/vslider]

//========================================================================================
//Indicator (think led light on control panel) 
//data-value sets state (0 or 1)
[indicator]
<div id="%id%" 
	 data-value="1" 
	 style="
		position:relative;
		display:inline-block;
		width:16px;height:16px;
		padding:0;
		border:1px solid black;
		background:white;
		-moz-border-radius:50%;
		-webkit-border-radius:50%;
		border-radius:50%;
	 ">
	<div id="%id%inner" 
		data-value="1" 
		style="
		    position:absolute;
			top:10%;left:10%;
			width:80%;height:80%;
			padding:0;
			margin:auto;
			border:0px solid red;
			background:red;
			-moz-border-radius:50%;
			-webkit-border-radius:50%;
			border-radius:50%;
		">
	</div>
</div>

<script>
  function %id%_handleVal(val){}
  //https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  var indicator_%id% = document.getElementById("%id%");
  var observer_%id% = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
	  var fChild=document.getElementById('%id%inner');
	  var val=indicator_%id%.getAttribute("data-value");
	  if (val.trim()=="") return; //following will call this function with empty val
	  indicator_%id%.setAttribute("data-value","");
	  var vals=val.split(";");
      if (vals[vals.length-1]=="1"){
		  //fChild.style.visibility="visible";
		  fChild.style.backgroundColor="#FF0000";
	  }else{
		  //fChild.style.visibility="hidden";
		  fChild.style.backgroundColor="#FFEEEE";
	  }
    });    
  });
  var config_%id% = { attributes: true, 
					  attributeFilter: ["data-value"],
					  childList: false, 
					  characterData: false };
  observer_%id%.observe(indicator_%id%, config_%id%);
  // observer.disconnect();
  // apply initial set value in initial.txt
  indicator_%id%.setAttribute("data-value",indicator_%id%.getAttribute("data-value"));
</script>

[/indicator]

//========================================================================================
//Turn Button (think led light on control panel) 
//if data-value="min max" then scale is set
//if data-value="val" (no spaces) then progress is set
//default range is 0 to 1024
[turnbutton]
<canvas id="%id%" 
		width="50px" height="50px" <!-- to prevent large initial canvas -->
		data-value="100" 
		style="border:0px solid black;display:inline-block;">  
</canvas>

<script>
  var %id%_min=0;
  var %id%_max=1024;  
  var %id%_val=512;  
  function %id%_handleVal(val){
    var sc=val.trim().split(" ");
	if (sc.length==2) {
	  //alert("scale");
	  %id%_min=parseFloat(sc[0]);  
	  %id%_max=parseFloat(sc[1]);  
	  return;
	}
	%id%_val=val;  
	%id%_redraw();
  }
  
  function %id%_redraw(val){
	var rel=100*(%id%_val-%id%_min)/(%id%_max-%id%_min);  
	if (rel<0) rel=0;
	if (rel>100) rel=100;

    var cnv_%id%=document.getElementById("%id%");
	var ctx_%id%=cnv_%id%.getContext("2d");
    var rw=cnv_%id%.width;
	var rh=cnv_%id%.height;
	ctx_%id%.clearRect(0,0,rw,rh);
    var x=rw/2;
	var y=rh/2;
	var r=rw*0.4;
	var lw=(x-r)*2;
	ctx_%id%.lineWidth=lw;
	//draw background curve
    ctx_%id%.beginPath();
    ctx_%id%.arc(x,y,r,0.75*Math.PI,(0.75+1.5)*Math.PI);//x,y,radius,fromRad,toRad
    ctx_%id%.strokeStyle="#DDDDFF";
    ctx_%id%.stroke();	
	//draw progress curve
	ctx_%id%.beginPath();
    ctx_%id%.arc(x,y,r,0.75*Math.PI,(0.75+rel/100*1.5)*Math.PI);//x,y,radius,fromRad,toRad
    ctx_%id%.strokeStyle="#0000FF";
    ctx_%id%.stroke();	
  }
	
  //https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  var tb_%id% = document.getElementById("%id%");
  var observer_%id% = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
	  var val=tb_%id%.getAttribute("data-value");
	  if (val.trim()=="") return; //following will call this function with empty val
	  tb_%id%.setAttribute("data-value","");
	  var vals=val.split(";");
	  //only last value matters
	  %id%_handleVal(vals[vals.length-1]);	  
    });    
  });
  var config_%id% = { attributes: true, 
					  attributeFilter: ["data-value"],
					  childList: false, 
					  characterData: false };
  observer_%id%.observe(tb_%id%, config_%id%);
  // observer.disconnect();
  // apply initial set value in initial.txt
  tb_%id%.setAttribute("data-value",tb_%id%.getAttribute("data-value"));
</script>

[/turnbutton]

//========================================================================================
//xy LINE plot, only values within range of x and y axies are shown 
//Last N values (Y) shown 
//if data-value="cls" then nrpoints=0
//if data-value="nrP xfrom xto yfrom yto" then scale is set
//if data-value="xpoint ypoint" (no spaces) then val is added to data list
//default shows history of 20 points and range of 0-1024 (Analog range Arduino)
[xyline] 

<canvas id="%id%" 
		width="150px" height="50px"
		data-value="20 -1024 -1024 1024 1024" 
		style="border:1px solid black;display:inline-block;">  
</canvas>

<script>
  var cnv_%id%=document.getElementById("%id%");
  var ctx_%id%=cnv_%id%.getContext("2d");
  var %id%_xpoints=[0,0,0,0,0,0,0,0,0,0];
  var %id%_ypoints=[0,0,0,0,0,0,0,0,0,0];
  var %id%_nrP=10;//nrPoints to show
  var %id%_x1=-1024;
  var %id%_x2=1024;  
  var %id%_y1=-1024;
  var %id%_y2=1024;  
  function %id%_handleVal(val){
	val=val.trim();  
    if (val=="cls") {
	  for (var i=0;i<%id%_nrP;i++) {
	    %id%_xpoints[i]=0;
		%id%_ypoints[i]=0;
		%id%_redraw();
		return;
	  }
	}
	var sc=val.split(" ");
	if (sc.length==5) {
	  //alert("scale");
	  %id%_nrP=parseInt(sc[0]);  
	  %id%_x1=parseFloat(sc[1]);  
	  %id%_y1=parseFloat(sc[2]); 
	  %id%_x2=parseFloat(sc[3]);  
	  %id%_y2=parseFloat(sc[4]); 
	  //make array and fill with zeros
	  for (var i=0;i<%id%_nrP;i++) {
	    %id%_xpoints[i]=0;
		%id%_ypoints[i]=0;
	  }
	  %id%_redraw();
	  return;
	}
	//else shift point and add point as last
	printConsole("received:"+sc);
	%id%_xpoints.shift();
	%id%_ypoints.shift();
	%id%_xpoints[%id%_nrP-1]=parseFloat(sc[0]);
	%id%_ypoints[%id%_nrP-1]=parseFloat(sc[1]);
	%id%_redraw();
  }
  
  function %id%_redraw(){
	try{
    var rw=cnv_%id%.width;
	var dx=rw/(%id%_x2-%id%_x1);
	
	var rh=cnv_%id%.height;
	var dy=rh/(%id%_y2-%id%_y1);
	
	ctx_%id%.clearRect(0,0,rw,rh);
	
	ctx_%id%.lineWidth=2;
    ctx_%id%.lineCap="round";
    for (var i=0;i<%id%_nrP-1;i++) {
	  var xf=(%id%_xpoints[i]-%id%_x1)*dx;
	  var yf=rh-(%id%_ypoints[i]-%id%_y1)*dy;
	  var xt=(%id%_xpoints[i+1]-%id%_x1)*dx;
	  var yt=rh-(%id%_ypoints[i+1]-%id%_y1)*dy;
	  //var raw=i+" points: "+%id%_xpoints[i]+","+%id%_ypoints[i]+" "+%id%_xpoints[i+1]+","+%id%_ypoints[i+1];
	  //var out=i+" line  : "+xf+","+yf+" "+xt+","+yt;
	  //printConsole(raw);
	  //printConsole(out);
	  ctx_%id%.beginPath();    
	  var grad=ctx_%id%.createLinearGradient(xf,yf,xt,yt);
	  var lf=Math.floor(255*(%id%_nrP-i)/%id%_nrP);
	  grad.addColorStop(0,"rgb("+lf+","+lf+",255)");
	  var lt=Math.floor(255*(%id%_nrP-i-1)/%id%_nrP);
	  grad.addColorStop(1,"rgb("+lt+","+lt+",255)");
	  ctx_%id%.strokeStyle=grad;
	  ctx_%id%.moveTo(xf,yf);
	  ctx_%id%.lineTo(xt,yt);	  
	  ctx_%id%.stroke();
	  ctx_%id%.closePath();    	
	}
	
    }catch(err){alert (err);printConsole(err);}
  }
  %id%_redraw();
  
  var xyl_%id% = document.getElementById("%id%");
  var observer_%id% = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
	  var val=xyl_%id%.getAttribute("data-value");
	  if (val.trim()=="") return; //following will call this function with empty val
	  xyl_%id%.setAttribute("data-value","");
	  var vals=val.split(";");
	  for (var i=0;i<vals.length;i++) %id%_handleVal(vals[i]);	  
    });    
  });
  var config_%id% = { attributes: true, 
					  attributeFilter: ["data-value"],
					  childList: false, 
					  characterData: false };
  observer_%id%.observe(xyl_%id%, config_%id%);
  // observer.disconnect();

  // apply initial set value in initial.txt
  xyl_%id%.setAttribute("data-value",xyl_%id%.getAttribute("data-value"));
  
</script>

[/xyline] 

//========================================================================================
//bar plot
//if data-value="cls" then all bars are set to 0
//if data-value="nrBars minY maxY" then scale is set
//if data-value="x y"  then bar x is set to height y
//default show 5 bars with range of 0-1024 (Analog range Arduino)
[bars]
<canvas id="%id%" 
		width="150px" height="50px"
		data-value="5 0 1024" 
		style="border:1px solid black;display:inline-block;">  
</canvas>

<script>
  var cnv_%id%=document.getElementById("%id%");
  var ctx_%id%=cnv_%id%.getContext("2d");
  var %id%_points=[0,0,0,0,0];
  var %id%_nrP=5;//nrPoints to show
  var %id%_y1=0;
  var %id%_y2=1024;  

  function %id%_handleVal(val){
    val=val.trim();  
    if (val=="cls") {
	  for (var i=0;i<%id%_nrP;i++) {
	    %id%_points[i]=0;
		%id%_redraw();
		return;
	  }
	}
	var sc=val.split(" ");	      
	if (sc.length==3){
	  //alert("scale");
	  var sc=val.split(" ");
	  %id%_nrP=parseFloat(sc[0]);  
	  %id%_y1=parseFloat(sc[1]);  
	  %id%_y2=parseFloat(sc[2]); 
	  //make array and fill with zeros
	  for (var i=0;i<%id%_nrP;i++) %id%_points[i]=0;
	  %id%_redraw();
	  return;
	}
	//else adjust bars
	x=parseFloat(sc[0]);  
	y=parseFloat(sc[1]); 
	if (y<%id%_y1) y=0;
	//if (y>%id%_y2) y=y2;
	%id%_points[x]=y;
  	%id%_redraw();
  }
  
  function %id%_redraw(){
    var rw=cnv_%id%.width;
	var dx=rw/%id%_nrP;			//interval between bars
	var ddx=dx*0.1;				//margin between bars
	var rh=cnv_%id%.height;
	var dy=rh/(%id%_y2-%id%_y1);
	var d="";
	var y=rh-(%id%_points[0]-%id%_y1)*dy;
		
	ctx_%id%.clearRect(0,0,rw,rh);
	var grad_%id%=ctx_%id%.createLinearGradient(0,rh,0,0);
	grad_%id%.addColorStop(0,"blue");
	grad_%id%.addColorStop(0.8,"red");
	ctx_%id%.fillStyle=grad_%id%;	
    for (var i=0;i<%id%_nrP;i++) {
	  var x=dx*i;
	  var y=rh-(%id%_points[i]-%id%_y1)*dy;
	  ctx_%id%.fillRect(x+ddx,rh-%id%_points[i]*dy,dx-2*ddx,%id%_points[i]*dy);
	}
  }
  %id%_redraw();
  
  var bar_%id% = document.getElementById("%id%");
  var observer_%id% = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
	  var val=bar_%id%.getAttribute("data-value");
	  if (val.trim()=="") return; //following will call this function with empty val
	  bar_%id%.setAttribute("data-value","");
	  var vals=val.split(";");
	  for (var i=0;i<vals.length;i++) %id%_handleVal(vals[i]);	  
    });    
  });
  var config_%id% = { attributes: true, 
					  attributeFilter: ["data-value"],
					  childList: false, 
					  characterData: false };
  observer_%id%.observe(bar_%id%, config_%id%);
  // observer.disconnect();

  // apply initial set value in initial.txt
  bar_%id%.setAttribute("data-value",bar_%id%.getAttribute("data-value"));
  
</script>

[/bars]

//========================================================================================
//Last N values (Y) shown at set interval
//if data-value="cls" then nrpoints=0
//if data-value="nrP yfrom yto" (has space) then scale is set
//if data-value="nr" (no spaces) then val is added to data list
//default show history of 20 points and range of 0-1024 (Analog range Arduino)
[yline]
<canvas id="%id%" 
		width="150px" height="50px"
		data-value="20 0 1024" 
		style="border:1px solid black;display:inline-block;">  
</canvas>

<script>
  var cnv_%id%=document.getElementById("%id%");
  var ctx_%id%=cnv_%id%.getContext("2d");
  var %id%_points=[0,0,0,0,0,0,0,0,0,0];
  var %id%_nrP=10;//nrPoints to show
  var %id%_y1=0;
  var %id%_y2=700;  

  function %id%_handleVal(val){
	val=val.trim();  
    if (val=="cls") {
	  for (var i=0;i<%id%_nrP;i++) {
	    %id%_points[i]=0;
		%id%_redraw();
		return;
	  }
	}
	if (val.indexOf(" ")>0) {
	  //alert("scale");
	  var sc=val.split(" ");
	  %id%_nrP=parseFloat(sc[0]);  
	  %id%_y1=parseFloat(sc[1]);  
	  %id%_y2=parseFloat(sc[2]); 
	  //make array elements and fill with zeros
	  for (var i=0;i<%id%_nrP;i++) %id%_points[i]=0;
	  %id%_redraw();
	  return;
	}
	//else shift point and add point as last
	%id%_points.shift();
	%id%_points[%id%_nrP-1]=parseFloat(val);
    printConsole((%id%_nrP-1)+": "+val+" -> "+%id%_points[%id%_nrP-1]);
	%id%_redraw();
  }

  var %id%_sizeIsSet=false;  
  function %id%_redraw(){	 
    var rw=parseInt(cnv_%id%.width);
	var dx=rw/(%id%_nrP-1);
	var rh=parseInt(cnv_%id%.height);
	var dy=rh/(%id%_y2-%id%_y1);

	var y=rh-(%id%_points[0]-%id%_y1)*dy;
		
	ctx_%id%.clearRect(0,0,rw,rh);
	ctx_%id%.beginPath();
    ctx_%id%.moveTo(0,y);
	for (var i=1;i<%id%_nrP;i++) {
	  var x=dx*i;
	  var y=rh-(%id%_points[i]-%id%_y1)*dy;
	  ctx_%id%.lineTo(x,y);
	}
	ctx_%id%.lineCap="round";
    ctx_%id%.lineWidth=2;
    ctx_%id%.strokeStyle="#0000FF";
    ctx_%id%.stroke();
	
  }
  %id%_redraw();
  
  var yl_%id% = document.getElementById("%id%");
  var nr=0;
  var observer_%id% = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
	  //printConsole('redraw call');
	  var val=yl_%id%.getAttribute("data-value");
	  if (val.trim()=="") return; //following will call this function with empty val
	  yl_%id%.setAttribute("data-value","");
	  var vals=val.split(";");
	  for (var i=0;i<vals.length;i++) %id%_handleVal(vals[i]);
      document.getElementById("NR").innerHTML=""+nr;
	  nr++;
    });    
  });
  var config_%id% = { attributes: true, 
					  attributeFilter: ["data-value"],
					  childList: false, 
					  characterData: false };
  observer_%id%.observe(yl_%id%, config_%id%);
  // observer.disconnect();

  // apply initial set value in initial.txt
  yl_%id%.setAttribute("data-value",yl_%id%.getAttribute("data-value"));

</script>

[/yline]

//========================================================================================
//xy POINT plot, only values within range of x and y axies are shown 
//Last N values (Y) shown 
//if data-value="cls" then nrpoints=0
//if data-value="dotSize nrP xfrom xto yfrom yto" then scale is set
//if data-value="xpoint ypoint" (no spaces) then val is added to data list
//default shows history of 50 points and range of -1024 - 1024 (Analog range Arduino)
[scatter] 

<canvas id="%id%" 
		width="150px" height="50px"
		data-value="8 50 -1024 -1024 1024 1024" 
		style="border:1px solid black;display:inline-block;">  
</canvas>

<script>
  var cnv_%id%=document.getElementById("%id%");
  var ctx_%id%=cnv_%id%.getContext("2d");
  var %id%_xpoints=[0,0,0,0,0,0,0,0,0,0];
  var %id%_ypoints=[0,0,0,0,0,0,0,0,0,0];
  var %id%_nrP=100;//nrPoints to show
  var %id%_dotSize=4;//nrPoints to show
  var %id%_x1=-1024;
  var %id%_x2=1024;  
  var %id%_y1=-1024;
  var %id%_y2=1024;  
  function %id%_handleVal(val){
    val=val.trim();  
    if (val=="cls") {
	  for (var i=0;i<%id%_nrP;i++) {
	    %id%_xpoints[i]=0;
		%id%_ypoints[i]=0;
		%id%_redraw();
		return;
	  }
	}
	var sc=val.split(" ");
	if (sc.length==6) {
	  //alert("scale");
	  %id%_dotSize=parseFloat(sc[0]);  
	  %id%_nrP=parseInt(sc[1]);  
	  %id%_x1=parseFloat(sc[2]);  
	  %id%_y1=parseFloat(sc[3]); 
	  %id%_x2=parseFloat(sc[4]);  
	  %id%_y2=parseFloat(sc[5]); 
	  //make array and fill with zeros
	  for (var i=0;i<%id%_nrP;i++) {
	    %id%_xpoints[i]=0;
		%id%_ypoints[i]=0;
	  }
	  %id%_redraw();
	  return;
	}
	//else shift point and add point as last
	printConsole("received:"+sc);
	%id%_xpoints.shift();
	%id%_ypoints.shift();
	%id%_xpoints[%id%_nrP-1]=parseFloat(sc[0]);
	%id%_ypoints[%id%_nrP-1]=parseFloat(sc[1]);
	%id%_redraw();
  }
  
  function %id%_redraw(){
    var rw=cnv_%id%.width;
	var dx=rw/(%id%_x2-%id%_x1);
	
	var rh=cnv_%id%.height;
	var dy=rh/(%id%_y2-%id%_y1);
	
	ctx_%id%.clearRect(0,0,rw,rh);
	
	ctx_%id%.lineWidth=2;
    ctx_%id%.lineCap="round";
    for (var i=0;i<%id%_nrP;i++) {
	  var x=(%id%_xpoints[i]-%id%_x1)*dx;
	  var y=rh-(%id%_ypoints[i]-%id%_y1)*dy;
	  var d=%id%_dotSize/2;
	  ctx_%id%.fillStyle="blue";
	  if (i==(%id%_nrP-1)) ctx_%id%.fillStyle="red";
	  ctx_%id%.fillRect(x-d,y-d,d,d);
	}
	
  }
  %id%_redraw();
  
  var sc_%id% = document.getElementById("%id%");
  var observer_%id% = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
	  var val=sc_%id%.getAttribute("data-value");
	  if (val.trim()=="") return; //following will call this function with empty val
	  sc_%id%.setAttribute("data-value","");
	  var vals=val.split(";");
	  for (var i=0;i<vals.length;i++) %id%_handleVal(vals[i]);	  
    });    
  });
  var config_%id% = { attributes: true, 
					  attributeFilter: ["data-value"],
					  childList: false, 
					  characterData: false };
  observer_%id%.observe(sc_%id%, config_%id%);
  // observer.disconnect();

  // apply initial set value in initial.txt
  sc_%id%.setAttribute("data-value",sc_%id%.getAttribute("data-value"));
  
</script>

[/scatter] 
