/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const database_tool = require("../database_tool");
const timeout = 10000;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
			//json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
			var t = setTimeout(() => { next({ message: 'timeout' }) }, timeout);
			database_tool.findAllBook((err, info) => {
				clearTimeout(t);
				err ? next(err) : res.json(info);
			});
    })

    .post(function (req, res){
      var title = req.body.title;
			var t = setTimeout(() => { next({ message: 'timeout' }) }, timeout);
			database_tool.addBook(title, (err, info) => {
				clearTimeout(t);
				err ? next(err) : res.json(info);
			});
    })

    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
			var t = setTimeout(() => { next({ message: 'timeout' }) }, timeout);
			database_tool.deleteAllBook((err, info) => {
				clearTimeout(t);
				err ? next(err) : res.json(info);
			});
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });

};
