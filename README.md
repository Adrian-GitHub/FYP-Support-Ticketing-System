# FYP-Support-Ticketing-System
# Structure

The main system is divided into sub-folders which are spread-out throughout the project. This is because the project itself is a combination of MERN stack associated with other libraries which are used for testing. 


### Directory layout

    .
    ├── Diagrams                             # Diagrams which show system process
    ├── Support_Ticketing_System             # The deliverable
    ├── ├── auto-test.js                     # Automated testing file
    ├── ├── *.**                             # All back-end files excluding front-end folder
    ├── ├── frontend-client                  # Front-end user interface
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

## Usage
After the installation is completed successfully the deliverable should be ready to be launched.

```python
Pre: Make sure MongoDB is running before starting anything
```
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
