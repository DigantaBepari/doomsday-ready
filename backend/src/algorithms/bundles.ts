export interface BundleBreakdown {
  size: number;
  count: number;
}

export interface BundleSolution {
  totalBundles: number;
  breakdown: BundleBreakdown[];
}

/** Finds an exact combination using the fewest bundles, reconstructing one optimal solution. */
export const findMinBundles = (sizes: number[], groupSize: number): BundleSolution | null => {
  if (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > 10_000) return null;
  if (sizes.length === 0 || sizes.some((size) => !Number.isInteger(size) || size < 1)) return null;

  const uniqueSizes = [...new Set(sizes)].sort((a, b) => b - a);
  const bestCount = new Array<number>(groupSize + 1).fill(Number.POSITIVE_INFINITY);
  const lastBundleSize = new Array<number>(groupSize + 1).fill(0);
  bestCount[0] = 0;

  for (let currentTotal = 1; currentTotal <= groupSize; currentTotal += 1) {
    for (const size of uniqueSizes) {
      if (size > currentTotal) continue;
      const candidateCount = bestCount[currentTotal - size]! + 1;
      if (candidateCount < bestCount[currentTotal]!) {
        bestCount[currentTotal] = candidateCount;
        lastBundleSize[currentTotal] = size;
      }
    }
  }

  if (!Number.isFinite(bestCount[groupSize])) return null;

  const counts = new Map<number, number>();
  for (let remaining = groupSize; remaining > 0;) {
    const size = lastBundleSize[remaining]!;
    if (size === 0) return null;
    counts.set(size, (counts.get(size) ?? 0) + 1);
    remaining -= size;
  }

  const breakdown = [...counts]
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => b.size - a.size);

  return { totalBundles: bestCount[groupSize]!, breakdown };
};
