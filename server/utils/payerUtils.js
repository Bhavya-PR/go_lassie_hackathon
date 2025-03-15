/**
 * Utility functions for processing payer data
 */
const { Op } = require('sequelize');
const { Payer, PayerDetail, PayerGroup } = require('../models');
const semanticMatcher = require('./semanticMatcher');

/**
 * Get an existing payer group or create a new one
 * @param {string} groupName - Name of the payer group
 * @returns {Promise<Object>} The retrieved or created payer group
 */
async function getOrCreatePayerGroup(groupName) {
  try {
    // Try to find existing group
    let payerGroup = await PayerGroup.findOne({
      where: { name: groupName }
    });
    
    // If not found, create new group
    if (!payerGroup) {
      payerGroup = await PayerGroup.create({
        name: groupName,
        description: `Automatically created group for ${groupName}`
      });
    }
    
    return payerGroup;
  } catch (error) {
    console.error('Error in getOrCreatePayerGroup:', error);
    throw error;
  }
}

/**
 * Attempt to map new payer information to an existing payer using various strategies
 * @param {string} payerName - Name of the payer
 * @param {string} payerNumber - Payer number or null
 * @param {string} taxId - Tax ID or null
 * @returns {Promise<Object|null>} Matched payer or null if no match found
 */
async function mapToExistingPayer(payerName, payerNumber, taxId) {
  try {
    // Strategy 1: Exact match by payer number or tax ID
    if (payerNumber || taxId) {
      const detailWhereClause = {};
      
      if (payerNumber) {
        detailWhereClause.payerNumber = payerNumber;
      }
      
      if (taxId) {
        detailWhereClause.taxId = taxId;
      }
      
      const matchingDetail = await PayerDetail.findOne({
        where: detailWhereClause,
        include: [{ model: Payer, as: 'payer' }]
      });
      
      if (matchingDetail) {
        return matchingDetail.payer;
      }
    }
    
    // Strategy 2: Exact name match
    const exactNameMatch = await Payer.findOne({
      where: { name: payerName }
    });
    
    if (exactNameMatch) {
      return exactNameMatch;
    }
    
    // Strategy 3: Semantic name matching
    const allPayers = await Payer.findAll();
    
    // Find semantically similar payers
    const similarPayers = allPayers.filter(payer => 
      semanticMatcher.areNamesSemanticallySimilar(payerName, payer.name, 0.7));
    
    if (similarPayers.length > 0) {
      // Return the first match (could be extended to use a scoring system)
      return similarPayers[0];
    }
    
    // No match found
    return null;
  } catch (error) {
    console.error('Error in mapToExistingPayer:', error);
    throw error;
  }
}

/**
 * Create a new payer detail and add it to the database
 * @param {number} payerId - ID of the payer this detail belongs to
 * @param {string} payerName - Name of the payer
 * @param {string|null} payerNumber - Payer number or null
 * @param {string|null} taxId - Tax ID or null
 * @param {string} source - Source of this payer detail information
 * @returns {Promise<Object>} The created payer detail object
 */
async function createPayerDetail(payerId, payerName, payerNumber, taxId, source) {
  try {
    // Create the payer detail
    const payerDetail = await PayerDetail.create({
      name: payerName,
      payerNumber: payerNumber || null,
      taxId: taxId || null,
      source,
      payerId
    });
    
    return payerDetail;
  } catch (error) {
    console.error('Error in createPayerDetail:', error);
    throw error;
  }
}

/**
 * Search for payers by name, number, or tax ID
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of results to return, default 10
 * @returns {Promise<Array>} List of matched payers with their details
 */
async function searchPayers(query, limit = 10) {
  try {
    if (!query) {
      return [];
    }
    
    // Search by payer name/display name
    const payerMatches = await Payer.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { displayName: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [
        { model: PayerGroup, as: 'payerGroup' },
        { model: PayerDetail, as: 'payerDetails' }
      ],
      limit: parseInt(limit, 10)
    });
    
    // Search by payer details
    const detailMatches = await PayerDetail.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { payerNumber: { [Op.iLike]: `%${query}%` } },
          { taxId: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [
        { 
          model: Payer, 
          as: 'payer',
          include: [
            { model: PayerGroup, as: 'payerGroup' }
          ]
        }
      ],
      limit: parseInt(limit, 10)
    });
    
    // Combine results, removing duplicates
    const payerIds = new Set(payerMatches.map(p => p.id));
    const allResults = [...payerMatches];
    
    for (const detail of detailMatches) {
      if (!payerIds.has(detail.payer.id)) {
        allResults.push(detail.payer);
        payerIds.add(detail.payer.id);
      }
    }
    
    // Limit results
    return allResults.slice(0, limit);
  } catch (error) {
    console.error('Error in searchPayers:', error);
    throw error;
  }
}

/**
 * Merge two payers, moving all details from source to target
 * @param {number} sourcePayerId - ID of the source payer
 * @param {number} targetPayerId - ID of the target payer
 * @returns {Promise<boolean>} True if successful, False otherwise
 */
async function mergePayers(sourcePayerId, targetPayerId) {
  try {
    if (sourcePayerId === targetPayerId) {
      throw new Error('Source and target payers cannot be the same');
    }
    
    // Get source and target payers
    const sourcePayer = await Payer.findByPk(sourcePayerId, {
      include: [{ model: PayerDetail, as: 'payerDetails' }]
    });
    
    const targetPayer = await Payer.findByPk(targetPayerId);
    
    if (!sourcePayer || !targetPayer) {
      throw new Error('Source or target payer not found');
    }
    
    // Move all payer details from source to target
    for (const detail of sourcePayer.payerDetails) {
      await detail.update({ payerId: targetPayerId });
    }
    
    // Delete the source payer
    await sourcePayer.destroy();
    
    return true;
  } catch (error) {
    console.error('Error in mergePayers:', error);
    throw error;
  }
}

module.exports = {
  getOrCreatePayerGroup,
  mapToExistingPayer,
  createPayerDetail,
  searchPayers,
  mergePayers
};