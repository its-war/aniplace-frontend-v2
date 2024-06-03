<template>
  <v-main :style='isMobile ? `grid-template-areas: "title title title" "content content content";` : ``' class="main-episodio">
    <div class="anime-title">
      <h2 :style="isMobile?'text-align: center;':''"
          v-show="(episodio.temporada === 1 || anime.tipo === 2) && anime.nome"
          v-if="getAnime">
        {{ getTitulo }}
      </h2>

      <h2 :style="isMobile?'text-align: center;':''"
          v-show="temporada.numeroTemporada > 1 && anime.tipo === 1 && anime.nome"
          v-if="getTemporada && getAnime">
        {{anime.nome}} — {{episodio.temporada}}ª Temporada,
        Episódio {{String(episodio.numero).padStart(2, '0')}}{{episodio.ova ? ' — OVA' : ''}}
      </h2>
      <v-progress-linear v-show="loadingPage" color="info" :indeterminate="true"></v-progress-linear>
    </div>
    <section class="player-section" :style="isMobile?'':'max-width: 1000px'">
      <vue-plyr ref="player">
        <div class="plyr__video-embed">
          <iframe
            style="border: none"
            class="video-player"
            :src="video"
            allowfullscreen
            allowtransparency
          ></iframe>
        </div>
      </vue-plyr>
      <article style="margin-bottom: 10px; text-align: center">
        <v-btn @click="anterior"
               :disabled="disabledAnterior"
               :text="!isMobile?'Anterior':''"
               size="small"
               color="#457BE4"
               :icon="isMobile?'mdi-chevron-left':false"
               prepend-icon="mdi-chevron-left"></v-btn>

        <v-btn @click="goBackAnimeList"
               :text="!isMobile?'Lista de Episódios':''"
               size="small"
               color="#3C669C"
               :icon="isMobile?'mdi-view-list':false"
               prepend-icon="mdi-view-list"
               style="margin-left: 5px"></v-btn>

        <v-btn @click="proximo"
               :disabled="disabledProximo"
               :text="!isMobile?'Próximo':''"
               size="small"
               color="#457BE4"
               :icon="isMobile?'mdi-chevron-right':false"
               append-icon="mdi-chevron-right"
               style="margin-left: 5px"></v-btn>

        <v-btn @click="reportar"
               :loading="reportLoading"
               :text="!isMobile?'Reportar Erro':''"
               size="small"
               color="#c30000"
               :icon="isMobile?'mdi-alert':false"
               prepend-icon="mdi-alert"
               style="margin-left: 5px"></v-btn>
      </article>
      <!--article>
        <ComentariosComponent v-if="episodio.idEpisodio" :tipo="1" :id-origem="episodio.idEpisodio"/>
        <v-progress-linear v-else :indeterminate="true" size="70" color="info"/>
      </article-->
    </section>
    <aside v-if="!isMobile" class="more-episodios">
      <v-tabs v-model="temporadaTab" align-tabs="center" color="#1E90FFFF" :center-active="true">
        <v-tab v-for="(temporada, i) in anime.temporadas" :key="i"
               :size="isMobile?'x-small':'small'"
               :value="temporada.numeroTemporada">
          {{ temporada.numeroTemporada }}ª Temporada
        </v-tab>
      </v-tabs>
      <v-window v-model="temporadaTab" style="padding-right: 15px">
        <v-window-item :id="`episodesList${temporada.numeroTemporada}`"
                       class="conteiner-episodios"
                       v-for="(temporada, i) in anime.temporadas"
                       :key="i"
                       :value="temporada.numeroTemporada">

          <div @click="goEpisodio(temporada.numeroTemporada, episodio.numero)"
               class="aside-episodio"
               :id="`temporada${temporada.numeroTemporada}_episodio${episodio.numero}`"
               :style="parseInt($route.params.temporada) === temporada.numeroTemporada && parseInt($route.params.numero) === episodio.numero ? 'background-color: rgb(170,0,0);' : ''"
               v-for="(episodio, i) in temporada.episodios" :key="i"
          >
            <div class="thumb">
              <v-icon
                :color="parseInt($route.params.temporada) === temporada.numeroTemporada && parseInt($route.params.numero) === episodio.numero ? 'rgb(170,0,0)' : 'white'"
                :icon="parseInt($route.params.temporada) === temporada.numeroTemporada && parseInt($route.params.numero) === episodio.numero ? 'mdi-restart' : 'mdi-play-circle-outline'"
                size="x-large"
                class="icon-play-episodio"
              ></v-icon>
            </div>
            <div class="episodio-title">
              Episódio {{String(episodio.numero).padStart(2, '0')}}{{episodio.duplo?'-' + String(episodio.numero + 1).padStart(2, '0'):''}}{{episodio.ova?' — OVA':''}}
              <v-spacer/>
              <ViewCountComponent :short="true" :views="episodio.acessos"/>
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
import ViewCountComponent from '@/components/ViewCountComponent.vue'
import { useDisplay } from 'vuetify'

export default {
  name: 'FirebaseComponent',
  components: { ViewCountComponent },
  inject: ['repository'],
  data: () => ({
    anime: {
      acessos: null,
      ano: null,
      audio: null,
      capa: null,
      dia: null,
      disponibilidade: null,
      foto: null,
      generos: null,
      id: null,
      idAnime: null,
      myanimelist: null,
      nome: null,
      nomeAlternativo: null,
      prints: null,
      sinopse: null,
      site: null,
      status: null,
      temporadaLancamento: null,
      temporadas: [],
      tipo: null
    },
    temporada: {
      episodios: null,
      numeroTemporada: null
    },
    episodio: {
      idEpisodio: null,
      temporada: null,
      numero: null,
      linkOnline: null,
      ova: false,
      acessos: 0,
    },
    video: null,
    loadingPage: false,
    reportSnackbar: false,
    reportLoading: false,
    temporadaTab: 1,
  }),
  async created(){
    await this.carregarAnime();
  },
  methods: {
    selecionarEpisodio(){
      for (let t = 0; t < this.anime.temporadas.length; t++) {
        if(this.anime.temporadas[t].numeroTemporada === Number(this.$route.params.temporada)){
          for (let e = 0; e < this.anime.temporadas[t].episodios.length; e++) {
            if(this.anime.temporadas[t].episodios[e].numero === Number(this.$route.params.numero)){
              this.anime.temporadas[t].episodios[e].acessos = this.anime.temporadas[t].episodios[e].acessos++;
              this.repository.animes.addAcessos(this.anime);
              this.repository.animes.episodioAddAcessos(this.anime.idAnime, this.anime.temporadas);
              this.temporada = this.anime.temporadas[t];
              this.episodio = this.anime.temporadas[t].episodios[e];
              this.episodio.linkOnline = this.episodio.linkOnline.split('/d/')[1];
              this.episodio.linkOnline = this.episodio.linkOnline.split('/')[0];
              this.episodio.linkOnline = 'https://drive.google.com/file/d/' + this.episodio.linkOnline + '/preview';
              this.video = this.episodio.linkOnline;
              return;
            }
          }
        }
      }
    },
    async carregarAnime(){
      this.anime = await this.repository.animes.getById(this.$route.params.idAnime);
      console.log(this.anime);
      this.selecionarEpisodio();
    },
    goBackAnimeList(){// TODO: terminar página de episodios no firebase
      this.$router.push({
        name: 'Anime',
        params: {id: this.$route.params.idAnime},
        hash: '#episodios'
      });
    },
    anterior(){},
    proximo(){},
    reportar(){},
    goEpisodio(){}
  },
  watch: {
    async '$route.params.idAnime'(){
      await this.carregarAnime();
      this.selecionarEpisodio();
    },
    '$route.params.temporada'(){
      this.selecionarEpisodio();
    },
    '$route.params.numero'(){
      this.selecionarEpisodio();
    }
  },
  computed: {
    isMobile(){
      return useDisplay().mobile.value;
    },
    disabledAnterior(){
      return this.episodio.temporada === 1 && this.episodio.numero === 1;

    },
    disabledProximo(){
      return this.temporada.numeroTemporada === this.anime.temporadas.length &&
        this.episodio.numero === this.anime.temporadas[this.anime.temporadas.length - 1].episodios.length;
    },
    getAnime(){
      return this.anime ?? false;
    },
    getEpisodio(){
      return this.episodio ?? false;
    },
    getTemporada(){
      return this.temporada ?? false;
    },
    getTitulo(){
      return `${this.anime.nome} — Episódio ${String(this.episodio.numero).padStart(2, '0')}${this.episodio.duplo?'-' + String(this.episodio.numero + 1).padStart(2, '0'):''}${this.episodio.ova ? ' — OVA' : ''}`;
    }
  }
}
</script>

<style src="@/components/EpisodioPage/style.css" scoped/>