
import { ABILITY, Character } from "../../data/character";
import {Greedy} from "../battle_strategy"

function createCharacter(
    attack: number, defend: number,
    agile: number, point: number): Character {
    let ret = new Character();
    ret.abilities[ABILITY.ATTACK] = attack;
    ret.abilities[ABILITY.DEFEND] = defend;
    ret.abilities[ABILITY.AGILE] = agile;
    ret.abilities[ABILITY.POINT] = point;
    return ret;
}

test("testGreedy", () => {
    let strategy = new Greedy();

    // possible attack << oppo.defend
    let ch1 = createCharacter(2, 2, 2, 2);
    let ch2 = createCharacter(2, 3, 2, 2);
    let ret = strategy.fight(ch1, ch2);
    expect(ret[ABILITY.ATTACK]).toBe(0);
    expect(ret[ABILITY.DEFEND]).toBe(2);
    expect(ret[ABILITY.AGILE]).toBe(0);

    // attack >> oppo.defend
    // add as-less-as-possible attack
    // the rest would be agile
    ch1 = createCharacter(2, 2, 2, 3);
    ch2 = createCharacter(2, 2, 2, 1);
    ret = strategy.fight(ch1, ch2);
    expect(ret[ABILITY.ATTACK]).toBe(2);
    expect(ret[ABILITY.DEFEND]).toBe(0);
    expect(ret[ABILITY.AGILE]).toBe(1);
})