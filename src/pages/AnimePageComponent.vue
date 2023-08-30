<template>
  <div>
    <div>
      <v-sheet v-if="anime.capa" :width="isMobile?'100%':getWidthScreen + 'px'" :height="getDivHeight" :style="getAnimeWallpaper"></v-sheet>
      <div class="sombra" :style="isMobile?'top: 62px !important;':''">
        <div class="sombra-2" :style="getSombra2Style">
          <div class="sombra-3" :style="'height: ' + getDivHeight + 'px !important; width: ' + getWidthScreen + 'px !important;'">
            <h1 v-if="!isTablet">{{anime.nome}}</h1>
            <h4 v-else style="width: 60%">{{anime.nome}}</h4>
            <h4 v-if="!isTablet" class="nome-alternativo">{{anime.nomeAlternativo}}</h4>
            <h5 v-else class="nome-alternativo">{{anime.nomeAlternativo}}</h5>
            <div class="generos">
              <span v-for="(genero, i) in getAnimeGeneros" :key="i" :style="spanGeneroStyle">{{genero.nome}}</span>
            </div>
            <span class="anime-info" :style="isMobile?'font-size: 10px;':''">
              {{anime.status === 1 ? 'Completo' : null}}
              {{anime.status === 2 ? 'Em Lançamento' : null}}
              {{anime.status === 3 ? 'Incompleto' : null}}
              <v-tooltip text="Há episódios disponíveis em HD" location="top" theme="light">
                <template v-slot:activator="{props}">
                  <v-icon icon="mdi-high-definition-box" v-bind="props"></v-icon>
                </template>
              </v-tooltip>
              <v-tooltip text="Legenda em português brasileiro disponível" location="top" theme="light">
                <template v-slot:activator="{props}">
                  <v-icon v-show="anime.audio === 1 || anime.audio === 2" icon="mdi-closed-caption" v-bind="props"></v-icon>
                </template>
              </v-tooltip>
              <v-tooltip text="Audio em português brasileiro disponível" location="top" theme="light">
                <template v-slot:activator="{props}">
                  <v-icon v-show="anime.audio === 1 || anime.audio === 3" icon="mdi-headphones-box" v-bind="props"></v-icon>
                </template>
              </v-tooltip>
              {{anime.ano}}
              <span><v-icon icon="mdi-star" color="yellow" style="margin-right: 0 !important;"></v-icon>9,78</span>
              <v-tooltip text="Site oficial do anime" location="top" theme="light">
                <template v-slot:activator="{props}">
                  <v-icon v-show="anime.site" icon="mdi-web" v-bind="props"></v-icon>
                </template>
              </v-tooltip>
              <v-tooltip text="Página oficial do anime no MyAnimeList" location="top" theme="light">
              <template v-slot:activator="{props}">
                <MyanimelistIcon v-show="anime.myanimelist" style="fill: white" v-bind="props"/>
              </template>
            </v-tooltip>
            </span>

            <div v-if="!isMobile" class="sinopse" style="overflow: auto; max-height: 80%; width: 50%; margin-top: 10px">
              <p v-for="(paragrafo, i) in anime.sinopse" :key="i" style="margin-bottom: 10px; text-indent: 3em; font-size: 12px" :style="isTablet ? 'padding-right: 10px; font-size: 5px !important;' : ''">
                {{ paragrafo }}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div v-if="isMobile" class="sinopse" style="overflow: auto; max-height: 200px; width: 95%; margin: 10px auto; z-index: 5; position: relative; padding-left: 35px">
      <p v-for="(paragrafo, i) in anime.sinopse" :key="i" style="margin-bottom: 10px; text-indent: 3em; font-size: 12px" :style="isTablet ? 'padding-right: 10px; font-size: 10px !important;' : ''">
        {{ paragrafo }}
      </p>
    </div>
    <div class="screenshots" style="z-index: 3; position: relative" v-show="anime.prints !== 'p'">
      <div class="img-screenshot" :style="isMobile?'width: 50%':''" v-for="(img, i) in anime.prints" :key="i">
        <v-img v-if="img.length > 5" @click="openDialogImg(i)" class="img-hover" width="100%" aspect-ratio="16/9" :src="$getImg(img, 'anime/print')"/>
      </div>

      <v-dialog v-if="anime.prints !== 'p'" v-model="imgPrintDialog" width="80%">
        <v-card>
          <v-card-text>
            <v-img style="border-radius: 5px;" width="100%" aspect-ratio="16/9" :src="getImgSelected"/>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn @click="anterior" icon="mdi-arrow-left"></v-btn>
            <v-btn @click="proximo" icon="mdi-arrow-right"></v-btn>
            <v-btn @click="closeImgDialog" icon="mdi-close"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </div>
    <div v-if="anime.temporadas" style="z-index: 3; position: relative" class="episodios" id="episodios">
      <v-tabs v-model="temporadaTab" align-tabs="center" color="red" :center-active="true">
        <v-tab v-for="(temporada, i) in anime.temporadas" :key="i" :size="isMobile?'x-small':'default'" :value="temporada.numeroTemporada">
          {{ temporada.numeroTemporada }}ª Temporada
        </v-tab>
      </v-tabs>
      <v-window v-model="temporadaTab" style="padding: 10px 25px">
        <v-window-item v-for="(temporada, i) in anime.temporadas" :key="i" :value="temporada.numeroTemporada">
          <div class="episodios-conteudo" :style="isMobile?'width: 100%':''">
            <v-table class="scroll-table" :hover="true" :fixed-footer="false">
              <tbody>
              <tr v-for="(episodio, j) in temporada.episodios" :key="j">
                <td style="text-align: center" :style="isMobile?'font-size: 10px':''">Episódio {{episodio.numero}}</td>
                <td style="text-align: center"><v-btn @click="assistir(i + 1, j + 1)" :size="isMobile?'x-small':'default'" prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center">
                  <v-btn :size="isMobile?'x-small':'default'" prepend-icon="mdi-download" color="red" variant="tonal">
                    Baixar
                    <v-menu activator="parent">
                      <v-list>
                        <v-list-item @click="baixar(episodio.link1080p)">
                          <v-list-item-title>Full HD (1080p)</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="baixar(episodio.link720p)">
                          <v-list-item-title>HD (720p)</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </v-table>
          </div>
        </v-window-item>
      </v-window>
    </div>
  </div>
</template>

<script>
import {useDisplay} from "vuetify";
import {MyanimelistIcon} from 'vue3-simple-icons';

export default {
  name: "AnimePageComponent",
  components: {MyanimelistIcon},
  computed: {
    isMobile(){
      return useDisplay().mobile.value;
    },
    isTablet(){
      return useDisplay().width.value < 700;
    },
    spanGeneroStyle(){
      if(this.isMobile){
        if(useDisplay().width.value < 700){
          return 'padding: 1px 8px; font-size: 10px;'
        }
      }
      return '';
    },
    getHeightScreen(){
      return useDisplay().height.value;
    },
    getWidthScreen(){
      return useDisplay().width.value;
    },
    getDivHeight(){
      if(this.isMobile){
        return 250;
      }else{
        return Math.ceil(0.8 * this.getHeightScreen);
      }
    },
    getAnimeWallpaper(){
      if(this.isMobile){
        return `background: url('${this.$getImg(this.anime.capa, 'anime/capa')}') top center no-repeat; background-size: cover; position: relative; margin-top: 62px;`
      }else{
        return `background: url('${this.$getImg(this.anime.capa, 'anime/capa')}') top center no-repeat; background-size: cover; position: relative`;
      }
    },
    getAnimeGeneros(){
      if(this.isMobile && this.anime.generos.length > 3){
        return this.anime.generos.slice(0, 3);
      }else{
        return this.anime.generos;
      }
    },
    getSombra2Style(){
      if(this.isMobile){
        return 'height: ' + this.getDivHeight + 'px !important; position: absolute; right: 0;';
      }else{
        return 'height: ' + this.getDivHeight + 'px !important;';
      }
    },
    getImgSelected(){
      if(this.imgSelectedIndex >= 0){
        return this.$getImg(this.anime.prints[this.imgSelectedIndex], 'anime/print');
      }
      return null;
    }
  },
  data: () => ({
    anime: {
      "idAnime": null,
      "nome": null,
      "nomeAlternativo": null,
      "generos": [
        {
          "idGenero": null,
          "nome": null
        }
      ],
      "status": null,
      "ano": null,
      "disponibilidade": null,
      "audio": null,
      "site": null,
      "myanimelist": null,
      "sinopse": null,
      "foto": null,
      "capa": null,
      "prints": null,
      "acessos": null,
      "temporadas": null
    },
    temporadaTab: null,
    imgPrintDialog: false,
    imgSelectedIndex: null
  }),
  mounted() {
    this.axios.get('anime/listar?id=' + this.$route.params.id).then((value) => {
      this.anime = value.data[0];
      this.$socket.emit('acessoAnime', value.data[0].idAnime);
    });
  },
  methods: {
    openDialogImg(index){
      this.imgSelectedIndex = index;
      this.imgPrintDialog = true;
    },
    closeImgDialog(){
      this.imgPrintDialog = false;
    },
    proximo(){
      if(this.imgSelectedIndex < this.anime.prints.length - 1){
        this.imgSelectedIndex++;
      }else{
        this.imgSelectedIndex = 0;
      }
    },
    anterior(){
      if(this.imgSelectedIndex > 0){
        this.imgSelectedIndex--;
      }else{
        this.imgSelectedIndex = this.anime.prints.length - 1;
      }
    },
    assistir(temporada, episodio){
      this.$router.push({name: 'Episódio', params: {idAnime: this.anime.idAnime, temporada: temporada, numero: episodio}});
    },
    baixar(link){
      console.log(link);
    }
  }
}
</script>

<style scoped>
.sombra {
  background-image: linear-gradient(to right, #0e0e12, rgb(14 14 18 / 0)) !important;
  position: absolute;
  z-index: 2;
  top: 0;
  width: 80%;
  height: 80%;
}

.sombra-2 {
  background-image: linear-gradient(to right, #0e0e12, rgb(14 14 18 / 0)) !important;
  width: 100%;
}

.sombra-3 {
  background-image: linear-gradient(to top, #0e0e12, rgb(14 14 18 / 0)) !important;
  padding: 10%;
}

.nome-alternativo {
  font-weight: lighter;
  font-style: italic;
}

.generos span {
  margin: 0 2px;
  padding: 5px 8px;
  transition: 300ms ease-in-out;
  border-radius: 15px;
  cursor: pointer;
  white-space: nowrap;
  display: inline-block;
  border: solid 1px transparent;
}

.generos span:hover {
  text-decoration: none;
  background-color: rgb(30,30,30);
  color: #ffffff;
  border: solid 1px white;
}

.sinopse {
  padding-right: 15px;
}

.sinopse::-webkit-scrollbar {
  width: 2px;
}

.sinopse::-webkit-scrollbar-thumb {
  background-color: red;
}

.sinopse::-webkit-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}

.sinopse::-ms-scrollbar {
  width: 2px;
}

.sinopse::-ms-scrollbar-thumb {
  background-color: red;
}

.sinopse::-ms-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}

.sinopse::-moz-scrollbar {
  width: 2px;
}

.sinopse::-moz-scrollbar-thumb {
  background-color: red;
}

.sinopse::-moz-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}

.anime-info {
  align-items: center;
  display: flex;
}

.anime-info * {
  margin: 0 3px;
}

.screenshots {
  width: 100%;
  padding: 10px 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  z-index: 3;
  margin-top: 20px;
}

.img-screenshot {
  width: 20%;
  padding: 10px;
  overflow: hidden;
}

.img-hover {
  transition: 300ms;
  border-radius: 5px;
  cursor: pointer;
}

.img-hover:hover {
  transform: scale(1.1);
  border-radius: 5px;
}

.episodios {
  z-index: 3;
}

.episodios-conteudo {
  width: 60%;
  margin: auto;
}

.scroll-table {
  max-height: 500px;
  overflow-y: scroll;
  padding: 0;
}

 .scroll-table::-webkit-scrollbar {
   width: 2px;
 }

.scroll-table::-webkit-scrollbar-thumb {
  background-color: red;
}

.scroll-table::-webkit-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}

.scroll-table::-ms-scrollbar {
  width: 2px;
}

.scroll-table::-ms-scrollbar-thumb {
  background-color: red;
}

.scroll-table::-ms-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}

.scroll-table::-moz-scrollbar {
  width: 2px;
}

.scroll-table::-moz-scrollbar-thumb {
  background-color: red;
}

.scroll-table::-moz-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}
</style>