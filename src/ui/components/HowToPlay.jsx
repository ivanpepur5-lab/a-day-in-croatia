import { SCORING } from '../../engine/scoring.js';
import { TRAVEL_MODEL } from '../../engine/travel.js';
import { DATA_STATUS } from '../../data/locations.js';
import { DataLegend } from './Status.jsx';

/** Rules + a fully transparent scoring explanation. */
export default function HowToPlay() {
  const S = SCORING;
  const T = TRAVEL_MODEL;
  return (
    <div className="howto">
      <ol className="howto__steps">
        <li>
          <strong>Read the mission.</strong> Everyone gets the same day: time, budget, party size and a few requirements.
        </li>
        <li>
          <strong>Pick 4 of 8 experiences.</strong> Tap a card to add it. Tap <em>i</em> for details.
        </li>
        <li>
          <strong>Order your day.</strong> Drag the handle (or use the arrows). Travel times update live. You always start
          and finish at Split Riva.
        </li>
        <li>
          <strong>Lock it in</strong> and see your score out of 100. One official attempt per day — practice as often as
          you like.
        </li>
      </ol>

      <h3 className="howto__h">How scoring works</h3>
      <dl className="howto__score">
        <div>
          <dt>⏱️ Time efficiency · {S.TIME_MAX}</dt>
          <dd>
            Time spent <em>at</em> experiences ÷ {Math.round(S.TIME_TARGET_RATIO * 100)}% of your available time. Finishing
            late costs 1 point per {S.OVERRUN_MIN_PER_POINT} minutes.
          </dd>
        </div>
        <div>
          <dt>💶 Budget management · {S.BUDGET_MAX}</dt>
          <dd>
            {S.BUDGET_BASE} points for staying within budget, plus up to {S.BUDGET_RESERVE_BONUS} for keeping{' '}
            {Math.round(S.BUDGET_RESERVE_RATIO * 100)}% in reserve. Overspending drains the {S.BUDGET_BASE} points, reaching
            zero at {Math.round(S.BUDGET_OVER_ZERO_RATIO * 100)}% over.
          </dd>
        </div>
        <div>
          <dt>🧭 Route efficiency · {S.ROUTE_MAX}</dt>
          <dd>The fastest possible travel time for your four stops ÷ your travel time.</dd>
        </div>
        <div>
          <dt>🎯 Mission · {S.MISSION_MAX}</dt>
          <dd>Shared equally between the day’s requirements.</dd>
        </div>
      </dl>
      <p className="howto__p">
        Your rank is exact: every one of the 1,680 possible plans (4 of 8 cards, in every order) is scored the same way,
        and your rank is 1 + the number of plans that score higher. A new challenge starts at midnight Croatian time.
      </p>

      <h3 className="howto__h">Travel estimates</h3>
      <p className="howto__p">
        No car: legs up to {T.WALK_MAX_KM} km are walked (free). Longer legs are estimated bus trips: {T.WAIT_MIN} min of
        waiting and connections plus ride time. Distances use straight-line km × {T.DETOUR_FACTOR}. These times (shown with “≈”) are{' '}
        <strong>not timetables</strong>. Bus fares are the official Promet Split online / ticket-office fares (valid from
        1 June 2026) where the price list covers the journey, marked “fare ✓”; other fares are estimates, marked “est.”.
      </p>

      <h3 className="howto__h">Verified vs. estimated</h3>
      <DataLegend />

      <p className="notice">
        <strong>{DATA_STATUS.label}.</strong> {DATA_STATUS.note}
      </p>
    </div>
  );
}
