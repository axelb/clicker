# Audience (or online) Response System

I try to build an easy-to-use web-based audience response system (synonymously: online reponse, or clicker system) for use in (my) lectures.
It allows me to instantly formulate questions and to put them online. Students must be able to use their own devices (BYOD)
to scan a QR code that brings them to a page where they can leave their quote.

I also used this project to gain experience with some modern web programming environments:
* [NodeJS](http://nodejs.org)
* [Express js](http://expressjs.com) (with RESTful URLs)
* Server-side templating with [Jade](http://jade-lang.com)
* Deployment on [Heroku](http://www.heroku.com)
* [MongoDB](http://www.mongodb.org) on [MongoLab](http://mongolab.com)
* Layout with [Bootstrap](http://twitter.github.com/bootstrap/)
* Markdown library [Showdown by Corey Innis](https://github.com/coreyti/showdown)
* [Angular](http://angularjs.org) as Client side framework
* [Notifier](https://github.com/Srirangan/notifer.js) library done by Srirangan
* Graph Drawing with Xavier Shay's [TufteGraphs](http://xaviershay.github.io/tufte-graph/)
* And (of course) [jquery](http://jquery.com)
* [QRcode plugin for jquery](http://jeromeetienne.github.com/jquery-qrcode/)
* Currently I do some testing with [casperjs](http://casperjs.org)
* Also [Mocha](http://visionmedia.github.io/mocha/) is used for testing.
* Server-side logging is done with [log4js-node](https://github.com/nomiddlename/log4js-node).
* Some testing is also done using plain node asserts

## Testing
There is a shell script *startlocal* to start a local empty mongo database (requires [mongo](http://www.mongodb.org)) and a script *stoplocal* to stop these processes again.
These are also used on the jenkins server I use for CI and deployment.

## Functionality
At the moment only multiple choice questions can be created. A PNG-image can be attached. The text preceding the choices can be formatted using [markdown](http://de.wikipedia.org/wiki/Markdown).
![Usage Scenario](/resources/websequencediagrams.com/usageScenario.png)

##Organization of the project
**Server-side** code is on top level `server.js` and the directories `routes` (containing node modules implementing the routes defined in `server.js`) and `views` (containing the Jade templates).
Jade is used to deliver the question to the devices as well to present the final result to the teacher.


**Client-side** angular code is located in the `public` subtree. Here all external libraries are bundeled in `./lib` and angular-js-code in `./js`