const express = require('express');
const router = express.Router();

// controller modules

const cat_ctrl = require('../controllers/categoryController');
const type_ctrl = require('../controllers/typeController');
const inst_ctrl = require('../controllers/instrumentsController');

// CATEGORY ROUTES

// TYPES

// display all types
router.get('/types', type_ctrl.list);

// detail type
router.get('/types/:id', type_ctrl.detail);

// INSTRUMENTS

// display all instruments
router.get('/instruments', inst_ctrl.list);

// detail instruments
router.get('/instruments/:id', inst_ctrl.detail);

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
