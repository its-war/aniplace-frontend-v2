<template>
  <div class="anime-container" v-if="!animeSelecionado">
    <div class="anime-busca">
      <div style="width: 50%; margin: auto">
        <v-text-field variant="outlined"
                      density="comfortable"
                      label="Busque o anime pelo nome..."
                      append-inner-icon="mdi-magnify"
                      @keyup="pesquisar"
                      v-model="busca.text"/>
      </div>
      <v-progress-linear v-if="busca.loading" color="info" :indeterminate="true"></v-progress-linear>
    </div>
    <div class="results">
      <div v-for="(anime, i) in busca.result" :key="i" style="width: 25%; padding: 10px; display: inline-block">
        <v-card class="box-anime" width="100%" @click="selecionarAnime(anime.idAnime)">
          <v-card-text>
            <div class="img" style="width: 100%">
              <v-img style="border-radius: 5px" :src="$getImg(anime.capa, 'anime/capa')" aspect-ratio="16/9" :cover="true"/>
            </div>
            <div class="anime-dados" style="margin-top: 10px">
              <h3 style="text-align: center">{{$limitarTexto(anime.nome, 25)}}</h3>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>

  <div class="episodio-container" v-if="animeSelecionado">
    <div class="anime-info" style="width: 100%;">
      <v-card width="50%" style="margin: 15px auto">
        <v-card-title style="text-align: center">
          Editar Episódios
          <v-btn @click="goBack" :flat="true" icon="mdi-close" style="position: absolute; top: 0; right: 0"></v-btn>
        </v-card-title>
        <v-card-text v-if="loadingPage" style="display: flex; justify-content: center;">
          <v-progress-circular indeterminate size="80" color="info"/>
        </v-card-text>
        <v-card-text v-else style="display: grid; grid-template-areas: 'img title'; grid-template-columns: 30% 70%">
          <div class="img" style="grid-area: img">
            <v-img :src="$getImg(anime.foto, 'anime/foto')"
                   :cover="true"
                   aspect-ratio="9/16"
                   style="border-radius: 5px"/>
          </div>
          <div class="dados" style="grid-area: title; padding: 15px">
            <h2>{{$limitarTexto(anime.nome, 25)}}</h2>
            <h4 v-if="anime.nomeAlternativo" style="font-style: italic">{{anime.nomeAlternativo}}</h4>
            <span>{{anime.ano}} — {{anime.status === 1 ? 'Completo' : 'Em Lançamento'}}</span>
            <span v-if="animeNota">
              <v-icon style="margin-left: 4px" color="yellow" icon="mdi-star"></v-icon>{{animeNota ? parseFloat(animeNota).toFixed(2) : false}}
            </span>
            <span v-if="temporadas.length === 1" style="margin-left: 4px">— <strong style="color: deepskyblue">{{temporadas.length}} Temporada</strong></span>
            <span v-if="temporadas.length > 1" style="margin-left: 4px">— <strong style="color: deepskyblue">{{temporadas.length}} Temporadas</strong></span>
            <v-chip-group>
              <v-chip v-for="(genero, i) in anime.generos" :key="i">{{genero.nome}}</v-chip>
            </v-chip-group>
          </div>
        </v-card-text>
      </v-card>

      <div class="form-editar-episodio" style="width: 80%; margin: 15px auto">
        <v-select label="Selecione a Temporada"
                  variant="outlined"
                  :items="selectTemporadas"
                  item-value="value"
                  v-model="temporadaSelecionada"
                  item-title="title"></v-select>

        <v-select label="Selecione o Episódio"
                  variant="outlined"
                  v-if="temporadaSelecionada"
                  :items="selectEpisodios"
                  item-value="value"
                  v-model="episodioSelecionado"
                  v-on:update:modelValue="listarEpisodio"
                  item-title="title"></v-select>

        <v-text-field label="Link do episódio"
                      v-if="episodio.idEpisodio"
                      v-model="episodio.link"
                      variant="outlined"
                      append-inner-icon="mdi-close"
                      v-on:click:appendInner="episodio.link = ''"
                      :loading="episodio.loading"></v-text-field>

        <v-checkbox v-if="episodio.idEpisodio" v-model="episodio.ova" label="Marque essa caixa se o episódio for um OVA." color="red"/>

        <v-btn :disabled="episodio.link === episodio.copia && episodio.ova === episodio.ovaCopia" @click="atualizarEpisodio" :loading="loading" append-icon="mdi-send" variant="outlined" text="Atualizar Episódio" color="success"></v-btn>
      </div>
    </div>
    <v-snackbar v-model="snackbar">
      {{snackbarText}}
      <template v-slot:actions>
        <v-btn @click="snackbar = false" text="Ok" color="pink"/>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "EditarEpisodioComponent",
  data: () => ({
    busca: {
      text: '',
      result: [],
      totalResults: 0,
      pagina: 1,
      loading: false
    },
    animeSelecionado: null,
    temporadaSelecionada: null,
    episodioSelecionado: null,
    loadingPage: false,
    anime: {
      idAnime: 0,
      nome: '',
      capa: ''
    },
    animeNota: null,
    snackbar: false,
    temporadas: [],
    snackbarText: '',
    episodio: {
      idEpisodio: null,
      loading: true,
      link: '',
      numero: null,
      temporada: null,
      copia: '',
      ova: false,
      ovaCopia: false
    },
    loading: false
  }),
  methods: {
    pesquisar(){
      if(this.busca.text.length > 0){
        this.busca.pagina = 1;
        this.busca.loading = true;
        this.axios.get('anime/pesquisa', {
          params: {
            texto: this.busca.text,
            pagina: this.busca.pagina
          }
        }).then((response) => {
          this.busca.result = response.data.animes;
          this.busca.totalResults = response.data.total;
        }).finally(() => {
          this.busca.loading = false;
        });
      }else{
        this.busca.result = [];
        this.busca.pagina = 1;
      }
    },
    selecionarAnime(idAnime){
      this.animeSelecionado = idAnime;
      this.carregarAnime();
    },
    goBack(){
      this.animeSelecionado = null;
      this.temporadaSelecionada = null;
      this.episodioSelecionado = null;
      this.episodio = {
        idEpisodio: null,
        loading: true,
        link: '',
        numero: null,
        temporada: null,
        copia: ''
      }
    },
    carregarAnime(){
      this.axios.get('anime/listar', {
        params: {
          id: this.animeSelecionado,
          pagina: 1,
          campos: 'idAnime, nome, capa'
        }
      }).then((response) => {
        this.anime = response.data[0];
      }).finally(() => {
        this.loadingPage = false;
      });

      this.axios.get('rating/getAnimeNota', {
        params: {
          idAnime: this.animeSelecionado
        }
      }).then((response) => {
        this.animeNota = response.data.nota;
      });

      this.getTemporadas();
    },
    getTemporadas(){
      this.axios.get('episodio/hasTemporada', {
        params: {
          idAnime: this.animeSelecionado
        }
      }).then((response) => {
        this.temporadas = response.data.numeroTemporadas;
      });
    },
    listarEpisodio(){
      this.axios.get('admin/episodio/listarById', {
        params: {
          idAnime: this.animeSelecionado,
          temporada: this.temporadaSelecionada,
          numero: this.episodioSelecionado
        }
      }).then((response) => {
        this.episodio.idEpisodio = response.data.episodio.idEpisodio;
        this.episodio.numero = response.data.episodio.numero;
        this.episodio.temporada = response.data.episodio.temporada;
        this.episodio.link = response.data.episodio.linkOnline;
        this.episodio.copia = response.data.episodio.linkOnline;
        this.episodio.ova = response.data.episodio.ova;
        this.episodio.ovaCopia = response.data.episodio.ova;
      }).finally(() => {
        this.episodio.loading = false;
      });
    },
    atualizarEpisodio(){
      if(this.episodio.link !== this.episodio.copia && this.episodio.link.length > 0 || this.episodio.ova !== this.episodio.ovaCopia){
        this.loading = true;
        this.axios.post('admin/episodio/atualizar', {
          idEpisodio: this.episodio.idEpisodio,
          link: this.episodio.link,
          ova: this.episodio.ova
        }).then((response) => {
          if(response.data.update){
            this.episodio.copia = this.episodio.link;
            this.episodio.ovaCopia = this.episodio.ova;
            this.snackbarText = 'Episódio atualizado com sucesso.';
          }else{
            this.snackbarText = 'Erro ao atualizar episódio.';
          }
        }).finally(() => {
          this.loading = false;
          this.snackbar = true;
        });
      }else{
        this.snackbarText = 'Campo do link está vazio.';
        this.snackbar = true;
      }
    }
  },
  computed: {
    selectTemporadas(){
      let temps = [];
      for(let i = 0; i < this.temporadas.length; i++){
        temps.push({value: i + 1, title: i + 1 + `ª Temporada`});
      }
      return temps;
    },
    selectEpisodios(){
      let eps = [];
      for(let e = 0; e < this.temporadas[this.temporadaSelecionada - 1].numeroEpisodios; e++){
        eps.push({value: e + 1, title: `Episódio ${e + 1}`});
      }
      return eps;
    }
  },
  mounted() {
    if(this.$route.params.idAnime){
      this.selecionarAnime(this.$route.params.idAnime);
    }
  }
}
</script>

<style scoped>

</style>