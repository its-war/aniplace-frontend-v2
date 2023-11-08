<template>
  <v-sheet width="100%" style="padding: 100px 50px 20px" :style="isMobile?'padding: 15px 10px':''">

    <h4 v-if="isMobile" style="margin-top: 80px; text-align: center">{{$store.main.getTituloVerTodos}}</h4>
    <h1 v-else>{{$store.main.getTituloVerTodos}}</h1>

    <div v-if="$props.isAnime" class="ver-todos-box">
      <div v-if="pageLoading" class="loading-animes" style="margin: auto; width: 50%; text-align: center">
        <v-progress-circular indeterminate color="red" size="70"/>
      </div>
      <div class="item-array" v-for="(anime, i) in paginator.animes" :key="i">
        <div class="item-object">
          <v-img :src="$getImg(anime.capa, 'anime/capa')"
                 aspect-ratio="16/9"
                 cover
                 style="border-radius: 10px"/>
          <div style="text-align: center">
            <span>
              {{$limitarTexto(anime.nome, 30)}}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="ver-todos-box">
      <div v-if="pageLoading" class="loading-animes" style="margin: auto; width: 50%; text-align: center">
        <v-progress-circular indeterminate color="red" size="70"/>
      </div>
      <div class="item-array" v-for="(episodio, i) in paginator.animes" :key="i" :style="isMobile?'width: 100%':''">
        <div class="item-object"
             @click.middle.prevent="abrirNovaAba(`/anime/${episodio.anime.idAnime}/episodio/${episodio.temporada}/${episodio.numero}/online`)"
             @click.left="goEpisodio(episodio.anime.idAnime, episodio.temporada, episodio.numero)">
          <div style="width: 100%; position: relative">
            <v-img :src="$getImg(episodio.anime.capa, 'anime/capa')"
                   aspect-ratio="16/9"
                   cover
                   style="border-radius: 10px"/>
            <span :style="isMobile?'font-size: 10px; padding: 3px 7px':''"
              style="position: absolute; top: 0; right: 0; padding: 5px 10px; background-color: rgb(0,150,0); border-bottom-left-radius: 10px">
              {{semana[episodio.anime.dia - 1]}}
            </span>
            <span :style="isMobile?'font-size: 10px':''"
              style="position: absolute; bottom: 0; left: 0; padding: 2px 5px 0; background-color: rgb(0,150,200); border-top-right-radius: 10px; border-bottom-left-radius: 10px">
              {{getData(episodio.registro)}}
            </span>
          </div>
          <div style="text-align: center" :style="isMobile?'font-size: 12px':''">
            <span>
              {{$limitarTexto(episodio.anime.nome, 25)}}
            </span>
            <span v-if="episodio.temporada > 1">
              Temp. {{episodio.temporada}} Ep. {{episodio.numero < 10 ? '0' + episodio.numero : episodio.numero}}
            </span>
            <span v-else>
              Ep. {{episodio.numero < 10 ? '0' + episodio.numero : episodio.numero}}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center">
      <v-pagination
        v-model="paginator.pagina"
        :length="paginator.total"
        :total-visible="isMobile?3:10"
        color="red"
        :disabled="pageLoading"
      ></v-pagination>

      <AdsComponent/>
    </div>
  </v-sheet>
</template>

<script>
import AdsComponent from "@/components/globalComponents/AdsComponent.vue";
import config from "../../../config";
export default {
  name: "VerTodosComponent",
  components: { AdsComponent },
  computed: {
    isMobile(){
      return this.$store.main.isMobile;
    }
  },
  data: () => ({
    paginator: {
      animes: [],
      pagina: 1,
      total: 0
    },
    pageLoading: false,
    semana: [
      'Todo domingo',
      'Toda segunda',
      'Toda terça',
      'Toda quarta',
      'Toda quinta',
      'Toda sexta',
      'Todo sábado'
    ]
  }),
  mounted() {
    this.paginator.animes = this.$store.main.getAnimeList;
    this.paginator.total = this.$store.main.getTotalPages;
  },
  methods: {
    carregarAnimes(){
      this.pageLoading = true;
      this.paginator.animes = [];
      this.axios.get('episodio/getLancamentos', {
        params: {
          pagina: this.paginator.pagina
        }
      }).then((response) => {
        this.paginator.animes = response.data.episodios;
      }).finally(() => {
        this.pageLoading = false;
      });
    },
    goEpisodio(idAnime, temporada, numero){
      this.$router.push({name: 'Episódio', params: {
        idAnime: idAnime,
          temporada: temporada,
          numero: numero
      }});
    },
    abrirNovaAba(path = '/'){
      const apiUrl = import.meta.env.MODE === 'production' ? config.production : config.development;
      window.open(apiUrl + path, '_blank');
    },
    getData(registro){
      let data = new Date(registro);
      let d = data.getDate() < 10 ? '0' + data.getDate() : data.getDate();
      let m = data.getMonth() + 1 < 10 ? '0' + (data.getMonth() + 1) : data.getMonth() + 1;
      let a = data.getFullYear();
      return `${d}/${m}/${a}`;
    }
  },
  watch: {
    'paginator.pagina'(){
      this.carregarAnimes();
    }
  },
  props: {
    isAnime: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.ver-todos-box {
  padding: 15px;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.item-array {
  width: 25%;
  padding: 10px;
}

.item-object {
  border: 3px solid transparent;
  border-radius: 15px;
  transition: 250ms;
  cursor: pointer;
  overflow: hidden;
}

.item-object:hover {
  border-color: white;
}
</style>