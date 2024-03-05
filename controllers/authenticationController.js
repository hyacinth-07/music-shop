const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.log_in_get = (req, res, next) => {
	res.render('main', {
		template: 'log-in',
		title: 'Log In Form',
		user: User.username,
	});
};

exports.sign_up = (req, res, next) => {
	res.render('main', {
		template: 'sign-up',
		title: 'Sign Up Form',
		user: User.username,
	});
};

exports.sign_up_post = async (req, res, next) => {
	bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
		if (err) {
			return next(err);
		} else {
			const user = new User({
				username: req.body.username,
				password: hashedPassword,
			});
			const result = await user.save();
			res.redirect('/');
		}
	});
};
