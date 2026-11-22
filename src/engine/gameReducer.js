import { toggleSelection, moveItem, isComplete } from './selection.js';

/**
 * Game flow state machine:  intro → pick → arrange → results
 * `selection` is both the chosen cards and their visiting order.
 */
export function createInitialState(challenge, saved = null) {
  if (saved && saved.challengeId === challenge.id && isComplete(saved.order, challenge)) {
    return {
      screen: 'results',
      selection: saved.order.slice(),
      submitted: true,
      practice: false,
      lastToggle: null,
    };
  }
  return { screen: 'intro', selection: [], submitted: false, practice: false, lastToggle: null };
}

export function gameReducer(state, action, challenge) {
  switch (action.type) {
    case 'START':
      return { ...state, screen: 'pick' };
    case 'TOGGLE': {
      const { selection, status } = toggleSelection(state.selection, action.id, challenge);
      return { ...state, selection, lastToggle: { id: action.id, status, at: action.at ?? 0 } };
    }
    case 'GO_ARRANGE':
      if (!isComplete(state.selection, challenge)) return state;
      return { ...state, screen: 'arrange' };
    case 'BACK':
      if (state.screen === 'arrange') return { ...state, screen: 'pick' };
      if (state.screen === 'pick') return { ...state, screen: 'intro' };
      return state;
    case 'MOVE':
      return { ...state, selection: moveItem(state.selection, action.from, action.to) };
    case 'SUBMIT':
      if (!isComplete(state.selection, challenge)) return state;
      return { ...state, screen: 'results', submitted: true };
    case 'PRACTICE':
      return { screen: 'pick', selection: [], submitted: false, practice: true, lastToggle: null };
    case 'VIEW_OFFICIAL':
      if (!isComplete(action.order ?? [], challenge)) return state;
      return { ...state, screen: 'results', selection: action.order.slice(), submitted: true, practice: false };
    case 'HOME':
      return { ...state, screen: 'intro' };
    default:
      return state;
  }
}
