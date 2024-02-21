const Instrument = require('../models/instruments');

const asyncHandler = require('express-async-handler');

exports.list = asyncHandler(async (req, res, next) => {
	const allInstruments = await Instrument.find().sort({ name: 1 }).exec();

	res.render('main', {
		template: 'instruments_list',
		title: 'Individual Instruments Available',
		inst_list: allInstruments,
	});
});

exports.detail = asyncHandler(async (req, res, next) => {
	const inst = await Instrument.findById(req.params.id)
		.populate('category')
		.populate('type')
		.exec();

	if (inst === null) {
		// No results.
		const err = new Error('Instrument not found');
		err.status = 404;
		return next(err);
	}

	res.render('main', {
		template: 'inst_detail',
		title: 'Instrument Detail',
		inst: inst,
	});
});
