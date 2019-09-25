<template>
  <section>
    <Game v-bind:game="game"></Game>
  </section>
</template>

<script lang="ts">
  import {
    Component,
    Vue
  } from "nuxt-property-decorator"
  import { State } from "vuex-class"
  import {GameObject} from "~/types";
  import Game from "~/components/Game.vue";

  @Component({
    components: {
      Game
    }
  })
  export default class extends Vue {
    @State game!: GameObject

  }
</script>

<style lang="scss">
  // Import Bulma's core
  @import "~bulma/sass/utilities/_all";
  // Set your colors
  $primary: #f1896f;
  $primary-invert: findColorInvert($primary);
  $twitter: #4099ff;
  $twitter-invert: findColorInvert($twitter);
  // Setup $colors to use as bulma classes (e.g. 'is-twitter')
  $colors: (
          "white": ($white, $black),
          "black": ($black, $white),
          "light": ($light, $light-invert),
          "dark": ($dark, $dark-invert),
          "primary": ($primary, $primary-invert),
          "info": ($info, $info-invert),
          "success": ($success, $success-invert),
          "warning": ($warning, $warning-invert),
          "danger": ($danger, $danger-invert),
          "twitter": ($twitter, $twitter-invert)
  );

  .button{ margin-bottom: .5rem}

  // Links
  $link: $primary;
  $link-invert: $primary-invert;
  $link-focus-border: $primary;
  // Import Bulma and Buefy styles
  @import "~bulma";
  @import "~buefy/src/scss/buefy";
</style>
