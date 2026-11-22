/**
 * Pure helpers for the pick-and-order phase.
 */

/**
 * Toggle a card in the selection.
 * @returns {{selection:string[], status:'added'|'removed'|'full'|'invalid'}}
 */
export function toggleSelection(selection, id, challenge) {
  if (!challenge.cardIds.includes(id)) return { selection, status: 'invalid' };
  if (selection.includes(id)) {
    return { selection: selection.filter((s) => s !== id), status: 'removed' };
  }
  if (selection.length >= challenge.picks) return { selection, status: 'full' };
  return { selection: [...selection, id], status: 'added' };
}

/** Move an item from one index to another (immutable). */
export function moveItem(list, from, to) {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return list.slice();
  }
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function isComplete(selection, challenge) {
  return selection.length === challenge.picks && new Set(selection).size === selection.length;
}
