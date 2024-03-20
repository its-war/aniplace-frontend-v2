<template>
  <v-snackbar :color="color" :timeout="timeout" :icon="icon">
    {{texto}}
    <template v-slot:actions>
      <v-btn @click="closeSnackbar" text="Ok" color="white"/>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "SnackbarAvisos",
  props: {
    texto: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    timeout: {
      type: Number,
      default: 10000
    },
    icon: {
      type: String,
      required: true
    }
  },
  methods: {
    closeSnackbar(){
      this.$store.main.closeSnackbar();
    }
  }
};
</script>

<style scoped>

</style>