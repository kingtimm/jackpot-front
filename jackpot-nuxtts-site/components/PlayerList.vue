<template>
    <p>{{ player.first_name }}</p>
</template>

<script lang="ts">
    import {
        Component,
        Prop,
        Vue
    } from "nuxt-property-decorator"
    import {GameObject, Person} from "~/types";

    @Component({})
    export default class PlayerStatus extends Vue {
        @Prop() player!: Person;
        @Prop() game!: GameObject;
    }

</script>

<style scoped>

</style>
