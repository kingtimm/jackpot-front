<template>
    <section>
        <b-table
                :data="data"
                :columns="columns"
                @click="openPlayerDetail"
                :key="game.players.length + game.transactions.length">
        </b-table>
    </section>
</template>

<script lang="ts">
    import {
        Component, Getter,
        Prop,
        Vue
    } from "nuxt-property-decorator"
    import {GameObject, TableColumn, PlayerListRow} from "~/types";
    import PlayerDetail from "~/components/PlayerDetail.vue";
    import { ModalProgrammatic } from "buefy";
    import { ModalConfig } from "buefy/types/components";
    import {test_game} from "~/tests/test-dummies";

    @Component({
        components: {
            PlayerDetail
        }
    })
    export default class PlayerList extends Vue {
        @Prop() game!: GameObject;

        @Getter getPotBalance!: number;

        data = this.buildTableData();

        columns: TableColumn[] = [
            // {
            //     field: "id",
            //     label: "ID",
            //     numeric: true
            // },
            {
                field: "first_name",
                label: "Player"
            },
            {
                field: "balance",
                label: "Balance",
                centered: true
            }
        ];


        buildTableData () : PlayerListRow[] {
            let x: PlayerListRow[] = [];
            for (let player of this.game.players) {
                let row:PlayerListRow = {
                    id: player.id!,
                    first_name: player.first_name,
                    balance: "$ "+this.$store.getters.getPlayerBalance(player).toString()
                };
                x.push(row)
            }
            return x
        }

        getSelectedPlayer (selectedRow) {
            return this.game.players.filter(player => player.id === selectedRow.id)[0]
        }

        openPlayerDetail (selectedRow) {
            let mc: ModalConfig = {
                component: PlayerDetail,
                parent: this,
                props: {
                    game: this.game,
                    player: this.getSelectedPlayer(selectedRow)
                },
                hasModalCard: true
            };
            ModalProgrammatic.open(mc)
        }

    }



</script>

<style scoped>

</style>
