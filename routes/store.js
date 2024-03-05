const express = require('express');
const router = express.Router();
const passport = require('passport');

// controller modules

const cat_ctrl = require('../controllers/categoryController');
const type_ctrl = require('../controllers/typeController');
const inst_ctrl = require('../controllers/instrumentsController');
const auth_ctrl = require('../controllers/authenticationController');

// ROUTES

// SIGN UP AND SIGN OUT

router.get('/sign-up', auth_ctrl.sign_up);

router.post('/sign-up', auth_ctrl.sign_up_post);

router.get('/log-in', auth_ctrl.log_in_get);

router.post(
	'/log-in',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/store/sign-up',
	})
);

router.get('/log-out', (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/');
		console.log('You Have Logged Out!');
	});
});

// TYPES

// display all types
router.get('/types', type_ctrl.list);

// detail type
router.get('/types/:id', type_ctrl.detail);

// create type GET
router.get('/create/type', type_ctrl.create_get);

// create type POST
router.post('/create/type', type_ctrl.create_post);

// delete type GET
router.get('/types/:id/delete', type_ctrl.delete_get);

// delete type POST
router.post('/types/:id/delete', type_ctrl.delete_post);

// INSTRUMENTS

// display all instruments
router.get('/instruments', inst_ctrl.list);

// detail instruments
router.get('/instruments/:id', inst_ctrl.detail);

// create instrument GET
router.get('/create/instrument', inst_ctrl.create_get);

// create instrument POST
router.post('/create/instrument', inst_ctrl.create_post);

// delete instrument GET
router.get('/instruments/:id/delete', inst_ctrl.delete_get);

// delete instrument POST
router.post('/instruments/:id/delete', inst_ctrl.delete_post);

// update instrument GET
router.get('/instruments/:id/update', inst_ctrl.update_get);

// update instrument POST
router.post('/instruments/:id/update', inst_ctrl.update_post);

// CATEGORIES

// display category detail page
router.get('/:id', cat_ctrl.detail);

// create category GET
router.get('/create/category', cat_ctrl.create_get);

// create category POST
router.post('/create/category', cat_ctrl.create_post);

// delete category GET
router.get('/:id/delete', cat_ctrl.delete_get);

// delete category POST
router.post('/:id/delete', cat_ctrl.delete_post);

// display all categories, main index
router.get('/', cat_ctrl.index);

module.exports = router;
