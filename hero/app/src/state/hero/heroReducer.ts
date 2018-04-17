import { IHeroState } from '.';
import { Action } from 'state/actions';

export function heroReducer(
  state: IHeroState = {},
  action: Action
): IHeroState {
  switch (action.type) {
    case 'HERO_DETAILS_RECEIVED':
      return {
        ...state,
        hero: action.data.hero,
        quizzStats: action.data.quizzStats
      };
    case 'LOGGED_IN':
      return {
        ...state,
        isLoggedIn: true
      };
    case 'LOGGED_OUT':
      return {};
    case 'REGISTRATION_FAILED':
      return {
        ...state,
        registerError: true
      };
    case 'REGISTER_PROFILE':
      const { id, nickname, name, avatarUrl, email } = action.profile;
      return {
        ...state,
        id: id,
        isRegistering: true,
        hero: { ...state.hero, ...action.profile }
      };
    case 'REGISTRATION_DONE':
      return { ...state, isRegistering: false };
    default:
      return state;
  }
}
