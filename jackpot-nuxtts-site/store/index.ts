import {
    RootState,
    Person,
    GameObject,
    GameMoneyTransaction,
    PotBankAccount,
    IBankAccount,
    GamePlayerBalanceRow
} from "~/types";
import { MutationTree, ActionTree, GetterTree } from "vuex";
import payout from "~/store/actions/payout"
import {Money} from "~/node_modules/ts-money";
import { v4 as uuid } from 'uuid'

let default_user:Person = {
    "id": 0,
    "first_name": "The Banker",
    "last_name": "",
    "contact": {"email": "sthorsby0@psu.edu", "phone": "1-(208)492-2543"},
    "gender": "Male",
    "ip_address": "250.213.72.156",
    "avatar": "https://robohash.org/quimodisint.png?size=200x200&set=set1",
    "address": {
        "city": "Idaho Falls",
        "country": "United States",
        "postalCode": "83405",
        "state": "ID",
        "street": "9465 Utah Crossing"
    }
};

export const state = (): RootState => ({
    people: [],
    game:  {
        "players": [],
        "transactions": [],
        "pot": {
            'first_name': "",
            'id': 0
        }
    }
});

export const mutations: MutationTree<RootState> = {

    setDefaultGame(state: RootState, game: GameObject): void {
        state.game = game
    },

    addPlayer(state: RootState, player: Person): number {
        player.id = state.game.players.length;
        state.game.players.push(player)
        return state.game.players.length
    },

    addTransaction(state:RootState, transaction: GameMoneyTransaction): number {
        transaction.uuid = uuid.v4();
        state.game.transactions.push(transaction);
        return state.game.transactions.length
    },
};

export const actions: ActionTree<RootState, RootState> = {
    async nuxtServerInit({ commit }, context) {
        // add people items
        // let people: Person[] = []
        //
        // // If you serve the site statically with `nuxt generate`, you can't use HTTP requests for local
        // people = context.isStatic ?
        //     localRandomData :
        //     await context.app.$axios.$get("./random-data.json")
        //
        // commit("setPeople", people.slice(0, 10))

        // add empty pot
        let potBankAccount: PotBankAccount = {
            id: 999,
            first_name: "Pot"
        }

        // add default game
        let default_game: GameObject = {
            players: [],
            transactions: [],
            pot:potBankAccount
        }

        default_game.players.push(default_user);

        commit("setDefaultGame", default_game)

    },

    async addPlayer({ commit }, player:Person ) {
        commit("addPlayer", player)

        return player.id
    },

    async addTransaction({ commit }, transaction:GameMoneyTransaction) {
        return commit("addTransaction", transaction)
    },

    async addAnte({commit, state}, anteAmount:number=1) {
        for (let player of state.game.players) {

            //build the transaction
            let gmt:GameMoneyTransaction = {
                fromAccount: player,
                toAccount: state.game.pot,
                amount: Money.fromDecimal(anteAmount, "USD")
            };

            commit("addTransaction", gmt)
        }
    },

    async addPayoutStrategy({commit, state, getters}) {
        let balances:any = [];
        if (getters.getPotBalance == 0) {
            for (let player of state.game.players) {
                let row = {
                    balance: getters.getPlayerBalance(player),
                    player: player
                };
                balances.push(row)
            }
        }
    }
};

export const getters: GetterTree<RootState, RootState> = {
    gamePlayers (state) {
        return state.game.players.length
    },

    getPlayerBalance (state) {
        return (bankAccount: IBankAccount): number => {
            let debits:number = 0;
            let credits: number = 0;

            // get the players debits (transactions they have paid out.)
            let playersDebits = state.game.transactions.filter(
                currentTransaction => currentTransaction.fromAccount === bankAccount
            );

            debits = playersDebits.reduce((sum, currentTransaction) => sum + currentTransaction.amount.toDecimal(), 0);

            // get the players credits (transactions where they have been paid.)
            let playersCredits = state.game.transactions.filter(
                currentTransaction => currentTransaction.toAccount === bankAccount
            );

            credits = playersCredits.reduce((sum, currentTransaction) => sum + currentTransaction.amount.toDecimal(), 0);

            return credits - debits
        }
    },

    getPotBalance (state, getters) : number {
        return getters.getPlayerBalance(state.game.pot)
    },

    getAllPlayerBalances(state, getters) : GamePlayerBalanceRow[] {
        let balances:any = [];

        for (let player of state.game.players) {
            let row = {
                player: player,
                balance: getters.getPlayerBalance(player)
            };
            balances.push(row)
        }

        balances.sort((a,b) => a.balance < b.balance ? -1 : a.balance > b.balance? 1 : 0);

        return balances
    },

    getPayout(state, getters) {
        return () => payout.getGamePayoutStrategy(getters.getAllPlayerBalances)

    }

};

export default {
    getters,
    actions,
    mutations
}
