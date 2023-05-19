<template>
  <v-main>
    <SliderComponent slide-nome="Lançamentos desta semana" :anime-list="animes"/>
    <SliderComponent slide-nome="Top animes" :anime-list="animes"/>
    <SliderComponent slide-nome="Mais vistos desse mês" :anime-list="animes"/>
    <SliderComponent slide-nome="Futuros lançamentos" :anime-list="animes"/>
    <FooterComponent/>
  </v-main>
</template>

<script>
import SliderComponent from "@/components/slider/SliderComponent.vue";
import FooterComponent from "@/components/globalComponents/FooterComponent.vue";

export default {
  name: "HomeBodyComponent",
  components: {FooterComponent, SliderComponent},
  data: () => ({
    animes: [
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Darling in The FranXX',
        foto: 'https://i.ytimg.com/vi/dnFXikH6o8U/maxresdefault.jpg',
        numero: 5
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      },
      {
        id: 'fghgfhgh4f5ghfghf4gh',
        nome: 'Zero no Tsukaima',
        foto: 'https://www.animenewsnetwork.com/hotlink/thumbnails/crop1200x630g80/cms/news/111809/zeronotsukaima22.jpg',
        numero: 11
      }
    ]
  }),
}
</script>

<style scoped>

</style>