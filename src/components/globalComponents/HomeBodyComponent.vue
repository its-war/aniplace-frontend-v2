<template>
  <div>
    <CarouselComponent @isReady="carregarTudo"/>
    <v-main>
      <SliderComponent v-if="ultimosLancamentos.list.length > 0 && !isFirebase"
                       :anime-list="ultimosLancamentos.list"
                       :total-pages="ultimosLancamentos.total"
                       slide-nome="Lançamentos da semana"
                       icon="mdi-new-box"
                       icon-color="info"
                       :show-ver-todos="true"
      />

      <div class="text-center">
        <AdsComponent/>
      </div>

      <SliderComponent v-if="maisAcessados.length > 0"
                       slide-nome="Animes em alta"
                       icon="mdi-fire"
                       icon-color="orange"
                       :anime-list="maisAcessados"
                       :is-anime="true"
                       :show-episodios="false"/>

      <SliderComponent v-if="futurosLancamentos.length > 0 && !isFirebase"
                       :is-anime="true"
                       :show-episodios="false"
                       icon="mdi-calendar-clock"
                       :anime-list="futurosLancamentos"
                       slide-nome="Futuros Lançamentos"/>

      <SliderComponent v-if="topAnimes.length > 0 && !isFirebase"
                       slide-nome="Top animes"
                       icon="mdi-podium"
                       icon-color="yellow"
                       :anime-list="topAnimes"
                       :show-episodios="false"
                       :is-anime="true"
                       :show-nota="true"/>

      <SliderComponent v-if="ultimos7Dias.length > 0 && !isFirebase"
                       slide-nome="Adicionados recentemente"
                       icon="mdi-history"
                       :show-only-temporada="true"
                       :anime-list="ultimos7Dias"/>

      <!--SliderComponent slide-nome="Futuros lançamentos" :anime-list="animes"/-->

      <div class="text-center">
        <AdsComponent/>
      </div>
    </v-main>
  </div>
</template>

<script>
import SliderComponent from "@/components/slider/SliderComponent.vue";
import CarouselComponent from "@/components/carousel/CarouselComponent.vue";
import AdsComponent from "@/components/globalComponents/AdsComponent.vue";

export default {
  name: "HomeBodyComponent",
  components: { AdsComponent, CarouselComponent, SliderComponent},
  inject: ['repository'],
  data: () => ({
    maisVistos: [],
    maisAcessados: [],
    ultimos7Dias: [],
    topAnimes: [],
    ultimosLancamentos: {
      list: [],
      total: 1
    },
    futurosLancamentos: []
  }),
  methods: {
    carregarTudo(){
      this.carregarUltimosLancamentos();
      this.carregarAnimesMaisAcessados();
      this.carregarFuturosLancamentos();
      this.carregarTopAnimes();
      this.carregarUltimos7Dias();
      //this.carregarMaisVistos();
    },
    carregarMaisVistos(){//não precisa mexer por enquanto
      this.axios.get('episodio/getMaisVistos').then((response) => {
        this.maisVistos = response.data.episodios;
      });
    },
    carregarAnimesMaisAcessados(){
      if(this.isFirebase){
        this.repository.animes.getMaisAcessados().then((animes) => {
          this.maisAcessados = animes;
        });
      }else{
        this.axios.get('anime/getMaisAcessados').then((response) => {
          this.maisAcessados = response.data.animes;
        });
      }
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
    },
    carregarUltimosLancamentos(){
      this.axios.get('episodio/getLancamentos').then((response) => {
        this.ultimosLancamentos.list = response.data.episodios;
        this.ultimosLancamentos.total = response.data.total;
      });
    },
    carregarFuturosLancamentos(){
      this.axios.get('anime/getFuturosLancamentos').then((response) => {
        this.futurosLancamentos = response.data.futurosLancamentos;
      });
    }
  },
  computed: {
    isFirebase(){
      return this.isFirebaseApiOrigin;
    }
  }
}
</script>

<style scoped>

</style>