import {QuizzAction} from './quizz';
import {HeroAction} from './hero';

export type Action = // add the list of component actions
    | QuizzAction
    | HeroAction;
