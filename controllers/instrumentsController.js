const Instrument = require('../models/instruments');
const Category = require('../models/category');
const Type = require('../models/type');
const User = require('../models/user');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.list = asyncHandler(async (req, res, next) => {
	const allInstruments = await Instrument.find().sort({ name: 1 }).exec();

	res.render('main', {
		template: 'instruments_list',
		title: 'Individual Instruments Available',
		inst_list: allInstruments,
		user: User.username,
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
		user: User.username,
	});
});

exports.delete_get = asyncHandler(async (req, res, next) => {
	const inst = await Instrument.findById(req.params.id).exec();

	if (inst === null) {
		res.redirect('/instruments');
	}

	res.render('main', {
		template: 'inst_delete',
		title: 'Instrument Delete',
		inst: inst,
		user: User.username,
	});
});

exports.delete_post = asyncHandler(async (req, res, next) => {
	await Instrument.findByIdAndDelete(req.body.id);
	res.redirect('/store/instruments');
});

exports.create_get = asyncHandler(async (req, res, next) => {
	const [allCat, allTypes] = await Promise.all([
		Category.find().sort().exec(),
		Type.find().sort().exec(),
	]);

	res.render('main', {
		template: 'inst_create',
		title: 'Create New Instrument',
		allCat: allCat,
		allTypes: allTypes,
		user: User.username,
	});
});

exports.create_post = [
	body('name').trim().isLength({ min: 3, max: 100 }).escape(),
	body('category').trim().escape(),
	body('type').trim().escape(),
	body('brand').optional({ values: 'falsy' }).trim().escape(),
	body('description').optional({ values: 'falsy' }).trim().escape(),
	body('price').trim().escape(),
	body('inStock').trim().escape(),
	body('backInStock').optional({ values: 'falsy' }).isISO8601().toDate(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const inst = new Instrument({
			name: req.body.name,
			category: req.body.category,
			type: req.body.type,
			brand: req.body.brand,
			description: req.body.description,
			price: req.body.price,
			inStock: req.body.inStock,
			backInStock: req.body.backInStock,
		});

		if (!errors.isEmpty()) {
			res.render('main', {
				template: 'inst_create',
				title: 'Create New Instrument',
				inst: inst,
				errors: errors,
				user: User.username,
			});
		} else {
			await inst.save();
			res.redirect(inst.url);
		}
	}),
];

exports.update_get = asyncHandler(async (req, res, next) => {
	const [inst, allCat, allType] = await Promise.all([
		Instrument.findById(req.params.id)
			.populate('category')
			.populate('type')
			.exec(),
		Category.find().sort().exec(),
		Type.find().sort().exec(),
	]);

	if (inst === null) {
		// No results.
		const err = new Error('Instrument not found');
		err.status = 404;
		return next(err);
	}

	console.log(inst.date_form);

	res.render('main', {
		template: 'inst_update',
		title: 'Update Instrument',
		inst: inst,
		allCat: allCat,
		allType: allType,
		user: User.username,
	});
});

exports.update_post = [
	body('name').trim().isLength({ min: 3, max: 100 }).escape(),
	body('category').trim().escape(),
	body('type').trim().escape(),
	body('brand').optional({ values: 'falsy' }).trim().escape(),
	body('description').optional({ values: 'falsy' }).trim().escape(),
	body('price').trim().escape(),
	body('inStock').trim().escape(),
	body('backInStock').optional({ values: 'falsy' }).isISO8601().toDate(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const inst = new Instrument({
			name: req.body.name,
			category: req.body.category,
			type: req.body.type,
			brand: req.body.brand,
			description: req.body.description,
			price: req.body.price,
			inStock: req.body.inStock,
			backInStock: req.body.backInStock,
			_id: req.params.id,
		});

		if (!errors.isEmpty()) {
			res.render('main', {
				template: 'inst_create',
				title: 'Create New Instrument',
				inst: inst,
				errors: errors,
				user: User.username,
			});
		} else {
			// Data from form is valid. Update the record.
			const updateInst = await Instrument.findByIdAndUpdate(
				req.params.id,
				inst,
				{}
			);
			// Redirect to book detail page.
			res.redirect(updateInst.url);
		}
	}),
];
