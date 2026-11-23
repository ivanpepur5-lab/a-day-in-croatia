import { NARRATOR } from '../data/story.js';

/** Duje, the narrator: a witty local friend from Split. Fiction — but his tips link to real Local Insider cards. */
export default function Duje({ children, compact = false, testId }) {
  if (!children) return null;
  return (
    <div className={`duje ${compact ? 'duje--compact' : ''}`} data-testid={testId}>
      <span className="duje__avatar" aria-hidden="true">
        D
      </span>
      <div className="duje__bubble">
        {!compact && (
          <span className="duje__name">
            {NARRATOR.name} <small>· {NARRATOR.role}</small>
          </span>
        )}
        <p>{children}</p>
      </div>
    </div>
  );
}
