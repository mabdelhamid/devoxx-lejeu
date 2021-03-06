package fr.aneo;

import fr.aneo.domain.FightDefinition;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Value;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

/**
 * Created by eeugene on 04/03/2017.
 */
@Service
public class ArenaFightExecutor {

    @Data
    @Value
    @AllArgsConstructor
    private static class FightRound {
        int roundNumber;
        FighterState fighter1;
        FighterState fighter2;
    }
    @Data
    @AllArgsConstructor
    private static class FighterState {
        int hp;
        int attack;
        boolean firstAttackBonus;
        boolean firstAttackBlocked;
        public void decreaseHp(int attackPower) {
            hp -= attackPower;
        }
    }

    /**
     * @param fightDefinition
     * @return true when hero 1 has won, false otherwise
     */
    public boolean fight(FightDefinition fightDefinition) {
        int roundId = 1;
        List<FightRound> rounds = new LinkedList<>();

        FighterState firstFighterState = null;
        FighterState secondFighterState = null;

        if (fightDefinition.isStartWithHero1()) {
            firstFighterState = new FighterState(fightDefinition.getHero1Hp(), fightDefinition.getHero1Attack(), fightDefinition.isHero1FirstAttackHas20PercentMorePower(), fightDefinition.isCancelHero1FirstAttack());
            secondFighterState = new FighterState(fightDefinition.getHero2Hp(), fightDefinition.getHero2Attack(), fightDefinition.isHero2FirstAttackHas20PercentMorePower(), fightDefinition.isCancelHero2FirstAttack());
        } else {
            firstFighterState = new FighterState(fightDefinition.getHero2Hp(), fightDefinition.getHero2Attack(), fightDefinition.isHero2FirstAttackHas20PercentMorePower(), fightDefinition.isCancelHero2FirstAttack());
            secondFighterState = new FighterState(fightDefinition.getHero1Hp(), fightDefinition.getHero1Attack(), fightDefinition.isHero1FirstAttackHas20PercentMorePower(), fightDefinition.isCancelHero1FirstAttack());
        }

        while (!foundWinner(firstFighterState, secondFighterState)) {

            int firstFighterAttack = firstFighterState.getAttack();
            int secondFighterAttack = secondFighterState.getAttack();

            if (roundId == 1) {
                if (firstFighterState.isFirstAttackBonus())
                    firstFighterAttack += firstFighterAttack *0.2;
                if (secondFighterState.isFirstAttackBonus())
                    secondFighterAttack += secondFighterAttack *0.2;
                if (firstFighterState.isFirstAttackBlocked())
                    firstFighterAttack = 0;
                if (secondFighterState.isFirstAttackBlocked())
                    secondFighterAttack = 0;
            }

            // rounds suivants
            hit(firstFighterAttack, secondFighterState);
            if (foundWinner(firstFighterState, secondFighterState))
            {
                addRoundSnapshot(roundId, rounds, firstFighterState, secondFighterState);
                break;
            }
            hit(secondFighterAttack, firstFighterState);
            if (foundWinner(firstFighterState, secondFighterState))
            {
                addRoundSnapshot(roundId, rounds, firstFighterState, secondFighterState);
                break;
            }

            addRoundSnapshot(roundId, rounds, firstFighterState, secondFighterState);
            ++roundId;
        }

        boolean hero1Won;
        if (fightDefinition.isStartWithHero1()) {
            hero1Won = secondFighterState.getHp() <= 0;
        } else {
            hero1Won = firstFighterState.getHp() <= 0;
        }

        //publishEvents(rounds);
        return hero1Won;
    }

    private void addRoundSnapshot(int roundId, List<FightRound> rounds, FighterState firstFighterState, FighterState secondFighterState) {
        rounds.add(new FightRound(roundId, clone(firstFighterState), clone(secondFighterState)));
    }

    private FighterState clone(FighterState state) {
        return new FighterState(state.getHp(), state.getAttack(), state.isFirstAttackBonus(), state.isFirstAttackBlocked());
    }

    private boolean foundWinner(FighterState firstFighter, FighterState secondFighter) {
        return !(firstFighter.getHp() > 0 && secondFighter.getHp() > 0);
    }

    private void hit(int attackPower, FighterState him) {
        him.decreaseHp(attackPower);
    }
}
