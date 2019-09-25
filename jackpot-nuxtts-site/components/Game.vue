<template>
    <section>
        <div class="tile is-ancestor">
            <div class="column"><b-icon icon="home-currency-usd" size="is-large"></b-icon>
                $ {{ getPotBalance }}</div>


        </div>
        <div class="tile is-ancestor">
          <div class="tile is-4 is-vertical is-parent">
            <div class="tile is-child box">
              <p class="title">One</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
            </div>
            <div class="tile is-child box">
              <p class="title">Two</p>
              <b-button class="button" v-on:click="promptPlayerName">
                Add Player
            </b-button>
            <b-button class="button" v-on:click="addAnte">
                Ante
            </b-button>
            <b-button class="button" v-on:click="endGame()">
                Show Payouts
            </b-button>
            </div>
          </div>
          <div class="tile is-parent">
            <div class="tile is-child box">
              <p class="title">Three</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper diam at erat pulvinar, at pulvinar felis blandit. Vestibulum volutpat tellus diam, consequat gravida libero rhoncus ut. Morbi maximus, leo sit amet vehicula eleifend, nunc dui porta orci, quis semper odio felis ut quam.</p>
              <p>Suspendisse varius ligula in molestie lacinia. Maecenas varius eget ligula a sagittis. Pellentesque interdum, nisl nec interdum maximus, augue diam porttitor lorem, et sollicitudin felis neque sit amet erat. Maecenas imperdiet felis nisi, fringilla luctus felis hendrerit sit amet. Aenean vitae gravida diam, finibus dignissim turpis. Sed eget varius ligula, at volutpat tortor.</p>
              <p>Integer sollicitudin, tortor a mattis commodo, velit urna rhoncus erat, vitae congue lectus dolor consequat libero. Donec leo ligula, maximus et pellentesque sed, gravida a metus. Cras ullamcorper a nunc ac porta. Aliquam ut aliquet lacus, quis faucibus libero. Quisque non semper leo.</p>
            </div>
          </div>
        </div>
        <PlayerList v-bind:game="game" :key="this.game.players.length + this.game.transactions.length" ></PlayerList>
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
