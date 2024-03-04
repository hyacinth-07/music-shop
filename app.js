var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const storeRouter = require('./routes/store');

var app = express();

// start mongoose and atlas connect

const mongoose = require('mongoose');
const mongoDB =
	'mongodb+srv://ndrhya37:2NNQAig3Lxs2pFyC@cluster0.pin2ke9.mongodb.net/?retryWrites=true&w=majority';

main().catch((err) => console.log(err));

async function main() {
	await mongoose.connect(mongoDB);
}

// authentication packages

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/user');

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// PASSPORT AND SESSION COOKIES

// with hashing

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({ username: username });
			if (!user) {
				return done(null, false, { message: 'Username does not exist' });
			}
			/// difference
			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				// passwords do not match!
				return done(null, false, { message: 'Incorrect password' });
			}
			/// difference over
			return done(null, user);
		} catch (err) {
			return done(err);
		}
	})
);

// session data (aka cookie)

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
});

// custom middleware to get a
// currentUser variable

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

//////////////////////////////////////////////////

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/store', storeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
