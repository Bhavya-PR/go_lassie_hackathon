/**
 * Semantic matcher utility for comparing payer names
 * Based on the original Python implementation
 */

// Common words to remove (equivalents to Python stopwords)
const COMMON_WORDS = [
    'inc', 'incorporated', 'llc', 'ltd', 'limited', 'corp', 'corporation',
    'co', 'company', 'group', 'holdings', 'services', 'service', 'insurance',
    'ins', 'health', 'healthcare', 'plan', 'plans', 'medical', 'care', 'the',
    'of', 'and', 'a', 'to', 'in', 'for', 'with', 'as', 'at', 'by', 'on',
    'united', 'states', 'america', 'american', 'national', 'association', 'assoc',
    'first', 'second', 'third', 'fourth', 'fifth', 'dental', 'vision'
  ];
  
  /**
   * Preprocess a payer name for comparison
   * @param {string} name - The payer name to preprocess
   * @returns {string} The preprocessed name
   */
  function preprocessName(name) {
    if (!name) return '';
    
    // Convert to lowercase
    let processed = name.toLowerCase();
    
    // Remove punctuation
    processed = processed.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ');
    
    // Split into words
    let words = processed.split(/\s+/).filter(word => word.length > 0);
    
    // Remove common words
    words = words.filter(word => !COMMON_WORDS.includes(word));
    
    // Join back and return
    return words.join(' ');
  }
  
  /**
   * Calculate Jaccard similarity between two preprocessed names
   * @param {string} name1 - First preprocessed name
   * @param {string} name2 - Second preprocessed name
   * @returns {number} Similarity score between 0 and 1
   */
  function calculateSimilarity(name1, name2) {
    // Split names into word sets
    const words1 = new Set(name1.split(/\s+/).filter(w => w.length > 0));
    const words2 = new Set(name2.split(/\s+/).filter(w => w.length > 0));
    
    // If both sets are empty, they're identical (edge case)
    if (words1.size === 0 && words2.size === 0) {
      return 1.0;
    }
    
    // Calculate intersection
    const intersection = new Set();
    for (const word of words1) {
      if (words2.has(word)) {
        intersection.add(word);
      }
    }
    
    // Calculate union
    const union = new Set([...words1, ...words2]);
    
    // Jaccard similarity: size of intersection / size of union
    return intersection.size / union.size;
  }
  
  /**
   * Determine if two payer names are semantically similar
   * @param {string} name1 - First payer name
   * @param {string} name2 - Second payer name
   * @param {number} threshold - Similarity threshold (0-1), default 0.5
   * @returns {boolean} True if names are similar, False otherwise
   */
  function areNamesSemanticallySimilar(name1, name2, threshold = 0.5) {
    // Quick check for exact matches
    if (name1 === name2) {
      return true;
    }
    
    // Preprocess names
    const processed1 = preprocessName(name1);
    const processed2 = preprocessName(name2);
    
    // Calculate similarity
    const similarity = calculateSimilarity(processed1, processed2);
    
    // Return based on threshold
    return similarity >= threshold;
  }
  
  module.exports = {
    preprocessName,
    calculateSimilarity,
    areNamesSemanticallySimilar
  };