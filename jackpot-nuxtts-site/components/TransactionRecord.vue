<template>
    <p>{ transaction.actor }</p>
    <p>{ transaction.amount }</p>
</template>

<script lang="ts">
    import {
        Component,
        Prop,
        Vue
    } from "nuxt-property-decorator"
    import { GameMoneyTransaction } from "~/types";

    @Component({})
    export default class TransactionListing extends Vue {
        @Prop() transaction!: GameMoneyTransaction
    }

</script>

<style scoped>

</style>
