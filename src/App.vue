<script setup>
import { RouterView } from 'vue-router'
import {useDisplay} from "vuetify"
import mainStore from "@/stores/mainStore"
const main = mainStore();
main.setMobile(useDisplay().mobile.value);
</script>

<template>
  <v-app>
    <v-overlay :model-value="main.isLoading" class="align-center justify-center">
      <v-progress-circular style="margin: auto" color="red" indeterminate :size="main.isMobile?40:80"></v-progress-circular>
    </v-overlay>
    <RouterView/>
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
