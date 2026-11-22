/**
 * Minimal dnd-kit modifiers (avoids pulling in @dnd-kit/modifiers).
 */
export const restrictToVerticalAxis = ({ transform }) => ({ ...transform, x: 0 });

export const restrictToParentElement = ({ transform, draggingNodeRect, containerNodeRect }) => {
  if (!draggingNodeRect || !containerNodeRect) return transform;
  const minY = containerNodeRect.top - draggingNodeRect.top;
  const maxY = containerNodeRect.bottom - draggingNodeRect.bottom;
  return { ...transform, y: Math.min(maxY, Math.max(minY, transform.y)) };
};
