/**
 * API Routes Index
 */
const express = require('express');
const router = express.Router();

// Import route modules
const payersRoutes = require('./payers');
const payerGroupsRoutes = require('./payerGroups');
const payerDetailsRoutes = require('./payerDetails');
const uploadRoutes = require('./upload');

// Register routes
router.use('/payers', payersRoutes);
router.use('/payer-groups', payerGroupsRoutes);
router.use('/payer-details', payerDetailsRoutes);
router.use('/upload', uploadRoutes);

// Stats endpoint for dashboard
router.get('/stats', async (req, res) => {
  try {
    const { Payer, PayerGroup, PayerDetail } = require('../../models');
    
    // Get counts of each model
    const totalPayers = await Payer.count();
    const totalPayerGroups = await PayerGroup.count();
    const totalUniqueDetails = await PayerDetail.count();
    
    // For recentUploads, we could track this in a separate table
    // For now, we'll just return a placeholder
    const recentUploads = 0;
    
    res.json({
      totalPayers,
      totalPayerGroups,
      totalUniqueDetails,
      recentUploads
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
});

module.exports = router;