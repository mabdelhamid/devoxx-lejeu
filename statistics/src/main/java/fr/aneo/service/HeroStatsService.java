package fr.aneo.service;

import fr.aneo.model.Hero;
import fr.aneo.model.CountByHour;
import fr.aneo.model.QuizzHeroAnswer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.ResultSet;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by eeugene on 02/04/2017.
 */
@Service
public class HeroStatsService {
    @Autowired
    @Qualifier("jdbcHero")
    JdbcTemplate heroJdbcTemplate;

    public List<CountByHour> getHeroCount() {
        String sql = "select REGISTER_TIME from HERO where ROLE = ? and REGISTER_TIME >= ?";
        java.util.Date startDate = Date.from(LocalDate.now().atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
        List<LocalDateTime> dates = heroJdbcTemplate.queryForList(sql,
                new Object[]{"PLAYER", new Date(startDate.getTime())}, LocalDateTime.class);
        Map<Integer, Long> collect = dates.stream()
                .collect(Collectors.groupingBy(d -> d.getHour(), Collectors.counting()));
        return collect.entrySet().stream().map(e -> CountByHour.builder().hour(e.getKey()).count(e.getValue()).build()).collect(Collectors.toList());
    }

    public List<Hero> getTopFive() {
        String sql = "select h.EMAIL, h.FIRSTNAME, h.LASTNAME, h.NICKNAME, h.ROLE, h.WIN, h.LOSS, h.RANK from HERO h where ROLE = ? and h.RANK >0 order by h.RANK LIMIT 5";
        List<Hero> heros = heroJdbcTemplate.query(sql,
                new Object[]{"PLAYER"},
                (ResultSet res, int rowNum) ->
                        Hero.builder()
                                .email(res.getString(1))
                                .firstname(res.getString(2))
                                .lastname(res.getString(3))
                                .nickname(res.getString(4))
                                .role(res.getString(5))
                                .wins(res.getInt(6))
                                .losses(res.getInt(7))
                                .rank(res.getInt(8))
                                .build()
        );
        heros.stream().forEach(h ->
                {
                    List<QuizzHeroAnswer> allAnswers = getQuizzHeroAnswers(h);
                    List<QuizzHeroAnswer> answers = allAnswers.stream().filter(q -> !q.isBonusQuizz()).collect(Collectors.toList());
                    h.setTotalQuizzAnswered(answers.size());
                    h.setTotalGoodQuizzAnswered(answers.stream()
                            .filter(a -> a.isGoodAnswer())
                            .collect(Collectors.counting())
                    );
                    List<QuizzHeroAnswer> bonusAnswers = allAnswers.stream().filter(q -> q.isBonusQuizz()).collect(Collectors.toList());
                    h.setTotalBonusQuizzAnswered(bonusAnswers.size());
                    h.setTotalGoodBonusQuizzAnswered(bonusAnswers.stream()
                            .filter(a -> a.isGoodAnswer())
                            .collect(Collectors.counting())
                    );
                }
        );
        return heros;
    }

    private List<QuizzHeroAnswer> getQuizzHeroAnswers(Hero h) {
        return heroJdbcTemplate.query(
                "select a.QUIZZ_ID,a.QUIZZ_ANSWER_ID,a.BONUS_WINED,q.IS_BONUS,qa.IS_CORRECT_ANSWER " +
                        "FROM QUIZZ_HERO_ANSWER a " +
                        "JOIN QUIZZ q ON q.ID = a.QUIZZ_ID " +
                        "JOIN QUIZZ_ANSWER qa ON qa.QUIZZ_ID = q.ID AND qa.ID = a.QUIZZ_ANSWER_ID " +
                        "WHERE a.HERO_EMAIL = ?",
                new Object[]{h.getEmail()},
                (ResultSet res, int rowNum) ->
                        QuizzHeroAnswer.builder()
                                .quizzId(res.getInt(1))
                                .answerId(res.getInt(2))
                                .bonusWined(res.getString(3))
                                .isBonusQuizz(res.getBoolean(4))
                                .isGoodAnswer(res.getBoolean(5))
                                .build()
        );
    }

}
