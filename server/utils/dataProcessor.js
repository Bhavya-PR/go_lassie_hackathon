/**
 * Data Processing Utilities for ERA Files
 */
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { Payer, PayerDetail, PayerGroup } = require('../models');
const payerUtils = require('./payerUtils');
const semanticMatcher = require('./semanticMatcher');

/**
 * Process a CSV file containing ERA data
 * @param {string} filePath - Path to the CSV file
 * @param {string} source - Source identifier for the data
 * @returns {Promise<Object>} Processing statistics
 */
async function processCSVFile(filePath, source) {
  try {
    // Read the CSV file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    // Process the data
    return await processPayerData(records, source);
  } catch (error) {
    console.error('Error processing CSV file:', error);
    throw new Error(`Failed to process CSV file: ${error.message}`);
  }
}

/**
 * Process a tab-delimited text file containing ERA data
 * @param {string} filePath - Path to the text file
 * @param {string} source - Source identifier for the data
 * @returns {Promise<Object>} Processing statistics
 */
async function processTextFile(filePath, source) {
  try {
    // Read the text file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the tab-delimited content
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split('\t').map(header => header.trim());
    
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split('\t').map(value => value.trim());
      
      // Create record object
      const record = {};
      for (let j = 0; j < headers.length; j++) {
        record[headers[j]] = values[j] || '';
      }
      
      records.push(record);
    }
    
    // Process the data
    return await processPayerData(records, source);
  } catch (error) {
    console.error('Error processing text file:', error);
    throw new Error(`Failed to process text file: ${error.message}`);
  }
}

/**
 * Process ERA data from any file format
 * @param {string} filePath - Path to the data file
 * @param {string} source - Source identifier for the data
 * @returns {Promise<Object>} Processing statistics
 */
async function processERAData(filePath, source) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    
    switch (ext) {
      case '.csv':
        return await processCSVFile(filePath, source);
      case '.txt':
        return await processTextFile(filePath, source);
      case '.xlsx':
      case '.xls':
        // For Excel files, we'd need an additional library like xlsx or exceljs
        // For now, throw an error or implement using the appropriate library
        throw new Error('Excel file processing not implemented yet');
      default:
        throw new Error('Unsupported file format');
    }
  } catch (error) {
    console.error('Error processing ERA data:', error);
    throw new Error(`Failed to process ERA data: ${error.message}`);
  }
}

/**
 * Process payer data from any source
 * @param {Array<Object>} data - Array of payer data objects
 * @param {string} source - Source identifier for the data
 * @returns {Promise<Object>} Processing statistics
 */
async function processPayerData(data, source) {
  // Initialize statistics
  const stats = {
    total: data.length,
    processed: 0,
    newPayers: 0,
    newPayerDetails: 0,
    existingDetails: 0,
    errors: 0,
    errorDetails: []
  };
  
  try {
    // Process each record
    for (const record of data) {
      try {
        // Extract payer data - adapt field names according to your data format
        const payerName = record.payer_name || record.name;
        const payerNumber = record.payer_number || record.number;
        const taxId = record.tax_id || record.taxId;
        const groupName = record.group_name || record.groupName || 'Default Group';
        
        if (!payerName) {
          throw new Error('Payer name is required');
        }
        
        // Try to map to existing payer
        let payer = await payerUtils.mapToExistingPayer(payerName, payerNumber, taxId);
        
        // If no matching payer found, create a new one
        if (!payer) {
          // Get or create payer group
          const payerGroup = await payerUtils.getOrCreatePayerGroup(groupName);
          
          // Create new payer
          payer = await Payer.create({
            name: payerName,
            displayName: payerName,
            payerGroupId: payerGroup.id
          });
          
          stats.newPayers++;
        }
        
        // Check if a similar payer detail already exists
        const existingDetail = await PayerDetail.findOne({
          where: {
            payerId: payer.id,
            source
          }
        });
        
        if (existingDetail) {
          // Update the existing detail if needed
          let updated = false;
          
          if (payerName && existingDetail.name !== payerName) {
            existingDetail.name = payerName;
            updated = true;
          }
          
          if (payerNumber && existingDetail.payerNumber !== payerNumber) {
            existingDetail.payerNumber = payerNumber;
            updated = true;
          }
          
          if (taxId && existingDetail.taxId !== taxId) {
            existingDetail.taxId = taxId;
            updated = true;
          }
          
          if (updated) {
            await existingDetail.save();
          }
          
          stats.existingDetails++;
        } else {
          // Create a new payer detail
          await payerUtils.createPayerDetail(
            payer.id,
            payerName,
            payerNumber,
            taxId,
            source
          );
          
          stats.newPayerDetails++;
        }
        
        stats.processed++;
      } catch (error) {
        stats.errors++;
        stats.errorDetails.push({
          record,
          error: error.message
        });
        console.error('Error processing record:', error);
      }
    }
    
    return stats;
  } catch (error) {
    console.error('Error processing payer data:', error);
    throw new Error(`Failed to process payer data: ${error.message}`);
  }
}

module.exports = {
  processCSVFile,
  processTextFile,
  processERAData,
  processPayerData
};