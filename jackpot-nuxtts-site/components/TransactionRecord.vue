<template>
    <p> {{transaction.fromAccount.first_name}} </p>
<!--    <p> {{ transaction.amount.toString() }} </p>-->
</template>

<script lang="ts">
    import {
        Component,
        Prop,
        Vue
    } from "nuxt-property-decorator"
    import { GameMoneyTransaction } from "~/types";

    @Component
    export default class TransactionRecord extends Vue {
        @Prop() transaction!: GameMoneyTransaction
    }

</script>

<style scoped>

</style>
