import {test_game, test_person1, test_person2, test_person3} from "~/tests/test-dummies";
import {GamePayoutStrategy, GamePlayerBalanceRow} from "~/types";
import payout from '~/store/actions/payout'


beforeEach( () => {

});

test('test simple matching balances', () => {

    let test_balances: GamePlayerBalanceRow[] = [
        {
            player: test_person1,
            balance: -4
        },
        {
            player: test_person2,
            balance: 4
        }
    ];

    let gpos: GamePayoutStrategy = payout.getGamePayoutStrategy(test_balances);

    expect(gpos.transactions.length).toBe(1);
});

test('test two owers and one owed', () => {

    let test_balances: GamePlayerBalanceRow[] = [
        {
            player: test_person1,
            balance: -4
        },
        {
            player: test_person2,
            balance: 1
        },
        {
            player: test_person3,
            balance: 3
        },

    ];

    let gpos: GamePayoutStrategy = payout.getGamePayoutStrategy(test_balances);

    expect(gpos.transactions.length).toBe(2);
});

test('test one ower and two owed', () => {

    let test_balances: GamePlayerBalanceRow[] = [
        {
            player: test_person1,
            balance: -4
        },
        {
            player: test_person2,
            balance: -1
        },
        {
            player: test_person3,
            balance: 5
        },

    ];

    let gpos: GamePayoutStrategy = payout.getGamePayoutStrategy(test_balances);

    expect(gpos.transactions.length).toBe(2);
});
