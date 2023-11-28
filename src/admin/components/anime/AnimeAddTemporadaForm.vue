<template>
  <div class="temporada-container">
    <div class="anime-info" style="width: 100%;">
      <v-card width="50%" style="margin: 15px auto">
        <v-card-title style="text-align: center">
          Cadastrar Temporada
          <v-btn @click="goBack" :flat="true" icon="mdi-close" style="position: absolute; top: 0; right: 0"></v-btn>
        </v-card-title>
        <v-card-text v-if="loadingPage" style="display: flex; justify-content: center;">
          <v-progress-circular indeterminate size="80" color="info" />
        </v-card-text>
        <v-card-text v-else style="display: grid; grid-template-areas: 'img title'; grid-template-columns: 30% 70%">
          <div class="img" style="grid-area: img">
            <v-img :src="$getImg(anime.foto, 'anime/foto')"
                   :cover="true"
                   aspect-ratio="9/16"
                   style="border-radius: 5px" />
          </div>
          <div class="dados" style="grid-area: title; padding: 15px">
            <h2>{{ $limitarTexto(anime.nome, 25) }}</h2>
            <h4 v-if="anime.nomeAlternativo" style="font-style: italic">{{ anime.nomeAlternativo }}</h4>
            <span>{{ anime.ano }} — {{ anime.status === 1 ? "Completo" : "Em Lançamento" }}</span>
            <span v-if="animeNota">
              <v-icon style="margin-left: 4px" color="yellow"
                      icon="mdi-star"></v-icon>{{ parseFloat(animeNota).toFixed(2) }}
            </span>
            <span v-if="temporadas.length === 1" style="margin-left: 4px">— <strong
              style="color: deepskyblue">{{ temporadas.length }} Temporada</strong></span>
            <span v-if="temporadas.length > 1" style="margin-left: 4px">— <strong
              style="color: deepskyblue">{{ temporadas.length }} Temporadas</strong></span>
            <v-chip-group>
              <v-chip v-for="(genero, i) in anime.generos" :key="i">{{ genero.nome }}</v-chip>
            </v-chip-group>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <div class="temporada-formulario" style="width: 80%; margin: 20px auto">
      <h5>Obs: O sistema se encarrega de colocar o número da temporada e os números dos episódios, então certifique-se
        de cadastrar tudo de forma sequencial.</h5>
      <v-card>
        <v-card-text>
          <v-textarea
            label="Cole os links dos episódios em ordem sequencial separando-os por uma quebra de linha (enter)"
            v-model="links"
            rows="6"
            @paste="colarEvent"
            variant="outlined"
            density="comfortable"
            :auto-grow="true" />
          <span style="color: deepskyblue">
            Total de links: {{ getLinks.length }}
          </span>

          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>Opções Avançadas</v-expansion-panel-title>
              <v-expansion-panel-text>
                <h3>Na lista há episódios duplos?</h3>
                <span>Marque o link de episódio duplo, exemplo: link 4 corresponde ao episódio 4 e 5, então você marcará o link 4.</span>
                <v-checkbox v-for="(ep, i) in getLinks" :key="i" :label="`Link ${i + 1}`" v-model="episodiosDuplos"
                            :value="i" />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="cadastrarTemporada" :loading="loading" append-icon="mdi-send" variant="outlined"
                 text="Cadastrar" color="success"></v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn @click="snackbar = false" text="Ok" color="pink" />
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "AnimeAddTemporadaForm",
  mounted() {
    this.axios.get("anime/listar", {
      params: {
        id: this.$route.params.idAnime,
        pagina: 1,
        campos: "idAnime, nome, capa"
      }
    }).then((response) => {
      this.anime = response.data[0];
    }).finally(() => {
      this.loadingPage = false;
    });

    this.axios.get("rating/getAnimeNota", {
      params: {
        idAnime: this.$route.params.idAnime
      }
    }).then((response) => {
      this.animeNota = response.data.nota;
    });

    this.getTemporadas();
  },
  data: () => ({
    loadingPage: true,
    anime: {
      idAnime: 0,
      nome: "",
      capa: ""
    },
    animeNota: null,
    links: "",
    temporadas: [],
    loading: false,
    snackbar: false,
    snackbarText: "",
    episodiosDuplos: []
  }),
  methods: {
    goBack() {
      this.$router.push({ name: "Selecionar Anime" });
    },
    cadastrarTemporada() {
      console.log('duplos:', this.getEpisodiosDuplos());
      if (this.getLinks.length > 0) {
        this.loading = true;
        this.axios.post("admin/episodio/inserirMultiEpisodios", {
          idAnime: this.$route.params.idAnime,
          temporada: this.temporadas.length + 1,
          links1080p: this.links,
          links720p: this.links,
          linksOnline: this.links,
          episodiosDuplos: this.getEpisodiosDuplos()
        }).then((response) => {
          if (response.data.cadastro) {
            this.snackbarText = "Cadastro da temporada foi bem-sucedido.";
            this.snackbar = true;
            this.links = "";
            this.getTemporadas();
          }
        }).finally(() => {
          this.loading = false;
        });
      }
    },
    getTemporadas() {
      this.axios.get("episodio/hasTemporada", {
        params: {
          idAnime: this.$route.params.idAnime
        }
      }).then((response) => {
        this.temporadas = response.data.numeroTemporadas;
      });
    },
    colarEvent(event) {
      event.preventDefault();

      let textoColado = event.clipboardData.getData("text");
      if (textoColado.includes(",")) {
        textoColado = textoColado.split(",");
        for (let i = 0; i < textoColado.length; i++) {
          textoColado[i] = textoColado[i].trim();
        }
        textoColado = textoColado.join("\n");
      }

      this.links = this.links + textoColado;
    },
    getEpisodiosDuplos(){
      let duplos = [];
      for (let i = 0; i < this.getLinks.length; i++) {
        if (this.episodiosDuplos.includes(i)) {
          duplos.push(true);
        }else{
          duplos.push(false);
        }
      }
      return duplos;
    }
  },
  computed: {
    getLinks() {
      return this.links.split("\n").filter((link) => link.trim() !== "");
    }
  }
};
</script>

<style scoped>

</style>