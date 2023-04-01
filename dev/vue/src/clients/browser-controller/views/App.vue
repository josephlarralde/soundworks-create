<template>
  <header>
    <h1>{{ `${$client.config.app.name} | ${$client.role}` }}</h1>
    <sw-audit .client="$client"></sw-audit>
  </header>
</template>

<style scoped>
:host {
  display: block;
  min-height: 100vh;
}

:host > div {
  padding: 20px;
}

header {
  display: block;
  line-height: 38px;
  background-color: #121212;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid #343434;
}

header h1 {
  font-size: 12px;
  margin: 0;
  padding-left: 20px;
}
</style>

<script>
import '../../components/sw-audit.js';

export default {
  inject: [ '$client' ],
};
</script>