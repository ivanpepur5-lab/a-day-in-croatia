import { getLocation, CATEGORIES } from '../data/locations.js';

/**
 * Mission requirement types:
 *  { type: 'category', category, min }   at least `min` stops tagged `category`
 *  { type: 'finishWith', category }      the last stop is tagged `category`
 *  { type: 'startWith', category }       the first stop is tagged `category`
 */
export function requirementMet(req, orderedIds) {
  const tagsOf = (id) => getLocation(id).tags;
  switch (req.type) {
    case 'category': {
      const count = orderedIds.filter((id) => tagsOf(id).includes(req.category)).length;
      return count >= (req.min ?? 1);
    }
    case 'finishWith':
      return orderedIds.length > 0 && tagsOf(orderedIds[orderedIds.length - 1]).includes(req.category);
    case 'startWith':
      return orderedIds.length > 0 && tagsOf(orderedIds[0]).includes(req.category);
    default:
      throw new Error(`Unknown requirement type: ${req.type}`);
  }
}

/** Human-readable label for a requirement. */
export function describeRequirement(req) {
  const cat = CATEGORIES[req.category];
  const name = cat ? cat.label : req.category;
  switch (req.type) {
    case 'category':
      return (req.min ?? 1) > 1 ? `At least ${req.min} × ${name}` : `Include ${name}`;
    case 'finishWith':
      return `Finish at a ${name.toLowerCase()}`;
    case 'startWith':
      return `Start with ${name}`;
    default:
      return req.type;
  }
}
