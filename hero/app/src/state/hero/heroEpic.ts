import { Observable, IScheduler } from 'rx';
import { Epic } from 'redux-observable';

import { Action } from 'state/actions';
import { AppState } from 'state';
import { IHeroDto, registrationFailed, registrationDone } from '.';
import {
  heroDetailsReceived,
  loggedOut,
  errorOnGetHeroDetails,
  refreshHeroStats,
  LoggedIn,
  HeroDetailsReceived,
  RefreshHeroStats,
  Login,
  RegisterProfile
} from './heroAction';
import { IHeroApi } from 'api/heroApi';
import { auth } from 'main';

export function getHeroDetails(
  api: IHeroApi,
  scheduler?: IScheduler
): Epic<Action, AppState> {
  return (action$, _) => {
    return action$
      .ofType('REFRESH_HERO_STATS')
      .mergeMap((action: RefreshHeroStats) =>
        api
          .getHero(action.id)
          .timeout(api.timeout, scheduler)
          .map((h: IHeroDto) => heroDetailsReceived(h))
          .catch(err => Observable.of(errorOnGetHeroDetails(err.message)))
      );
  };
}

export function setUpdateHeroStatsMechanism(
  scheduler?: IScheduler
): Epic<Action, AppState> {
  return action$ =>
    action$
      .ofType('HERO_DETAILS_RECEIVED')
      .delay(5000)
      .map((action: HeroDetailsReceived) =>
        refreshHeroStats(action.data.hero.email)
      );
}
export function submitHeroRegistration(
  api: IHeroApi,
  scheduler?: IScheduler
): Epic<Action, AppState> {
  return (action$, _) => {
    return action$
      .ofType('REGISTER_PROFILE')
      .mergeMap((action: RegisterProfile) =>
        api
          .register(action.profile)
          .timeout(api.timeout, scheduler)
          .mergeMap(_ => [
            registrationDone(),
            refreshHeroStats(action.profile.id)
          ])
          .catch(error =>
            Observable.of(registrationFailed(error.xhr.response.errors))
          )
      );
  };
}

export function loginHero(
  api: IHeroApi,
  scheduler?: IScheduler
): Epic<Action, AppState> {
  return action$ => {
    return action$.ofType('LOG_IN').mergeMap((action: Login) => {
      auth.login();
      return Observable.of();
    });
  };
}

export function logoutHero(
  api: IHeroApi,
  scheduler?: IScheduler
): Epic<Action, AppState> {
  return (action$, _) => {
    return action$.ofType('LOG_OUT').mergeMap((action: any) => {
      auth.logout();
      return Observable.of(loggedOut());
    });
  };
}
