import { checkRateLimit, pruneExpiredBuckets } from "../rateLimit";

describe("checkRateLimit", () => {
  it("allows requests under the limit", () => {
    const id = `test-user-${Math.random()}`;
    const result = checkRateLimit(id);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks requests once the limit is exceeded", () => {
    const id = `test-user-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(id);
    }
    const sixth = checkRateLimit(id);
    expect(sixth.allowed).toBe(false);
    expect(sixth.remaining).toBe(0);
  });

  it("resets after the window expires", () => {
    const id = `test-user-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(id);
    }
    expect(() => pruneExpiredBuckets()).not.toThrow();
    const otherId = `other-user-${Math.random()}`;
    const result = checkRateLimit(otherId);
    expect(result.allowed).toBe(true);
  });
});
