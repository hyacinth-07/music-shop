const Type = require('../models/type');

const asyncHandler = require('express-async-handler');

exports.list = asyncHandler(async (req, res, next) => {
	const allTypes = await Type.find().sort({ name: 1 }).exec();

	res.render('main', {
		template: 'type_list',
		title: 'Types of Instruments Available',
		type_list: allTypes,
	});
});
