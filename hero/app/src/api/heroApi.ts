import { Observable, ajax, AjaxResponse } from 'rx';
import { IHeroDto, ProfileInfo } from 'state/hero';
import { getAuthorization } from 'service/header';

export interface IHeroApi {
  getHero: (id: string) => Observable<IHeroDto>;
  register: (hero: ProfileInfo) => Observable<AjaxResponse>;
  timeout: number;
}

export const heroApi: IHeroApi = {
  getHero(id: string) {
    return ajax.getJSON<IHeroDto>('api/hero/' + id, getAuthorization());
  },
  register(hero: ProfileInfo) {
    const body = JSON.stringify(hero);
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthorization()
    };
    return ajax.post('api/hero/register', body, headers);
  },
  timeout: 5000
};
