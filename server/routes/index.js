/**
 * Main Routes Index
 */
const express = require('express');
const router = express.Router();
const apiRoutes = require('./api');

// Use API routes
router.use('/', apiRoutes);

module.exports = router;