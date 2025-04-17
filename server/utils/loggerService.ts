import { LogEntry } from "../types/types";

/**
 * In-memory logger service that stores system logs without requiring a database
 * Maintains a circular buffer of log entries with a configurable maximum size
 * @class LoggerService
 */
class LoggerService {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000; // Limit the number of logs to prevent memory issues

  /**
   * Add a new log entry to the in-memory log store
   * The new log is added to the beginning of the array (most recent first)
   * Older logs are removed if the total exceeds maxLogs
   *
   * @param {LogEntry} entry - The log entry to add
   */
  addLog(entry: LogEntry): void {
    this.logs.unshift(entry); // Add to the beginning for most recent first

    // Trim logs if they exceed the maximum capacity
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  /**
   * Get all stored logs from most recent to oldest
   *
   * @returns {LogEntry[]} Array of log entries
   */
  getLogs(): LogEntry[] {
    return this.logs;
  }

  /**
   * Clear all logs from memory
   */
  clearLogs(): void {
    this.logs = [];
  }
}

export const loggerService = new LoggerService();
