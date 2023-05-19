<template>
  <div style="padding: 13px 45px; height: 300px !important; position: relative">
    <h3>{{$props.slideNome}}</h3>
    <v-btn variant="outlined" style="position: absolute; top: 0; right: 50px">Ver todos</v-btn>
    <v-slide-group v-model="slider" show-arrows>
      <SliderItemComponent
          v-for="(anime, i) in $props.animeList" :key="i"
          :id="anime.id" :nome="anime.nome" :foto="anime.foto" :numero="anime.numero"
      />
    </v-slide-group>
  </div>
</template>

<script>
import SliderItemComponent from "@/components/slider/SliderItemComponent.vue";
export default {
  name: "SliderComponent",
  components: {SliderItemComponent},
  data: () => ({
    slider: null,
  }),
  props: {
    slideNome: {
      type: String,
      required: true
    },
    animeList: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>