import { searchQuestion } from "../../utils/searchQuestion";
import { IQuestion, ITag } from "../../types/types";

describe("searchQuestion Tests", () => {
  // Mock data for testing
  const mockTags: ITag[] = [
    { _id: "1", name: "javascript" },
    { _id: "2", name: "react" },
    { _id: "3", name: "node.js" },
    { _id: "4", name: "typescript" },
  ];

  const mockQuestions: IQuestion[] = [
    {
      _id: "q1",
      title: "React component not rendering",
      text: "I'm having trouble with my React component. It's not rendering as expected.",
      tags: [mockTags[1]], // react
      answers: [],
      ask_date_time: new Date().toISOString(),
      views: 5,
      mostRecentActivity: new Date(),
    },
    {
      _id: "q2",
      title: "How to use Node.js with TypeScript",
      text: "I want to set up a Node.js project with TypeScript. What's the best approach?",
      tags: [mockTags[2], mockTags[3]], // node.js, typescript
      answers: [],
      ask_date_time: new Date().toISOString(),
      views: 10,
      mostRecentActivity: new Date(),
    },
    {
      _id: "q3",
      title: "JavaScript async/await explained",
      text: "Can someone explain how async/await works in JavaScript?",
      tags: [mockTags[0]], // javascript
      answers: [],
      ask_date_time: new Date().toISOString(),
      views: 15,
      mostRecentActivity: new Date(),
    },
    {
      _id: "q4",
      title: "React Hooks with TypeScript",
      text: "How to properly type React Hooks when using TypeScript?",
      tags: [mockTags[1], mockTags[3]], // react, typescript
      answers: [],
      ask_date_time: new Date().toISOString(),
      views: 20,
      mostRecentActivity: new Date(),
    },
  ];

  describe("extractTags function (indirectly tested)", () => {
    test("should extract tags from search text", () => {
      const result = searchQuestion(mockQuestions, "[react] component");

      // Should return questions with 'react' tag
      expect(result).toHaveLength(2);
      expect(result.map((q) => q._id)).toContain("q1");
      expect(result.map((q) => q._id)).toContain("q4");
    });

    test("should extract multiple tags from search text", () => {
      const result = searchQuestion(mockQuestions, "[react] [typescript]");

      // Should return questions with both 'react' and 'typescript' tags
      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe("q4");
    });

    test("should handle search with no tags", () => {
      const result = searchQuestion(mockQuestions, "component");

      // Should return questions with word 'component'
      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe("q1");
    });
  });

  describe("extractWords function (indirectly tested)", () => {
    test("should extract words from search text", () => {
      const result = searchQuestion(mockQuestions, "react component");

      // Should return questions with either 'react' or 'component'
      expect(result).toHaveLength(2);
      expect(result.map((q) => q._id)).toContain("q1");
      expect(result.map((q) => q._id)).toContain("q4");
    });

    test("should handle search with only tags (no words)", () => {
      const result = searchQuestion(mockQuestions, "[react]");

      // Should return questions with 'react' tag only
      expect(result).toHaveLength(2);
      expect(result.map((q) => q._id)).toContain("q1");
      expect(result.map((q) => q._id)).toContain("q4");
    });

    test("should ignore tags when extracting words", () => {
      const result = searchQuestion(mockQuestions, "[react] typescript");

      // Should return questions with 'react' tag or containing 'typescript'
      expect(result).toHaveLength(3);
      expect(result.map((q) => q._id)).toContain("q1");
      expect(result.map((q) => q._id)).toContain("q2");
      expect(result.map((q) => q._id)).toContain("q4");
    });
  });

  describe("filterByTags function (indirectly tested)", () => {
    test("should filter questions by tag name", () => {
      const result = searchQuestion(mockQuestions, "[typescript]");

      // Should return questions with 'typescript' tag
      expect(result).toHaveLength(2);
      expect(result.map((q) => q._id)).toContain("q2");
      expect(result.map((q) => q._id)).toContain("q4");
    });

    test("should filter questions by multiple tags (AND logic)", () => {
      const result = searchQuestion(mockQuestions, "[react] [typescript]");

      // Should return questions with both 'react' AND 'typescript' tags
      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe("q4");
    });

    test("should return all questions when no tags are provided", () => {
      const result = searchQuestion(mockQuestions, "");

      // Should return all questions
      expect(result).toHaveLength(4);
    });

    test("should handle tags with no matching questions", () => {
      const result = searchQuestion(mockQuestions, "[nonexistent]");

      // Should return no questions
      expect(result).toHaveLength(0);
    });
  });

  describe("filterByWords function (indirectly tested)", () => {
    test("should filter questions by words in title", () => {
      const result = searchQuestion(mockQuestions, "component");

      // Should return questions with 'component' in title
      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe("q1");
    });

    test("should filter questions by words in text", () => {
      const result = searchQuestion(mockQuestions, "project");

      // Should return questions with 'project' in text
      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe("q2");
    });

    test("should be case insensitive", () => {
      const result = searchQuestion(mockQuestions, "REACT");

      // Should return questions with 'react' in title/text (case insensitive)
      expect(result).toHaveLength(2);
      expect(result.map((q) => q._id)).toContain("q1");
      expect(result.map((q) => q._id)).toContain("q4");
    });

    test("should handle words with no matching questions", () => {
      const result = searchQuestion(mockQuestions, "python");

      // Should return no questions
      expect(result).toHaveLength(0);
    });
  });

  describe("combined filtering", () => {
    test("should filter by both tags and words (OR logic between tags and words)", () => {
      const result = searchQuestion(mockQuestions, "[javascript] async");

      // Should return questions with 'javascript' tag OR containing 'async'
      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe("q3");
    });

    test("should handle multiple words and tags", () => {
      const result = searchQuestion(mockQuestions, "[react] typescript hooks");

      // Should return questions with 'react' tag OR containing 'typescript' OR containing 'hooks'
      expect(result).toHaveLength(3);
      expect(result.map((q) => q._id)).toContain("q1");
      expect(result.map((q) => q._id)).toContain("q2");
      expect(result.map((q) => q._id)).toContain("q4");
    });

    test("should handle empty search string", () => {
      const result = searchQuestion(mockQuestions, "");

      // Should return all questions
      expect(result).toHaveLength(4);
    });

    test("should handle whitespace only search string", () => {
      const result = searchQuestion(mockQuestions, "   ");

      // Should return all questions
      expect(result).toHaveLength(4);
    });

    test("should handle complex search with both tags and words", () => {
      const result = searchQuestion(
        mockQuestions,
        "[react] [typescript] hooks properly"
      );

      // Should return the question with both 'react' and 'typescript' tags, or containing 'hooks' or 'properly'
      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe("q4");
    });
  });
});
