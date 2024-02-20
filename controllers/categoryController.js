const Category = require('../models/category');

const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
	const allCategories = await Category.find().sort({ name: 1 }).exec();

	res.render('main', {
		template: 'index',
		title: 'A Music Store',
		cat_list: allCategories,
	});
});
