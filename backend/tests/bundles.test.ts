import { describe, expect, it } from "vitest";
import { findMinBundles } from "../src/algorithms/bundles.js";

describe("findMinBundles", () => {
  it("uses two bundles of size 3 for [1, 3, 4] and 6", () => {
    expect(findMinBundles([1, 3, 4], 6)).toEqual({
      totalBundles: 2,
      breakdown: [{ size: 3, count: 2 }],
    });
  });

  it("reconstructs the minimum combination for [2, 5] and 11", () => {
    expect(findMinBundles([2, 5], 11)).toEqual({
      totalBundles: 4,
      breakdown: [{ size: 5, count: 1 }, { size: 2, count: 3 }],
    });
  });

  it("reconstructs the minimum combination for [6, 9, 20] and 44", () => {
    expect(findMinBundles([6, 9, 20], 44)).toEqual({
      totalBundles: 4,
      breakdown: [{ size: 20, count: 1 }, { size: 9, count: 2 }, { size: 6, count: 1 }],
    });
  });

  it("returns null when an exact combination is impossible", () => {
    expect(findMinBundles([4, 6], 7)).toBeNull();
  });

  it("handles group size 1", () => {
    expect(findMinBundles([2, 3], 1)).toBeNull();
    expect(findMinBundles([2, 3, 1], 1)).toEqual({ totalBundles: 1, breakdown: [{ size: 1, count: 1 }] });
  });

  it("always finds a combination when bundle size 1 is available", () => {
    expect(findMinBundles([1], 99)).toEqual({ totalBundles: 99, breakdown: [{ size: 1, count: 99 }] });
  });

  it("handles the 10,000 group size upper bound", () => {
    expect(findMinBundles([500], 10_000)).toEqual({
      totalBundles: 20,
      breakdown: [{ size: 500, count: 20 }],
    });
  });

  it("returns null for invalid algorithm inputs", () => {
    expect(findMinBundles([], 10)).toBeNull();
    expect(findMinBundles([0, 2], 10)).toBeNull();
    expect(findMinBundles([1.5, 2], 10)).toBeNull();
    expect(findMinBundles([1, 2], 0)).toBeNull();
    expect(findMinBundles([1, 2], 10_001)).toBeNull();
  });
});
