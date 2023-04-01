<template>
  <div id="main"> Hello Soundworks 4 + Vue 3 !</div>
  <div id="credits">
    <!-- if we add $app to client in index.js we must remove it somehow -->
    <!-- before passing the client to lit components, e.g. : -->
    <!--
      <sw-credits v-if="showCredits" .client="{ config: $client.config }">
      </sw-credits>
    -->
    <sw-credits v-if="showCredits" .client="$client"></sw-credits>
    <sw-infos-button @click="toggleCredits"></sw-infos-button>
  </div>
</template>

<style scoped>
div#main {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
}

sw-infos-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 1001;
}

sw-credits {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
}
</style>

<script>
import '../../components/sw-infos-button.js';
import '../../components/sw-credits.js';

export default {
  inject: [ '$client' ],
  data() {
    return {
      showCredits: false,
    };
  },
  methods: {
    toggleCredits() {
      this.showCredits = !this.showCredits;
      console.log(this.showCredits);
    }
  }
};
</script>
