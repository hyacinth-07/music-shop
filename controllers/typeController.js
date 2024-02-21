const Type = require('../models/type');
const Instrument = require('../models/instruments');

const asyncHandler = require('express-async-handler');

exports.list = asyncHandler(async (req, res, next) => {
	const allTypes = await Type.find().sort({ name: 1 }).exec();

	res.render('main', {
		template: 'type_list',
		title: 'Types of Instruments Available',
		type_list: allTypes,
	});
});

exports.detail = asyncHandler(async (req, res, next) => {
	const [type, inst] = await Promise.all([
		Type.findById(req.params.id).exec(),
		Instrument.find({ type: req.params.id }, 'name').exec(),
	]);

	if (type === null) {
		// No results.
		const err = new Error('Instrument not found');
		err.status = 404;
		return next(err);
	}

	res.render('main', {
		template: 'type_detail',
		title: 'Type Detail',
		type: type,
		inst: inst,
	});
});
