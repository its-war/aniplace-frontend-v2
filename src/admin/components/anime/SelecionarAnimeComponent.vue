<template>
  <div class="anime-container">
    <div class="anime-busca" v-show="!busca.oculto">
      <div style="width: 50%; margin: auto">
        <h3 style="margin-bottom: 5px" v-if="$props.opcao === 2">Selecione o anime que deseja destacar na tela inicial</h3>
        <v-text-field variant="outlined"
                      density="comfortable"
                      label="Busque o anime pelo nome..."
                      append-inner-icon="mdi-magnify"
                      @keyup="pesquisar"
                      v-model="busca.text"/>
        <v-radio-group inline v-model="selected" v-if="$props.opcao === 1">
          <v-radio label="Cadastrar Episódio" :value="1" color="info"></v-radio>
          <v-spacer/>
          <v-radio label="Cadastrar Temporada Completa" :value="2" color="info"></v-radio>
        </v-radio-group>
      </div>
      <v-progress-linear v-if="busca.loading" color="info" :indeterminate="true"></v-progress-linear>
    </div>
    <div class="results" v-show="!busca.oculto">
      <div v-for="(anime, i) in busca.result" :key="i" style="width: 25%; padding: 10px; display: inline-block">
        <v-card class="box-anime" width="100%" @click="clickEvent(i)">
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

    <div class="add-destaques" v-if="$props.opcao === 2 && destaques.showAddDestaques">
      <div class="anime-info" style="width: 100%;">
        <v-card width="50%" style="margin: 15px auto">
          <v-card-title style="text-align: center">
            Cadastrar destaque na tela inicial
            <v-btn @click="backEvent" :flat="true" icon="mdi-close" style="position: absolute; top: 0; right: 0"></v-btn>
          </v-card-title>
          <v-card-text style="display: grid; grid-template-areas: 'img title'; grid-template-columns: 30% 70%">
            <div class="img" style="grid-area: img">
              <v-img :src="$getImg(destaques.anime.foto, 'anime/foto')"
                     :cover="true"
                     aspect-ratio="9/16"
                     style="border-radius: 5px"/>
            </div>
            <div class="dados" style="grid-area: title; padding: 15px">
              <h2>{{$limitarTexto(destaques.anime.nome, 25)}}</h2>
              <h4 v-if="destaques.anime.nomeAlternativo" style="font-style: italic">{{destaques.anime.nomeAlternativo}}</h4>
              <span>{{destaques.anime.ano}} — {{destaques.anime.status === 1 ? 'Completo' : 'Em Lançamento'}}</span>
              <span v-if="destaques.animeNota">
              <v-icon style="margin-left: 4px" color="yellow" icon="mdi-star"></v-icon>{{parseFloat(destaques.animeNota).toFixed(2)}}
            </span>
              <span v-if="destaques.temporadas.length === 1" style="margin-left: 4px">— <strong style="color: deepskyblue">{{destaques.temporadas.length}} Temporada</strong></span>
              <span v-if="destaques.temporadas.length > 1" style="margin-left: 4px">— <strong style="color: deepskyblue">{{destaques.temporadas.length}} Temporadas</strong></span>
              <v-chip-group>
                <v-chip v-for="(genero, i) in destaques.anime.generos" :key="i">{{genero.nome}}</v-chip>
              </v-chip-group>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <div class="form-destaques" style="width: 100%" v-if="destaques.hasDestaque > 0">
        <h2 v-if="destaques.hasDestaque === 1" style="text-align: center">Já existe um destaque para esse anime.</h2>
        <div v-else class="form-destaques-content">
          <Transition>
            <v-card width="50%" style="margin: auto" v-if="!destaques.continuar && destaques.hasDestaque === 2">
              <v-card-text style="text-align: center">
                <h3>Deseja criar um destaque na tela inicial para esse anime?</h3>
              </v-card-text>
              <v-card-actions>
                <v-spacer/>
                <v-btn @click="destaques.continuar = true" variant="tonal" text="Sim" prepend-icon="mdi-check" color="success"></v-btn>
                <v-spacer/>
                <v-btn @click="backEvent" variant="tonal" text="Não" append-icon="mdi-cancel" color="red"></v-btn>
                <v-spacer/>
              </v-card-actions>
            </v-card>
          </Transition>
          <Transition>
            <v-card width="50%" style="margin: auto" v-if="destaques.continuar && destaques.hasDestaque === 2">
              <v-card-text style="text-align: center">
                <h3>De 1 a 10, qual a prioridade que você deseja para esse destaque?</h3>
                <v-slider
                  v-model="destaques.prioridade"
                  :min="1"
                  :max="10"
                  :step="1"
                  color="info"
                  :ticks="destaques.tickLabels"
                  show-ticks="always"
                  tick-size="4"
                ></v-slider>
              </v-card-text>
              <v-card-actions style="margin-top: -20px">
                <h4>Mais prioridade</h4>
                <v-spacer/>
                <h4>Menos prioridade</h4>
              </v-card-actions>
              <v-card-actions>
                <h2 style="text-align: center; color: red" v-if="destaques.erro">{{destaques.erro}}</h2>
              </v-card-actions>
              <v-card-actions>
                <v-spacer/>
                <v-btn :loading="destaques.loadingCadastro" @click="cadastrarDestaque" variant="tonal" text="Cadastrar Destaque" prepend-icon="mdi-check" color="success"></v-btn>
                <v-spacer/>
                <v-btn :disabled="destaques.loadingCadastro" @click="backEvent" variant="tonal" text="Não" append-icon="mdi-cancel" color="red"></v-btn>
                <v-spacer/>
              </v-card-actions>
            </v-card>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*
* Valores para uso da prop 'opcao'
* 1 - padrão (uso no cadastro de episodios e temporadas) chamado pelo router
* 2 - selecionar para inserir destaque do anime
* */

export default {
  name: "AnimeAddTemporadaComponent",
  data: () => ({
    busca: {
      text: '',
      result: [],
      totalResults: 0,
      pagina: 1,
      loading: false,
      oculto: false
    },
    selected: 1,
    destaques: {
      showAddDestaques: false,
      anime: {
        idAnime: 0,
        nome: '',
        capa: ''
      },
      animeNota: null,
      temporadas: [],
      hasDestaque: 0,
      continuar: false,
      prioridade: 5,
      tickLabels: {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        10: '10'
      },
      loadingCadastro: false,
      erro: ''
    }
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
    },
    clickEvent(i){
      if(this.$props.opcao === 1){
        this.goCadTemporada(this.busca.result[i].idAnime);
      }

      if(this.$props.opcao === 2){
        this.axios.get('admin/destaque/hasDestaque', {
          params: {
            idAnime: this.busca.result[i].idAnime
          }
        }).then((response) => {
          this.destaques.hasDestaque = response.data.hasDestaque ? 1 : 2;
        });

        this.destaques.anime = this.busca.result[i];
        this.axios.get('rating/getAnimeNota', {
          params: {
            idAnime: this.destaques.anime.idAnime
          }
        }).then((response) => {
          this.animeNota = response.data.nota;
        });

        this.axios.get('episodio/hasTemporada', {
          params: {
            idAnime: this.destaques.anime.idAnime
          }
        }).then((response) => {
          this.destaques.temporadas = response.data.numeroTemporadas;
        });

        this.busca.oculto = true;
        this.destaques.showAddDestaques = true;
      }
    },
    backEvent(){
      if(this.$props.opcao === 2){
        this.busca.oculto = false;
        this.destaques.showAddDestaques = false;
        this.busca.text = '';
        this.busca.result = [];
        this.destaques.anime = {
          idAnime: 0,
          nome: '',
          capa: ''
        };
        this.destaques.animeNota = null;
        this.destaques.temporadas = [];
      }
    },
    cadastrarDestaque(){
      this.destaques.loadingCadastro = true;
      this.axios.post('admin/destaque/inserir', {
        idAnime: this.destaques.anime.idAnime,
        numero: this.destaques.prioridade
      }).then((response) => {
        if(response.data.destaque){
          this.backEvent();
        }else{
          this.destaques.erro = 'Erro ao cadastrar destaque.';
        }
      }).finally(() => {
        this.destaques.loadingCadastro = false;
      });
    }
  },
  props: {
    opcao: {
      type: Number,
      default: 1
    }
  },
  watch: {
    '$props.opcao'(){
      this.busca.oculto = false;
      this.destaques.showAddDestaques = false;
      this.busca.text = '';
      this.busca.result = [];
      this.destaques.anime = {
        idAnime: 0,
        nome: '',
        capa: ''
      };
      this.destaques.animeNota = null;
      this.destaques.temporadas = [];
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

.add-destaques {
  width: 100%;
  margin: auto;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>