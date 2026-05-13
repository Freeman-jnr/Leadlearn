import { describe, it, expect } from "@jest/globals";

describe("smoke", () => {
  it("environment loads", () => {
    expect(1 + 1).toBe(2);
  });
});
