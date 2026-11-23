import { useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from './dndModifiers.js';
import Media from '../components/Media.jsx';
import Meter from '../components/Meter.jsx';
import RouteMap from '../components/RouteMap.jsx';
import { CATEGORIES } from '../../data/locations.js';
import { buildItinerary, formatClock, formatDuration, formatEuro } from '../../engine/itinerary.js';
import { describeRequirement, requirementMet } from '../../engine/requirements.js';
import { MODE_LABELS } from '../../engine/travel.js';
import { PriceTag } from '../components/Status.jsx';
import { FARE_SOURCE } from '../../data/fares.js';
import { formatCheckDate } from '../../data/verification.js';
import { getLocation, SPLIT_HUB } from '../../data/locations.js';

const placeName = (id) => (id === SPLIT_HUB.id ? SPLIT_HUB.short : getLocation(id).short);

function Leg({ leg, dim }) {
  const mode = MODE_LABELS[leg.mode];
  return (
    <li className={`leg leg--${leg.mode} ${dim ? 'is-dim' : ''}`}>
      <span className="leg__line" aria-hidden="true" />
      <span className="leg__text">
        <span aria-hidden="true">{mode.emoji}</span> {mode.label} ·{' '}
        <span title="Estimated travel time (not a timetable)">≈{formatDuration(leg.minutes)}</span>
        {leg.cost > 0 ? (
          <span
            className="leg__fare"
            title={
              leg.fareStatus === 'verified'
                ? `Official Promet Split fare: ${formatEuro(leg.costPerPerson)} per person online / at a ticket office (${formatEuro(leg.driverFarePerPerson)} from the driver)`
                : 'Estimated fare — not an official tariff'
            }
          >
            {' '}
            · {leg.party} × {leg.fareStatus === 'estimate' ? '≈' : ''}
            {formatEuro(leg.costPerPerson)} = {formatEuro(leg.cost)}
          </span>
        ) : (
          ' · free'
        )}
        {leg.fareStatus === 'verified' && (
          <span className="tag tag--ok" title={`Official fare, last verified ${formatCheckDate(FARE_SOURCE.verifiedOn)}`}>
            fare ✓
          </span>
        )}
        {leg.fareStatus === 'estimate' && <span className="tag">est.</span>}
      </span>
    </li>
  );
}

function StopCard({ stop, index, count, onMove }) {
  const { location } = stop;
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: location.id });
  const style = {
    transform: transform ? `translate3d(0, ${Math.round(transform.y)}px, 0)` : undefined,
    transition,
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`stop cat-${location.category} ${isDragging ? 'is-dragging' : ''}`}
      data-testid={`stop-${index}`}
      data-id={location.id}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        className="stop__handle"
        aria-label={`Drag to reorder ${location.name}`}
        {...attributes}
        {...listeners}
      >
        <span aria-hidden="true">⋮⋮</span>
      </button>
      <Media location={location} className="stop__media" variant="thumb" />
      <div className="stop__body">
        <p className="stop__time">
          {formatClock(stop.arrive)} – {formatClock(stop.depart)}
        </p>
        <h3 className="stop__name">{location.name}</h3>
        <p className="stop__meta">
          {CATEGORIES[location.category].emoji} ≈{formatDuration(location.durationMin)} ·{' '}
          <PriceTag rec={location.price} amount={stop.cost} suffix="" />
        </p>
      </div>
      <div className="stop__arrows">
        <button
          type="button"
          className="icon-btn icon-btn--sm"
          onClick={() => onMove(index, index - 1)}
          disabled={index === 0}
          aria-label={`Move ${location.name} earlier`}
          data-testid={`up-${index}`}
        >
          ↑
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--sm"
          onClick={() => onMove(index, index + 1)}
          disabled={index === count - 1}
          aria-label={`Move ${location.name} later`}
          data-testid={`down-${index}`}
        >
          ↓
        </button>
      </div>
    </li>
  );
}

export default function ArrangeScreen({ challenge, selection, practice, onMove, onSubmit, onBack }) {
  const [dragging, setDragging] = useState(false);
  const itinerary = useMemo(() => buildItinerary(challenge, selection), [challenge, selection]);
  const { totals, constraints, stops, returnLeg } = itinerary;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = ({ active, over }) => {
    setDragging(false);
    if (!over || active.id === over.id) return;
    onMove(selection.indexOf(active.id), selection.indexOf(over.id));
  };

  return (
    <main className="screen arrange">
      <header className="stephead">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back to experiences">
          ←
        </button>
        <div>
          <p className="eyebrow">Step 2 of 2{practice ? ' · Practice' : ''}</p>
          <h1 className="stephead__title">Order your day</h1>
        </div>
      </header>

      <section className="panel constraints" aria-label="Constraints">
        <Meter
          icon="⏱"
          label="Time"
          value={totals.totalMinutes}
          limit={challenge.availableMinutes}
          valueText={formatDuration(totals.totalMinutes)}
          limitText={formatDuration(challenge.availableMinutes)}
          testId="meter-time"
        />
        <Meter
          icon="💶"
          label="Budget"
          value={totals.totalCost}
          limit={challenge.budget}
          valueText={formatEuro(totals.totalCost)}
          limitText={formatEuro(challenge.budget)}
          testId="meter-budget"
        />
        <p className="costsplit" data-testid="cost-split">
          Entry {formatEuro(totals.experienceCost)} · Bus {formatEuro(totals.transportCost)}
          {totals.transportCost > 0 && (
            <>
              {' '}
              ({formatEuro(totals.transportVerified)} official fares
              {totals.transportEstimated > 0 && <> + {formatEuro(totals.transportEstimated)} est.</>})
            </>
          )}{' '}
          · for {challenge.partySize}
        </p>
        {totals.estimatedCost > 0 && (
          <p className="disclose" data-testid="estimate-disclosure">
            <span className="badge badge--estimate">≈ Estimate</span> This plan includes{' '}
            {formatEuro(totals.estimatedCost)} of estimated costs:{' '}
            {[
              ...stops
                .filter((st) => st.location.costStatus !== 'verified' && st.cost > 0)
                .map((st) => `${st.location.short} entry ≈${formatEuro(st.cost)}`),
              ...itinerary.legs
                .filter((l) => l.fareStatus === 'estimate')
                .map((l) => `bus ${placeName(l.fromId)}→${placeName(l.toId)} ≈${formatEuro(l.cost)}`),
            ].join(', ')}
            . The game can be played as normal; check official prices before travelling.
          </p>
        )}
        <ul className="checks">
          {challenge.requirements.map((r) => {
            const ok = requirementMet(r, selection);
            return (
              <li key={r.id} className={ok ? 'is-ok' : ''}>
                <span className="checks__mark" aria-hidden="true">
                  {ok ? '✓' : ''}
                </span>
                {describeRequirement(r)}
                <span className="sr-only">{ok ? ' — met' : ' — not met'}</span>
              </li>
            );
          })}
        </ul>
        {(!constraints.timeOk || !constraints.budgetOk) && (
          <p className="warn" role="alert">
            {!constraints.timeOk && <>Back {formatDuration(constraints.overrunMinutes)} after your deadline. </>}
            {!constraints.budgetOk && <>{formatEuro(constraints.overBudget)} over budget. </>}
            You can still lock in, but it will cost points.
          </p>
        )}
      </section>

      <ol className="timeline">
        <li className="node">
          <span className="node__dot" aria-hidden="true" />
          <span className="node__time">{formatClock(totals.startTime)}</span>
          <span className="node__label">Depart {challenge.hub.name}</span>
        </li>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragStart={() => setDragging(true)}
          onDragCancel={() => setDragging(false)}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={selection} strategy={verticalListSortingStrategy}>
            <li className="timeline__stops">
              <ol>
                {stops.map((stop, i) => (
                  <FragmentRow key={stop.location.id}>
                    <Leg leg={stop.legIn} dim={dragging} />
                    <StopCard stop={stop} index={i} count={stops.length} onMove={onMove} />
                  </FragmentRow>
                ))}
              </ol>
            </li>
          </SortableContext>
        </DndContext>
        {returnLeg && <Leg leg={returnLeg} dim={dragging} />}
        <li className={`node node--end ${constraints.timeOk ? '' : 'is-late'}`}>
          <span className="node__dot" aria-hidden="true" />
          <span className="node__time">{formatClock(totals.endTime)}</span>
          <span className="node__label">
            Back at {challenge.hub.short}
            {constraints.timeOk
              ? ` · ${formatDuration(totals.freeMinutes)} to spare`
              : ` · deadline ${formatClock(totals.deadline)}`}
          </span>
        </li>
      </ol>

      <section className="panel">
        <RouteMap hub={challenge.hub} orderedIds={selection} compact />
      </section>

      <div className="dock dock--single">
        <div className="dock__inner">
          <div className="dock__summary dock__summary--wide">
            <span>🚶🚌 {formatDuration(totals.travelMinutes)} travel</span>
            <span>✨ {formatDuration(totals.experienceMinutes)} experiences</span>
          </div>
          <button type="button" className="btn btn--primary dock__cta" onClick={onSubmit} data-testid="submit">
            Lock in my day
          </button>
        </div>
      </div>
    </main>
  );
}

/** Keeps leg + stop adjacent without an extra DOM wrapper. */
function FragmentRow({ children }) {
  return children;
}
