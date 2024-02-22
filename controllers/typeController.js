const Type = require('../models/type');
const Instrument = require('../models/instruments');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

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

exports.create_get = (req, res, next) => {
	res.render('main', {
		template: 'type_create',
		title: 'Create New Type',
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

		const type = new Type({ name: req.body.name });

		const typeExists = await Type.findOne({ name: req.body.name }).exec();

		if (!errors.isEmpty()) {
			res.render('main', {
				template: 'type_create',
				title: 'Create New Type',
				type: type,
				errors: errors,
			});
			return;
		} else {
			// data is valid
			const typeExists = await Type.findOne({ name: req.body.name }).exec();
			if (typeExists) {
				res.redirect(typeExists.url);
			} else {
				await type.save();
				res.redirect(type.url);
			}
		}
	}),
];

exports.delete_get = asyncHandler(async (req, res, next) => {
	const [type, inst] = await Promise.all([
		Type.findById(req.params.id).exec(),
		Instrument.find({ type: req.params.id }, 'name').exec(),
	]);

	if (type === null) {
		res.redirect('/store/types');
	}

	res.render('main', {
		template: 'type_delete',
		title: 'Type Delete',
		type: type,
		inst: inst,
	});
});

exports.delete_post = asyncHandler(async (req, res, next) => {
	const [type, inst] = await Promise.all([
		Type.findById(req.params.id).exec(),
		Instrument.find({ type: req.params.id }, 'name').exec(),
	]);

	if (inst.length > 0) {
		res.render('layout', {
			template: 'type_delete',
			title: 'Type Delete',
			type: type,
			inst: inst,
		});
		return;
	} else {
		await Type.findByIdAndDelete(req.body.id);
		res.redirect('/store/types');
	}
});
