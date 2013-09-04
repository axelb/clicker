/**
 *  Node module containing code to create RESTful services related to questions.
 */

'use strict';

var shortid = require('shortid'),
    markDown = require('node-markdown').Markdown,
    mongo = require('./mongo'),
    config = require('../public/js/config'),
    Alternative = new mongo.Schema({
        title: { type: String, required: false, trim: true }
    }),
    questionSchema = new mongo.Schema({
        _id: false,
        question: { type: String, required: true, trim: true },
        type: {type: String, required: true, trim: true },
        alternatives: [Alternative],
        imageId: {type: String, required: false, trim: true }
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
            if (question.imageId && question.imageId !== null) {
                Image.findById(question.imageId, function (error, img) {
                    res.render(question.type, {question: question, image: img, markDown: markDown});
                });
            }
            else {
                res.render(question.type, {question: question, markDown: markDown});
            }
        }
    );
};

/**
 * Replace all occurences of @@ (or whatever is used in root.TEXTFIELD_INDICATOR) with textfields containing increasing ids of kind "text<x>"
 * @param string  String to convert.
 * @return String with @@ replaced by html textfields
 */
exports.mangleTextfield = function(string) {
    var textFieldStart = "<input class='clozetext' id='text",
        textFieldEnd = "' type='text'></input>",
        id = 0,
        replacementText;
    while(string.indexOf(config.TEXTFIELD_INDICATOR) >= 0) {
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
 * @param req request object
 * @param res response object
 * @param imageId id of a newly attached image -- or null if no (or no new in case of editing) image is attached.
 */
var saveQuestion = function (req, res, imageId) {
    var question,
        id,
        newQuestion;
    logger.debug("received question: " + req.body.question);//raw question before parsing
    question = JSON.parse(req.body.question);
    id = question._id;
    logger.info("Saving question: " + question);
    if (imageId) {
        question.imageId = imageId;
    }
    else if (!question.imageId) {
        question.imageId = null;
    }
    logger.debug(question);
    if (question._id) {
        delete question._id;//I don't really understand why this works!
        newQuestion = new Question(question);
        newQuestion.update(question, function (error) {
            if (error) {
                logger.error("Error: " + error);
            } else {
                logger.debug("Updated question:  " + newQuestion);
            }
        });
    } else {
        question._id = shortid.generate();
        newQuestion = new Question(question);
        newQuestion.save(function (error) {
            logger.debug("Stored new question:  " + newQuestion);
        });
    }
    res.json({id: newQuestion._id});
};

/**
 * Prepares a question for storage in db. If an image is part of the request it is stored upfront and attached.
 * @param req The HTTP request.
 * @param res The HTTP response.
 */
exports.save = function (req, res) {
    if (req.files && req.files.uploadedImage) {
        Image.attachImage(req.files.uploadedImage.path, function(id) {
            saveQuestion(req, res, id);
        });
    } else {
        saveQuestion(req, res, null);
    }
};

/**
 * RESTful-url to get a list of all stored questions.
 * @param req
 * @param res
 */
exports.list = function (req, res) {
    Question.find().exec(
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
