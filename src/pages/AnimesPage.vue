<template>
  <v-main>
    <v-sheet width="100%" style="padding: 25px 50px" :style="isMobile?'padding: 15px 10px':''">
      <div class="d-flex" style="width: 100%; align-items: center; padding-left: 45px" :style="isMobile?'padding-left: 0':'width: 400px'">
        <v-text-field
            style="margin-right: 15px; margin-top: 22px"
            color="red"
            density="compact"
            variant="solo-filled"
            label="pesquisar..."
            v-model="pesquisaSimples.texto"
            append-inner-icon="mdi-magnify">
        </v-text-field>
        <v-btn style="margin-right: 3px" :size="isMobile?'x-small':'default'" variant="tonal" append-icon="mdi-format-list-bulleted">
          Filtros

          <v-dialog v-model="filtrosDialog" activator="parent" width="85%" :scrollable="true">
            <v-card width="100%" style="padding: 15px; border-radius: 10px">
              <v-card-text>
                <h3>Pesquisa Avançada</h3>
                <v-btn @click="filtrosDialog = false" variant="text" icon="mdi-close" style="position: absolute; top: 0; right: 0"></v-btn>
                <div class="letras">
                  <v-btn @click="clickLetra(26)" id="letra26" class="btn-letra" icon variant="tonal" :size="isMobile?'x-small':'small'">#</v-btn>
                  <v-btn @click="clickLetra(i)" class="btn-letra" v-for="(letter, i) in alphabet" icon :key="i" :id="'letra' + i" variant="tonal" :size="isMobile?'x-small':'small'">{{letter}}</v-btn>
                </div>
                <v-row :no-gutters="true" style="margin-top: 5px">
                  <v-col cols="12" sm="3" style="padding-right: 5px">
                    <span :style="isMobile?'font-size: 12px;':''">Ano de Lançamento</span>
                    <v-combobox :density="isMobile?'compact':'default'" v-model="filtros.ano" :clearable="true" variant="solo-filled" :items="arrayAnos" item-title="title" item-value="value"></v-combobox>
                  </v-col>
                  <v-col cols="12" sm="3" style="padding-right: 5px">
                    <span :style="isMobile?'font-size: 12px;':''">Disponibilidade</span>
                    <v-select :density="isMobile?'compact':'default'" v-model="filtros.disponibilidade" variant="solo-filled" :items="[{value: 1, title: 'Todos'}, {value: 2, title: 'Online'}, {value: 3, title: 'Download'}]"
                              item-value="value"
                              item-title="title"></v-select>
                  </v-col>
                  <v-col cols="12" sm="3" style="padding-right: 5px">
                    <span :style="isMobile?'font-size: 12px;':''">Áudio</span>
                    <v-select :density="isMobile?'compact':'default'" v-model="filtros.audio" variant="solo-filled" :items="[{value: 1, title: 'Todos'}, {value: 2, title: 'Original (com legenda)'}, {value: 3, title: 'Dublado'}]"></v-select>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <span :style="isMobile?'font-size: 12px;':''">Status</span>
                    <v-select :density="isMobile?'compact':'default'" v-model="filtros.pesquisaStatus" variant="solo-filled" item-title="title" item-value="value" :items="[{ value: 0, title: 'Todos' }, { value: 1, title: 'Completo' }, { value: 2, title: 'Em Lançamento' }, { value: 3, title: 'Aguardando Lançamento' }]"></v-select>
                  </v-col>
                </v-row>
                <div class="generos">
                  <span>Gêneros</span>
                  <v-chip-group :multiple="true" v-model="filtros.generos" selected-class="text-red">
                    <v-chip :size="isMobile?'x-small':'default'" v-for="(genero, i) in generos" :key="i" :value="genero.idGenero">{{genero.nome}}</v-chip>
                  </v-chip-group>
                </div>
              </v-card-text>
              <v-card-actions v-if="isMobile">
                <v-spacer/>
                <v-btn :size="isMobile?'x-small':'default'" append-icon="mdi-close" variant="text" color="red" @click="filtrosDialog = false">Cance.</v-btn>
                <v-btn :size="isMobile?'x-small':'default'" append-icon="mdi-refresh" variant="text" color="blue" @click="limparFiltros">Limpar</v-btn>
                <v-btn :size="isMobile?'x-small':'default'" :loading="searchLoading" append-icon="mdi-magnify" variant="text" color="green" @click="pesquisaAvancada">Pesquisar</v-btn>
              </v-card-actions>
              <v-card-actions v-else>
                <v-spacer/>
                <v-btn append-icon="mdi-close" variant="text" color="red" @click="filtrosDialog = false">Cancelar</v-btn>
                <v-btn append-icon="mdi-refresh" variant="text" color="blue" @click="limparFiltros">Limpar Filtros</v-btn>
                <v-btn :loading="searchLoading" append-icon="mdi-magnify" variant="text" color="green" @click="pesquisaAvancada">Pesquisar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-btn>
        <v-btn v-if="filtros.enabled || pesquisaSimples.enabled" :size="isMobile?'x-small':'default'" variant="tonal" append-icon="mdi-delete" @click="resetarBuscas">Limpar</v-btn>
      </div>

      <!-- ### Animes no mobile ### -->
      <div v-if="isMobile" class="animes-main">
        <div v-if="pageLoading" class="loading-animes" style="margin: auto; width: 50%; text-align: center">
          <v-progress-circular indeterminate color="red" size="70"/>
        </div>
        <div :style="{ width: getAnimeWidth }" class="anime-item" v-for="(anime, i) in getAnimes" :key="i">
          <img @click="goAnime(anime.idAnime)" :src="$getImg(anime.foto, 'anime/foto')" :alt="anime.nome"/>
          <v-tooltip :text="anime.nome" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime(anime.idAnime)" v-bind="props">{{this.$limitarTexto(anime.nome, 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
      </div>

      <!-- ### Animes no desktop ### -->
      <div v-else class="animes-main">
        <div v-if="pageLoading" class="loading-animes" style="margin: auto; width: 50%; text-align: center">
          <v-progress-circular indeterminate color="red" size="70"/>
        </div>
        <div :style="{ width: getAnimeWidth + 'px', height: getAnimeHeight + 'px' }" v-for="(anime, i) in getAnimes" :key="i" style="padding: 5px;">
          <div class="container noselect" @click.left="goAnime(anime.idAnime)" @click.middle.prevent="abrirNovaAba('/anime/' + anime.idAnime)">
            <div class="canvas">
              <div class="tracker tr-1"></div>
              <div class="tracker tr-2"></div>
              <div class="tracker tr-3"></div>
              <div class="tracker tr-4"></div>
              <div class="tracker tr-5"></div>
              <div class="tracker tr-6"></div>
              <div class="tracker tr-7"></div>
              <div class="tracker tr-8"></div>
              <div class="tracker tr-9"></div>
              <div class="tracker tr-10"></div>
              <div class="tracker tr-11"></div>
              <div class="tracker tr-12"></div>
              <div class="tracker tr-13"></div>
              <div class="tracker tr-14"></div>
              <div class="tracker tr-15"></div>
              <div class="tracker tr-16"></div>
              <div class="tracker tr-17"></div>
              <div class="tracker tr-18"></div>
              <div class="tracker tr-19"></div>
              <div class="tracker tr-20"></div>
              <div class="tracker tr-21"></div>
              <div class="tracker tr-22"></div>
              <div class="tracker tr-23"></div>
              <div class="tracker tr-24"></div>
              <div class="tracker tr-25"></div>
              <div id="card" :style="`background: url('${$getImg(anime.foto, 'anime/foto')}'); background-size: cover;`">
                <div class="title">{{anime.nome}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center">
        <v-pagination
            v-show="!filtros.enabled && !pesquisaSimples.enabled"
            v-model="paginator.pagina"
            :length="paginator.total"
            :total-visible="7"
            color="red"
        ></v-pagination>
        <v-pagination
            v-show="filtros.enabled"
            v-model="paginatorSearch.pagina"
            :length="paginatorSearch.total"
            :total-visible="7"
            color="red"
        ></v-pagination>
        <v-pagination
            v-show="pesquisaSimples.enabled"
            v-model="pesquisaSimples.pagina"
            :length="pesquisaSimples.total"
            :total-visible="7"
            color="red"
        ></v-pagination>
        <AdsComponent/>
      </div>
    </v-sheet>
  </v-main>
</template>

<script>
import config from "../../config";
import AdsComponent from "@/components/globalComponents/AdsComponent.vue";

export default {
  name: "AnimesPage",
  components: { AdsComponent },
  data: () => ({
    filtrosDialog: false,
    filtros: {
      letra: null,
      ano: null,
      generos: null,
      disponibilidade: null,
      audio: null,
      pesquisaStatus: null,
      enabled: false
    },
    alphabet: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    arrayAnos: [
      {
        value: 0,
        title: 'Todos'
      }
    ],
    disponibilidade: 'Todos',
    audio: 'Todos',
    pesquisaStatus: 'Todos',
    generos: [
      {
        idGenero: null,
        nome: null
      }
    ],
    letraAtual: -5,
    paginator: {
      animes: [],
      pagina: 1,
      total: 0
    },
    paginatorSearch: {
      animes:[],
      pagina: 1,
      total: 0
    },
    pesquisaSimples: {
      animes: [],
      pagina: 1,
      total: 0,
      enabled: false,
      texto: ''
    },
    searchLoading: false,
    pageLoading: false
  }),
  methods: {
    clickLetra(numeroLetra){
      if(numeroLetra === this.letraAtual){
        this.removerSelecaoLetra();
      }else{
        let btnLetra = document.getElementById('letra' + numeroLetra);
        this.removerSelecaoLetra();
        btnLetra.setAttribute('style', 'color: red;');
        this.filtros.letra = numeroLetra >= 26 ? '#' : this.alphabet[numeroLetra];
        this.letraAtual = numeroLetra;
      }
    },
    removerSelecaoLetra(){
      for(let i = 0; i < 27; i++){
        document.getElementById('letra' + i)?.setAttribute('style', '');
      }
      this.filtros.letra = null;
    },
    limparFiltros(){
      this.filtros = {
        letra: null,
        ano: null,
        generos: null,
        disponibilidade: null,
        audio: null,
        pesquisaStatus: null
      };
      this.removerSelecaoLetra();
    },
    goAnime(id){
      this.$router.push({name: 'Anime', params: {id: id}});
    },
    abrirNovaAba(path = '/'){
      const apiUrl = import.meta.env.MODE === 'production' ? config.production : config.development;
      window.open(apiUrl + path, '_blank');
    },
    pullData(){
      this.paginator.animes = [];
      this.pageLoading = true;
      this.axios.get('anime/listar?pagina=' + this.paginator.pagina).then((value) => {
        if(value.data){
          this.paginator.animes = value.data.animes;
          this.paginator.total = value.data.total;
        }
      }).finally(() => {
        this.pageLoading = false;
      });
    },
    listarGeneros(){
      this.axios.get('anime/listarGeneros').then((value) => {
        this.generos = value.data.generos;
      });
    },
    pesquisaAvancada(){
      this.searchLoading = true;
      let conditions = [];
      let strQuery = 'anime/pesquisaAvancada?';

      if(this.filtros.letra){
        conditions.push('letra=' + this.filtros.letra);
      }
      if(this.filtros.ano){
        conditions.push('ano=' + this.filtros.ano.value);
      }
      if(this.filtros.generos){
        conditions.push('generos=' + this.filtros.generos.join(','));
      }
      if(this.filtros.pesquisaStatus){
        console.log(this.filtros.pesquisaStatus);
        conditions.push('status=' + this.filtros.pesquisaStatus);
      }
      if(this.filtros.audio){
        conditions.push('audio=' + this.filtros.audio);
      }
      if(this.filtros.disponibilidade){
        conditions.push('disponibilidade=' + this.filtros.disponibilidade);
      }

      conditions.push('pagina=' + this.paginatorSearch.pagina);
      strQuery = strQuery + conditions.join('&');

      this.axios.get(strQuery).then((value) => {
        if(!value.data.error){
          this.paginatorSearch.animes = value.data.animes;
          this.paginatorSearch.total = value.data.total;
          this.filtros.enabled = true;
          this.paginatorSearch.pagina = 1;
          this.paginator.pagina = 1;
          this.filtrosDialog = false;
        }
      }).finally(() => {
        this.searchLoading = false;
      });
    },
    resetarBuscas(){
      this.limparFiltros();

      this.paginatorSearch.pagina = 1;
      this.paginatorSearch.animes = [];
      this.paginatorSearch.total = 0;
      this.filtros.enabled = false;

      this.pesquisaSimples.enabled = false;
      this.pesquisaSimples.animes = [];
      this.pesquisaSimples.pagina = 1;
      this.pesquisaSimples.total = 1;
      this.pesquisaSimples.texto = '';

      this.paginator.pagina = 1;
    },
    pesquisarPorTexto(){
      if(this.pesquisaSimples.texto.length){
        this.axios.get('anime/pesquisa?texto=' + this.pesquisaSimples.texto + '&pagina=' + this.pesquisaSimples.pagina).then((value) => {
          this.pesquisaSimples.animes = value.data.animes;
          this.pesquisaSimples.total = value.data.total;
          this.pesquisaSimples.enabled = true;
        });
      }
    }
  },
  mounted() {
    this.paginator.pagina = parseInt(this.$route.params.pagina);

    this.listarGeneros();

    if(this.$route.query.text){
      this.pesquisaSimples.texto = this.$route.query.text;
    }

    this.pullData();

    for(let i = 1990; i <= new Date().getFullYear(); i++){
      this.arrayAnos.push({
        value: i,
        title: i.toString()
      });
    }
  },
  watch: {
    'paginator.pagina'(newValue){
      this.$router.push({name: 'Animes', params: {pagina: newValue}});
    },
    '$route.params.pagina'(){
      this.pullData();
    },
    'pesquisaSimples.pagina'(){
      this.pesquisarPorTexto();
    },
    'pesquisaSimples.texto'(){
      if(this.pesquisaSimples.texto){
        this.pesquisarPorTexto();
      }
    },
    '$route.query.text'(newValue){
      this.pesquisaSimples.texto = newValue;
    }
  },
  computed: {
    getAnimeWidth(){
      if(this.isMobile){
        let largura = this.$vuetify.display.width;
        if(largura > 400){
          return '33.33%';
        }else{
          return '50%';
        }
      }else{
        let el = document.querySelector('.animes-main');
        let maxWidth = el.offsetWidth;
        let width = 0;
        let screen = this.$vuetify.display.width;
        if(screen >= 1300){
          width = maxWidth / 7;
        }else if(screen >= 1000){
          width = maxWidth / 6;
        }else if(screen >= 700){
          width = maxWidth / 5;
        }else if(screen >= 300){
          width = maxWidth / 4;
        }else{
          width = maxWidth / 3;
        }
        return width;
      }
    },
    getAnimeHeight(){
      return 1280 * this.getAnimeWidth / 900;
    },
    getAnimes(){
      if(this.filtros.enabled){
        return this.paginatorSearch.animes;
      }else if(this.pesquisaSimples.enabled){
        return this.pesquisaSimples.animes;
      }else{
        return this.paginator.animes;
      }
    },
    isMobile(){
      return this.$store.main.isMobile;
    }
  }
}
</script>

<style scoped>
.animes-main {
  padding: 20px 30px;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.anime-item {
  /*width: 33.33%;*/
  border-radius: 10px;
  transition: 300ms;
  padding: 15px;
  -ms-transition: 300ms;
}

.anime-item h3 {
  text-align: center;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: #434343;
  font-size: 2vh;
  font-weight: lighter;
}

.anime-item img {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  width: 100%;
}

.anime-item:hover {
  transform: scale(1.1);
  -ms-transform: scale(1.1);
}

.letras {
  margin: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  text-align: center;
  align-items: center;
  justify-items: center;
}

.btn-letra {
  margin: 5px;
  border-radius: 10px;
}

/* Efeito do Canvas */
/*works janky on mobile :<*/
.container {
  position: relative;
  /*width: 200px;
  height: 284.44px;
  height: v-bind();*/
  width: 100%;
  height: 100%;
  transition: 200ms;
}

#card {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  transition: 700ms;
  /*background: linear-gradient(43deg, rgb(65, 88, 208) 0%, rgb(200, 80, 192) 46%, rgb(255, 204, 112) 100%);*/
}

.subtitle {
  transform: translateY(160px);
  color: rgb(134, 110, 221);
  text-align: center;
  width: 100%;
}

.title {
  opacity: 0;
  transition-duration: 300ms;
  transition-timing-function: ease-in-out-out;
  transition-delay: 100ms;
  position: absolute;
  font-size: large;
  font-weight: bold;
  color: white;
  padding: 3px;
  text-align: center;
}

.tracker:hover ~ #card .title {
  opacity: 1;
}

#prompt {
  bottom: 8px;
  left: 12px;
  z-index: 20;
  font-size: 20px;
  font-weight: bold;
  transition: 300ms ease-in-out-out;
  position: absolute;
  max-width: 110px;
  color: rgb(255, 255, 255);
}

.tracker {
  position: absolute;
  z-index: 200;
  width: 100%;
  height: 100%;
}

.tracker:hover {
  cursor: pointer;
}

.tracker:hover ~ #card #prompt {
  opacity: 0;
}

.tracker:hover ~ #card {
  transition: 300ms;
  filter: brightness(1.1);
}

.container:hover #card::before {
  transition: 200ms;
  content: '';
  opacity: 80%;
}

.canvas {
  perspective: 800px;
  inset: 0;
  z-index: 200;
  position: absolute;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas: "tr-1 tr-2 tr-3 tr-4 tr-5"
    "tr-6 tr-7 tr-8 tr-9 tr-10"
    "tr-11 tr-12 tr-13 tr-14 tr-15"
    "tr-16 tr-17 tr-18 tr-19 tr-20"
    "tr-21 tr-22 tr-23 tr-24 tr-25";
}

#card::before {
  content: '';
  background: linear-gradient(43deg, rgb(146, 146, 146) 0%, rgb(8, 8, 8) 46%, rgb(117, 117, 117) 100%);
  filter: blur(2rem);
  opacity: 30%;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  transition: 200ms;
}

.tr-1 {
  grid-area: tr-1;
}

.tr-2 {
  grid-area: tr-2;
}

.tr-3 {
  grid-area: tr-3;
}

.tr-4 {
  grid-area: tr-4;
}

.tr-5 {
  grid-area: tr-5;
}

.tr-6 {
  grid-area: tr-6;
}

.tr-7 {
  grid-area: tr-7;
}

.tr-8 {
  grid-area: tr-8;
}

.tr-9 {
  grid-area: tr-9;
}

.tr-10 {
  grid-area: tr-10;
}

.tr-11 {
  grid-area: tr-11;
}

.tr-12 {
  grid-area: tr-12;
}

.tr-13 {
  grid-area: tr-13;
}

.tr-14 {
  grid-area: tr-14;
}

.tr-15 {
  grid-area: tr-15;
}

.tr-16 {
  grid-area: tr-16;
}

.tr-17 {
  grid-area: tr-17;
}

.tr-18 {
  grid-area: tr-18;
}

.tr-19 {
  grid-area: tr-19;
}

.tr-20 {
  grid-area: tr-20;
}

.tr-21 {
  grid-area: tr-21;
}

.tr-22 {
  grid-area: tr-22;
}

.tr-23 {
  grid-area: tr-23;
}

.tr-24 {
  grid-area: tr-24;
}

.tr-25 {
  grid-area: tr-25;
}

.tr-1:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(20deg) rotateY(-10deg) rotateZ(0deg);
}

.tr-2:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(20deg) rotateY(-5deg) rotateZ(0deg);
}

.tr-3:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(20deg) rotateY(0deg) rotateZ(0deg);
}

.tr-4:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(20deg) rotateY(5deg) rotateZ(0deg);
}

.tr-5:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(20deg) rotateY(10deg) rotateZ(0deg);
}

.tr-6:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(10deg) rotateY(-10deg) rotateZ(0deg);
}

.tr-7:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(10deg) rotateY(-5deg) rotateZ(0deg);
}

.tr-8:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(10deg) rotateY(0deg) rotateZ(0deg);
}

.tr-9:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(10deg) rotateY(5deg) rotateZ(0deg);
}

.tr-10:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(10deg) rotateY(10deg) rotateZ(0deg);
}

.tr-11:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(0deg) rotateY(-10deg) rotateZ(0deg);
}

.tr-12:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(0deg) rotateY(-5deg) rotateZ(0deg);
}

.tr-13:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
}

.tr-14:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(0deg) rotateY(5deg) rotateZ(0deg);
}

.tr-15:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(0deg) rotateY(10deg) rotateZ(0deg);
}

.tr-16:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(-10deg) rotateY(-10deg) rotateZ(0deg);
}

.tr-17:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(-10deg) rotateY(-5deg) rotateZ(0deg);
}

.tr-18:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(-10deg) rotateY(0deg) rotateZ(0deg);
}

.tr-19:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(-10deg) rotateY(5deg) rotateZ(0deg);
}

.tr-20:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(-10deg) rotateY(10deg) rotateZ(0deg);
}

.tr-21:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(-20deg) rotateY(-10deg) rotateZ(0deg);
}

.tr-22:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(-20deg) rotateY(-5deg) rotateZ(0deg);
}

.tr-23:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(-20deg) rotateY(0deg) rotateZ(0deg);
}

.tr-24:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(-20deg) rotateY(5deg) rotateZ(0deg);
}

.tr-25:hover ~ #card {
  transition: 125ms ease-in-out;
  transform: rotateX(-20deg) rotateY(10deg) rotateZ(0deg);
}

.noselect {
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Safari */
  /* Konqueror HTML */
  -moz-user-select: none;
  /* Old versions of Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently
                 supported by Chrome, Edge, Opera and Firefox */
}
</style>