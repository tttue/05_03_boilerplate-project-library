/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const database_tool = require("../tool/database_tool");
const tool = require("../tool/tool");
const timeout = 10000;

module.exports = function (app) {

	app.route('/api/books')
		.get(function (req, res, next) {
			//response will be array of book objects
			//json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
			var t = setTimeout(() => { next({ message: 'timeout' }) }, timeout);
			database_tool.findAllBook((err, info) => {
				clearTimeout(t);
				tool.apiProcessResult(res, next, err, info);
			});
		})

		.post(function (req, res, next) {
			var title = req.body.title;
			var t = setTimeout(() => { next({ message: 'timeout' }) }, timeout);
			database_tool.addBook(title, (err, info) => {
				clearTimeout(t);
				tool.apiProcessResult(res, next, err, info);
			});
		})

		.delete(function (req, res, next) {
			//if successful response will be 'complete delete successful'
			var t = setTimeout(() => { next({ message: 'timeout' }) }, timeout);
			database_tool.deleteAllBook((err, info) => {
				clearTimeout(t);
				tool.apiProcessResult(res, next, err, info);
			});
		});



	app.route('/api/books/:id')
		.get(function (req, res, next) {
			var bookid = req.params.id;
			//json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
			var t = setTimeout(() => { next({ message: 'timeout' }) }, timeout);
			database_tool.findOneBook(bookid, (err, info) => {
				clearTimeout(t);
				tool.apiProcessResult(res, next, err, info);
			});
		})

		.post(function (req, res, next) {
			var bookid = req.params.id;
			var comment = req.body.comment;
			//json res format same as .get
			var t = setTimeout(() => { next({ message: 'timeout' }) }, timeout);
			database_tool.addComment(bookid, comment, (err, info) => {
				clearTimeout(t);
				tool.apiProcessResult(res, next, err, info);
			});
		})

		.delete(function (req, res, next) {
			var bookid = req.params.id;
			//if successful response will be 'delete successful'
			var t = setTimeout(() => { next({ message: 'timeout' }) }, timeout);
			database_tool.deleteBook(bookid, (err, info) => {
				clearTimeout(t);
				tool.apiProcessResult(res, next, err, info);
			});
		});

};
