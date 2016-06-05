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

### Directories
- 'Builds' contains zips of the latest released versions of the Arduino Library and the application itself. (A build for iOS is not available yet, since I don't have an iOS system.)
- 'Source' contains the latest source of the Arduino Library and the Processing source of the application.
- 'screenshots' contains the images which are used in this readme.md

### Install
- Download all files as a zip (green button top right of main page)
- Open the archive, go to de 'Builds' folder and copy the latest archive of the Arduino library (..... HTMLSerialMonitor - Arduino Library.zip) and the archive of the application itself (..... HTMLSerialMonitor - Application.zip) to a temporary folder on your pc.
- Place the content of the Arduino library archive in your Arduino library folder on your system (which for Windows is probably located inside your sketches folder and is called 'libraries')
- Open the Application archive, select the correct build folder for your system and copy it somewhere to your system. This is the HTMLSerialMonitor program.
- If you don't have java (needed by the the application) installed already, you should do this now.

### First run
- Open your Arduino IDE.
- Select a example from the HTMLSerialMonitor library e.g. Lib_Snippets.
- Burn the sketch to your Arduino.

- Go to the folder where you placed the HTMLSerialMonitor program.
- Run HTMLSerialMonitor. (If you forgot to install java, HTMLSerialMonitor will ask you to install Java.)
- Now open your browser and surf to http://127.0.0.1:8080 (note the port-number)
- Select the correct COM port and baudrate (9600).
- Press Connect. 
 
Now you should see the sketch on your Arduino drawing and updating the html page, which looks something like:
![](https://github.com/NardJ/HTMLSerialMonitor/blob/master/screenshots/Lib_Snippets.gif)

For more info, go to http://127.0.0.1:8080/manual.htm.

To give you an impression of the possiblities:

![](https://github.com/NardJ/HTMLSerialMonitor/blob/master/screenshots/Bare_DecoratedText.gif)
![](https://github.com/NardJ/HTMLSerialMonitor/blob/master/screenshots/Lib_UserInterface.gif)

