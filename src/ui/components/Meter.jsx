/**
 * Horizontal meter showing usage against a hard limit.
 */
export default function Meter({ label, valueText, limitText, value, limit, icon, testId }) {
  const ratio = limit > 0 ? value / limit : 0;
  const over = value > limit;
  const state = over ? 'over' : ratio > 0.9 ? 'tight' : 'ok';
  return (
    <div className={`meter meter--${state}`} data-testid={testId}>
      <div className="meter__row">
        <span className="meter__label">
          <span aria-hidden="true">{icon}</span> {label}
        </span>
        <span className="meter__value">
          <strong>{valueText}</strong>
          <span className="meter__limit"> / {limitText}</span>
        </span>
      </div>
      <div
        className="meter__track"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={Math.round(value)}
      >
        <div className="meter__fill" style={{ transform: `scaleX(${Math.min(1, ratio)})` }} />
        {over && <div className="meter__over" />}
      </div>
    </div>
  );
}
