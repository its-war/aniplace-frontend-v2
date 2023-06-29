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
        <div class="sinopse" style="overflow: auto; max-height: 80%; width: 50%; margin-top: 10px">
          <p v-for="(paragrafo, i) in sinopse" :key="i" style="margin-bottom: 10px; text-indent: 3em; font-size: 12px" :style="isTablet ? 'padding-right: 10px; font-size: 5px !important;' : ''">
            <span v-if="i < 2">{{paragrafo}}</span>
          </p>
        </div>
        <div class="d-flex flex-row" style="align-items: center">
          <v-btn prepend-icon="mdi-play-circle-outline" variant="tonal" color="secondary">Assistir</v-btn>
          <v-btn @click="goAnime" prepend-icon="mdi-text-box-plus-outline" variant="tonal" color="primary" style="margin: 0 3px 0 6px">Mais detalhes</v-btn>
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
      type: Array,
      required: true
    },
    img: {
      type: String,
      required: true
    }
  },
  methods: {
    goAnime(){
      this.$router.push({name: 'Anime', params: {id: this.$props.id}});
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
  width: 100%;
  height: 100%;
}

.sombra-2 {
  background-image: linear-gradient(to right, #0e0e12, rgb(14 14 18 / 0)) !important;
  width: 100%;
  height: 100%;
  padding: 10%;
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
</style>