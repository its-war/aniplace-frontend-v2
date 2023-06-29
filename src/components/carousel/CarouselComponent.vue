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
        sinopse: [
          'No futuro distante, a humanidade está à beira da extinção devido a uma ameaça implacável conhecida como Klaxosaurs. Essas criaturas colossais surgiram das profundezas da terra e ameaçam destruir o que resta da humanidade. Para se protegerem, os seres humanos se refugiam em enormes assentamentos chamados Plantations, que são imensas cidades flutuantes.',
          'Dentro dessas Plantations, as crianças são criadas e treinadas desde o nascimento para se tornarem pilotos de FranXX, robôs gigantes de combate que são a última linha de defesa da humanidade contra os Klaxosaurs. Os FranXX são operados em pares, com um piloto masculino conhecido como Stammi e uma piloto feminina chamada Pistil. Juntos, eles devem sincronizar suas mentes e corpos para controlar essas máquinas poderosas.',
          'Hiro, um jovem talentoso, costumava ser um prodígio promissor, mas agora está desiludido e sem propósito. Ele está desencantado com a vida em Plantation 13, onde os outros jovens pilotos o consideram inútil devido à sua baixa compatibilidade com as unidades FranXX. No entanto, seu destino muda quando ele encontra uma garota misteriosa de chifres e cabelos rosa chamada Zero Two, conhecida como a "Killer Klaxosaur".',
          'Zero Two é uma piloto habilidosa e temida pelos outros devido à sua reputação de ser a única a sobreviver a várias batalhas contra os Klaxosaurs. Ela possui uma personalidade cativante e uma aura enigmática, mas também carrega um segredo obscuro. Quando Zero Two se aproxima de Hiro e o chama de "Darling", eles descobrem que sua compatibilidade como pilotos é extraordinariamente alta. Juntos, eles formam uma parceria única e poderosa.',
          'À medida que Hiro se torna o novo parceiro de Zero Two, ele é introduzido em um mundo cheio de emoções intensas, perigos constantes e segredos profundos. Ele descobre que pilotar os FranXX não é apenas uma batalha física contra os Klaxosaurs, mas também um desafio emocional e psicológico. Conforme a história se desenrola, os pilotos e suas relações se entrelaçam em um enredo complexo, repleto de romance, amizade, traição e redenção.',
          '"Darling in the FranXX" explora temas profundos, como identidade, sexualidade, relações humanas e a busca pelo propósito e significado na vida. Os personagens enfrentam conflitos internos e lutam para encontrar seu lugar em uma sociedade opressiva. A história mergulha em questões de individualidade versus conformidade, liberdade pessoal e a importância de questionar o status quo.',
          'Com animação deslumbrante, sequências de ação empolgantes e um enredo cheio de reviravoltas emocionantes, "Darling in the FranXX" cativa os espectadores e os envolve em um mundo pós-apocalíptico sombrio e fascinante. A medida que a trama se desenrola, segredos são revelados, alianças são testadas e os personagens descobrem o verdadeiro significado do amor, sacrifício e esperança.'
      ],
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
        sinopse: [
            '"Zero no Tsukaima" se passa em um mundo onde a magia é real e os nobres detêm poder e privilégios. A história começa na Academia de Magia Tristain, onde estudantes aprendem a dominar a magia e se preparam para se tornarem feiticeiros respeitados.',
            'A protagonista da série é Louise Françoise Le Blanc de La Vallière, uma jovem nobre conhecida por seu apelido depreciativo "Louise a Zero". Apesar de vir de uma família prestigiada, Louise tem um problema: ela não consegue conjurar magias corretamente, resultando em explosões e desastres frequentes. Ela se sente extremamente frustrada e teme ser uma decepção para sua família e para si mesma.',
            'No entanto, durante a cerimônia de invocação de familiares, um ritual em que os estudantes convocam criaturas mágicas para serem seus parceiros, Louise acidentalmente convoca um humano da Terra chamado Saito Hiraga. Saito, um garoto comum do Japão, é transportado para o mundo de Louise e se torna seu familiar.',
            'No início, Louise trata Saito com desprezo e o considera um inferior. No entanto, ela logo descobre que Saito possui uma marca misteriosa em sua mão, o que significa que ele é um "Gandálfr", um guerreiro lendário com habilidades de combate excepcionais. Esse fato muda a dinâmica entre eles, e eles começam a desenvolver uma relação complexa.',
            'Ao longo da série, Louise e Saito embarcam em várias aventuras, enfrentando desafios mágicos, políticos e pessoais. Eles se envolvem em conflitos entre nações, batalham contra inimigos poderosos e exploram segredos antigos. Conforme a história avança, Louise e Saito enfrentam dilemas morais, desafios românticos e descobrem mais sobre si mesmos e sobre o mundo em que vivem.',
            'Além de Louise e Saito, a série apresenta uma variedade de personagens interessantes, incluindo outros estudantes da Academia de Magia Tristain, nobres poderosos e criaturas mágicas. A comédia, o romance e as cenas de ação são entrelaçados em toda a narrativa, proporcionando momentos emocionantes e divertidos.',
            'No decorrer das quatro temporadas do anime, os relacionamentos são desenvolvidos, os mistérios são revelados e os personagens enfrentam grandes desafios que moldam seu destino e o destino do mundo em que vivem.'
        ],
        img: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg'
      }
    ]
  })
}
</script>

<style scoped>

</style>