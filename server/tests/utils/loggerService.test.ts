/* eslint-disable @typescript-eslint/no-explicit-any */
import { loggerService } from "../../utils/loggerService";
import { LogEntry } from "../../types/types";

describe("Logger Service", () => {
  // Store original logs for restoration after tests
  let originalLogs: LogEntry[];
  let originalMaxLogs: number;

  beforeAll(() => {
    // Save original logs
    originalLogs = [...(loggerService as any).logs];
    originalMaxLogs = (loggerService as any).maxLogs;
  });

  beforeEach(() => {
    // Reset logs before each test
    (loggerService as any).logs = [];
    // Reduce the maxLogs value for testing
    (loggerService as any).maxLogs = 5;
  });

  afterAll(() => {
    // Restore original logs and maxLogs
    (loggerService as any).logs = originalLogs;
    (loggerService as any).maxLogs = originalMaxLogs;
  });

  test("addLog should add a log entry to the beginning of the logs array", () => {
    // Arrange
    const logEntry: LogEntry = {
      timestamp: new Date(),
      method: "GET",
      path: "/test",
      ip: "127.0.0.1",
      userId: "user123",
      statusCode: 200,
      responseTime: 100,
      userAgent: "Test Agent",
    };

    // Act
    loggerService.addLog(logEntry);

    // Assert
    const logs = loggerService.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0]).toEqual(logEntry);
  });

  test("addLog should add new logs to the beginning of the array", () => {
    // Arrange
    const logEntry1: LogEntry = {
      timestamp: new Date(2023, 0, 1),
      method: "GET",
      path: "/test1",
      ip: "127.0.0.1",
      userId: "user1",
      statusCode: 200,
      responseTime: 100,
      userAgent: "Test Agent 1",
    };

    const logEntry2: LogEntry = {
      timestamp: new Date(2023, 0, 2),
      method: "POST",
      path: "/test2",
      ip: "127.0.0.2",
      userId: "user2",
      statusCode: 201,
      responseTime: 200,
      userAgent: "Test Agent 2",
    };

    // Act
    loggerService.addLog(logEntry1);
    loggerService.addLog(logEntry2);

    // Assert
    const logs = loggerService.getLogs();
    expect(logs.length).toBe(2);
    expect(logs[0]).toEqual(logEntry2); // Most recent should be first
    expect(logs[1]).toEqual(logEntry1);
  });

  test("addLog should trim logs if they exceed maxLogs", () => {
    // Arrange
    const maxLogs = (loggerService as any).maxLogs;
    const entries: LogEntry[] = [];

    // Create maxLogs + 2 entries (exceeding the limit by 2)
    for (let i = 0; i < maxLogs + 2; i++) {
      entries.push({
        timestamp: new Date(2023, 0, i),
        method: "GET",
        path: `/test${i}`,
        ip: "127.0.0.1",
        userId: `user${i}`,
        statusCode: 200,
        responseTime: 100 + i,
        userAgent: `Test Agent ${i}`,
      });
    }

    // Act - add all entries
    entries.forEach((entry) => loggerService.addLog(entry));

    // Assert
    const logs = loggerService.getLogs();
    expect(logs.length).toBe(maxLogs);

    // Check that we have the most recent logs (in reverse order)
    for (let i = 0; i < maxLogs; i++) {
      const expectedEntry = entries[entries.length - 1 - i];
      expect(logs[i]).toEqual(expectedEntry);
    }
  });

  test("getLogs should return all logs", () => {
    // Arrange
    const entries: LogEntry[] = [
      {
        timestamp: new Date(2023, 0, 1),
        method: "GET",
        path: "/test1",
        ip: "127.0.0.1",
        userId: "user1",
        statusCode: 200,
        responseTime: 100,
        userAgent: "Test Agent 1",
      },
      {
        timestamp: new Date(2023, 0, 2),
        method: "POST",
        path: "/test2",
        ip: "127.0.0.2",
        userId: "user2",
        statusCode: 201,
        responseTime: 200,
        userAgent: "Test Agent 2",
      },
    ];

    entries.forEach((entry) => loggerService.addLog(entry));

    // Act
    const logs = loggerService.getLogs();

    // Assert
    expect(logs.length).toBe(2);
    expect(logs[0]).toEqual(entries[1]); // Most recent first
    expect(logs[1]).toEqual(entries[0]);
  });

  test("clearLogs should empty the logs array", () => {
    // Arrange
    const entries: LogEntry[] = [
      {
        timestamp: new Date(2023, 0, 1),
        method: "GET",
        path: "/test1",
        ip: "127.0.0.1",
        userId: "user1",
        statusCode: 200,
        responseTime: 100,
        userAgent: "Test Agent 1",
      },
      {
        timestamp: new Date(2023, 0, 2),
        method: "POST",
        path: "/test2",
        ip: "127.0.0.2",
        userId: "user2",
        statusCode: 201,
        responseTime: 200,
        userAgent: "Test Agent 2",
      },
    ];

    entries.forEach((entry) => loggerService.addLog(entry));
    expect(loggerService.getLogs().length).toBe(2);

    // Act
    loggerService.clearLogs();

    // Assert
    expect(loggerService.getLogs().length).toBe(0);
  });
});
