<template>
  <v-main>
    <v-sheet width="100%" style="padding: 25px 50px">
      <div class="d-flex align-center justify-center" style="width: 400px; justify-content: center; align-items: center; padding-left: 45px">
        <v-text-field
            style="margin-right: 15px; margin-top: 22px"
            color="red"
            density="compact"
            variant="solo-filled"
            label="pesquisar..."
            append-inner-icon="mdi-magnify">
        </v-text-field>
        <v-btn variant="tonal" append-icon="mdi-format-list-bulleted">
          Filtros

          <v-dialog v-model="filtrosDialog" activator="parent" width="70%" :scrollable="true">
            <v-card width="100%" style="padding: 15px; border-radius: 10px">
              <v-card-text>
                <h3>Pesquisa Avançada</h3>
                <v-btn @click="filtrosDialog = false" variant="text" icon="mdi-close" style="position: absolute; top: 0; right: 0"></v-btn>
                <div class="letras">
                  <v-btn @click="clickLetra(26)" id="letra26" class="btn-letra" icon variant="tonal" size="small">#</v-btn>
                  <v-btn @click="clickLetra(i)" class="btn-letra" v-for="(letter, i) in alphabet" icon :key="i" :id="'letra' + i" variant="tonal" size="small">{{letter}}</v-btn>
                </div>
                <v-row :no-gutters="true" style="margin-top: 5px">
                  <v-col cols="12" sm="3" style="padding-right: 5px">
                    <span>Ano de Lançamento</span>
                    <v-combobox v-model="filtros.ano" :clearable="true" variant="solo-filled" :items="arrayAnos"></v-combobox>
                  </v-col>
                  <v-col cols="12" sm="3" style="padding-right: 5px">
                    <span>Disponibilidade</span>
                    <v-select v-model="filtros.disponibilidade" variant="solo-filled" :items="['Todos', 'Online', 'Download']"></v-select>
                  </v-col>
                  <v-col cols="12" sm="3" style="padding-right: 5px">
                    <span>Áudio</span>
                    <v-select v-model="filtros.audio" variant="solo-filled" :items="['Todos', 'Original (com legenda)', 'Dublado']"></v-select>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <span>Status</span>
                    <v-select v-model="filtros.pesquisaStatus" variant="solo-filled" :items="['Todos', 'Em Lançamento', 'Completo', 'Aguardando Lançamento']"></v-select>
                  </v-col>
                </v-row>
                <div class="generos">
                  <span>Gêneros</span>
                  <v-chip-group :multiple="true" v-model="filtros.generos" selected-class="text-red">
                    <v-chip v-for="(genero, i) in generos" :key="i" :value="genero.id">{{genero.nome}}</v-chip>
                  </v-chip-group>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer/>
                <v-btn append-icon="mdi-close" variant="text" color="red" @click="filtrosDialog = false">Cancelar</v-btn>
                <v-btn append-icon="mdi-refresh" variant="text" color="blue" @click="limparFiltros">Limpar Filtros</v-btn>
                <v-btn append-icon="mdi-magnify" variant="text" color="green">Pesquisar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-btn>
        <!-- TODO implementar as caixas dos animes (5 ou 6 por página) e com carregamento infinito -->
      </div>
      <div class="animes-main">
        <div class="anime-item">
          <img @click="goAnime" src="https://static.wikia.nocookie.net/new-game/images/c/cb/New-Game-S1-visual.jpg" alt=""/>
          <v-tooltip text="New Game!" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime" v-bind="props">{{this.$limitarTexto('New Game!', 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
        <div class="anime-item">
          <img @click="goAnime" src="https://m.media-amazon.com/images/M/MV5BZGVlY2ZhM2ItMWIwZC00YjU0LWJjNjAtZGVlNWJkM2JmZjhmXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_FMjpg_UX1000_.jpg"/>
          <v-tooltip text="Darling in The FranXX" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime" v-bind="props">{{this.$limitarTexto('Darling in The FranXX', 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
        <div class="anime-item">
          <img @click="goAnime" src="https://static.wikia.nocookie.net/new-game/images/c/cb/New-Game-S1-visual.jpg"/>
          <v-tooltip text="New Game!" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime" v-bind="props">{{this.$limitarTexto('New Game!', 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
        <div class="anime-item">
          <img @click="goAnime" src="https://m.media-amazon.com/images/M/MV5BZGVlY2ZhM2ItMWIwZC00YjU0LWJjNjAtZGVlNWJkM2JmZjhmXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_FMjpg_UX1000_.jpg"/>
          <v-tooltip text="Darling in The FranXX" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime" v-bind="props">{{this.$limitarTexto('Darling in The FranXX', 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
        <div class="anime-item">
          <img @click="goAnime" src="https://static.wikia.nocookie.net/new-game/images/c/cb/New-Game-S1-visual.jpg"/>
          <v-tooltip text="New Game!" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime" v-bind="props">{{this.$limitarTexto('New Game!', 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
        <div class="anime-item">
          <img @click="goAnime" src="https://m.media-amazon.com/images/M/MV5BZGVlY2ZhM2ItMWIwZC00YjU0LWJjNjAtZGVlNWJkM2JmZjhmXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_FMjpg_UX1000_.jpg"/>
          <v-tooltip text="Darling in The FranXX" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime" v-bind="props">{{this.$limitarTexto('Darling in The FranXX', 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
        <div class="anime-item">
          <img @click="goAnime" src="https://static.wikia.nocookie.net/new-game/images/c/cb/New-Game-S1-visual.jpg"/>
          <v-tooltip text="New Game!" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime" v-bind="props">{{this.$limitarTexto('New Game!', 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
        <div class="anime-item">
          <img @click="goAnime" src="https://m.media-amazon.com/images/M/MV5BZGVlY2ZhM2ItMWIwZC00YjU0LWJjNjAtZGVlNWJkM2JmZjhmXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_FMjpg_UX1000_.jpg"/>
          <v-tooltip text="Darling in The FranXX" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime" v-bind="props">{{this.$limitarTexto('Darling in The FranXX', 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
        <div class="anime-item">
          <img @click="goAnime" src="https://static.wikia.nocookie.net/new-game/images/c/cb/New-Game-S1-visual.jpg"/>
          <v-tooltip text="New Game!" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime" v-bind="props">{{this.$limitarTexto('New Game!', 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
        <div class="anime-item">
          <img @click="goAnime" src="https://m.media-amazon.com/images/M/MV5BZGVlY2ZhM2ItMWIwZC00YjU0LWJjNjAtZGVlNWJkM2JmZjhmXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_FMjpg_UX1000_.jpg"/>
          <v-tooltip text="Darling in The FranXX" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime" v-bind="props">{{this.$limitarTexto('Darling in The FranXX', 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
        <div class="anime-item">
          <img @click="goAnime" src="https://static.wikia.nocookie.net/new-game/images/c/cb/New-Game-S1-visual.jpg"/>
          <v-tooltip text="New Game!" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime" v-bind="props">{{this.$limitarTexto('New Game!', 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
        <div class="anime-item">
          <img @click="goAnime" src="https://m.media-amazon.com/images/M/MV5BZGVlY2ZhM2ItMWIwZC00YjU0LWJjNjAtZGVlNWJkM2JmZjhmXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_FMjpg_UX1000_.jpg"/>
          <v-tooltip text="Darling in The FranXX" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime" v-bind="props">{{this.$limitarTexto('Darling in The FranXX', 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
        <div class="anime-item">
          <img @click="goAnime" src="https://static.wikia.nocookie.net/new-game/images/c/cb/New-Game-S1-visual.jpg"/>
          <v-tooltip text="New Game!" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime" v-bind="props">{{this.$limitarTexto('New Game!', 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
        <div class="anime-item">
          <img @click="goAnime" src="https://m.media-amazon.com/images/M/MV5BZGVlY2ZhM2ItMWIwZC00YjU0LWJjNjAtZGVlNWJkM2JmZjhmXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_FMjpg_UX1000_.jpg"/>
          <v-tooltip text="Darling in The FranXX" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime" v-bind="props">{{this.$limitarTexto('Darling in The FranXX', 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
        <div class="anime-item">
          <img @click="goAnime" src="https://static.wikia.nocookie.net/new-game/images/c/cb/New-Game-S1-visual.jpg"/>
          <v-tooltip text="New Game!" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime" v-bind="props">{{this.$limitarTexto('New Game!', 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
        <div class="anime-item">
          <img @click="goAnime" src="https://m.media-amazon.com/images/M/MV5BZGVlY2ZhM2ItMWIwZC00YjU0LWJjNjAtZGVlNWJkM2JmZjhmXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_FMjpg_UX1000_.jpg"/>
          <v-tooltip text="Darling in The FranXX" location="top">
            <template v-slot:activator="{ props }">
              <h3 @click="goAnime" v-bind="props">{{this.$limitarTexto('Darling in The FranXX', 12)}}</h3>
            </template>
          </v-tooltip>
        </div>
      </div>
    </v-sheet>
  </v-main>
</template>

<script>
export default {
  name: "AnimesPage",
  data: () => ({
    filtrosDialog: false,
    filtros: {
      letra: null,
      ano: null,
      generos: null,
      disponibilidade: null,
      audio: null,
      pesquisaStatus: null
    },
    alphabet: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    arrayAnos: [],
    disponibilidade: 'Todos',
    audio: 'Todos',
    pesquisaStatus: 'Todos',
    generos: [
      {
        id: 1,
        nome: "Ação"
      },
      {
        id: 2,
        nome: "Aventura"
      },
      {
        id: 3,
        nome: "Comédia"
      },
      {
        id: 4,
        nome: "Drama"
      },
      {
        id: 5,
        nome: "Fantasia"
      },
      {
        id: 6,
        nome: "Romance"
      },
      {
        id: 7,
        nome: "Slice of Life"
      },
      {
        id: 8,
        nome: "Ficção Científica"
      },
      {
        id: 9,
        nome: "Mecha"
      },
      {
        id: 10,
        nome: "Sobrenatural"
      },
      {
        id: 11,
        nome: "Mistério"
      },
      {
        id: 12,
        nome: "Horror"
      },
      {
        id: 13,
        nome: "Esportes"
      },
      {
        id: 14,
        nome: "Musical"
      },
      {
        id: 15,
        nome: "Histórico"
      }
    ],
    letraAtual: -5
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
        document.getElementById('letra' + i).setAttribute('style', '');
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
    goAnime(){
      this.$router.push({name: 'Anime', params: {id: 'fghg4gh7g554fggh8ghg'}});
    }
  },
  mounted() {
    for(let i = 1990; i <= new Date().getFullYear(); i++){
      this.arrayAnos.push(i);
    }
    console.log(this.alphabet.length);
  }
}
</script>

<style scoped>
.animes-main {
  padding: 20px 30px;
  width: 100%;
}

.anime-item {
  width: 16.66%;
  border-radius: 10px;
  transition: 300ms;
  padding: 15px;
  -ms-transition: 300ms;
  display: inline-block;
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
</style>