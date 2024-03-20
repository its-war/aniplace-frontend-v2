<template>
  <SnackbarAvisos v-model="getSnackbar.show" :icon="getSnackbar.icon" :timeout="getSnackbar.timeout"
                  :color="getSnackbar.color" :texto="getSnackbar.text"/>

  <v-footer class="d-flex flex-column">
    <div class="px-4 py-2 text-center align-center w-100" :style="'width: ' + getWidthScreen + ' px !important;'">
      <v-btn variant="text" href="https://www.instagram.com/aniplace.top" target="_blank" tag="a" icon="mdi-instagram"></v-btn>
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
import SnackbarAvisos from "@/utils/SnackbarAvisos.vue";

export default {
  name: "FooterComponent",
  components: { SnackbarAvisos },
  data: () => ({
    icons: [
      'mdi-facebook',
      'mdi-instagram',
    ],
    snackbar: false
  }),
  computed: {
    getWidthScreen(){
      return useDisplay().width.value;
    },
    getSnackbar(){
      if(this.$store.main.getSnackbar){
        return this.$store.main.getSnackbar;
      }
      return {
        show: false
      }
    }
  }
}
</script>

<style scoped>

</style>