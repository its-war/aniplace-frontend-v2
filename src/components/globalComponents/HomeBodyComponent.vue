<template>
  <div>
    <CarouselComponent/>
    <v-main>
      <SliderComponent v-if="ultimos7Dias.length > 0" slide-nome="Lançamentos desta semana" :anime-list="ultimos7Dias"/>
      <SliderComponent v-if="maisAcessados.length > 0" slide-nome="Animes em alta" :anime-list="maisAcessados" :is-anime="true" :show-episodios="false"/>
      <SliderComponent v-if="maisVistos.length > 0" slide-nome="Episódios em alta" :anime-list="maisVistos"/>
      <SliderComponent v-if="topAnimes.length > 0" slide-nome="Top animes" :anime-list="topAnimes" :show-episodios="false" :is-anime="true" :show-nota="true"/>
      <!--SliderComponent slide-nome="Futuros lançamentos" :anime-list="animes"/-->
      <!-- TODO: iniciar a criação de um algoritmo de automação para alimentar esses sliders -->
    </v-main>
  </div>
</template>

<script>
import SliderComponent from "@/components/slider/SliderComponent.vue";
import CarouselComponent from "@/components/carousel/CarouselComponent.vue";

export default {
  name: "HomeBodyComponent",
  components: {CarouselComponent, SliderComponent},
  data: () => ({
    maisVistos: [],
    maisAcessados: [],
    ultimos7Dias: [],
    topAnimes: []
  }),
  methods: {
    carregarTudo(){
      this.carregarMaisVistos();
      this.carregarAnimesMaisAcessados();
      this.carregarUltimos7Dias();
      this.carregarTopAnimes();
    },
    carregarMaisVistos(){
      this.axios.get('episodio/getMaisVistos').then((response) => {
        this.maisVistos = response.data.episodios;
      });
    },
    carregarAnimesMaisAcessados(){
      this.axios.get('anime/getMaisAcessados').then((response) => {
        this.maisAcessados = response.data.animes;
      });
    },
    carregarUltimos7Dias(){
      this.axios.get('episodio/getUltimos7Dias').then((response) => {
        this.ultimos7Dias = response.data.episodios;
      });
    },
    carregarTopAnimes(){
      this.axios.get('anime/getTopAnimes').then((response) => {
        this.topAnimes = response.data.animes;
      });
    }
  },
  mounted() {
    this.carregarTudo();
  },
  computed: {
    showMaisVistos(){
      return this.maisVistos.length > 0;
    }
  }
}
</script>

<style scoped>

</style>