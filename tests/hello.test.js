const { describe, it, expect } = require("@jest/globals");

describe("Hello", () => {
  it("should return hello", () => {
    expect("hello").toBe("hello");
  });
});
