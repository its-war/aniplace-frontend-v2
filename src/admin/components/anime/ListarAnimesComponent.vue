<template>
  <div style="padding: 20px;">
    <v-data-table
      :loading="pageLoading"
      loading-text="Carregando animes..."
      :headers="tableHeaders"
      :items="pesquisa.active ? pesquisa.resultado : dados.animes"
      :hover="true"
      :fixed-header="true"
      :fixed-footer="true"
      height="500px"
      :items-per-page="15"
    >
      <template v-slot:top>
        <v-toolbar :flat="true">
          <v-toolbar-title>Animes Cadastrados</v-toolbar-title>
          <v-spacer/>
          <v-btn
            color="success"
            dark
            variant="tonal"
            class="mb-1"
            prepend-icon="mdi-plus"
            text="Novo Anime"
            @click="goRoute(-1, 'Anime')"
          />
          <v-text-field
            style="margin: 20px 15px 0"
            label="Pesquisar..."
            placeholder="Busque por nome ou nome alternativo..."
            v-model="pesquisa.texto"
            append-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            color="info"
            base-color="info"
            @keyup="busca"
            :clearable="true"
            v-on:click:clear.prevent="resetarBusca"
          />
        </v-toolbar>
      </template>

      <template v-slot:item.nome="{item}">
        <span @click="goRoute(item.idAnime, 'Anime')" class="link-nome" :title="item.nome">
          {{$limitarTexto(item.nome, 25)}}
        </span>
      </template>

      <template v-slot:item.status="{item}">
        {{status[item.status - 1]}}
      </template>

      <template v-slot:item.dia="{item}">
        {{semana[item.dia - 1]}}
      </template>

      <template v-slot:item.disponibilidade="{item}">
        {{disponibilidade[item.disponibilidade - 1]}}
      </template>

      <template v-slot:item.audio="{item}">
        {{audio[item.audio - 1]}}
      </template>

      <template v-slot:item.foto="{item}">
        <div style="padding: 10px 0">
          <v-img style="border-radius: 10px" :src="$getImg(item.foto, 'anime/foto')" aspect-ratio="9/16" :cover="true" width="100px"/>
        </div>
      </template>

      <template v-slot:item.generos="{item}">
        <v-chip-group :column="true">
          <v-chip v-for="genero in item.generos" :key="genero.idGenero">{{genero.nome}}</v-chip>
        </v-chip-group>
      </template>

      <template v-slot:item.site="{item}">
        <a v-if="item.site" :href="item.site" target="_blank">Site Oficial</a>
        <span v-else>—</span>
      </template>

      <template v-slot:item.myanimelist="{item}">
        <a v-if="item.myanimelist" :href="item.myanimelist" target="_blank">MyAnimeList</a>
        <span v-else>—</span>
      </template>

      <template v-slot:item.sinopse="{item}">
        <v-btn text="Ver Sinopse" size="small" color="purple"></v-btn>
      </template>

      <template v-slot:item.episodios="{item}">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              text="Opções"
              size="small"
              color="pink-darken-4"
              append-icon="mdi-chevron-down"
            />
          </template>
          <v-list bg-color="pink-darken-4">
            <v-list-item prepend-icon="mdi-movie-open-plus" @click="goRoute(item.idAnime)">Add Episódio</v-list-item>
            <v-list-item prepend-icon="mdi-playlist-plus" @click="goRoute(item.idAnime, 'Temporada')">Add Temporada</v-list-item>

            <v-list-item
              prepend-icon="mdi-movie-edit"
              @click="goRoute(item.idAnime, 'Editar Episódio')">
              Editar Episódios
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-slot:item.acessos="{item}">
        <ViewCountComponent :views="item.acessos" :short="true"/>
      </template>

      <template v-slot:item.actions="{item}">
        <v-icon @click="dialogEditarAnime(item)" icon="mdi-pencil" size="small" color="green"></v-icon>
        <v-icon icon="mdi-delete" size="small" color="red"></v-icon>
      </template>

      <template v-slot:bottom>
        <div class="text-center" v-show="!pesquisa.active">
          <v-pagination v-model="dados.pagina" :length="dados.total" :total-visible="5" color="red"/>
        </div>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog.anime.active">
      <v-card class="pa-5 dialog-scroll-custom">
        <v-card-title>
          <h2>Editar Anime</h2>
          <v-btn
            @click="dialog.anime.active = false"
            style="position: fixed; top: 0; right: 5px"
            icon="mdi-close" :flat="true"/>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-row :no-gutters="true">
              <v-col cols="12" sm="6" class="pa-5">
                <v-text-field
                  label="Nome do anime"
                  placeholder="ex: Seiken Gakuin no Makentsukai"
                  v-model="dialog.anime.data.nome"
                  variant="outlined"
                  base-color="info"
                /><!-- Campos obrigatórios possuem base-color na cor 'info' -->
              </v-col>
              <v-col cols="12" sm="6" class="pa-5">
                <v-text-field
                  label="Nome alternativo do anime"
                  placeholder="ex: The Demon Sword Master of Excalibur Academy"
                  v-model="dialog.anime.data.nomeAlternativo"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <v-row :no-gutters="true">
              <h4>Gêneros <span style="color: rgb(0,110,250); font-size: 30px">*</span></h4>
              <v-col sm="12" cols="12">
                <v-chip-group :multiple="true" v-model="dialog.anime.data.generos" selected-class="text-blue">
                  <v-chip v-for="(genero, i) in generos" :value="genero.idGenero" :key="i">{{genero.nome}}</v-chip>
                </v-chip-group>
              </v-col>
            </v-row>

            <v-row :no-gutters="true" style="margin-top: 15px">
              <v-col sm="6" cols="12">
                <div class="text-center">
                  <v-img class="ma-auto" aspect-ratio="9/16" width="50%" :src="$getImg(dialog.anime.data.foto, 'anime/foto')" style="border-radius: 10px"/>
                  <v-btn text="Mudar Foto" color="info" variant="tonal" style="margin-top: 5px"/>
                </div>
              </v-col>
              <v-col sm="6" cols="12">
                <div class="text-center">
                  <v-img class="ma-auto" aspect-ratio="16/9" width="95%" :src="$getImg(dialog.anime.data.capa, 'anime/capa')" style="border-radius: 10px"/>
                  <v-btn text="Mudar Capa" color="success" variant="tonal" style="margin-top: 5px"/>
                </div>
              </v-col>
            </v-row>

            <v-divider class="ma-4"/>

            <v-row :no-gutters="true" style="margin-top: 15px">
              <v-col sm="3" cols="12" style="padding: 5px">
                <v-select
                  label="Status do anime"
                  :items="[{value: 1, title: 'Completo'}, {value: 2, title: 'Em Lançamento'}]"
                  item-value="value"
                  item-title="title"
                  base-color="info"
                  color="info"
                  variant="outlined"
                  v-model="dialog.anime.data.status"
                />
              </v-col>
              <v-col sm="3" cols="12" style="padding: 5px">
                <v-select
                  v-if="dialog.anime.data.status === 2"
                  label="Dia de lançamento"
                  :items="semanaEdit"
                  item-value="value"
                  item-title="title"
                  base-color="info"
                  color="info"
                  variant="outlined"
                  v-model="dialog.anime.data.dia"
                />
              </v-col>
              <v-col sm="3" cols="12" style="padding: 5px">
                <v-select
                  label="Ano de Lançamento"
                  base-color="info"
                  color="info"
                  :items="anos"
                  variant="outlined"
                  v-model="dialog.anime.data.ano"
                />
              </v-col>
              <v-col sm="3" cols="12" style="padding: 5px">
                <v-select
                  label="Disponibilidade"
                  :items="[{value: 1, title: 'Todos'}, {value: 2, title: 'Online'}, {value: 3, title: 'Download'}]"
                  item-value="value"
                  item-title="title"
                  base-color="info"
                  color="info"
                  variant="outlined"
                  v-model="dialog.anime.data.disponibilidade"
                />
              </v-col>
            </v-row>

            <v-row :no-gutters="true">
              <v-col sm="6" cols="12" style="padding: 5px">
                <v-text-field
                  label="Site Oficial"
                  v-model="dialog.anime.data.site"
                  variant="outlined"
                />
              </v-col>
              <v-col sm="6" cols="12" style="padding: 5px">
                <v-text-field
                  label="Página Oficial no MyAnimeList"
                  v-model="dialog.anime.data.myanimelist"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <v-row :no-gutters="true">
              <v-col sm="12" cols="12">
                <v-checkbox
                  label="Marque essa caixa se o anime for longo. Ex: Naruto, One Piece, Bleach..."
                  color="info"
                  v-model="dialog.anime.data.tipo"
                />
              </v-col>
            </v-row>

            <v-row :no-gutters="true">
              <v-col sm="12" cols="12">
                <v-textarea label="Escreva a sinopse"
                            variant="outlined"
                            :rows="7"
                            base-color="info"
                            color="info"
                            v-model="dialog.anime.data.sinopse"/>
                <h5 style="color: rgb(255,0,0)">* Separe os parágrafos por APENAS uma quebra de linha (enter).</h5>
              </v-col>
            </v-row>

            <v-divider/>

            <v-row :no-gutters="true">
              <v-col sm="12" cols="12" class="pa-5">
                <span>Adicione prints para o anime</span><br/>
                <v-file-input
                  @change="inputPrintsEvent"
                  :multiple="true"
                  accept="image/*"
                  style="display: none"
                  ref="prints"
                />
              </v-col>
            </v-row>

            <v-row :no-gutters="true">
              <v-col cols="12" sm="2" class="pa-2" v-for="(img, i) in renderizarPreviaPrints" :key="i" style="position: relative">
                <v-img :src="img" class="d-flex align-center" height="130" width="auto" aspect-ratio="16/9"/>
                <v-btn icon="mdi-close" style="position: absolute; top: 0; right: 0" @click="removerPrint(img)"/>
              </v-col>

              <v-col cols="12" sm="2" class="pa-2" v-for="(img, i) in renderizarPreviaPrintsLocais" :key="i" style="position: relative">
                <v-img :src="img" class="d-flex align-center" height="130" width="auto" aspect-ratio="16/9"/>
                <v-btn icon="mdi-close" style="position: absolute; top: 0; right: 0" @click="removerPrint(i, 2)"/>
              </v-col>

              <v-col cols="12" sm="2" class="pa-2" v-for="n in renderizarBotoesAdicionar" :key="n">
                <v-card class="d-flex align-center" height="130" color="grey-lighten-1" @click="abrirSelecionarPrints">
                  <v-icon icon="mdi-plus" size="45px" class="ma-auto"/>
                  <span class="ma-auto">Adicionar</span>
                </v-card>
              </v-col>
            </v-row>

            <v-divider/>

            <v-row :no-gutters="true">
              <v-col sm="6" cols="12" class="pa-5">
                <v-text-field
                  type="number"
                  base-color="info"
                  color="info"
                  label="Temporada em lançamento"
                  v-model="dialog.anime.data.temporadaLancamento"
                  variant="outlined"
                />
                <span style="color: red; font-size: 12px">* Esse campo serve para o sistema saber qual a temporada está em lançamento (pode ser ignorado caso não esteja em lançamento)</span>
              </v-col>
              <v-col sm="6" cols="12">
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn prepend-icon="mdi-send" variant="tonal" text="Cadastrar" style="margin: 5px" color="success" theme="light"/>
          <v-btn prepend-icon="mdi-restart" variant="tonal" text="Limpar Campos" style="margin: 5px" color="primary" theme="light"/>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ViewCountComponent from "@/components/ViewCountComponent.vue";
export default {
  name: "ListarAnimesComponent",
  components: { ViewCountComponent },
  data: () => ({
    tableHeaders: [
      { title: 'Foto', align: 'start', key: 'foto', sortable: false },
      { title: 'Nome', align: 'start', key: 'nome', sortable: false },
      { title: 'Gêneros', align: 'start', key: 'generos', sortable: false },
      { title: 'Status', align: 'start', key: 'status', sortable: false },
      { title: 'Dia', align: 'start', key: 'dia', sortable: false },
      { title: 'Ano', align: 'start', key: 'ano', sortable: false },
      { title: 'Episódios', align: 'start', key: 'episodios', sortable: false },
      { title: 'Acessos', align: 'start', key: 'acessos', sortable: false },
      { title: 'Ações', align: 'start', key: 'actions', sortable: false },
    ],
    pesquisa: {
      texto: '',
      resultado: [],
      active: false
    },
    dados: {
      pagina: 1,
      total: 0,
      animes: []
    },
    pageLoading: false,
    semana: [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado'
    ],
    semanaEdit: [
      {value: 1, title: 'Domingo'},
      {value: 2, title: 'Segunda'},
      {value: 3, title: 'Terça'},
      {value: 4, title: 'Quarta'},
      {value: 5, title: 'Quinta'},
      {value: 6, title: 'Sexta'},
      {value: 7, title: 'Sábado'},
    ],
    status: [
      'Completo',
      'Em Lançamento',
      'Incompleto'
    ],
    disponibilidade: [
      'Online e Download',
      'Online',
      'Download'
    ],
    audio: [
      'Dublado',
      'Legendado'
    ],
    dialog: {
      anime: {
        data: {},
        active: false,
        prints: []
      },
      episodio: {
        active: false,
        list: []
      }
    },
    generos: [],
    anos: []
  }),
  methods: {
    carregarAnimes(){
      this.pageLoading = true;
      this.axios.get('anime/listar?pagina=' + this.dados.pagina).then((response) => {
        this.dados.animes = response.data.animes;
        this.dados.total = response.data.total;
      }).finally(() => {
        this.pageLoading = false;
      })
    },
    goRoute(idAnime, contexto = 'Episódio'){
      if(contexto === 'Editar Episódio'){
        this.$router.push({name: `${contexto}`, params: {idAnime: idAnime}});
        return;
      }

      if(contexto === 'Anime'){
        if(idAnime > 0){
          this.$router.push({name: `${contexto}`, params: {id: idAnime}});
          return;
        }
        this.$router.push({name: `Cadastrar ${contexto}`});
        return;
      }
      this.$router.push({name: `Cadastrar ${contexto}`, params: {idAnime: idAnime}});
    },
    busca(){
      if(this.pesquisa.texto.length > 0){
        this.pesquisa.active = true;
        this.pageLoading = true;
        this.axios.get('anime/pesquisa', {
          params: {
            texto: this.pesquisa.texto,
            pagina: 1
          }
        }).then((res) => {
          this.pesquisa.resultado = res.data.animes;
        }).finally(() => {
          this.pageLoading = false;
        });
      }else{
        this.resetarBusca();
      }
    },
    resetarBusca(){
      this.pesquisa.texto = '';
      this.pesquisa.resultado = [];
      this.pesquisa.active = false;
      this.pageLoading = false;
    },
    dialogEditarAnime(anime){
      this.dialog.anime.data = anime;
      this.parseGenerosToVModelFormat();
      this.parseSinopseToVModelFormat();
      this.parseTipoToVModelFormat();
      this.parsePrintsToVModelFormat();
      this.dialog.anime.prints = [];
      this.dialog.anime.active = true;
    },
    carregarGeneros(){
      this.axios.get('anime/listarGeneros').then((value) => {
        this.generos = value.data.generos;
      });
    },
    parseGenerosToVModelFormat(){
      this.dialog.anime.data.generos = this.dialog.anime.data.generos.map(genero => genero.idGenero);
    },
    parseSinopseToVModelFormat(){
      this.dialog.anime.data.sinopse = this.dialog.anime.data.sinopse.join('\n');
    },
    parseTipoToVModelFormat(){
      this.dialog.anime.data.tipo = this.dialog.anime.data.tipo === 2;
    },
    parsePrintsToVModelFormat(){
      if(this.dialog.anime.data.prints !== 'p'){
        this.dialog.anime.data.prints = this.dialog.anime.data.prints.split('_');
      }
    },
    abrirSelecionarPrints(){
      this.$refs.prints.click();
    },
    removerPrint(img, opcao = 1) {
      if(opcao === 1){
        if (this.dialog.anime.data.prints.includes(img.split('/').pop())) {
          this.dialog.anime.data.prints.splice(this.dialog.anime.data.prints.indexOf(img.split('/').pop()),1);
        }
      }else{
        this.dialog.anime.prints.splice(img,1);
      }
    },
    inputPrintsEvent(event){
      for (let i = 0; i < event.target.files.length; i++) {
        this.dialog.anime.prints.push(event.target.files[i]);
      }
    }
  },
  watch: {
    'dados.pagina'(){
      this.carregarAnimes();
    }
  },
  mounted(){
    this.carregarAnimes();
    this.carregarGeneros();

    for(let i = new Date().getFullYear() + 1; i >= 1960; i--){
      this.anos.push(i);
    }
  },
  computed: {
    renderizarPreviaPrints(){
      const files = [];
      if(this.dialog.anime.data.prints !== 'p'){
        for (let i = 0; i < this.dialog.anime.data.prints.length; i++) {
          files.push(this.$getImg(this.dialog.anime.data.prints[i], 'anime/print'));
        }
      }
      return files;
    },
    renderizarPreviaPrintsLocais(){
      const files = [];
      let limite = 5 - (this.dialog.anime.data.prints === 'p' ? 0 : this.dialog.anime.data.prints);
      for (let i = 0; i < this.dialog.anime.prints.length; i++) {
        if(limite <= 0) break;
        if(i + 1 <= limite){
          files.push(URL.createObjectURL(this.dialog.anime.prints[i]));
        }
      }
      return files;
    },
    renderizarBotoesAdicionar(){
      let retorno = 5 - this.dialog.anime.prints.length;
      if(this.dialog.anime.data.prints !== 'p'){
        retorno = 5 - this.dialog.anime.data.prints.length - this.dialog.anime.prints.length;
      }
      return retorno < 0 ? 0 : retorno;
    }
  }
}
</script>

<style scoped>
.link-nome {
  cursor: pointer;
}

.link-nome:hover {
  text-decoration: underline;
  color: rgb(0,150,255);
}

th.resizeable {
  overflow: auto;
  resize: horizontal;
}

.dialog-scroll-custom::-webkit-scrollbar {
  width: 4px;
}

.dialog-scroll-custom::-webkit-scrollbar-thumb {
  background-color: #007bff;
}

.dialog-scroll-custom::-webkit-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}

.dialog-scroll-custom::-ms-scrollbar {
  width: 2px;
}

.dialog-scroll-custom::-ms-scrollbar-thumb {
  background-color: #007bff;
}

.dialog-scroll-custom::-ms-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}

.dialog-scroll-custom::-moz-scrollbar {
  width: 2px;
}

.dialog-scroll-custom::-moz-scrollbar-thumb {
  background-color: #007bff;
}

.dialog-scroll-custom::-moz-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}
</style>