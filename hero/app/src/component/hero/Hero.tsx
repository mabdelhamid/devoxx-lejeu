import * as React from 'react';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from 'state';
import { getHero } from 'state/selectors';
import { Hero, HeroStats, IHeroQuizzStats } from 'state/hero';
import { Avatar } from './Avatar';
import Logout from 'component/login/Logout';
import './hero.css';

interface IHeroPropsFromState {
  hero: Hero;
  quizzStats: IHeroQuizzStats;
}

interface IHeroDispatchProps {}

interface IHeroOwnProps {}

type IHeroProps = IHeroOwnProps & IHeroPropsFromState & IHeroDispatchProps;

function getStat(stats: HeroStats, key: string): any {
  if (stats) {
    let value = stats[key];
    if (value) return value;
  }
  return 0;
}

function split(text: string, delimiter: string) {
  if (text) {
    return text.split(delimiter);
  }
  return [];
}

const component = (props: IHeroProps) => {
  const stats = props.hero.heroStats;
  const currentRanking = getStat(stats, 'currentRanking');
  const bestRanking = getStat(stats, 'bestRanking');
  const wins = getStat(stats, 'wins');
  const losses = getStat(stats, 'losses');
  const lastFiveBattles = split(getStat(stats, 'lastFiveBattles'), ';');
  return (
    <div>
      <div className="hero-header">
        <div className="hero-info">
          {props.hero.avatarUrl && (
            <Avatar url={props.hero.avatarUrl} getClassName="hero-avatar-img" />
          )}
        </div>
        <div className="hero-info">
          <span className="nickname">{props.hero.nickname}</span>
        </div>
        <div className="hero-info">
          <span>
            {props.hero.name}
            <br />
            {props.hero.email}
          </span>
        </div>
      </div>
      <p className={'rule'}>
        Une nouvelle question est envoyée toutes les 30 minutes<br />
        Toute bonne réponse augmentera les forces de votre combattant<br />
        <span className={'main-rule'}>
          Prenez de l'avance et soyez le premier à répondre aux questions
        </span>
      </p>
      {props.hero.heroStats && (
        <div className="flex">
          <div className="item">
            <div className="item-content">
              <span className="item-label">Rang</span>
              <p className="item-value">{currentRanking}</p>
            </div>
          </div>
          <div className="item">
            <span className="item-label">Meilleurs Rang</span>
            <p className="item-value">{bestRanking}</p>
          </div>
          <div className="item">
            <span className="item-label">Victoires</span>
            <p className="item-value">{wins}</p>
          </div>
          <div className="item">
            <span className="item-label">Défaites</span>
            <p className="item-value">{losses}</p>
          </div>
          <div className="item">
            <span className="item-label">Force</span>
            <p className="item-value">{props.hero.attackLevel}</p>
          </div>
          <div className="item">
            <span className="item-label">Vie</span>
            <p className="item-value">{props.hero.hpLevel}</p>
          </div>
          <div className="item">
            <span className="item-label">5 derniers combats</span>
            <p className="item-label">
              <ol className="text-left">
                {lastFiveBattles.map(result => <li>{result}</li>)}
              </ol>
            </p>
          </div>
          {props.quizzStats && (
            <div className="item">
              <span className="item-label">Quizz</span>
              <p className="item-label">
                <p>
                  {props.quizzStats.totalGoodAnswered} /{' '}
                  {props.quizzStats.totalQuizzAnswered} bonnes réponses
                </p>
              </p>
            </div>
          )}
          {props.quizzStats && (
            <div className="item">
              <span className="item-label">Bonus gagnés</span>
              <p className="item-label">
                {props.quizzStats.bonusesWined.length > 0 ? (
                  <ol className="text-left">
                    {props.quizzStats.bonusesWined.map(b => <li>{b}</li>)}
                  </ol>
                ) : (
                  <span>Aucun</span>
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(component);

function mapStateToProps(state: AppState) {
  const propsFromState: IHeroPropsFromState = {
    hero: { ...getHero(state) },
    quizzStats: state.heroState.quizzStats
  };
  return propsFromState;
}

function mapDispatchToProps(
  dispatch: Dispatch<any>,
  {  }: IHeroOwnProps
): IHeroDispatchProps {
  return {};
}
