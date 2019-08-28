/*
 Promise.all()
 */
const promiseForeach = require('promise-foreach')
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(process.cwd(), 'private.env') });
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
const tool = require("./tool")

const bookSchema = new mongoose.Schema({
	title: String
});
bookSchema.index({ title: 1 });

const Book = mongoose.model('Book', bookSchema);

const commentSchema = new mongoose.Schema({
	bookId: String,
	comment: String
});
commentSchema.index({ bookId: 1 });

const Comment = mongoose.model('Comment', commentSchema);


const addBook = (title, done) => {
	var checkResult = tool.checkStringNotBlank(title, "title", true);
	if (checkResult) {
		done(null, { errorCode: -2, errorMsg: checkResult });
		return;
	}
	let objBook = {
		title: title
	}
	let book = new Book(objBook);
	book.save((err, data) => {
		if (err) {
			done(err)
		} else {
			data.open = (data.open === 1);
			done(null, { errorCode: 0, data: data })
		}
	});
};

const findAllBook = (done) => {
	Book.find((err, data) => {
		if (err) {
			done(err)
		} else {
			// Clone data
			var ret = []
			for (var elm of data) {
				ret.push({
					_id: elm._id,
					title: elm.title
				});
			}
			promiseForeach.each(ret, (elm) => {
				return Comment.countDocuments({ bookId: elm._id });
			}, (arrResult, elm) => {
				elm.commentcount = arrResult[0]
				return elm;
			}, (err, newList) => {
				if (err) {
					done(err)
				} else {
					done(null, { errorCode: 0, data: newList });
				}
			});
		}
	});
};


const findAllBookPromiseAll = (done) => {
	Book.find((err, data) => {
		if (err) {
			done(err)
		} else {
			// Clone data
			var ret = []
			for (var elm of data) {
				ret.push({
					_id: elm._id,
					title: elm.title
				});
			}
			var promisArr = []
			ret.forEach((elm, i) => {
				promisArr.push(Comment.countDocuments({ bookId: elm._id }));
			});
			Promise.all(promisArr).then((result) => {
				result.forEach((count, i) => {
					ret[i].commentcount = count;
				});
				done(null, { errorCode: 0, data: ret });
			});
		}
	});
};

const deleteAllBook = (done) => {
	Comment.deleteMany({}, (err) => {
		if (err) {
			done(err);
		} else {
			Book.deleteMany({}, (err) => {
				if (err) {
					done(err);
				} else {
					done(null, { errorCode: 0, message: "complete delete successful" })
				}
			});
		}
	});
};


const findOneBook = (_id, done) => {
	var checkResult = tool.checkId(_id, "_id", true);
	if (checkResult) {
		done(null, { errorCode: -2, errorMsg: checkResult });
		return;
	}

	Book.findOne({ _id: _id }, (err, data) => {
		if (err) {
			done(err);
		} else {
			if (!data) {
				done(null, { errorCode: 1, errorMsg: "no book exists" })
				return;
			}
			var ret = {
				_id: data._id,
				title: data.title
			};
			Comment.find({ bookId: _id }, (err, comments) => {
				if (err) {
					done(err);
				} else {
					ret.comments = comments.map(x => x.comment);
					done(null, { errorCode: 0, data: ret });
				}
			});
		}
	});
};

const addComment = (_id, commentS, done) => {
	var checkResult = tool.checkId(_id, "_id", true);
	if (checkResult) {
		done(null, { errorCode: -2, errorMsg: checkResult });
		return;
	}
	var checkResult = tool.checkStringNotBlank(commentS, "comment", true);
	if (checkResult) {
		done(null, { errorCode: -2, errorMsg: checkResult });
		return;
	}
	Book.findOne({ _id: _id }, (err, data) => {
		if (err) {
			done(err);
		} else {
			if (!data) {
				done(null, { errorCode: 1, errorMsg: "no book exists" })
				return;
			}
			let objComment = {
				bookId: _id,
				comment: commentS
			}
			let comment = new Comment(objComment);
			comment.save((err, data) => {
				if (err) {
					done(err);
				} else {
					findOneBook(_id, done);
				}
			})
		}
	})
}

const deleteBook = (_id, done) => {
	var checkResult = tool.checkId(_id, "_id", true);
	if (checkResult) {
		done(null, { errorCode: -2, errorMsg: checkResult });
		return;
	}

	Comment.deleteMany({ bookId: _id }, (err) => {
		if (err) {
			done(err);
		} else {
			Book.findByIdAndDelete(_id , (err, data) => {
				if (err) {
					done(err);
				} else {
					if (!data){
						done(null, { errorCode: 1, errorMsg: "no book exists" })
						return;
					}
					done(null, { errorCode: 0, message: "delete successful" })
				}
			});
		}
	});
};


exports.addBook = addBook;
exports.findAllBook = findAllBook;
exports.deleteAllBook = deleteAllBook;
exports.findOneBook = findOneBook;
exports.deleteBook = deleteBook;
exports.addComment = addComment;
