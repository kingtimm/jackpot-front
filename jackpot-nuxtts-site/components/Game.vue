<template>
    <section>
        <div class="tile is-ancestor">



        </div>
        <div class="tile is-ancestor">
            <div class="tile is-4 is-vertical is-parent">
                <div class="tile is-child">
                    <article class="tile is-child notification is-primary">
                    <p class="title"><b-icon icon="home-currency-usd" size="is-large"></b-icon>jackpot</p>
                        <p class="subtitle">pot balance: $ {{ getPotBalance }}</p>
                    </article>
                </div>
                <div class="tile is-child">
                    <article class="tile is-child notification is-secondary" :key="getPotBalance">
                        <p class="title">controls</p>
                        <a class="button is-primary is-fullwidth" v-on:click="addAnte">
                            Ante
                        </a>
                        <a class="button is-primary is-fullwidth" v-on:click="promptPlayerName" :disabled="isNoBalance()">
                            Add Player
                        </a>
                        <a class="button is-primary is-fullwidth" v-on:click="endGame()" :disabled="isNoBalance()">
                            Show Payouts
                        </a>
                    </article>
                </div>
            </div>
            <div class="tile is-parent">
                <div class="tile is-child">
                    <article class="tile is-child notification is-secondary">
                    <p class="title">players</p>
                    <PlayerList v-bind:game="game" :key="this.game.players.length + this.game.transactions.length" ></PlayerList>
                    </article>
                </div>
            </div>
        </div>

    </section>

</template>

<script lang="ts">
    import {
        Component, Getter,
        Prop, State,
        Vue
    } from "nuxt-property-decorator"
    import {GameObject, GamePayoutStrategy, Person} from "~/types";
    import { DialogProgrammatic, ToastProgrammatic, ModalProgrammatic } from "buefy"
    import { ModalConfig } from "buefy/types/components";
    import PlayerList from "~/components/PlayerList.vue";
    import PayoutScreen from "~/components/PayoutScreen.vue";

    @Component({
        components: {
            PlayerList,
        }
    })
    export default class extends Vue {
        @Prop() game!: GameObject;
        @Getter('getPotBalance') getPotBalance!: number;
        // @Getter('getPayout') getPayout!: () => GamePayoutStrategy;

        isNoBalance () {
            return this.getPotBalance != 0;
        }

        promptPlayerName() {
            if (this.getPotBalance == 0) {
                DialogProgrammatic.prompt({
                    message: `Who's getting added?`,
                    inputAttrs: {
                        placeholder: 'e.g. name',
                        maxlength: 12,
                        confirmText: "Add"
                    },

                    onConfirm: (value) => {
                        this.addUser(value)
                        ToastProgrammatic.open(`Added: ${value}`);

                    }
                });
            } else {
                ToastProgrammatic.open({
                    message: "Wait until pot is cleared to add players. (math gets a little crazy)"
                })
            }
        }

        addUser(value) {
            let newPerson: Person = {
                first_name: value,
                id: 998
            };

            return this.$store.dispatch("addPlayer", newPerson)
        }

        addAnte() {
            return this.$store.dispatch("addAnte", 1)
        }

        endGame() {
            if (this.getPotBalance > 0) {
                ToastProgrammatic.open({
                    message: "Wait until pot is cleared to calculate payouts (math gets a little crazy)"
                });
                return
            };

            let mc: ModalConfig = {
                component: PayoutScreen,
                parent: this,
                props: {
                    gamePayoutStrategy: this.$store.getters.getPayout(),
                },
                hasModalCard: true
            };
            ModalProgrammatic.open(mc)
        }

    }

</script>

<style scoped>

</style>
