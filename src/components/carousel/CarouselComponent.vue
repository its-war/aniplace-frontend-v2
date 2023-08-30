<template>
  <v-carousel :cycle="true"
              v-if="animes.length > 0"
              :style="isMobile?'margin-top: 62px; max-height: 280px':''"
              :interval="10000"
              :show-arrows="false"
              :height="isTablet ? '500px' : getHeightScreen"
              :vertical-delimiters="!isMobile"
              :hide-delimiter-background="true">
                    <CarouselItemComponent
                        v-for="(anime, i) in animes" :key="i"
                        :id="anime.idAnime"
                        :nome="anime.nome"
                        :img="anime.capa"
                        :sinopse="anime.sinopse"
                    />
  </v-carousel>
</template>

<script>
import { useDisplay } from 'vuetify';
import CarouselItemComponent from "@/components/carousel/CarouselItemComponent.vue";
export default {
  name: "CarouselComponent",
  components: {CarouselItemComponent},
  computed: {
    isMobile(){
      return useDisplay().mobile.value;
    },
    isTablet(){
      return useDisplay().width.value < 630;
    },
    getHeightScreen(){
      return useDisplay().height.value;
    }
  },
  data: () => ({
    animes: []
  }),
  mounted() {
    this.axios.get('anime/getDestaques').then((value) => {
      this.animes = value.data.destaques;
    });
  }
}
</script>

<style scoped>

</style>