<template>
    <form action="">
        <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
                <p class="modal-card-title">Pot: ${{ getPotBalance }} - {{ player.first_name }} Transaction</p>
            </header>
            <section class="modal-card-body">
                <b-field label="Shortcuts">
                    <div class="columns" :key="getPotBalance">
                        <div
                                v-for="bet in getMaxBets()"
                                :key="bet.name"
                                :value="bet.amount"
                                class="column">
                            <button
                                    type="button"
                                    class="button"
                                    @click="amount = bet.amount">
                                {{bet.name}} Pot ${{bet.amount}}
                            </button>
                        </div>
                    </div>
                </b-field>
                <b-field label="Amount">
                    <b-field>
                        <b-numberinput min=1 :max="getMaxBets().triple.amount" controls-rounded v-model="amount"></b-numberinput>
                    </b-field>
                </b-field>
            </section>
            <footer class="modal-card-foot">
                <button class="button" type="button" @click="$parent.close()">Cancel</button>
                <button type="button"
                        class="button is-success"
                        @click="addTransactionToPlayer(false)">
                    {{ `Pay $${this.amount.toString()} to the Pot` }}
                </button>
                <button type="button"
                        class="button is-danger"
                        @click="addTransactionToPlayer(true)">
                    {{ `Take $${this.amount.toString()} from the Pot `}}
                </button>
            </footer>
        </div>
    </form>
</template>


<script lang="ts">
    import {
        Component, Getter,
        Prop,
        Vue
    } from "nuxt-property-decorator"
    import {GameMoneyTransaction, Person, GameObject} from "~/types";
    import {Money} from "~/node_modules/ts-money";


    @Component
    export default class PlayerDetail extends Vue {
        @Prop() player!: Person;
        @Prop() game!: GameObject;

        @Getter('getPotBalance') getPotBalance!: number;

        amount: number = 1;

        getMaxBets(balance = this.getPotBalance) {
            let names: string[] = ["Full", "Half", "Double", "Triple"],
                vals: number[] = [1, 0.5, 2, 3];

            let result = {};
            names.forEach((name, i) => {
                    result[name.toLowerCase()] = {
                        name: name,
                        amount: Math.floor(vals[i]*balance)
                    }
                }
            );
            return result
        }


        async addTransactionToPlayer(isTakenFromPlayer) {

            let gmt: GameMoneyTransaction = {
                fromAccount: this.player,
                toAccount: this.game.pot,
                amount: Money.fromDecimal(this.amount, "USD")
            };

            // flip to/from if it is not taken from the player
            if (isTakenFromPlayer) {
                gmt.fromAccount = this.game.pot;
                gmt.toAccount = this.player
            }

            await this.$store.dispatch("addTransaction", gmt);

            this.$emit("close");
        }

    }
</script>

<style scoped>

</style>
