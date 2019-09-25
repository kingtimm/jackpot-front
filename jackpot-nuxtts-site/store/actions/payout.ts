import {GameMoneyTransaction, GamePayoutStrategy, GamePlayerBalanceRow} from "~/types";
import {Money} from "~/node_modules/ts-money";

export default {

    checkForPerfectMatchBalance(gpos:GamePayoutStrategy, balanceRow:GamePlayerBalanceRow): GameMoneyTransaction | null {
        // returns a payout transaction if the balance equals what another player needs to be whole
        for (const [i, current] of gpos.unmatchedBalances.entries()) {
            if (current.balance === -balanceRow.balance && current.player != balanceRow.player) {

                // create the transaction. make the from account the person who is owing. to account is he who is owed.
                let gmt:GameMoneyTransaction = {
                    fromAccount: current.balance < 0 ? current.player : balanceRow.player,
                    toAccount: current.balance > 0 ? current.player : balanceRow.player,
                    amount: Money.fromDecimal(Math.abs(current.balance), "USD")
                };

                // remove the matching item from the existing list
                gpos.unmatchedBalances.splice(i,1);

                return gmt
            }
        }
        return null
    },

    payBiggestLosersDebt(gpos:GamePayoutStrategy, biggestLoser:GamePlayerBalanceRow): GameMoneyTransaction {
        // zeros out a players debt
        let biggestWinner:GamePlayerBalanceRow = gpos.unmatchedBalances[gpos.unmatchedBalances.length-1];

        // the amount should be whatever is lower between the debt and the due
        let amount:number = Math.min(Math.abs(biggestLoser.balance), biggestWinner.balance);

        // create the transaction
        let gmt:GameMoneyTransaction = {
            fromAccount: biggestLoser.player,
            toAccount: biggestWinner.player,
            amount: Money.fromDecimal(amount, "USD")
        };

        // set the balances minus the transactions.
        biggestWinner.balance -= amount;
        biggestLoser.balance += amount;

        return gmt;
    },

    iterateThroughBalances(gpos:GamePayoutStrategy) : GamePlayerBalanceRow[] {

        // remove those who have a 0 balance
        gpos.unmatchedBalances = gpos.unmatchedBalances.filter( (item:GamePlayerBalanceRow) => item.balance !== 0 );

        // return if there are no more left. This probably is not necessary
        if (gpos.unmatchedBalances.length == 0) return gpos.unmatchedBalances;

        // sort by those owing the most
        gpos.unmatchedBalances.sort((a,b) => a.balance < b.balance ? -1 : a.balance > b.balance? 1 : 0);

        // loop through balances
        let result: GameMoneyTransaction | null;

        // check if any of the balances match another player's perfectly for 1 to 1 payout
        for (const [i, current] of gpos.unmatchedBalances.entries()) {
            result = this.checkForPerfectMatchBalance(gpos, current);
            if (result !== null) {
                // add to the payout list and delete
                gpos.unmatchedBalances.splice(i,1);
                gpos.transactions.push(result!);
                return gpos.unmatchedBalances
            }
        }

        // if that resulted in nothing, pair up balances - balances should be in order of biggest loser to biggest winner
        result = this.payBiggestLosersDebt(gpos, gpos.unmatchedBalances[0]);

        // add to the payout list
        gpos.transactions.push(result);
        return gpos.unmatchedBalances

    },

    getGamePayoutStrategy(unmatchedBalances: GamePlayerBalanceRow[]): GamePayoutStrategy {

        let gpos: GamePayoutStrategy = {
            unmatchedBalances: unmatchedBalances,
            transactions: []
        };

        do {
            this.iterateThroughBalances(gpos)
        } while (gpos.unmatchedBalances.length > 0)

        return gpos
    }



}
