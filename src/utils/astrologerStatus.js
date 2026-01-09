// Astrologer status constants
export const ASTROLOGER_STATUS = {
  OFFLINE: 'Offline',
  ONLINE: 'Online',
  BUSY: 'Busy'
};

// Status color mapping
export const STATUS_COLORS = {
  [ASTROLOGER_STATUS.OFFLINE]: 'text-gray-500',
  [ASTROLOGER_STATUS.BUSY]: 'text-red-500',
  [ASTROLOGER_STATUS.ONLINE]: 'text-green-500'
};

/**
 * Determines astrologer status based on workingStatus and isBusy flags
 * @param {boolean} workingStatus - Whether astrologer is working
 * @param {boolean} isBusy - Whether astrologer is busy
 * @returns {string} Status string (Offline, Online, or Busy)
 */
export const getAstrologerStatus = (workingStatus = false, isBusy = false) => {
  if (!workingStatus) return ASTROLOGER_STATUS.OFFLINE;
  return isBusy ? ASTROLOGER_STATUS.BUSY : ASTROLOGER_STATUS.ONLINE;
};

/**
 * Checks if astrologer is available for navigation/interaction
 * @param {string} status - Astrologer status
 * @returns {boolean} Whether astrologer is available
 */
export const isAstrologerAvailable = (status) => {
  return status !== ASTROLOGER_STATUS.OFFLINE;
};

/**
 * Gets status color class for UI display
 * @param {string} status - Astrologer status
 * @returns {string} CSS color class
 */
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || STATUS_COLORS[ASTROLOGER_STATUS.OFFLINE];
};