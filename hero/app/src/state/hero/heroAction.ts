import { IHeroDto, ProfileInfo } from '.';

export type HeroAction =
  // list of hero actions
  | RegisterProfile
  | RegistrationDone
  | RegistrationFailed
  | Login
  | Logout
  | LoggedOut
  | LoggedIn
  | HeroDetailsReceived
  | ErrorOnGetHeroDetails
  | RefreshHeroStats;

export interface RegisterProfile {
  type: 'REGISTER_PROFILE';
  profile: ProfileInfo;
}
export const registerProfile = (profile: ProfileInfo): RegisterProfile => ({
  profile,
  type: 'REGISTER_PROFILE'
});

export interface RegistrationFailed {
  type: 'REGISTRATION_FAILED';
  errors: string;
}
export const registrationFailed = (errors: string): RegistrationFailed => ({
  type: 'REGISTRATION_FAILED',
  errors
});

export interface Login {
  type: 'LOG_IN';
}
export const loginAction = (): Login => ({
  type: 'LOG_IN'
});

export interface Logout {
  type: 'LOG_OUT';
}
export const logout = (): Logout => ({
  type: 'LOG_OUT'
});
export interface LoggedOut {
  type: 'LOGGED_OUT';
}
export const loggedOut = (): LoggedOut => ({
  type: 'LOGGED_OUT'
});

export interface RegistrationDone {
  type: 'REGISTRATION_DONE';
}
export const registrationDone = (): RegistrationDone => ({
  type: 'REGISTRATION_DONE'
});

export interface LoggedIn {
  type: 'LOGGED_IN';
}
export const loggedIn = (): LoggedIn => ({ type: 'LOGGED_IN' });

export interface HeroDetailsReceived {
  type: 'HERO_DETAILS_RECEIVED';
  data: IHeroDto;
}
export const heroDetailsReceived = (data: IHeroDto): HeroDetailsReceived => ({
  type: 'HERO_DETAILS_RECEIVED',
  data
});

export interface ErrorOnGetHeroDetails {
  type: 'ERROR_ON_GET_HERO_DETAILS';
  error: string;
}
export const errorOnGetHeroDetails = (
  error: string
): ErrorOnGetHeroDetails => ({
  type: 'ERROR_ON_GET_HERO_DETAILS',
  error
});

export interface RefreshHeroStats {
  type: 'REFRESH_HERO_STATS';
  id: string;
}
export const refreshHeroStats = (id: string): RefreshHeroStats => ({
  type: 'REFRESH_HERO_STATS',
  id
});
