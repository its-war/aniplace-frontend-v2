<template>
  <div class="anime-container">
    <div class="anime-busca">
      <div style="width: 50%; margin: auto">
        <v-text-field variant="outlined"
                      density="comfortable"
                      label="Busque o anime pelo nome..."
                      append-inner-icon="mdi-magnify"
                      @keyup="pesquisar"
                      v-model="busca.text"/>
        <v-radio-group inline v-model="selected">
          <v-radio label="Cadastrar Episódio" :value="1" color="info"></v-radio>
          <v-spacer/>
          <v-radio label="Cadastrar Temporada Completa" :value="2" color="info"></v-radio>
        </v-radio-group>
      </div>
      <v-progress-linear v-if="busca.loading" color="info" :indeterminate="true"></v-progress-linear>
    </div>
    <div class="results">
      <div v-for="(anime, i) in busca.result" :key="i" style="width: 25%; padding: 10px; display: inline-block">
        <v-card class="box-anime" width="100%" @click="goCadTemporada(anime.idAnime)">
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
</template>

<script>
export default {
  name: "AnimeAddTemporadaComponent",
  data: () => ({
    busca: {
      text: '',
      result: [],
      totalResults: 0,
      pagina: 1,
      loading: false
    },
    selected: 1
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
    goCadTemporada(idAnime){
      if(this.selected === 1){
        this.$router.push({name: 'Cadastrar Episódio', params: {idAnime: idAnime}});
      }else{
        this.$router.push({name: 'Cadastrar Temporada', params: {idAnime: idAnime}});
      }
    }
  }
}
</script>

<style scoped>
.anime-container {
  padding: 15px;
}

.anime-busca {
  width: 100%;
}

.results {
  width: 100%;
}

.box-anime {
  display: inline-block;
  transition: 150ms ease-in-out;
}

.box-anime:hover {
  transform: scale(1.05);
}
</style>