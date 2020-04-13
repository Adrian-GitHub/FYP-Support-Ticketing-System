# FYP-Support-Ticketing-System
# Structure

The main system is divided into sub-folders which are spread-out throughout the project. This is because the project itself is a combination of MERN stack associated with other libraries which are used for testing. The system implements a 3rd party engine (Business Process Management) BPM, known as Camunda.


### Directory layout

    .
    ├── Diagrams                             # Diagrams which show system process
    ├── ├── Camunda                          # Folder in which diagrams for BPM Engine are located
    ├── Support_Ticketing_System             # The deliverable
    ├── ├── auto-test.js                     # Automated testing file
    ├── ├── *.**                             # All back-end files excluding front-end folder
    ├── ├── frontend-client                  # Front-end user interface
    ├── camunda.js                           # Camunda's Worker file
    └── README.md

## Installation

Use the package manager [NodeJS](https://nodejs.org/en/) (NPM) to install this project. This project is using [MongoDB](https://www.mongodb.com/) for the database; before proceeding please install and configure the database otherwise the deliverable won't work.

1. Download MongoDB from [HERE](https://www.mongodb.com/download-center/community) then choose SERVER 
2. PICK YOUR SYSTEM AND LATEST VERSION
3. WINDOWS ONLY SCRIPT: 

```bash
"path\to\MongoDBServer\bin\mongod.exe" --dbpath "path\to\MongoDBServer\data\db"
```
Now let's install the client (back-end and front-end).

1. Proceed to the main directory which is `Support_Ticketing_System`.
2. Do `npm install` and wait until that completes.
2. Now proceed to front-end directory by typing `cd frontend-client` in the terminal.
3. Do `npm install` and wait until that completes.

After these steps the client/server/database are good to go. One more final step, as this project relies on BPM Engine it is advised to install it.
Head over to [Camunda](https://camunda.com/download/) website to download the [Server](https://camunda.com/download/) and the [Modeller](https://camunda.com/download/modeler/) associated with it. Choose Community Edition, GA Release(should be selected by default), then **ZIP** file.

Now, lets set it up.

1. Unpack the ZIP folder into your desired place and then extract all the files. Click on `start-camunda.bat`.
Server is running.
2. Upload the diagram via Modeller. Start the `Camunda Modeler.exe`.
3. Drag the BPMN Diagram file from `Diagrams/Camunda/`,the file name is `THE PROCESS.bpmn`. Into the modeller.
4. Click the `DEPLOY CURRENT DIAGRAM` button located at the top, the icon resembles UPLOAD button.
5. Confirm the dialogue that just popped up and it should notify you of a success.

Done. The BPMN Server (Camunda) is up and running. Everything has been setup inside the client and server to communicate with it by default.

## Usage
After the installation is completed successfully the deliverable should be ready to be launched.

```python
Pre: Make sure MongoDB is running before starting anything
```
*Before* proceeding further make sure to start the worker for Camunda that's built into this project by typing `npm run camunda-worker` into a **new command line window**. Without running the *worker* you won't be able to use the system fully as worker relies on Camunda's engine and worker tells Camunda what to do when there's incoming task thus Camunda is managing and creating some of the tasks for this project.

Navigate to the main directory which is `Support_Ticketing_System`. Type `npm run both` this will start the back-end and front-end at the same time. Chrome browser is suggested for this project. Once the project starts the browser *should* automatically open itself with address `localhost:3001` loaded into the search bar.

## Available Commands 

The working directory for these commands is `Support_Ticketing_System` .
Running the project (front-end +  back-end) simultaneously (make sure MongoDB is running before initiating the command)
````
$ npm run both
````

Testing the project and its API's using JEST
````
$ npm test
````

Testing the project the way would user/support interact with it (See chapter below on how to set this up)
````
$ npm auto-test
````

## Testing suite
The reason why this is a separate header is that the testing suite which we're using by isn't built into the system. The testing that is installed using the above methods can be launched using `npm test` command which as a result will launch testing which follows [JEST](https://jestjs.io/) framework.

To use `Support_Ticketing_System_Selenium` the following needs to be installed:

*PRE: These are the drivers which can be installed. When downloading please try picking the latest version but no later than 10 versions behind*
>[Chrome](http://chromedriver.storage.googleapis.com/index.html) 

>[Internet Explorer](http://selenium-release.storage.googleapis.com/index.html) 

>[Edge](http://go.microsoft.com/fwlink/?LinkId=619687) 

>[Firefox](https://github.com/mozilla/geckodriver/releases/) 

>[Safari](https://developer.apple.com/library/prerelease/content/releasenotes/General/WhatsNewInSafari/Articles/Safari_10_0.html#//apple_ref/doc/uid/TP40014305-CH11-DontLinkElementID_28)
```
1. Create folder on C drive, call it Selenium
2. Put the downloaded driver into that folder
3. Go to system variables
4. Go to environment variables
5. Click on PATH then EDIT then NEW then add C:\Selenium
6. Now to see if it works, go to CMD and type start chromedriver(Chrome's driver name, choose the applicable one to the downloaded version)
7. It should start the chrome driver
```
