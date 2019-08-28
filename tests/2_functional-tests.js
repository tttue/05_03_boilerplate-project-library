/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);
let bookIdForTest = ""
let timeout = 10000;
suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
	test('#example Test GET /api/books', function (done) {
		this.timeout(timeout);
		chai.request(server)
			.get('/api/books')
			.end(function (err, res) {
				assert.equal(res.status, 200);
				assert.isArray(res.body, 'response should be an array');
				assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
				assert.property(res.body[0], 'title', 'Books in array should contain title');
				assert.property(res.body[0], '_id', 'Books in array should contain _id');
				done();
			});
	});
  /*
  * ----[END of EXAMPLE TEST]----
  */

	suite('Routing tests', function () {


		suite('POST /api/books with title => create book object/expect book object', function () {

			test('Test POST /api/books with title', function (done) {
				chai.request(server)
					.post('/api/books')
					.send({ title: "Tue test" })
					.end(function (err, res) {
						assert.equal(res.status, 200);
						assert.equal(res.body.title, 'Tue test');
						bookIdForTest = res.body._id;
						done();
					});
			});

			test('Test POST /api/books with no title given', function (done) {
				chai.request(server)
					.post('/api/books')
					.send({})
					.end(function (err, res) {
						assert.equal(res.status, 200);
						assert.equal(res.text, 'title must be not blank');
						done();
					});
			});

		});


		suite('GET /api/books => array of books', function () {

			test('Test GET /api/books', function (done) {
				this.timeout(timeout);
				chai.request(server)
					.get('/api/books')
					.end(function (err, res) {
						assert.equal(res.status, 200);
						assert.isArray(res.body, 'response should be an array');
						assert.isNumber(res.body[0].commentcount, 'Books in array has commentcount is Number');
						assert.property(res.body[0], 'title', 'Books in array should contain title');
						assert.property(res.body[0], '_id', 'Books in array should contain _id');
						done();
					});
			});

		});


		suite('GET /api/books/[id] => book object with [id]', function () {

			test('Test GET /api/books/[id] with id not in db', function (done) {
				let id = "5d5cddc6c030024a4497952d";
				chai.request(server)
				.get('/api/books/'+id)
				.end(function(err, res){
					assert.equal(res.status, 200);
					assert.equal(res.text,"no book exists")
				done();
				});

			});

			test('Test GET /api/books/[id] with valid id in db', function (done) {
				chai.request(server)
				.get('/api/books/'+bookIdForTest)
				.end(function(err, res){
					assert.equal(res.status, 200);
					assert.isArray(res.body.comments, 'Books  should contain array comments');
					assert.property(res.body, 'title', 'Books should contain title');
					assert.property(res.body, '_id', 'Books should contain _id');
					done();
				});
			});

		});


		suite('POST /api/books/[id] => add comment/expect book object with id', function () {

			test('Test POST /api/books/[id] with comment', function (done) {
				chai.request(server)
				.post('/api/books/'+bookIdForTest)
				.send({comment:bookIdForTest+" comment"})
				.end(function(err, res){
					assert.equal(res.status, 200);
					assert.isArray(res.body.comments, 'Books  should contain array comments');
					assert.property(res.body, 'title', 'Books should contain title');
					assert.property(res.body, '_id', 'Books should contain _id');
					done();
				});
			});

		});

	});

});
