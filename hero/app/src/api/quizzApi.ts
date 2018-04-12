import { Observable, ajax } from 'rx';
import { IQuizzApi, IQuizzDto, IQuizzAnswerResult } from 'state/quizz';
import { getAuthorization } from 'service/header';

export const quizzApi: IQuizzApi = {
  getQuizz() {
    const header = getAuthorization();
    return ajax.getJSON<IQuizzDto>('api/quizz', header);
  },
  postQuizzAnswer(
    quizzId: number,
    answerId: number
  ): Observable<IQuizzAnswerResult> {
    let headers = { 'Content-Type': 'application/json' };
    headers = Object.assign(headers, getAuthorization());
    return ajax
      .post('api/quizz', { quizzId, answerId }, headers)
      .map(resp => resp.response);
  },
  timeout: 5000
};
