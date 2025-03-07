/**
 * Utility object for consistent logging across the application
 * Provides different log levels with visual indicators
 */
export const log = {
  /**
   * Log informational message
   * @param {string} category - The category or context of the log
   * @param {string} message - The message to log
   */
  info: (category: string, message: string) =>
    console.log(`[${category}] ${message}`),

  /**
   * Log success message with checkmark
   * @param {string} category - The category or context of the log
   * @param {string} message - The message to log
   */
  success: (category: string, message: string) =>
    console.log(`[${category}] ✅ ${message}`),

  /**
   * Log warning message with warning symbol
   * @param {string} category - The category or context of the log
   * @param {string} message - The message to log
   */
  warning: (category: string, message: string) =>
    console.log(`[${category}] ⚠️ ${message}`),

  /**
   * Log error message with cross mark
   * @param {string} category - The category or context of the log
   * @param {string} message - The message to log
   */
  error: (category: string, message: string) =>
    console.error(`[${category}] ❌ ${message}`),

  /**
   * Log skip message with skip symbol
   * @param {string} category - The category or context of the log
   * @param {string} message - The message to log
   */
  skip: (category: string, message: string) =>
    console.log(`[${category}] ⏭️ ${message}`),

  /**
   * Log detailed information
   * @param {string} category - The category or context of the log
   * @param {string} message - The message to log
   */
  detail: (category: string, message: string) =>
    console.log(`[${category}] �� ${message}`),
};
