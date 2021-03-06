# Audience (or online) Response System

I try to build an easy-to-use web-based audience response system (synonymously: online reponse, or clicker system) for use in (my) lectures.
It allows me to instantly formulate questions and to put them online. Students must be able to use their own devices (BYOD)
to scan a QR code that brings them to a page where they can leave their quote.

I also used this project to gain experience with some modern web programming environments:
* [NodeJS](http://nodejs.org)
* [Express js](http://expressjs.com) (with RESTful URLs)
* Server-side templating with [pug](http://jade-lang.com)
* [Passport for authentication](http://passportjs.org)
* Deployment on [Heroku](http://www.heroku.com)
* [MongoDB](http://www.mongodb.org) on [MongoLab](http://mongolab.com)
* [ShortId](https://github.com/dylang/shortid) to create URL-friendly ID's (for mongo; these are basis for all question handling).
* Layout with [Bootstrap](http://twitter.github.com/bootstrap/)
* Markdown library [Showdown by Corey Innis](https://github.com/coreyti/showdown)
* [Angular](http://angularjs.org) as Client side framework
* [Angular bootstrap components](http://angular-ui.github.io/bootstrap/)   for visual effects (popovers)
* [Notifier](https://github.com/Srirangan/notifer.js) library done by Srirangan
* Graph Drawing with [chartjs](http://www.chartjs.org/)
* And (of course) [jquery](http://jquery.com)
* [Angular QR Code directive](https://github.com/monospaced/angular-qrcode)
* [QR Code generator](https://github.com/kazuhikoarase/qrcode-generator)
* [Mocha](http://mochajs.org/) is used for testing.
* I also do some integration testing with [casperjs](http://casperjs.org)
* Server-side logging is done with [log4js-node](https://github.com/nomiddlename/log4js-node)
* Special glyphs are used from [Font Awesome](http://fortawesome.github.io/Font-Awesome/)
* When code is collected in cloze questions, a normalization is done by beautifying the inserted code using [jsbeautifier](https://github.com/einars/js-beautify)

## Functionality
At the moment the following types of questions can be created and used:
* single choice questions
* multiple choice questions A PNG-image can be attached. The text preceding the choices can be formatted using [markdown](http://de.wikipedia.org/wiki/Markdown).
* cloze (freetext) questions. These are especially designed to show code snippets with omissions that can be inserted by the audience.
* Point-and-Click (heatmap) questions: people in the audience click on an image to identify an important point.

To single and multiple choice questions, a PNG-image can be attached. The text preceding the choices can be formatted using [markdown](http://de.wikipedia.org/wiki/Markdown).

## Workflow
The pulldown menu on top of the page allows to create questions of a given type. If you want to work with an existing question, a list of all questions is displayed.
Each line first indicates the question's type. This is followed by the first line of the question's text. Then there are three icons to start the vote (qr code), to edit the question and to delete the question.

Starting a vote by clicking the QR-code-icon shows the QR code leading to a voting page. *Caution*: Clicking the QR code stops the voting process and shows the results of the voting.

![Usage Scenario](/resources/websequencediagrams.com/usageScenario.png)

## Technical stuff
### Organization of the project
**Server-side** code is on top level `server.js` and the directories `routes` (containing node modules implementing the routes defined in `server.js`) and `views` (containing the pug-templates).
PUG templates are used to deliver the question to the devices as well to present the final result to the teacher.


**Client-side** angular code is located in the `public` subtree. Here all external libraries are bundeled in `./lib` and angular-js-code in `./js`

### Configuration
* server (module mongo.js) expects environment variable MONGOURI containing valid URI to access the mongo db
* if no environment variable PORT is present, port 8888 is used as default application port
* logging can be configured ... somewhere

## Testing
Server-side code in directory routes is unit-tested using mocha. Does not require a running server. Tests can be executed using the script runTests in that directory.

Client-side code is tested using casper and requires a running server. Tests can be started with the script `runtests` in directory test.

There is a shell script *startlocal* to start a local empty mongo database (requires [mongo](http://www.mongodb.org)) and a script *stoplocal* to stop these processes again.
These are also used on the jenkins server I use for CI and deployment. BTW: Current Jenkins config is stored in the resources directory.


##Deployment
Set environment on Heroku:

`heroku config:set MONGOURI=mongodb://<database-ueser>:<db-user-passwd>@ds043997.mongolab.com:43997/onlineresponse`

`heroku restart` to restart