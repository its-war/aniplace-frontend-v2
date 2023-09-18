<template>
  <v-footer class="d-flex flex-column">
    <div class="px-4 py-2 text-center align-center w-100" :style="'width: ' + getWidthScreen + ' px !important;'">
      <v-btn variant="text" tag="a" icon="mdi-instagram"></v-btn>
      <v-btn variant="text" tag="a" icon="mdi-facebook"></v-btn>
      <v-btn variant="text" tag="a" icon="mdi-github"></v-btn>
    </div>

    <div :style="'width: ' + getWidthScreen + ' px !important;'"></div>

    <div class="px-4 py-2 text-center align-center w-100" :style="'width: ' + getWidthScreen + ' px !important;'" style="float: none; border-top: solid 1px grey">
      Copyright © {{ new Date().getFullYear() }} — <strong>Aniplace</strong>
    </div>
  </v-footer>
</template>

<script>
import {useDisplay} from "vuetify";

export default {
  name: "FooterComponent",
  data: () => ({
    icons: [
      'mdi-facebook',
      'mdi-instagram',
    ],
  }),
  computed: {
    getWidthScreen(){
      return useDisplay().width.value;
    }
  }
}
</script>

<style scoped>

</style>