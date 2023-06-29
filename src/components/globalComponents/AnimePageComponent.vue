<template>
  <div>
    <v-sheet :width="getWidthScreen + 'px'" :height="getDivHeight" style="background: url('https://i.ytimg.com/vi/dnFXikH6o8U/maxresdefault.jpg') top center no-repeat; background-size: cover; position: relative"></v-sheet>
    <div class="sombra">
      <div class="sombra-2" :style="'height: ' + getDivHeight + 'px !important;'">
        <div class="sombra-3" :style="'height: ' + getDivHeight + 'px !important; width: ' + getWidthScreen + 'px !important;'">
          <h1 v-if="!isTablet">Darling in The FranXX</h1>
          <h3 v-else>Darling in The FranXX</h3>
          <h4 v-if="!isTablet" class="nome-alternativo">Darling in The FranXX</h4>
          <h5 v-else class="nome-alternativo">Darling in The FranXX</h5>
          <div class="generos">
            <span :style="spanGeneroStyle" v-for="(genero, i) in generos" :key="i">{{genero.nome}}</span>
          </div>
          <span class="anime-info">
          Completo
          <v-tooltip text="Há episódios disponíveis em HD" location="top" theme="light">
            <template v-slot:activator="{props}">
              <v-icon icon="mdi-high-definition-box" v-bind="props"></v-icon>
            </template>
          </v-tooltip>
          <v-tooltip text="Legenda em português brasileiro disponível" location="top" theme="light">
            <template v-slot:activator="{props}">
              <v-icon icon="mdi-closed-caption" v-bind="props"></v-icon>
            </template>
          </v-tooltip>
          <v-tooltip text="Audio em português brasileiro disponível" location="top" theme="light">
            <template v-slot:activator="{props}">
              <v-icon icon="mdi-headphones-box" v-bind="props"></v-icon>
            </template>
          </v-tooltip>
          2018
          <span><v-icon icon="mdi-star" color="yellow" style="margin-right: 0 !important;"></v-icon>9,78</span>
          <v-tooltip text="Site oficial do anime" location="top" theme="light">
            <template v-slot:activator="{props}">
              <v-icon icon="mdi-web" v-bind="props"></v-icon>
            </template>
          </v-tooltip>
          <v-tooltip text="Página oficial do anime no MyAnimeList" location="top" theme="light">
            <template v-slot:activator="{props}">
              <MyanimelistIcon style="fill: white" v-bind="props"/>
            </template>
          </v-tooltip>
          </span>
          <div class="sinopse" style="overflow: auto; max-height: 80%; width: 50%; margin-top: 10px">
            <p v-for="(paragrafo, i) in sinopse" :key="i" style="margin-bottom: 10px; text-indent: 3em; font-size: 12px" :style="isTablet ? 'padding-right: 10px; font-size: 5px !important;' : ''">
              {{ paragrafo }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="screenshots">
    <div class="img-screenshot">
      <v-img class="img-hover" width="100%" aspect-ratio="16/9" src="https://i.pinimg.com/originals/5f/92/e9/5f92e93754f142886632c9b164741094.jpg"/>
    </div>
    <div class="img-screenshot">
      <v-img class="img-hover" width="100%" aspect-ratio="16/9" src="https://i2.wp.com/www.animefeminist.com/wp-content/uploads/2018/03/Franxx8-header.png?fit=768%2C432&ssl=1"/>
    </div>
    <div class="img-screenshot">
      <v-img class="img-hover" width="100%" aspect-ratio="16/9" src="https://i.pinimg.com/736x/da/1c/d5/da1cd51dfa54e23f714ca5f1267f88ca.jpg"/>
    </div>
    <div class="img-screenshot">
      <v-img class="img-hover" width="100%" aspect-ratio="16/9" src="https://www.intoxianime.com/wp-content/uploads/2018/04/WEB%E4%BA%88%E5%91%8A%E5%85%AC%E9%96%8B-%E7%AC%AC14%E8%A9%B1%E7%BD%AA%E3%81%A8%E5%91%8A%E7%99%BD%E3%81%AEWEB%E4%BA%88%E5%91%8A%E6%98%A0%E5%83%8F%E3%82%92%E5%85%AC%E9%96%8B.mp4_snapshot_00.03_2018.04.12_12.47.03-1024x576.jpg"/>
    </div>
    <div class="img-screenshot">
      <v-img class="img-hover" width="100%" aspect-ratio="16/9" src="https://static.anime21.blog.br/2018/04/Screenshot_20180408-005513_1.jpg"/>
    </div>
  </div>
  <div class="episodios">
    <v-tabs v-model="temporadaTab" align-tabs="center" color="red" center-active>
      <v-tab :value="1">1ª Temporada</v-tab>
      <v-tab :value="2">2ª Temporada</v-tab>
      <v-tab :value="3">3ª Temporada</v-tab>
    </v-tabs>
    <v-window v-model="temporadaTab" style="padding: 10px 35px">
      <v-window-item :value="1">
        <div class="episodios-conteudo">
          <v-table class="scroll-table" hover :fixed-footer="false">
            <tbody>
              <tr>
                <td style="text-align: center">Episódio 1</td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
              </tr>
              <tr>
                <td style="text-align: center">Episódio 2</td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
              </tr>
              <tr>
                <td style="text-align: center">Episódio 3</td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
              </tr>
              <tr>
                <td style="text-align: center">Episódio 4</td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
              </tr>
              <tr>
                <td style="text-align: center">Episódio 5</td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
              </tr>
              <tr>
                <td style="text-align: center">Episódio 6</td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
              </tr>
              <tr>
                <td style="text-align: center">Episódio 7</td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
              </tr>
              <tr>
                <td style="text-align: center">Episódio 8</td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
              </tr>
              <tr>
                <td style="text-align: center">Episódio 9</td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
              </tr>
              <tr>
                <td style="text-align: center">Episódio 10</td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
              </tr>
              <tr>
                <td style="text-align: center">Episódio 11</td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
              </tr>
              <tr>
                <td style="text-align: center">Episódio 12</td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
              </tr>
              <tr>
                <td style="text-align: center">Episódio 13</td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
              </tr>
              <tr>
                <td style="text-align: center">Episódio 14</td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
              </tr>
              <tr>
                <td style="text-align: center">Episódio 15</td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
              </tr>
              <tr>
                <td style="text-align: center">Episódio 16</td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
                <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-window-item>
      <v-window-item :value="2">
        <div class="episodios-conteudo">
          <v-table class="scroll-table" hover :fixed-footer="false">
            <tbody>
            <tr>
              <td style="text-align: center">Episódio 1</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 2</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 3</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 4</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 5</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 6</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 7</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 8</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 9</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 10</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 11</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 12</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 13</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 14</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 15</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 16</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            </tbody>
          </v-table>
        </div>
      </v-window-item>
      <v-window-item :value="3">
        <div class="episodios-conteudo">
          <v-table class="scroll-table" hover :fixed-footer="false">
            <tbody>
            <tr>
              <td style="text-align: center">Episódio 1</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 2</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 3</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 4</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 5</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 6</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 7</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 8</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 9</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 10</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 11</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 12</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 13</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 14</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 15</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            <tr>
              <td style="text-align: center">Episódio 16</td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-play" color="secondary" variant="tonal">Assistir</v-btn></td>
              <td style="text-align: center"><v-btn prepend-icon="mdi-download" color="red" variant="tonal">Baixar</v-btn></td>
            </tr>
            </tbody>
          </v-table>
        </div>
      </v-window-item>
    </v-window>
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
      return useDisplay().width.value < 600;
    },
    isTablet(){
      return useDisplay().width.value < 700;
    },
    spanGeneroStyle(){
      if(useDisplay().width.value < 700){
        return 'padding: 1px 8px'
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
      return Math.ceil(0.8 * this.getHeightScreen);
    }
  },
  data: () => ({
    generos: [
      {
        id: 'ghy745aqw852gty964fvb745',
        nome: 'Romance'
      },
      {
        id: 'ghy745aqw852gty964fvb745',
        nome: 'Mecha'
      },
      {
        id: 'ghy745aqw852gty964fvb745',
        nome: 'Sci-fy'
      },
      {
        id: 'ghy745aqw852gty964fvb745',
        nome: 'Shounen'
      }
    ],
    sinopse: [
        'No futuro distante, a humanidade está à beira da extinção devido a uma ameaça implacável conhecida como Klaxosaurs. Essas criaturas colossais surgiram das profundezas da terra e ameaçam destruir o que resta da humanidade. Para se protegerem, os seres humanos se refugiam em enormes assentamentos chamados Plantations, que são imensas cidades flutuantes.',
        'Dentro dessas Plantations, as crianças são criadas e treinadas desde o nascimento para se tornarem pilotos de FranXX, robôs gigantes de combate que são a última linha de defesa da humanidade contra os Klaxosaurs. Os FranXX são operados em pares, com um piloto masculino conhecido como Stammi e uma piloto feminina chamada Pistil. Juntos, eles devem sincronizar suas mentes e corpos para controlar essas máquinas poderosas.',
        'Hiro, um jovem talentoso, costumava ser um prodígio promissor, mas agora está desiludido e sem propósito. Ele está desencantado com a vida em Plantation 13, onde os outros jovens pilotos o consideram inútil devido à sua baixa compatibilidade com as unidades FranXX. No entanto, seu destino muda quando ele encontra uma garota misteriosa de chifres e cabelos rosa chamada Zero Two, conhecida como a "Killer Klaxosaur".',
        'Zero Two é uma piloto habilidosa e temida pelos outros devido à sua reputação de ser a única a sobreviver a várias batalhas contra os Klaxosaurs. Ela possui uma personalidade cativante e uma aura enigmática, mas também carrega um segredo obscuro. Quando Zero Two se aproxima de Hiro e o chama de "Darling", eles descobrem que sua compatibilidade como pilotos é extraordinariamente alta. Juntos, eles formam uma parceria única e poderosa.',
        'À medida que Hiro se torna o novo parceiro de Zero Two, ele é introduzido em um mundo cheio de emoções intensas, perigos constantes e segredos profundos. Ele descobre que pilotar os FranXX não é apenas uma batalha física contra os Klaxosaurs, mas também um desafio emocional e psicológico. Conforme a história se desenrola, os pilotos e suas relações se entrelaçam em um enredo complexo, repleto de romance, amizade, traição e redenção.',
        '"Darling in the FranXX" explora temas profundos, como identidade, sexualidade, relações humanas e a busca pelo propósito e significado na vida. Os personagens enfrentam conflitos internos e lutam para encontrar seu lugar em uma sociedade opressiva. A história mergulha em questões de individualidade versus conformidade, liberdade pessoal e a importância de questionar o status quo.',
        'Com animação deslumbrante, sequências de ação empolgantes e um enredo cheio de reviravoltas emocionantes, "Darling in the FranXX" cativa os espectadores e os envolve em um mundo pós-apocalíptico sombrio e fascinante. A medida que a trama se desenrola, segredos são revelados, alianças são testadas e os personagens descobrem o verdadeiro significado do amor, sacrifício e esperança.'
    ],
    temporadaTab: null
  })
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
  z-index: 3;
  margin-top: 20px;
}

.img-screenshot {
  width: 20%;
  padding: 0 10px;
  overflow: hidden;
}

.img-hover {
  transition: 300ms;
}

.img-hover:hover {
  transform: scale(1.1);
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