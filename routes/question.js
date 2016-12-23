/**
 *  Node module containing code to create RESTful services related to questions.
 */

'use strict';

var shortid = require('shortid'),
    markDown = require('marked'),
    mongo = require('./mongo'),
    config = require('../public/js/config'),
    Alternative = new mongo.Schema({
        title: {type: String, required: false, trim: true}
    }),
    questionSchema = new mongo.Schema({
        _id: false,
        question: {type: String, required: true, trim: true},
        owner: {type: String, required: true, trim: true},
        type: {type: String, required: true, trim: true},
        alternatives: [Alternative],
        imageId: {type: String, required: false, trim: true}
    }),
    Question = mongo.connection.model('questions', questionSchema),
    Image = require('./image'),
    log4js = require('log4js'),
    logger = log4js.getLogger('server');

/**
 * Render question to a BYOD in the audience.
 * @param req The HTTP request.
 * @param res The HTTP response.
 */
exports.show = function (req, res) {
    Question.findOne()
        .where('_id').equals(req.params.id)
        .exec(function (error, question) {
                if (error) {
                    logger.error("ERROR: " + error);
                    res.render('noquestion');
                    return;
                }
                if (!question || question === null) {
                    logger.error("No such question: " + req.params.id);
                    res.render('noquestion');
                    return;
                }
                if (question.type === config.questionTypes().Cloze.name) {
                    question.question = exports.mangleTextfield(question.question);
                }
                res.render(question.type, {question: question, markDown: markDown});
            }
        );
};

/**
 * Process the input string through markDown and then replace all occurences of @@
 * (or whatever is used in root.TEXTFIELD_INDICATOR) with textfields containing increasing ids of kind "text<x>"
 * @param string  String to convert.
 * @return Markdowned input string with @@ replaced by html textfields
 */
exports.mangleTextfield = function (string) {
    var textFieldStart = "<input class='clozetext' id='text",
        textFieldEnd = "' type='text'></input>",
        id = 0,
        replacementText;
    string = markDown(string);
    while (string.indexOf(config.TEXTFIELD_INDICATOR) >= 0) {
        replacementText = textFieldStart + id + textFieldEnd;
        string = string.replace(config.TEXTFIELD_INDICATOR, replacementText);
        id++;
    }
    return string;
};

exports.asjson = function (req, res) {
    Question.findOne()
        .where('_id').equals(req.params.id)
        .exec(function (error, data) {
                if (error) {
                    logger.error("ERROR: " + error);
                    res.send(404, 'Requested question not found');
                }
                res.end(JSON.stringify(data));
            }
        );
};

/**
 * Save or update a question depending on whether it already carries an _id or not.
 * The call to this method must be secured with ensureAuthenticated to guarantee
 * that we have a currentUser in the session.
 * @param req request object
 * @param res response object
 */
var saveQuestion = function (req, res) {
    var question,
        id,
        newQuestion,
        query;
    question = req.body;
    id = question._id;
    logger.debug("Saving question: '" + question.question + "'");
    // update existing question or create a new one
    if (question._id) {
        delete question._id;
        query = Question.findByIdAndUpdate(id, question, function () { /* something to do here? */
        });
    } else { //create
        question._id = shortid.generate();
        question.owner = req.user.username;
        newQuestion = new Question(question);
        newQuestion.save(function (error) {
            logger.debug("Stored new question:  " + newQuestion);
        });
    }
    res.json({id: id || newQuestion._id});
};

/**
 * Prepares a question for storage in db. If an image is part of the request it is stored upfront and attached.
 * @param req The HTTP request.
 * @param res The HTTP response.
 */
exports.save = function (req, res) {
    var question = req.body;
    if (question.attachedImage && !question.imageId) { // new image: must be saved
        Image.attachImage(question.attachedImage, function (id) {
            question.imageId = id;
            delete question.attachedImage;
            saveQuestion(req, res);
        });
    } else {
        saveQuestion(req, res);
    }
};

/**
 * RESTful-url to get a list of all stored questions for the current user.
 * The call to this method must be secured with ensureAuthenticated to guarantee
 * that we have a currentUser in the session.
 * @param req
 * @param res
 */
exports.list = function (req, res) {
    Question.find().where('owner').equals(req.user.username).exec(
        function (error, data) {
            res.end(JSON.stringify(data));
        });
};

/**
 * Delete a question and also a possibly attached image.
 * @param req The HTTP request
 * @param res The HTTP response
 */
exports.remove = function (req, res) {
    Question.findOne()
        .where('_id').equals(req.params.id)
        .exec(function (error, data) {
                if (error) {
                    logger.error("ERROR: " + error);
                    res.send(500, error);
                    return;
                }
                Image.deleteImage(data.imageId);
                data.remove();
                logger.debug("question removed: " + req.params.id);
                res.redirect('/#/list');
            }
        );
};
