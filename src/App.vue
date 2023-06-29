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

html {
  scroll-behavior: smooth !important;
}

.myanimelist-icon {
  background: url("./assets/myanimelist-icon.png") top center;
  background-size: cover;
  cursor: pointer;
}

.icone-normal {
  display: inline-block;
  width: 40px;
  height: 40px;
}

html::-webkit-scrollbar {
  width: 2px;
}

html::-webkit-scrollbar-thumb {
  background-color: red;
}

html::-webkit-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}

html::-ms-scrollbar {
  width: 2px;
}

html::-ms-scrollbar-thumb {
  background-color: red;
}

html::-ms-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}

html::-moz-scrollbar {
  width: 2px;
}

html::-moz-scrollbar-thumb {
  background-color: red;
}

html::-moz-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}
</style>
