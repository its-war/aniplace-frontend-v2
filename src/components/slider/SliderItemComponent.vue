<template>
  <v-slide-group-item>
    <div @click="clickEvent" class="item" :style="isMobile?'height: 100px !important; margin: 9px 3px;':''">
      <div class="item-numero" :style="isMobile?'font-size: 13px;':''">
        <span v-if="$props.showOnlyTemporada">
          {{$props.temporada ?? 1}}ª {{isMobile?'Temp.':'Temporada'}}
        </span>

        <span v-if="$props.numero > 0 && $props.temporada && !$props.showOnlyTemporada">
          {{$props.temporada}}ª {{isMobile?'Temp.':'Temporada'}}, Ep. {{$props.numero}}
        </span>

        <span v-if="$props.temporadaLancamento > 0">
          {{$props.temporadaLancamento}}ª Temp. em breve
        </span>

        <span v-if="$props.numero > 0 && $props.temporada === null && !$props.showOnlyTemporada">Episódio {{$props.numero}}</span>

        <span v-if="$props.showNota"><v-icon icon="mdi-star" color="yellow"/>{{parseFloat($props.nota).toFixed(2)}}</span>
      </div>
      <ImageSlideItemComponent :nome="$props.nome" :foto="$props.foto"/>
      <div class="item-nome" :style="isMobile?'font-size: 11px;':''">
        <h4>{{$limitarTexto($props.nome, 18)}}</h4>
      </div>
    </div>
  </v-slide-group-item>
</template>

<script>
import ImageSlideItemComponent from "@/components/slider/ImageSlideItemComponent.vue";

export default {
  name: "SliderItemComponent",
  components: { ImageSlideItemComponent },
  props: {
    id: {
      type: Number,
      required: true
    },
    nome: {
      type: String,
      required: true
    },
    foto: {
      type: String,
      required: true
    },
    numero: {
      type: Number,
      required: true
    },
    temporada: {
      type: Number,
      default: null
    },
    isAnime: {
      type: Boolean,
      default: false
    },
    showNota: {
      type: Boolean,
      default: false
    },
    nota: {
      type: String,
      default: null
    },
    temporadaLancamento: {
      type: Number,
      default: 0
    },
    showOnlyTemporada: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isMobile(){
      return this.$vuetify.display.mobile;
    }
  },
  methods: {
    clickEvent(){
      if(this.$props.isAnime){
        this.$router.push({name: 'Anime', params: {id: this.$props.id}});
      }else{
        this.$router.push({
          name: 'Episódio',
          params: {
            idAnime: this.$props.id,
            temporada: this.$props.temporada ?? 1,
            numero: this.$props.numero
          }
        });
      }
    }
  }
}
</script>

<style scoped>
.item {
  margin: 9px 13px;
  height: 150px;
  position: relative;
  border-radius: 10px;
  border: solid 3px transparent;
  overflow: hidden;
  cursor: pointer;
  transition: 300ms;
}

.item:hover {
  border: solid 3px white;
  transform: scale(1.05);
}

.item-numero {
  position: absolute;
  width: 100%;
  top: 0;
  right: 0;
  background: linear-gradient(to bottom, #0e0e12, rgb(14 14 18 / 0));
  padding-left: 10px;
}

.item-nome {
  position: absolute;
  bottom: 0;
  left: 0;
  background: linear-gradient(to top, #0e0e12, rgb(14 14 18 / 0));
  width: 100%;
  padding-left: 10px;
}
</style>