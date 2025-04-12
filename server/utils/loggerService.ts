import { LogEntry } from "../types/types";

/**
 * In-memory logger service that stores logs without using a database
 */
class LoggerService {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000; // Limit the number of logs to prevent memory issues

  /**
   * Add a new log entry to the in-memory log store
   * @param entry The log entry to add
   */
  addLog(entry: LogEntry): void {
    this.logs.unshift(entry); // Add to the beginning for most recent first

    // Trim logs if they exceed the maximum capacity
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  /**
   * Get all stored logs
   * @returns Array of log entries
   */
  getLogs(): LogEntry[] {
    return this.logs;
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }
}

export const loggerService = new LoggerService();
