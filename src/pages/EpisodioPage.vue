<template>
  <v-main :style='isMobile ? `grid-template-areas: "title title title" "content content content";` : ``' class="main-episodio">
    <div class="anime-title">
      <h2 :style="isMobile?'text-align: center;':''" v-if="episodio.temporada === 1 && episodio.anime.nome">{{episodio.anime.nome}} — Episódio {{getEpisodioNumero(episodio.numero)}}{{episodio.ova ? ' — OVA' : ''}}</h2>
      <h2 :style="isMobile?'text-align: center;':''" v-if="episodio.temporada > 1 && episodio.anime.nome">{{episodio.anime.nome}} — {{episodio.temporada}}ª Temporada, Episódio {{getEpisodioNumero(episodio.numero)}}{{episodio.ova ? ' — OVA' : ''}}</h2>
      <v-progress-linear v-show="loadingPage" color="info" :indeterminate="true"></v-progress-linear>
    </div>
    <section class="player-section">
      <vue-plyr ref="player">
        <div class="plyr__video-embed">
          <iframe
              style="border: none"
              class="video-player"
              :src="episodio.linkOnline"
              allowfullscreen
              allowtransparency
          ></iframe>
        </div>
      </vue-plyr>
      <article style="margin-bottom: 10px; text-align: center">
        <v-btn @click="anterior" :disabled="disabledAnterior" :text="!isMobile?'Anterior':''" size="small" color="#457BE4" :icon="isMobile?'mdi-chevron-left':false" prepend-icon="mdi-chevron-left"></v-btn>
        <v-btn @click="goBackAnimeList" :text="!isMobile?'Lista de Episódios':''" size="small" color="#3C669C" :icon="isMobile?'mdi-view-list':false" prepend-icon="mdi-view-list" style="margin-left: 5px"></v-btn>
        <v-btn @click="proximo" :disabled="disabledProximo" :text="!isMobile?'Próximo':''" size="small" color="#457BE4" :icon="isMobile?'mdi-chevron-right':false" append-icon="mdi-chevron-right" style="margin-left: 5px"></v-btn>
        <v-btn @click="reportar" :loading="reportLoading" :text="!isMobile?'Reportar Erro':''" size="small" color="#c30000" :icon="isMobile?'mdi-alert':false" prepend-icon="mdi-alert" style="margin-left: 5px"></v-btn>
      </article>
      <article><!-- TODO: sessão de comentarios -->
        <ComentariosComponent v-if="episodio.idEpisodio" :tipo="1" :id-origem="episodio.idEpisodio"/>
        <v-progress-linear v-else indeterminate size="70" color="info"/>
      </article>
    </section>
    <aside v-if="!isMobile" class="more-episodios">
      <v-tabs v-model="temporadaTab" align-tabs="center" color="#1E90FFFF" :center-active="true">
        <v-tab v-for="(temporada, i) in episodio.temporadas" :key="i" :size="isMobile?'x-small':'small'" :value="temporada.numeroTemporada">
          {{ temporada.numeroTemporada }}ª Temporada
        </v-tab>
      </v-tabs>
      <v-window v-model="temporadaTab" style="padding-right: 15px">
        <v-window-item :id="`episodesList${temporada.numeroTemporada}`" class="conteiner-episodios" v-for="(temporada, i) in episodio.temporadas" :key="i" :value="temporada.numeroTemporada">

          <div @click="goEpisodio(temporada.numeroTemporada, numero)"
               class="aside-episodio"
               :id="`temporada${temporada.numeroTemporada}_episodio${numero}`"
               :style="parseInt($route.params.temporada) === temporada.numeroTemporada && parseInt($route.params.numero) === numero ? 'background-color: rgb(170,0,0);' : ''"
               v-for="numero in temporada.totalEpisodios" :key="numero"
          >
            <div class="thumb">
              <v-icon
                  :color="parseInt($route.params.temporada) === temporada.numeroTemporada && parseInt($route.params.numero) === numero ? 'rgb(170,0,0)' : 'white'"
                  :icon="parseInt($route.params.temporada) === temporada.numeroTemporada && parseInt($route.params.numero) === numero ? 'mdi-restart' : 'mdi-play-circle-outline'"
                  size="x-large"
                  class="icon-play-episodio"
              ></v-icon>
            </div>
            <div class="episodio-title">
              Episódio {{getEpisodioNumero(numero)}}
              <v-spacer/>
              <ViewCountComponent :short="true" :views="temporada.acessos[numero - 1]"/>
            </div>
          </div>
        </v-window-item>
      </v-window>
    </aside>
    <v-snackbar v-model="reportSnackbar" theme="light">
      Episódio reportado com sucesso.
      <template v-slot:actions>
        <v-btn
            color="pink"
            variant="text"
            @click="reportSnackbar = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script>
import {useDisplay} from "vuetify";
import ViewCountComponent from "@/components/ViewCountComponent.vue";
import ComentariosComponent from "@/components/comments/ComentariosComponent.vue";

export default {
  name: "EpisodioPage",
  components: { ComentariosComponent, ViewCountComponent },
  async mounted() {
    this.player = this.$refs.player.player;
    await this.carregarEpisodio();
  },
  methods: {
    carregarEpisodio(){
      return new Promise((resolve) => {
        this.temporadaTab = parseInt(this.$route.params.temporada);
        this.axios.get('anime/getEpisodio', {
          params: {
            idAnime: this.$route.params.idAnime,
            temporada: this.$route.params.temporada,
            numero: this.$route.params.numero
          }
        }).then((response) => {
          if(response.data.episodio){
            this.episodio = response.data.episodio;
            this.$socket.emit('acessoAnime', this.episodio.anime.idAnime);
            this.$socket.emit('acessoEpisodio', this.$route.params.idAnime, this.$route.params.numero, this.$route.params.temporada);
            document.title = this.episodio.anime.nome + ' - ' + this.$route.params.temporada + 'ª Temporada, episódio ' + this.$route.params.numero + ' — Aniplace';
          }
        }).finally(() => {
          this.loadingPage = false;
          this.scrollEpisodio();
          resolve(true);
        });
      });
    },
    goBackAnimeList(){
      this.$router.push({
        name: 'Anime',
        params: {id: this.$route.params.idAnime},
        hash: '#episodios'
      });
    },
    getEpisodioNumero(n){
      if(n < 10){
        return `0${n}`;
      }
      return n;
    },
    goEpisodio(t, n){
      if(parseInt(this.$route.params.temporada) !== t || parseInt(this.$route.params.numero) !== n){
        this.loadingPage = true;
        this.$router.push({
          name: 'Episódio',
          params: {
            idAnime: this.episodio.anime.idAnime,
            temporada: t, numero: n
          }
        }).then(() => {
          this.carregarEpisodio();
        });
      }
    },
    proximo(){
      let total = this.episodio.temporadas[this.episodio.temporada - 1].totalEpisodios;
      if(this.episodio.numero < total){
        this.goEpisodio(this.episodio.temporada, this.episodio.numero + 1);
      }else{
        if(this.episodio.temporada + 1 <= this.episodio.temporadas.length){
          this.goEpisodio(this.episodio.temporada + 1, 1);
        }
      }
    },
    anterior(){
      if(this.episodio.numero > 1){
        this.goEpisodio(this.episodio.temporada, this.episodio.numero - 1);
      }else{
        if(this.episodio.temporada - 1 >= 1){
          this.goEpisodio(this.episodio.temporada - 1, this.episodio.temporadas[this.episodio.temporada - 2].totalEpisodios);
        }
      }
    },
    reportar(){
      this.reportLoading = true;
      this.axios.post('report/inserir', {
        idAnime: this.episodio.anime.idAnime,
        idEpisodio: this.episodio.idEpisodio
      }).then((response) => {
        if(response.data.report){
          this.reportSnackbar = true;
        }
      }).finally(() => {
        this.reportLoading = false;
      });
    },
    scrollEpisodio(){
      let selectedEpisodio = document.getElementById(`temporada${this.$route.params.temporada}_episodio${this.$route.params.numero}`);
      if (selectedEpisodio) {
        const episodePosition = selectedEpisodio.offsetTop;
        const episodesList = document.getElementById(`episodesList${this.$route.params.temporada}`);
        episodesList.scrollTop = episodePosition;
      }
    }
  },
  data: () => ({
    episodio: {
      idEpisodio: null,
      temporada: null,
      numero: null,
      linkOnline: null,
      ova: false,
      acessos: 0,
      anime: {
        idAnime: null,
        nome: null,
        capa: null
      },
      temporadas: []
    },
    player: null,
    temporadaTab: null,
    loadingPage: true,
    reportSnackbar: false,
    reportLoading: false
  }),
  computed: {
    isMobile(){
      return useDisplay().mobile.value;
    },
    disabledAnterior(){
      return this.episodio.temporada === 1 && this.episodio.numero === 1;

    },
    disabledProximo(){
      return this.episodio.temporada === this.episodio.temporadas.length
          && this.episodio.numero === this.episodio.temporadas[this.episodio.temporadas.length - 1].totalEpisodios;

    }
  }
}
</script>

<style scoped>
.main-episodio {
  display: grid;
  grid-template-areas: "title title title"
                       "content content side";
  grid-template-columns: 35% 35% 30%;
}

.anime-title {
  grid-area: title;
  padding-left: 30px;
  margin-top: 10px;
}

.player-section {
  grid-area: content;
  padding: 5px 15px 0 15px;
}

.more-episodios {
  grid-area: side;
}

.video-player {
  width: 100%;
  max-width: 1000px;
  aspect-ratio: 16/9;
}

.conteiner-episodios {
  max-height: 500px;
  overflow-y: auto;
}

.conteiner-episodios::-webkit-scrollbar {
  width: 2px;
}

.conteiner-episodios::-webkit-scrollbar-thumb {
  background-color: dodgerblue;
}

.conteiner-episodios::-webkit-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}

.conteiner-episodios::-ms-scrollbar {
  width: 2px;
}

.conteiner-episodios::-ms-scrollbar-thumb {
  background-color: dodgerblue;
}

.conteiner-episodios::-ms-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}

.conteiner-episodios::-moz-scrollbar {
  width: 2px;
}

.conteiner-episodios::-moz-scrollbar-thumb {
  background-color: dodgerblue;
}

.conteiner-episodios::-moz-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}

.aside-episodio {
  margin-top: 1px;
  display: grid;
  grid-template-areas: "thumb episodiotitle episodiotitle";
  grid-template-columns: 30% 35% 35%;
  grid-template-rows: 65px;
  cursor: pointer;
  transition: 300ms ease-in-out;
}

.aside-episodio-active {
  background-color: rgb(255,0,0);
}

.aside-episodio:hover {
  background-color: black;
}

.aside-episodio:hover .thumb {
  background-color: black;
}

.aside-episodio:hover .thumb .icon-play-episodio {
  color: dodgerblue;
}

.thumb {
  grid-area: thumb;
  background-color: #3B3B3BFF;
  text-align: center;
  align-items: center;
  align-content: center;
  justify-content: center;
  display: flex;
  transition: 300ms ease-in-out;
}

.episodio-title {
  grid-area: episodiotitle;
  align-content: center;
  align-items: center;
  display: flex;
  padding-left: 10px;
  padding-right: 30px;
}
</style>