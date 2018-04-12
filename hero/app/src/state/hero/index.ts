export * from './heroAction';

export interface IHeroState {
  id?: string;
  hero?: Hero;
  quizzStats?: IHeroQuizzStats;
  isLoggedIn?: boolean;
  isRegistering?: boolean;
  loginErrors?: string;
  registerErrors?: string[];
}

export interface IHeroDto {
  hero: Hero;
  quizzStats: IHeroQuizzStats;
}

export interface Hero {
  id: string;
  email: string;
  name: string;
  nickname: string;
  avatarUrl: string;
  attackLevel: number;
  hpLevel: number;
  heroStats: HeroStats;
}

export interface IAvatar {
  id: number;
  isSelected?: boolean;
}

export interface HeroStats {
  wins: number;
  losses: number;
  currentRanking: number;
  bestRanking: number;
  lastFiveBattles: string;
}

export interface ProfileInfo {
  id: string;
  email: string;
  name: string;
  nickname: string;
  avatarUrl: string;
}

export interface IHeroQuizzStats {
  totalQuizzAnswered: number;
  totalGoodAnswered: number;
  bonusesWined: string[];
}
