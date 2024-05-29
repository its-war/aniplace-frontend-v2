<template>
<!-- TODO: concluir essa página -->
</template>

<script>
export default {
  name: 'FirebaseComponent',
  inject: ['repository'],
  data: () => ({
    anime: null,
    episodio: null,
    video: null
  }),
  async created(){
    await this.carregarAnime();
  },
  methods: {
    selecionarEpisodio(){
      for (let t = 0; t < this.anime.temporadas.length; t++) {
        if(this.anime.temporadas[t].numeroTemporada === Number(this.$route.params.temporada)){
          for (let e = 0; e < this.anime.temporadas[t].episodios.length; e++) {
            if(this.anime.temporadas[t].episodios[e].numero === Number(this.$route.params.numero)){
              this.anime.temporadas[t].episodios[e].acessos = this.anime.temporadas[t].episodios[e].acessos++;
              this.episodio = this.anime.temporadas[t].episodios[e];
              this.video = this.episodio.linkOnline;
              this.repository.animes.addAcessos(this.anime);
              this.repository.animes.episodioAddAcessos(this.anime.idAnime, this.anime.temporadas[t]);
              return;
            }
          }
        }
      }
    },
    async carregarAnime(){
      this.anime = await this.repository.animes.getById(Number(this.$route.params.idAnime));
    }
  },
  watch: {
    async '$route.params.idAnime'(){
      await this.carregarAnime();
      this.selecionarEpisodio();
    },
    '$route.params.temporada'(){
      this.selecionarEpisodio();
    },
    '$route.params.numero'(){
      this.selecionarEpisodio();
    }
  }
}
</script>

<style src="@/components/EpisodioPage/style.css" scoped/>