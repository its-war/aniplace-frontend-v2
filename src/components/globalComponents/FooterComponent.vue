<template>
  <v-footer class="d-flex flex-column">
    <div class="w-100">
      <div class="align-center px-4" style="float: left; width: 50%">
        <strong>Siga-nos em nossas redes sociais!</strong>

        <v-spacer></v-spacer>

        <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-4"
            :icon="icon"
            variant="plain"
            size="small"
        ></v-btn>
      </div>

      <div class="px-4 align-center" style="float: right; width: 50%; text-align: right">
        <strong>Este site foi construído usando a técnica Single Page Application</strong><br/>
        <v-spacer/>
        <v-btn
            class="mx-4"
            icon="mdi-vuejs"
            variant="plain"
            size="small"
        ></v-btn>
        <v-btn
            class="mx-4"
            icon="mdi-vuetify"
            variant="plain"
            size="small"
        ></v-btn>
        <v-btn
            class="mx-4"
            icon="mdi-nodejs"
            variant="plain"
            size="small"
        ></v-btn>
        <v-btn
            class="mx-4"
            icon="mdi-language-php"
            variant="plain"
            size="small"
        ></v-btn>
        <v-btn
            class="mx-4"
            icon="mdi-database"
            variant="plain"
            size="small"
        ></v-btn>
      </div>
    </div>

    <div class="w-100"></div>

    <div class="px-4 py-2 text-center align-center w-100" style="float: none; border-top: solid 1px grey">
      Copyright © {{ new Date().getFullYear() }} — <strong>AniVision</strong>
    </div>
  </v-footer>
</template>

<script>
export default {
  name: "FooterComponent",
  data: () => ({
    icons: [
      'mdi-facebook',
      'mdi-instagram',
    ],
  }),
}
</script>

<style scoped>

</style>