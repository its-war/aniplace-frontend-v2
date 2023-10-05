<template>
  <div style="height: 250px; position: relative; padding: 20px 5px"
       :style="isMobile?'padding: 20px 5px 13px 5px; height: 180px;':''">

    <h4 v-if="isMobile"
        style="margin-left: 15px">
      {{$props.slideNome}} <v-icon v-if="$props.icon.length > 0" :color="getColor" :icon="$props.icon"/>
    </h4>
    <h3 v-else
        style="margin-left: 65px">
      {{$props.slideNome}} <v-icon v-if="$props.icon.length > 0" :color="getColor" :icon="$props.icon"/>
    </h3>

    <v-btn v-if="$props.animeList.length > 10 && $props.showVerTodos"
           :size="isMobile?'x-small':'default'"
           variant="outlined"
           @click="verTodos"
           append-icon="mdi-page-next-outline"
           style="position: absolute; top: 0; right: 50px">Ver todos</v-btn>

    <v-slide-group v-model="slider" show-arrows="always" v-if="$props.isAnime">
      <SliderItemComponent
          v-for="(anime, i) in $props.animeList.slice(0, 10)" :key="i" :is-anime="$props.isAnime"
          :id="anime.idAnime" :temporada="anime.temporada > 1 ? anime.temporada : null"
          :nome="anime.nome" :foto="anime.capa" :numero="$props.showEpisodios ? anime.numero : 0"
          :show-nota="$props.showNota"
          :nota="$props.showNota ? anime.weighted_average : null"
          :temporada-lancamento="anime.temporadaLancamento ?? 0"
      />
    </v-slide-group>

    <v-slide-group v-model="slider" v-else show-arrows="always">
      <SliderItemComponent
          v-for="(episodio, i) in $props.animeList.slice(0, 10)" :key="i" :is-anime="$props.isAnime"
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
    },
    icon: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: 'white'
    },
    totalPages: {
      type: Number,
      default: 1
    },
    showVerTodos: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isMobile(){
      return this.$vuetify.display.mobile;
    },
    getColor(){
      return this.$props.iconColor;
    }
  },
  methods: {
    verTodos(){
      this.$store.main.setAnimeList(this.$props.animeList);
      this.$store.main.setTotalPages(this.$props.totalPages);
      this.$store.main.setTituloVerTodos(this.$props.slideNome);
      if(this.$props.isAnime){
        this.$router.push('/animes/ver-todos');
      }else{
        this.$router.push('/episodios/ver-todos');
      }
    }
  }
}
</script>

<style scoped>

</style>