<template>
  <v-carousel cycle
              :interval="10000"
              :show-arrows="false"
              :height="isTablet ? '500px' : getHeightScreen"
              vertical-delimiters
              :hide-delimiters="isMobile"
              hide-delimiter-background>
                    <CarouselItemComponent
                        v-for="(anime, i) in animes" :key="i"
                        :id="anime.id"
                        :nome="anime.nome"
                        :nome-alternativo="anime.nomeAlternativo"
                        :completo="anime.completo"
                        :ano="anime.ano"
                        :generos="anime.generos"
                        :img="anime.img"
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
      return useDisplay().width.value < 600;
    },
    isTablet(){
      return useDisplay().width.value < 630;
    },
    getHeightScreen(){
      return useDisplay().height.value;
    }
  },
  data: () => ({
    animes: [
      {
        id: 'ghy745aqw852gty964fvb745',
        nome: 'Darling in The FranXX',
        nomeAlternativo: '',
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
        completo: true,
        ano: 2018,
        sinopse: 'Em um futuro distante, a humanidade vive em cidades fortificadas chamadas Plantações, que são lideradas por governantes conhecidos como "Mistresses". Os pilotos adolescentes das máquinas de combate chamadas FranXX são criados e treinados para defender as Plantações dos misteriosos seres conhecidos como Klaxosaurs. Hiro, um jovem ex-piloto prodígio, conhece a misteriosa Zero Two, e juntos eles lutam para descobrir a verdade por trás da existência dos FranXX e dos Klaxosaurs, bem como a verdade por trás de seu próprio passado e destino.',
        img: 'https://i.ytimg.com/vi/dnFXikH6o8U/maxresdefault.jpg'
      },
      {
        id: 'ghy745aqw852gty964fvb745',
        nome: 'Zero no Tsukaima',
        nomeAlternativo: 'The Familiar of Zero',
        generos: [
          {
            id: 'ghy745aqw852gty964fvb745',
            nome: 'Romance'
          },
          {
            id: 'ghy745aqw852gty964fvb745',
            nome: 'Comédia'
          },
          {
            id: 'ghy745aqw852gty964fvb745',
            nome: 'Fantasia'
          },
          {
            id: 'ghy745aqw852gty964fvb745',
            nome: 'Shounen'
          }
        ],
        completo: true,
        ano: 2006,
        sinopse: 'A história segue um estudante do ensino médio chamado Saito Hiraga que é convocado para um mundo de fantasia onde as pessoas usam magia. Lá, ele é contratado como "familiar" pela jovem aristocrata Louise Françoise Le Blanc de La Vallière. Juntos, eles se envolvem em várias aventuras e encontros românticos enquanto lutam para proteger seu mundo de ameaças externas.',
        img: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg'
      }
    ]
  })
}
</script>

<style scoped>

</style>