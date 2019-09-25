import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import storeConfig from '~/store'
import { cloneDeep } from 'lodash'
import {test_game, test_person1} from "~/tests/test-dummies";
import {GameMoneyTransaction} from "~/types";
import {Money} from "~/node_modules/ts-money";

let store: any;

beforeEach( () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  store = new Vuex.Store(cloneDeep(storeConfig));
  store.commit("setDefaultGame", test_game);
});

test('looks at default balances in test game store', () => {
  expect(store.getters.gamePlayers).toBe(3);
  expect(store.getters.getPlayerBalance(test_game.pot)).toBe(10)
});

test('commits a player ante', () => {
  expect(store.getters.getPlayerBalance(test_game.pot)).toBe(10);
  store.dispatch("addAnte", 1);
  expect(store.getters.getPlayerBalance(test_game.pot)).toBe(13)

});

test('test get player balance after small transaction', () => {
  // wipe transactions
  test_game.transactions = [];
  expect(store.getters.getPlayerBalance(test_person1)).toBe(0);
  expect(store.getters.getPlayerBalance(test_game.pot)).toBe(0);

  // add a single debit to the player
  let gmt:GameMoneyTransaction = {
    amount: Money.fromInteger(200, "USD"),
    fromAccount: test_game.players[0],
    toAccount: test_game.pot
  };
  store.commit("addTransaction", gmt);
  expect(store.getters.getPlayerBalance(test_person1)).toBe(-2);
  expect(store.getters.getPlayerBalance(test_game.pot)).toBe(2);


  // add a single credit to the player
  let gmt2:GameMoneyTransaction = {
    amount: Money.fromInteger(100, "USD"),
    fromAccount: test_game.pot,
    toAccount: test_game.players[0]
  };
  store.commit("addTransaction", gmt2);
  expect(store.getters.getPlayerBalance(test_person1)).toBe(-1);
  expect(store.getters.getPlayerBalance(test_game.pot)).toBe(1)

});

test('test get all of the balances', () => {
  // clear pot balance
  let gmt:GameMoneyTransaction = {
    amount: Money.fromDecimal(store.getters.getPlayerBalance(test_game.pot), "usd"),
    toAccount: test_game.players[2],
    fromAccount: test_game.pot
  };

  store.commit("addTransaction", gmt);

  let balances: any[] = store.getters.getAllPlayerBalances;

  for (let playerRow of balances) {
    expect(playerRow.balance).toBe(store.getters.getPlayerBalance(playerRow.player))
  }
});

