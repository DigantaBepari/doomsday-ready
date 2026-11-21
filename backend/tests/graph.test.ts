import { describe, expect, it } from "vitest";
import { getRewatchOrder, wouldCreateCycle } from "../src/algorithms/graph.js";

describe("wouldCreateCycle", () => {
  it("detects direct and indirect cycles", () => {
    const graph = new Map<number, number[]>([
      [1, []],
      [2, [1]],
      [3, [2]],
    ]);

    expect(wouldCreateCycle(1, [1], graph)).toBe(true);
    expect(wouldCreateCycle(1, [3], graph)).toBe(true);
    expect(wouldCreateCycle(1, [2], graph)).toBe(true);
    expect(wouldCreateCycle(3, [1], graph)).toBe(false);
  });
});

describe("getRewatchOrder", () => {
  it("returns transitive prerequisites once in prerequisite-first order", () => {
    const graph = new Map<number, number[]>([
      [1, []],
      [2, [1]],
      [3, [1]],
      [4, [2, 3]],
      [5, [4]],
    ]);

    const order = getRewatchOrder(5, graph);
    const positions = new Map(order.map((id, index) => [id, index]));

    expect(order).toHaveLength(4);
    expect(new Set(order).size).toBe(4);
    expect(order).not.toContain(5);
    for (const [movieId, prerequisites] of graph) {
      for (const prerequisiteId of prerequisites) {
        if (positions.has(movieId) && positions.has(prerequisiteId)) {
          expect(positions.get(prerequisiteId)).toBeLessThan(positions.get(movieId)!);
        }
      }
    }
  });

  it("handles deep graphs iteratively", () => {
    const depth = 20_000;
    const graph = new Map<number, number[]>([[0, [1]]]);
    for (let id = 1; id <= depth; id += 1) graph.set(id, id === depth ? [] : [id + 1]);

    const order = getRewatchOrder(0, graph);

    expect(order).toHaveLength(depth);
    expect(order[0]).toBe(depth);
    expect(order.at(-1)).toBe(1);
  });
});
