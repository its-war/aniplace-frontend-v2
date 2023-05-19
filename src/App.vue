<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <RouterView />
  </v-app>
</template>

<style>
@font-face {
  font-family: 'Aqua_Grotesque';
  src: url('./assets/font/aqua-grotesque-webfont.woff2') format('woff2'),
  url('./assets/font/aqua-grotesque-webfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

* {
  font-family: Aqua_Grotesque, sans-serif;
}

.myanimelist-icon {
  background: url("./assets/myanimelist-icon.png") top center;
  background-size: cover;
  cursor: pointer;
}

.icone-normal {
  width: 40px;
  height: 40px;
}
</style>
