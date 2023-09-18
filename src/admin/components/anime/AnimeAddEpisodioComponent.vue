<template>
  <div class="episodio-container">
    <div class="anime-info" style="width: 100%;">
      <v-card width="50%" style="margin: 15px auto">
        <v-card-title style="text-align: center">
          Cadastrar Episódio
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
              <v-icon style="margin-left: 4px" color="yellow" icon="mdi-star"></v-icon>{{parseFloat(animeNota).toFixed(2)}}
            </span>
            <span v-if="temporadas.length === 1" style="margin-left: 4px">— <strong style="color: deepskyblue">{{temporadas.length}} Temporada</strong></span>
            <span v-if="temporadas.length > 1" style="margin-left: 4px">— <strong style="color: deepskyblue">{{temporadas.length}} Temporadas</strong></span>
            <v-chip-group>
              <v-chip v-for="(genero, i) in anime.generos" :key="i">{{genero.nome}}</v-chip>
            </v-chip-group>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <div class="temporada-formulario" style="width: 80%; margin: 20px auto">
      <h5>Obs: O sistema se encarrega de colocar o número do episódio, então certifique-se de cadastrar tudo de forma sequencial.</h5>
      <v-card>
        <v-card-text>
          <span v-if="temporadaSelecionada === 0" style="color: #007bff">* O sistema atribui automaticamente o número da nova temporada.</span>
          <v-select label="Selecione a Temporada"
                    variant="outlined"
                    item-value="value"
                    item-title="title"
                    style="margin-top: 5px"
                    v-model="temporadaSelecionada"
                    :items="selectTemporadas"/>
          <v-text-field label="Cole o link do episódio"
                      v-model="link"
                      variant="outlined"
                      density="comfortable"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="cadastrarEpisodio" :loading="loading" append-icon="mdi-send" variant="outlined" text="Cadastrar" color="success"></v-btn>
        </v-card-actions>
      </v-card>
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
  name: "AnimeAddEpisodioComponent",
  mounted() {
    this.axios.get('anime/listar', {
      params: {
        id: this.$route.params.idAnime,
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
        idAnime: this.$route.params.idAnime
      }
    }).then((response) => {
      this.animeNota = response.data.nota;
    });

    this.getTemporadas();
  },
  data: () => ({
    loadingPage: true,
    anime: {
      idAnime: 0,
      nome: '',
      capa: ''
    },
    animeNota: null,
    link: '',
    temporadas: [],
    loading: false,
    snackbar: false,
    snackbarText: '',
    temporadaSelecionada: null
  }),
  methods: {
    goBack(){
      this.$router.push({name: 'Selecionar Anime'});
    },
    getTemporadas(){
      this.axios.get('episodio/hasTemporada', {
        params: {
          idAnime: this.$route.params.idAnime
        }
      }).then((response) => {
        this.temporadas = response.data.numeroTemporadas;
      });
    },
    cadastrarEpisodio(){
      if((this.temporadaSelecionada || this.temporadaSelecionada === 0) && this.link.length > 0){
        this.loading = true;
        this.axios.post('admin/episodio/inserir', {
          idAnime: this.$route.params.idAnime,
          numero: this.temporadaSelecionada === 0 ? 1 : this.temporadas[this.temporadaSelecionada - 1].numeroEpisodios + 1,
          temporada: this.temporadaSelecionada === 0 ? this.temporadas.length + 1 : this.temporadaSelecionada,
          link1080p: this.link,
          link720p: this.link,
          linkOnline: this.link,
        }).then((response) => {
          if(response.data.cadastro){
            this.snackbarText = 'Episódio cadastrado com sucesso.';
            this.link = '';
            this.temporadaSelecionada = null;
          }else{
            this.snackbarText = 'Erro ao cadastrar. Tente novamente.';
          }
        }).finally(() => {
          this.snackbar = true;
          this.loading = false;
          this.getTemporadas();
        });
      }else{
        this.snackbarText = 'Algum campo está vázio.';
        this.snackbar = true;
      }
    }
  },
  computed: {
    selectTemporadas(){
      let temps = [];
      for(let i = 0; i < this.temporadas.length; i++){
        temps.push({value: i + 1, title: i + 1 + `ª Temporada (${this.temporadas[i].numeroEpisodios} episódios)`});
      }
      temps.push({value: 0, title: 'Nova Temporada'});
      return temps;
    }
  }
}
</script>

<style scoped>

</style>