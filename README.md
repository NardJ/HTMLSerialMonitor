## HTMLSerialMonitor
 
HTML Serial Monitor is a replacement for the standard serial monitor which comes with the Arduino IDE. It allows you to use 
html to enhance you debugging messages and make a dashboard. 

HTML Serial Monitor uses your browser to output the html debugging messages from your Arduino. 
It also allows you to send messages back to your Arduino, like button clicks or information your html-code requests from the internet. 
An Arduino library is available with some predefined functions to make some things easier.
It was programmed in Processing 3.1 (Java mode), acts like a bridge which receives messages from the serial port and serves them to your browser by implementing a webserver. 
Special codes in the messages are replaced before sending them through.

This program is still considered to be in development and was only tested by myself with an Arduino Nano on Chrome, Edge and Internet Explorer 11 using a Windows 10 pc. It has no access to your arduino sketch folders, so the risk of any bugs should be very limited.
HTML Serial Monitor needs exclusive access to the Arduino (just like the serial monitor of your Arduino IDE). It cannot (yet) be started from the Arduino IDE. 

If you encounter bugs or have ideas to make it better please let me know at [pandarve.link@gmail.com](pandarve.link@gmail.com).

### Install
Download 
Open the archive
Go to the Processing folder in the archive, select the correct subfolder for your system en copy it to a folder of your liking. This is the HTMLSerialMonitor program.
Go to the Arduino-Lib folder in the archive and copy the HTMLSerialMonitor to your Arduino library folder.

### First run
Open your Arduino IDE.
Select a example from the HTMLSerialMonitor library e.g. Lib_Snippets.
Burn the sketch to your Arduino.

Go to the folder where you placed the HTMLSerialMonitor program.
Run HTMLSerialMonitor.
Now open your browser and surf to http://127.0.0.1:8080 (note the port-number)
Select the correct COM port and baudrate (9600).
Press Connect. 

Now you should see the sketch on your Arduino drawing and updating the html page, which looks something like:
![](https://github.com/NardJ/HTMLSerialMonitor/blob/master/screenshots/Lib_Snippets.gif)

For more info, go to http://127.0.0.1:8080/manual.htm.

To give you an impression of the possiblities:

![](https://github.com/NardJ/HTMLSerialMonitor/blob/master/screenshots/Bare_DecoratedText.gif)
![](https://github.com/NardJ/HTMLSerialMonitor/blob/master/screenshots/Lib_UserInterface.gif)

