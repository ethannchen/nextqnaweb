import {
  sanitizeUsername,
  sanitizeEmail,
  sanitizePassword,
  sanitizeText,
  validateUrl,
} from "../../utils/sanitizers";

describe("Sanitizer Utilities", () => {
  describe("sanitizeUsername", () => {
    it("should accept valid usernames", () => {
      expect(sanitizeUsername("user123")).toBe("user123");
      expect(sanitizeUsername("user_123")).toBe("user_123");
      expect(sanitizeUsername("User123")).toBe("User123");
    });

    it("should reject usernames that are too short", () => {
      expect(sanitizeUsername("ab")).toBeNull();
    });

    it("should reject usernames that are too long", () => {
      expect(sanitizeUsername("a".repeat(31))).toBeNull();
    });

    it("should reject usernames with invalid characters", () => {
      expect(sanitizeUsername("user@123")).toBeNull();
      expect(sanitizeUsername("user-123")).toBeNull();
      expect(sanitizeUsername("user 123")).toBeNull();
    });

    it("should trim whitespace", () => {
      expect(sanitizeUsername(" user123 ")).toBe("user123");
    });

    it("should handle undefined input", () => {
      expect(sanitizeUsername(undefined)).toBeNull();
    });
  });

  describe("sanitizeEmail", () => {
    it("should accept valid emails", () => {
      expect(sanitizeEmail("user@example.com")).toBe("user@example.com");
      expect(sanitizeEmail("user.name@example.co.uk")).toBe(
        "user.name@example.co.uk"
      );
    });

    it("should convert emails to lowercase", () => {
      expect(sanitizeEmail("User@Example.com")).toBe("user@example.com");
    });

    it("should reject invalid emails", () => {
      expect(sanitizeEmail("userexample.com")).toBeNull(); // Missing @
      expect(sanitizeEmail("user@")).toBeNull(); // Incomplete
      expect(sanitizeEmail("@example.com")).toBeNull(); // Missing local part
    });

    it("should trim whitespace", () => {
      expect(sanitizeEmail(" user@example.com ")).toBe("user@example.com");
    });

    it("should handle undefined input", () => {
      expect(sanitizeEmail(undefined)).toBeNull();
    });
  });

  describe("sanitizePassword", () => {
    it("should accept valid passwords", () => {
      expect(sanitizePassword("Password123")).toBe("Password123");
      expect(sanitizePassword("p@ssw0rd")).toBe("p@ssw0rd");
    });

    it("should reject passwords that are too short", () => {
      expect(sanitizePassword("Pass1")).toBeNull();
    });

    it("should reject passwords without letters", () => {
      expect(sanitizePassword("12345678")).toBeNull();
    });

    it("should reject passwords without numbers", () => {
      expect(sanitizePassword("Password")).toBeNull();
    });

    it("should handle undefined input", () => {
      expect(sanitizePassword(undefined)).toBeNull();
    });
  });

  describe("sanitizeText", () => {
    it("should escape HTML characters", () => {
      expect(sanitizeText('<script>alert("XSS")</script>')).toBe(
        "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"
      );
    });

    it("should handle empty and undefined input", () => {
      expect(sanitizeText("")).toBe("");
      expect(sanitizeText(undefined)).toBe("");
    });

    it("should trim whitespace", () => {
      expect(sanitizeText(" text ")).toBe("text");
    });
  });

  describe("validateUrl", () => {
    it("should accept valid URLs", () => {
      expect(validateUrl("https://example.com")).toBe("https://example.com");
      expect(validateUrl("http://localhost:3000")).toBe(
        "http://localhost:3000"
      );
    });

    it("should reject invalid URLs", () => {
      expect(validateUrl("not-a-url")).toBeNull();
      expect(validateUrl("example.com")).toBeNull();
    });

    it("should handle empty, null, and undefined input", () => {
      expect(validateUrl("")).toBeNull();
      expect(validateUrl(null)).toBeNull();
      expect(validateUrl(undefined)).toBeNull();
    });
  });
});
