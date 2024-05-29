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
          <AnimesPageImgComponent :mobile="true" :nome="anime.nome" :idAnime="anime.idAnime" :foto="anime.foto"/>
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
          <AnimesPageImgComponent :mobile="false" :nome="anime.nome" :idAnime="anime.idAnime" :foto="anime.foto"/>
        </div>
      </div>
      <div class="text-center">
        <div v-if="isFirebase">
          <v-btn prepend-icon="mdi-chevron-left" variant="text" text="Anterior" color="red" @click="firebasePreviousPage" :disabled="!firebasePaginator.hasPreviousPage || pageLoading"/>
          <span style="padding: 8px 18px; background-color: #ff5454; color: white; border-radius: 10px">{{firebasePaginator.pagina}}</span>
          <v-btn append-icon="mdi-chevron-right" variant="text" text="Próximo" color="red" @click="firebaseNextPage" :disabled="!firebasePaginator.hasNextPage || pageLoading"/>
        </div>
        <div v-else>
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
        </div>
        <AdsComponent/>
      </div>
    </v-sheet>
  </v-main>
</template>

<script>
import AdsComponent from "@/components/globalComponents/AdsComponent.vue";
import AnimesPageImgComponent from "@/pages/AnimesPageImgComponent.vue";

export default {
  name: "AnimesPage",
  inject: ['repository'],
  components: { AnimesPageImgComponent, AdsComponent },
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
      total: 0,
      enabled: false
    },
    pesquisaSimples: {
      animes: [],
      pagina: 1,
      total: 0,
      enabled: false,
      texto: ''
    },
    searchLoading: false,
    pageLoading: false,
    firebasePaginator: {
      hasNextPage: false,
      hasPreviousPage: false,
      pagina: 1
    }
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
    pullData(){
      if(this.paginatorSearch.enabled){
        this.pesquisaAvancada();
      }else{
        this.paginator.animes = [];
        this.pageLoading = true;
        if(this.isFirebase){
          this.repository.animes.getFirstPage(15, 'nome', 'asc').then((values) => {
            setTimeout(() => {
              this.firebasePaginator.hasNextPage = values.value.length > 15;
              this.paginator.animes = values.value.slice(0, 15);
              this.pageLoading = false;
            }, 5000);//TODO: corrigir valor do timeout depois
          }).catch(() => {
            this.pageLoading = false;
          });
        }else{
          this.axios.get('anime/listar?pagina=' + this.paginator.pagina).then((value) => {
            if(value.data){
              this.paginator.animes = value.data.animes;
              this.paginator.total = value.data.total;
            }
          }).finally(() => {
            this.pageLoading = false;
          });
        }
      }
    },
    listarGeneros(){
      if(this.isFirebase){
        this.repository.generos.getAll().then((values) => {
          this.generos = values;
        });
      }else{
        this.axios.get('anime/listarGeneros').then((value) => {
          this.generos = value.data.generos;
        });
      }
    },
    pesquisaAvancada(){
      this.searchLoading = true;
      this.paginatorSearch.enabled = true;
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
          // this.paginatorSearch.pagina = 1;
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
      this.paginatorSearch.enabled = false;

      this.pesquisaSimples.enabled = false;
      this.pesquisaSimples.animes = [];
      this.pesquisaSimples.pagina = 1;
      this.pesquisaSimples.total = 1;
      this.pesquisaSimples.texto = '';

      this.paginator.pagina = 1;
    },
    pesquisarPorTexto(){
      this.paginatorSearch.enabled = false;
      this.filtros.enabled = false;
      if(this.pesquisaSimples.texto.length){
        this.axios.get('anime/pesquisa?texto=' + this.pesquisaSimples.texto + '&pagina=' + this.pesquisaSimples.pagina).then((value) => {
          this.pesquisaSimples.animes = value.data.animes;
          this.pesquisaSimples.total = value.data.total;
          this.pesquisaSimples.enabled = true;
        });
      }
    },
    firebaseNextPage(){
      let lastItem = this.paginator.animes[this.paginator.animes.length - 1].nome;
      this.paginator.animes = [];
      this.firebasePaginator.pagina = this.firebasePaginator.pagina + 1;
      this.$router.push({name: 'Animes', params: {pagina: this.firebasePaginator.pagina}});
      this.pageLoading = true;
      this.repository.animes.getNextPage(
        lastItem,
        15
      ).then((animes) => {
        setTimeout(() => {
          this.firebasePaginator.hasNextPage = animes.value.length > 15;
          this.firebasePaginator.hasPreviousPage = true;
          this.paginator.animes = animes.value.slice(0, 15);
          this.pageLoading = false;
        }, 1000);
      }).catch(() => {
        this.pageLoading = false;
      });
    },
    firebasePreviousPage(){
      let firstItem = this.paginator.animes[0].nome;
      this.paginator.animes = [];
      this.firebasePaginator.pagina = this.firebasePaginator.pagina - 1;
      this.$router.push({name: 'Animes', params: {pagina: this.firebasePaginator.pagina}});
      this.pageLoading = true;
      this.repository.animes.getPreviousPage(
        firstItem,
        15
      ).then((animes) => {
        this.firebasePaginator.hasNextPage = true;
        this.firebasePaginator.hasPreviousPage = animes.length > 15;
        this.paginator.animes = animes.value.slice(-15);
      }).finally(() => {
        this.pageLoading = false;
      });
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
      if(!this.isFirebase){
        this.pullData();
      }
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
    },
    'paginatorSearch.pagina'(newValue){
      this.$router.push({name: 'Animes', params: {pagina: newValue}});
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
    },
    isFirebase(){
      return this.isFirebaseApiOrigin;
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
</style>