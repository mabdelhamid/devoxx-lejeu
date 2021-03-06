package fr.aneo.api.leaderboard;

import feign.hystrix.FallbackFactory;
import feign.hystrix.HystrixFeign;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import fr.aneo.domain.HeroStats;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.EmitterProcessor;

import java.time.Duration;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by eeugene on 05/03/2017.
 */
@Service
@Slf4j
public class LeaderboardService {
    EmitterProcessor<Collection<HeroStats>> emitter;
    private LeaderboardApi leaderboardApi;

    public LeaderboardService(@Value("${leaderboardUrl}") String leaderboardUrl) {
        FallbackFactory<? extends LeaderboardApi> fallbackFactory =
                cause -> leaderBoard -> new LeaderBoard(Collections.emptyList());
        leaderboardApi = HystrixFeign.builder()
                .encoder(new JacksonEncoder())
                .decoder(new JacksonDecoder())
                .requestInterceptor(requestTemplate -> log.debug(requestTemplate.toString()))
                .target(LeaderboardApi.class, leaderboardUrl, fallbackFactory);

        emitter = EmitterProcessor.<Collection<HeroStats>>create().connect();

        emitter.sample(Duration.ofSeconds(10))
                .subscribe(v -> updateLeaderboardInternal(v));
    }

    public void updateLeaderboard(Collection<HeroStats> stats) {
        emitter.onNext(stats);
    }

    private void updateLeaderboardInternal(Collection<HeroStats> stats) {
        List<LeaderBoardLine> list = stats
                .stream()
                .sorted((o1, o2) -> o2.getWinRatio().compareTo(o1.getWinRatio()))
                .limit(20)
                .map(stat -> LeaderBoardLine.builder()
                        .heroId(stat.getHero().getEmail())
                        .avatarId(stat.getHero().getAvatarId())
                        .heroName(stat.getHero().getNickname())
                        .winRatio(stat.getWinRatio())
                        .build()
                ).collect(Collectors.toList());

        LeaderBoard leaderBoard = new LeaderBoard(list);
        leaderboardApi.update(leaderBoard);
        if (log.isDebugEnabled()) {
            printLeaderboard(leaderBoard);
        }
    }

    private void printLeaderboard(LeaderBoard leaderBoard) {
        log.debug("-- LEADERBOARD --\n");
        int i = 0;
        for (LeaderBoardLine entry : leaderBoard.getList()) {
            log.debug(
                    (++i) + "- " + entry.getHeroName() + " - " + entry.getWinRatio()
            );
        }
    }
}
