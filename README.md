# Audience (or online) Response System

I try to build an easy-to-use web-based audience response system for use in (my) lectures.
It must allow me to instantly formulate questions and to put them online. Students must be able to use their own devices
to scan a QR code that brings them to a page where they can leave their quote.

I also used this project to gain experience with some modern web programming environments:
* [NodeJS](http://nodejs.org)
* [Express js (with RESTful URLs)](http://expressjs.com)
* [Server-side templating with Jade](http://jade-lang.com)
* [Deployment on Heroku](http://www.heroku.com)
* [MongoDB on mongolabs](http://mongolabs.com)
* [Layout with Bootstrap](http://twitter.github.com/bootstrap/)
* [Markdown library Showdown by Corey Innis](https://github.com/coreyti/showdown)
* [Angular as Client side framework](http://angularjs.org)
* [Notifier library done by Srirangan](https://github.com/Srirangan/notifer.js)
* [Graph Drawing with Xavier Shay's TufteGraphs](http://http://xaviershay.github.io/tufte-graph/)
* [Of course jquery](http://jquery.com)
* [QRcode plugin for jquery](http://jeromeetienne.github.com/jquery-qrcode/)
* [Markdown for text in questions.]()
* [Currently I do some testing with casperjs](http://casperjs.org)
* Testing is also done using node asserts)

## Testing
There is a shell script *startlocal* to start a local empty mongo database and a script *stoplocal* to stop these processes again.
These are also used on the jenkins server I use for CI and deployment.

# Functionality
At the moment only multiple choice questions can be created. A PNG-image can be attached. The text preceding the choices can be formatted using markdown.


