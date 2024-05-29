<template>
  <v-main :style='isMobile ? `grid-template-areas: "title title title" "content content content";` : ``' class="main-episodio">
    <div class="anime-title">
      <h2 :style="isMobile?'text-align: center;':''"
          v-if="(episodio.temporada === 1 || episodio.anime.tipo === 2) && episodio.anime.nome">
        {{episodio.anime.nome}} — Episódio {{getEpisodioNumero(episodio.numero)}}{{episodio.duplo?'-' + getEpisodioNumero(episodio.numero + 1):''}}{{episodio.ova ? ' — OVA' : ''}}
      </h2>

      <h2 :style="isMobile?'text-align: center;':''" v-if="episodio.temporada > 1 && episodio.anime.tipo === 1 && episodio.anime.nome">{{episodio.anime.nome}} — {{episodio.temporada}}ª Temporada, Episódio {{getEpisodioNumero(episodio.numero)}}{{episodio.ova ? ' — OVA' : ''}}</h2>
      <v-progress-linear v-show="loadingPage" color="info" :indeterminate="true"></v-progress-linear>
    </div>
    <section class="player-section" :style="isMobile?'':'max-width: 1000px'">
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
      <article>
        <ComentariosComponent v-if="episodio.idEpisodio" :tipo="1" :id-origem="episodio.idEpisodio"/>
        <v-progress-linear v-else :indeterminate="true" size="70" color="info"/>
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
              Episódio {{getEpisodioNumero(episodio.numero)}}{{episodio.duplo?'-' + getEpisodioNumero(episodio.numero + 1):''}}{{episodio.ova?' — OVA':''}}
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
import {useDisplay} from "vuetify";
import ViewCountComponent from "@/components/ViewCountComponent.vue";
import ComentariosComponent from "@/components/comments/ComentariosComponent.vue";

export default {
  name: "EpisodioPage",
  components: { ComentariosComponent, ViewCountComponent },
  async mounted() {
    this.player = this.$refs.player;
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
            if(this.$store.main.isLogged){
              this.$socket.emit('userActivity', this.$store.user.getIdUser);
              this.$socket.emit('userAtividadeAnimeView', this.$store.user.getIdUser, this.$route.params.idAnime);
            }

            if(this.episodio.anime.tipo === 2){
              document.title = this.episodio.anime.nome + ' Ep. ' + this.$route.params.numero + ' — Aniplace';
            }else{
              if(parseInt(this.$route.params.temporada) > 1){
                document.title = this.episodio.anime.nome + ' - ' + this.$route.params.temporada + 'ª Temporada, episódio ' + this.$route.params.numero + ' — Aniplace';
              }else{
                document.title = this.episodio.anime.nome + ' - Episódio ' + this.$route.params.numero + ' — Aniplace';
              }
            }
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
    proximo() {
      // Remove o último episódio da temporada atual e armazena em proximoEp
      let proximoEp = this.episodio.temporadas[this.episodio.temporada - 1].episodios.pop();

      // Verifica se o número do próximo episódio é maior que o número do episódio atual
      if (this.episodio.numero < proximoEp.numero) {
        // Vai para o próximo episódio na mesma temporada
        this.goEpisodio(this.episodio.temporada, this.episodio.numero + 1 + this.episodio.duplo);
      } else {
        // Se o número do próximo episódio não for maior que o número do episódio atual
        // Verifica se há uma temporada seguinte
        if (this.episodio.temporada + 1 <= this.episodio.temporadas.length) {
          // Verifica se o tipo do anime é maior que 1
          if (this.episodio.anime.tipo > 1) {
            // Vai para o primeiro episódio da próxima temporada
            this.goEpisodio(this.episodio.temporada + 1, this.episodio.temporadas[this.episodio.temporada].episodios[0].numero);
          } else {
            // Vai para o primeiro episódio da próxima temporada
            this.goEpisodio(this.episodio.temporada + 1, 1);
          }
        }
      }
    },
    anterior() {
      // Verifica se o tipo do anime é maior que 1
      if (this.episodio.anime.tipo > 1) {
        // Verifica se a temporada é maior que 1
        if (this.episodio.temporada > 1) {
          // Verifica se o número do episódio é maior que o primeiro episódio da temporada atual
          if (this.episodio.numero > this.episodio.temporadas[this.episodio.temporada - 1].episodios[0].numero) {
            // Itera sobre os episódios da temporada atual
            for (let i = 0; i < this.episodio.temporadas[this.episodio.temporada - 1].episodios.length; i++) {
              // Verifica se o número do episódio atual é igual ao número do episódio desejado
              if (this.episodio.temporadas[this.episodio.temporada - 1].episodios[i].numero === this.episodio.numero) {
                // Chama a função goEpisodio com a temporada atual e o número do episódio anterior
                this.goEpisodio(this.episodio.temporada, this.episodio.temporadas[this.episodio.temporada - 1].episodios[i - 1].numero);
                break;
              }
            }
          } else {
            // Se o número do episódio não for maior que o primeiro episódio da temporada,
            // vai para o último episódio da temporada anterior
            this.goEpisodio(this.episodio.temporada - 1, this.episodio.temporadas[this.episodio.temporada - 2].episodios.pop().numero);
          }
        } else {
          // Se a temporada não for maior que 1, vai para o episódio anterior na mesma temporada
          for (let i = 0; i < this.episodio.temporadas[this.episodio.temporada - 1].episodios.length; i++) {
            if (this.episodio.temporadas[this.episodio.temporada - 1].episodios[i].numero === this.episodio.numero) {
              this.goEpisodio(this.episodio.temporada, this.episodio.temporadas[this.episodio.temporada - 1].episodios[i - 1].numero);
              break;
            }
          }
        }
      } else {
        // Se o tipo do anime não for maior que 1
        if (this.episodio.numero > 1) {
          // Vai para o episódio anterior na mesma temporada
          for (let i = 0; i < this.episodio.temporadas[this.episodio.temporada - 1].episodios.length; i++) {
            if (this.episodio.temporadas[this.episodio.temporada - 1].episodios[i].numero === this.episodio.numero) {
              this.goEpisodio(this.episodio.temporada, this.episodio.temporadas[this.episodio.temporada - 1].episodios[i].numero - 1 - this.episodio.temporadas[this.episodio.temporada - 1].episodios[i - 1].duplo);
              break;
            }
          }
        } else {
          // Se o número do episódio for 1
          if (this.episodio.temporada - 1 >= 1) {
            // Vai para o último episódio da temporada anterior
            this.goEpisodio(this.episodio.temporada - 1, this.episodio.temporadas[this.episodio.temporada - 2].totalEpisodios);
          }
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
        capa: null,
        tipo: null
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

<style src="@/components/EpisodioPage/style.css" scoped/>