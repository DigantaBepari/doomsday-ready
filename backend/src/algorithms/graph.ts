export type PrerequisiteGraph = ReadonlyMap<number, readonly number[]>;

/** Returns whether replacing movieId's outgoing prerequisite edges would create a cycle. */
export const wouldCreateCycle = (
  movieId: number,
  proposedPrerequisiteIds: readonly number[],
  graph: PrerequisiteGraph,
): boolean => {
  const visited = new Set<number>();
  const pending = [...proposedPrerequisiteIds];

  while (pending.length > 0) {
    const currentId = pending.pop()!;
    if (currentId === movieId) return true;
    if (visited.has(currentId)) continue;

    visited.add(currentId);
    for (const prerequisiteId of graph.get(currentId) ?? []) pending.push(prerequisiteId);
  }

  return false;
};

/** Returns unique prerequisite ids in DFS post-order, without including targetId. */
export const getRewatchOrder = (targetId: number, graph: PrerequisiteGraph): number[] => {
  const order: number[] = [];
  const completed = new Set<number>();
  const active = new Set<number>();
  const pending: Array<{ id: number; expanded: boolean }> = [];

  for (let index = (graph.get(targetId)?.length ?? 0) - 1; index >= 0; index -= 1) {
    const prerequisiteId = graph.get(targetId)![index]!;
    if (prerequisiteId !== targetId) pending.push({ id: prerequisiteId, expanded: false });
  }

  while (pending.length > 0) {
    const current = pending.pop()!;
    if (current.id === targetId || completed.has(current.id)) continue;

    if (current.expanded) {
      active.delete(current.id);
      completed.add(current.id);
      order.push(current.id);
      continue;
    }

    if (active.has(current.id)) continue;
    active.add(current.id);
    pending.push({ id: current.id, expanded: true });

    const prerequisites = graph.get(current.id) ?? [];
    for (let index = prerequisites.length - 1; index >= 0; index -= 1) {
      const prerequisiteId = prerequisites[index]!;
      if (prerequisiteId !== targetId && !completed.has(prerequisiteId) && !active.has(prerequisiteId)) {
        pending.push({ id: prerequisiteId, expanded: false });
      }
    }
  }

  return order;
};
