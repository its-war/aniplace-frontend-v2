<template>
  <div style="height: 250px; position: relative; padding: 20px 5px"
       :style="isMobile?'padding: 20px 5px 13px 5px; height: 180px;':''">

    <h4 v-if="isMobile" style="margin-left: 15px">{{$props.slideNome}}</h4>
    <h3 v-else style="margin-left: 65px">{{$props.slideNome}}</h3>

    <v-btn v-if="isMobile" size="x-small" variant="outlined" style="position: absolute; top: 0; right: 50px">Ver todos</v-btn>
    <v-btn v-else variant="outlined" style="position: absolute; top: 0; right: 50px">Ver todos</v-btn>

    <v-slide-group v-model="slider" show-arrows v-if="$props.isAnime">
      <SliderItemComponent
          v-for="(anime, i) in $props.animeList" :key="i" :is-anime="$props.isAnime"
          :id="anime.idAnime" :temporada="anime.temporada > 1 ? anime.temporada : null"
          :nome="anime.nome" :foto="anime.capa" :numero="$props.showEpisodios ? anime.numero : 0"
          :show-nota="$props.showNota"
          :nota="$props.showNota ? anime.weighted_average : null"
      />
    </v-slide-group>

    <v-slide-group v-model="slider" show-arrows v-else>
      <SliderItemComponent
          v-for="(episodio, i) in $props.animeList" :key="i" :is-anime="$props.isAnime"
          :id="episodio.anime.idAnime" :temporada="episodio.temporada > 1 ? episodio.temporada : null"
          :nome="episodio.anime.nome" :foto="episodio.anime.capa" :numero="$props.showEpisodios ? episodio.numero : 0"
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
    },
    showEpisodios: {
      type: Boolean,
      default: true
    },
    isAnime: {
      type: Boolean,
      default: false
    },
    showNota: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isMobile(){
      return this.$vuetify.display.mobile;
    }
  }
}
</script>

<style scoped>

</style>