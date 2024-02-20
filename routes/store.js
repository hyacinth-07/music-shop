const express = require('express');
const router = express.Router();

// controller modules

const cat_ctrl = require('../controllers/categoryController');

// CATEGORY ROUTES

router.get('/', cat_ctrl.index);

module.exports = router;
