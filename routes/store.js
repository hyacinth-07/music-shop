const express = require('express');
const router = express.Router();

// controller modules

const cat_ctrl = require('../controllers/categoryController');
const type_ctrl = require('../controllers/typeController');
const inst_ctrl = require('../controllers/instrumentsController');

// CATEGORY ROUTES

// display all types
router.get('/types', type_ctrl.list);

// detail type

router.get('/types/:id', type_ctrl.detail);

// display all instruments

router.get('/instruments', inst_ctrl.list);

// detail instruments

router.get('/instruments/:id', inst_ctrl.detail);

// display category detail page

router.get('/:id', cat_ctrl.detail);

// display all categories, main index

router.get('/', cat_ctrl.index);

module.exports = router;
