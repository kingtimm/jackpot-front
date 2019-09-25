<template>
    <section>
        <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
                <p class="modal-card-title">Game Payouts</p>
            </header>
            <section class="modal-card-body">
                <b-field label="List">
                     <b-table
                            :data="data"
                            :columns="columns"
                            :key="data.length">
                    </b-table>
                </b-field>
            </section>
            <footer class="modal-card-foot">
                <button class="button" type="button" @click="$parent.close()">Cancel</button>
            </footer>
        </div>
    </section>
</template>

<script lang="ts">
    import {
        Component,
        Prop,
        Vue
    } from "nuxt-property-decorator"
    import {GameMoneyTransaction, GamePayoutStrategy, TableColumn} from "~/types";


    @Component
    export default class TransactionRecord extends Vue {
        @Prop() gamePayoutStrategy!: GamePayoutStrategy;


        data = this.gamePayoutStrategy.transactions;

        columns: TableColumn[] = [
            {
                field: "fromAccount.first_name",
                label: "From Player"
            },
            {
                field: "toAccount.first_name",
                label: "To Player"
            },
            {
                field: "amount",
                label: "Amount",
                centered: true
            }
        ];
    }
</script>

<style scoped>

</style>
