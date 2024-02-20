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
