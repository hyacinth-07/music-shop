const Category = require('../models/category');
const Instrument = require('../models/instruments');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.index = asyncHandler(async (req, res, next) => {
	const allCategories = await Category.find().sort({ name: 1 }).exec();

	res.render('main', {
		template: 'index',
		title: 'A Music Store',
		cat_list: allCategories,
	});
});

exports.detail = asyncHandler(async (req, res, next) => {
	const [cat, inst] = await Promise.all([
		Category.findById(req.params.id).exec(),
		Instrument.find({ category: req.params.id }, 'name').exec(),
	]);

	if (cat === null) {
		// No results.
		const err = new Error('Category not found');
		err.status = 404;
		return next(err);
	}

	res.render('main', {
		template: 'cat_detail',
		title: 'Categories Detail',
		cat: cat,
		inst: inst,
	});
});

exports.create_get = (req, res, next) => {
	res.render('main', {
		template: 'cat_create',
		title: 'Create New Category',
	});
};

exports.create_post = [
	// first sanitize
	body('name', 'Category should be at least three characters')
		.trim()
		.isLength({ min: 3 })
		.escape(),

	// second handle the request
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const cat = new Category({ name: req.body.name });

		const catExists = await Category.findOne({ name: req.body.name }).exec();

		if (!errors.isEmpty()) {
			res.render('main', {
				template: 'cat_create',
				title: 'Create New Category',
				cat: cat,
				errors: errors,
			});
			return;
		} else {
			// data is valid
			const catExists = await Category.findOne({ name: req.body.name }).exec();
			if (catExists) {
				res.redirect(catExists.url);
			} else {
				await cat.save();
				res.redirect(cat.url);
			}
		}
	}),
];
