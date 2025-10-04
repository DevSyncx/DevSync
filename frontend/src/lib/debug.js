/**
 * Debug utilities for DevSync
 * Used to help log and debug GitHub integration
 */

// Debug levels
const DEBUG_LEVELS = {
  NONE: 0,     // No logging
  ERROR: 1,    // Only errors
  INFO: 2,     // Errors and info
  DEBUG: 3,    // All logs including debug
  VERBOSE: 4   // Extremely detailed logs
};

// Current debug level - set to INFO by default
let currentLevel = DEBUG_LEVELS.INFO;

/**
 * Set the current debug level
 * @param {number} level - Debug level from DEBUG_LEVELS
 */
export function setDebugLevel(level) {
  currentLevel = level;
}

/**
 * Log an error message
 * @param {string} message - Error message
 * @param {any} data - Optional error data
 */
export function logError(message, data) {
  if (currentLevel >= DEBUG_LEVELS.ERROR) {
    console.error(`[ERROR] ${message}`, data || '');
  }
}

/**
 * Log an info message
 * @param {string} message - Info message
 * @param {any} data - Optional info data
 */
export function logInfo(message, data) {
  if (currentLevel >= DEBUG_LEVELS.INFO) {
    console.info(`[INFO] ${message}`, data || '');
  }
}

/**
 * Log a debug message
 * @param {string} message - Debug message
 * @param {any} data - Optional debug data
 */
export function logDebug(message, data) {
  if (currentLevel >= DEBUG_LEVELS.DEBUG) {
    console.debug(`[DEBUG] ${message}`, data || '');
  }
}

/**
 * Log a verbose message (very detailed)
 * @param {string} message - Verbose message
 * @param {any} data - Optional verbose data
 */
export function logVerbose(message, data) {
  if (currentLevel >= DEBUG_LEVELS.VERBOSE) {
    console.debug(`[VERBOSE] ${message}`, data || '');
  }
}

/**
 * Format GitHub activity data for display and debugging
 * @param {Array} activityData - GitHub activity data
 * @returns {Object} - Statistics and formatted data
 */
export function formatGitHubData(activityData) {
  if (!activityData || !Array.isArray(activityData) || activityData.length === 0) {
    return {
      count: 0,
      hasData: false,
      message: "No GitHub activity data available"
    };
  }
  
  // Count events by type
  const eventTypes = {};
  activityData.forEach(activity => {
    const type = activity.type || 'unknown';
    eventTypes[type] = (eventTypes[type] || 0) + 1;
  });
  
  // Count total values for heatmap
  const totalValue = activityData.reduce((total, activity) => {
    return total + (activity.value || 0);
  }, 0);
  
  // Find date range
  const dates = activityData
    .map(activity => activity.date || activity.day || '')
    .filter(Boolean)
    .sort();
  
  const firstDate = dates[0] || 'unknown';
  const lastDate = dates[dates.length - 1] || 'unknown';
  
  return {
    count: activityData.length,
    hasData: true,
    totalValue,
    eventTypes,
    dateRange: {
      first: firstDate,
      last: lastDate
    },
    sampleItem: activityData[0]
  };
}

export default {
  DEBUG_LEVELS,
  setDebugLevel,
  logError,
  logInfo,
  logDebug,
  logVerbose,
  formatGitHubData
};