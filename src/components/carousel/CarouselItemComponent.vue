<template>
  <v-carousel-item style="position: relative">
    <v-sheet width="100%" height="100%" style="z-index: 1">
      <v-img
          width="100%"
          aspect-ratio="16/9"
          cover
          :src="$props.img"
      ></v-img>
    </v-sheet>
    <div class="sombra">
      <div class="sombra-2">
        <h1 v-if="!isTablet">{{$props.nome}}</h1>
        <h3 v-else>{{$props.nome}}</h3>
        <h4 v-if="!isTablet" class="nome-alternativo">{{$props.nomeAlternativo}}</h4>
        <h5 v-else class="nome-alternativo">{{$props.nomeAlternativo}}</h5>
        <div class="generos">
          <span :style="spanGeneroStyle" v-for="(genero, i) in $props.generos" :key="i">{{genero.nome}}</span>
        </div>
        <span>
            {{$props.completo ? 'Completo' : 'Lançamento'}}
            <v-icon icon="mdi-high-definition-box"></v-icon>
            <v-icon icon="mdi-closed-caption"></v-icon>
            {{$props.ano}}
          </span>
        <h4>Sinopse:</h4>
        <p style="max-width: 50%" :style="isTablet ? 'padding-right: 10px; font-size: 14px' : ''">
          {{this.$limitarTexto($props.sinopse, 400)}}
        </p>
        <div class="d-flex flex-row" style="align-items: center">
          <v-btn prepend-icon="mdi-play-circle-outline" variant="tonal" color="secondary">Assistir</v-btn>
          <v-btn prepend-icon="mdi-text-box-plus-outline" variant="tonal" color="primary" style="margin: 0 3px 0 6px">Mais detalhes</v-btn>
          <div class="myanimelist-icon icone-normal"></div>
        </div>
      </div>
    </div>
  </v-carousel-item>
</template>

<script>
import { useDisplay } from 'vuetify';
export default {
  name: "CarouselItemComponent",
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
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    nome: {
      type: String,
      required: true
    },
    nomeAlternativo: {
      type: String,
      default: ''
    },
    generos: {
      type: Array,
      required: true
    },
    completo: {
      type: Boolean,
      default: false
    },
    ano: {
      type: Number,
      required: true
    },
    sinopse: {
      type: String,
      required: true
    },
    img: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
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
}

.generos span:hover {
  text-decoration: none;
  background-color: rgb(30,30,30);
  color: #ffffff;
}

.sombra {
  background-image: linear-gradient(to right, #0e0e12, rgb(14 14 18 / 0)) !important;
  position: absolute;
  z-index: 2;
  top: 0;
  width: 100%;
  height: 100%;
}

.sombra-2 {
  background-image: linear-gradient(to right, #0e0e12, rgb(14 14 18 / 0)) !important;
  width: 100%;
  height: 100%;
  padding: 10%;
}
</style>