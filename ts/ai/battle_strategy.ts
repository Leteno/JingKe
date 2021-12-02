import { ABILITY, Character } from "../data/character";


export interface BattleStrategy {
    fight(me: Character, oppo: Character): Array<number>;
}
export class Greedy implements BattleStrategy {
    fight(me: Character, oppo: Character): Array<number> {
        let result = this.createEmptyStrategy();
        let leftPoint = me.abilities[ABILITY.POINT];
        if (me.abilities[ABILITY.ATTACK] <= oppo.abilities[ABILITY.DEFEND]) {
            let maxGap = oppo.abilities[ABILITY.DEFEND] + oppo.abilities[ABILITY.POINT]
                - me.abilities[ABILITY.ATTACK] + 1;
            if (maxGap >= leftPoint) {
                // If we cannot harm oppo, we should defend ourselves
                result[ABILITY.DEFEND] = leftPoint;
                leftPoint = 0;
            } else {
                // Add the min attack that we need
                result[ABILITY.ATTACK] = maxGap;
                leftPoint -= maxGap;
            }
        }
        result[ABILITY.AGILE] = leftPoint;
        return result;
    }

    private createEmptyStrategy(): Array<number> {
        let result = [];
        for (let i in ABILITY) {
            result[i] = 0;
        }
        return result;
    }
}