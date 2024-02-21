const Category = require('../models/category');
const Instrument = require('../models/instruments');

const asyncHandler = require('express-async-handler');

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
