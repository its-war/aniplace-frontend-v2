<template>
  <div class="cadastro-container">
    <div class="campo-title">
      <h1>Cadastrar Anime</h1><br/>
      <h4>Os campos em <span style="color: rgb(0,110,250)">AZUL</span> são obrigatórios.</h4>
    </div>
    <div class="campo-nome">
      <v-text-field
          label="Nome"
          v-model="anime.nome"
          base-color="info"
          color="info"
          variant="outlined"
      />
    </div>
    <div class="campo-nomeAlternativo">
      <v-text-field
          label="Nome Alternativo"
          v-model="anime.nomeAlternativo"
          variant="outlined"
          base-color="info"
          color="info"
      />
    </div>

    <div class="campo-divider"><v-divider/></div>

    <div class="campo-generos">
      <h4>Selecione os gêneros <span style="color: rgb(0,110,250); font-size: 30px">*</span></h4>
      <v-chip-group :multiple="true" v-model="anime.generos" selected-class="text-blue">
        <v-chip :size="isMobile?'x-small':'default'" v-for="(genero, i) in generos" :key="i" :value="genero.idGenero">{{genero.nome}}</v-chip>
      </v-chip-group>
    </div>

    <div class="campo-divider2"><v-divider/></div>

    <div class="campo-foto">
      <v-file-input @change="handleFotoChange"
                    v-model="img.foto"
                    accept="image/*"
                    v-on:click:clear="resetarFoto"
                    label="Foto do anime"
                    base-color="info"
                    color="info"
                    variant="outlined">
        <template v-slot:selection>
          {{$limitarTexto(img.foto[0].name, 25)}}
        </template>
      </v-file-input>
      <h5 style="color: rgb(255,0,0)">* Recomendado: 900x1280px</h5>
    </div>
    <div class="campo-capa">
      <v-file-input @change="handleCapaChange"
                    v-model="img.capa"
                    accept="image/*"
                    v-on:click:clear="resetarCapa"
                    label="Capa do anime"
                    base-color="info"
                    color="info"
                    variant="outlined">
        <template v-slot:selection>
          {{$limitarTexto(img.capa[0].name, 25)}}
        </template>
      </v-file-input>
      <h5 style="color: rgb(255,0,0)">* Recomendado: 1920x1080px</h5>
    </div>
    <div class="campo-fotoPreview">
      <v-img v-if="img.preview.foto" width="50%" style="margin: auto; border-radius: 10px" aspect-ratio="9/16" :src="img.preview.foto" :cover="true"/>
    </div>
    <div class="campo-capaPreview">
      <v-img v-if="img.preview.capa" style="border-radius: 10px" aspect-ratio="16/9" :src="img.preview.capa" :cover="true"/>
    </div>

    <div class="campo-divider3"><v-divider/></div>

    <div class="campo-status">
      <v-select label="Selecione o status"
                :items="[{value: 1, title: 'Completo'}, {value: 2, title: 'Em Lançamento'}]"
                item-value="value"
                item-title="title"
                base-color="info"
                color="info"
                variant="outlined"
                v-model="anime.status"
      ></v-select>
    </div>
    <div class="campo-dia">
      <v-select v-if="anime.status === 2"
                label="Dia de lançamento"
                :items="semana"
                item-value="value"
                base-color="info"
                color="info"
                item-title="title"
                variant="outlined"
                v-model="anime.dia"
      ></v-select>
    </div>
    <div class="campo-ano">
      <v-select label="Ano de lançamento"
                :items="anos"
                base-color="info"
                color="info"
                variant="outlined"
                v-model="anime.ano"
      ></v-select>
    </div>
    <div class="campo-disponibilidade">
      <v-select label="Disponibilidade"
                :items="[{value: 1, title: 'Todos'}, {value: 2, title: 'Online'}, {value: 3, title: 'Download'}]"
                item-value="value"
                item-title="title"
                base-color="info"
                color="info"
                variant="outlined"
                v-model="anime.disponibilidade"
      ></v-select>
    </div>

    <div class="campo-divider4"><v-divider/></div>

    <div class="campo-site">
      <v-text-field
          label="Site Oficial"
          v-model="anime.site"
          variant="outlined"
      />
    </div>
    <div class="campo-myanimelist">
      <v-text-field
          label="Página Oficial no MyAnimeList"
          v-model="anime.myanimelist"
          variant="outlined"
      />
    </div>

    <div class="campo-divider5"><v-divider/></div>

    <div class="campo-tipo">
      <v-checkbox-btn
        label="Marque essa caixa se o anime for longo. Ex: Naruto, One Piece, Bleach..."
        color="info"
        v-model="anime.tipo"
      />
    </div>

    <div class="campo-divider7"><v-divider/></div>

    <div class="campo-sinopse">
      <v-textarea label="Escreva a sinopse"
                  variant="outlined"
                  :rows="7"
                  base-color="info"
                  color="info"
                  v-model="anime.sinopse"/>
      <h5 style="color: rgb(255,0,0)">* Separe os parágrafos por APENAS uma quebra de linha (enter).</h5>
    </div>

    <div class="campo-divider6"><v-divider/></div>

    <div class="campo-actions">
      <v-btn @click="cadastrarAnime" :loading="loading" prepend-icon="mdi-send" text="Cadastrar" style="margin: 5px" color="success" theme="light"/>
      <v-btn @click="resetar" :disabled="loading" prepend-icon="mdi-restart" text="Limpar Campos" style="margin: 5px" color="primary" theme="light"/>
    </div>
    <v-snackbar v-model="snackbar">
      {{snackbarText}}
      <template v-slot:actions>
        <v-btn @click="snackbar = false" text="Ok" color="pink"/>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "AnimeCadastroComponent",
  data: () => ({
    anime: {
      nome: '',
      nomeAlternativo: '',
      generos: [],
      status: null,
      dia: null,
      ano: null,
      disponibilidade: null,
      audio: 2,
      site: '',
      myanimelist: '',
      tipo: false,
      sinopse: ''
    },
    img: {
      foto: null,
      capa: null,
      preview: {
        foto: null,
        capa: null
      }
    },
    generos: [],
    semana: [
      {value: 1, title: 'Domingo'},
      {value: 2, title: 'Segunda'},
      {value: 3, title: 'Terça'},
      {value: 4, title: 'Quarta'},
      {value: 5, title: 'Quinta'},
      {value: 6, title: 'Sexta'},
      {value: 7, title: 'Sábado'},
    ],
    anos: [],
    loading: false,
    snackbar: false,
    snackbarText: ''
  }),
  computed: {
    isMobile(){
      return this.$store.main.isMobile;
    },
    validarCadastro(){
      if(this.anime.nome.length > 0 &&
          this.anime.generos.length > 0 &&
          this.anime.status &&
          this.anime.ano &&
          this.anime.disponibilidade &&
          this.anime.audio &&
          this.anime.sinopse.length > 0 &&
          this.img.foto &&
          this.img.capa){
        if(this.anime.status === 2){
          return !!this.anime.dia;
        }else{
          return true;
        }
      }else{
        return false;
      }
    }
  },
  methods: {
    listarGeneros(){
      this.axios.get('anime/listarGeneros').then((value) => {
        this.generos = value.data.generos;
      });
    },
    handleFotoChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.img.preview.foto = URL.createObjectURL(file);
      } else {
        this.img.preview.foto = null;
      }
    },
    handleCapaChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.img.preview.capa = URL.createObjectURL(file);
      } else {
        this.img.preview.capa = null;
      }
    },
    cadastrarAnime(){
      if(this.validarCadastro){
        this.loading = true;
        const formData = new FormData();
        formData.append('nome', this.anime.nome);
        if(this.anime.nomeAlternativo.length > 0){
          formData.append('nomeAlternativo', this.anime.nomeAlternativo);
        }
        formData.append('generos', this.anime.generos.join(','));
        formData.append('status', this.anime.status);
        if(this.anime.dia){
          formData.append('dia', this.anime.dia);
        }
        formData.append('ano', this.anime.ano);
        formData.append('disponibilidade', this.anime.disponibilidade);
        formData.append('audio', this.anime.audio);
        if(this.anime.site.length > 0){
          formData.append('site', this.anime.site);
        }
        if(this.anime.myanimelist.length > 0){
          formData.append('myanimelist', this.anime.myanimelist);
        }
        if(this.anime.tipo){
          formData.append('tipo', 2);
        }
        formData.append('sinopse', JSON.stringify(this.anime.sinopse.split('\n')));
        formData.append('foto', this.img.foto[0]);
        formData.append('capa', this.img.capa[0]);

        this.axios.post('admin/anime/inserir', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          if(response.data.idCadastrado > 0){
            this.resetar();
            this.snackbarText = 'Cadastro com sucesso.';
            this.snackbar = true;
          }
        }).catch((e) => {
          this.snackbarText = e;
          this.snackbar = true;
        }).finally(() => {this.loading = false});
      }else{
        this.loading = false;
        this.snackbarText = 'Um ou mais campos necessários não estão preenchidos.';
        this.snackbar = true;
      }
    },
    resetar(){
      this.anime.nome = '';
      this.anime.nomeAlternativo = '';
      this.anime.nomeAlternativo = '';
      this.anime.generos = [];
      this.anime.status = null;
      this.anime.dia = null;
      this.anime.ano = null;
      this.anime.disponibilidade = null;
      this.anime.site = '';
      this.anime.myanimelist = '';
      this.anime.sinopse = '';
      this.anime.tipo = false;

      this.resetarFoto();
      this.resetarCapa();
    },
    resetarFoto(){
      this.img.foto = null;
      this.img.preview.foto = null
    },
    resetarCapa(){
      this.img.capa = null;
      this.img.preview.capa = null;
    }
  },
  mounted() {
    this.listarGeneros();

    for(let i = new Date().getFullYear() + 1; i >= 1960; i--){
      this.anos.push(i);
    }
  }
}
</script>

<style scoped>
.cadastro-container {
  display: grid;
  grid-template-areas: "title title title title"
                       "nome nome nomeAlternativo nomeAlternativo"
                       "divider divider divider divider"
                       "generos generos generos generos"
                       "divider2 divider2 divider2 divider2"
                       "foto foto capa capa"
                       "fotoPreview fotoPreview capaPreview capaPreview"
                       "divider3 divider3 divider3 divider3"
                       "status dia ano disponibilidade"
                       "divider4 divider4 divider4 divider4"
                       "site site myanimelist myanimelist"
                       "divider5 divider5 divider5 divider5"
                       "tipo tipo tipo tipo"
                       "divider7 divider7 divider7 divider7"
                       "sinopse sinopse sinopse sinopse"
                       "divider6 divider6 divider6 divider6"
                       "actions actions actions actions";
  grid-template-columns: 25% 25% 25% 25%;
  padding: 20px;
}

.campo-divider {
  grid-area: divider;
}

.campo-divider2 {
  grid-area: divider2;
}

.campo-divider3 {
  grid-area: divider3;
}

.campo-divider4 {
  grid-area: divider4;
}

.campo-divider5 {
  grid-area: divider5;
}

.campo-divider6 {
  grid-area: divider6;
}

.campo-divider7 {
  grid-area: divider7;
}

.campo-title {
  grid-area: title;
}

.campo-title h1 {
  margin: auto;
  text-align: center;
}

.campo-nome {
  grid-area: nome;
  padding: 10px;
}

.campo-nomeAlternativo {
  grid-area: nomeAlternativo;
  padding: 10px;
}

.campo-generos {
  grid-area: generos;
  padding: 10px;
}

.campo-foto {
  grid-area: foto;
  padding: 10px;
}

.campo-capa {
  grid-area: capa;
  padding: 10px;
}

.campo-fotoPreview {
  grid-area: fotoPreview;
  padding: 10px;
}

.campo-capaPreview {
  grid-area: capaPreview;
  padding: 10px;
}

.campo-status {
  grid-area: status;
  padding: 10px;
}

.campo-dia {
  grid-area: dia;
  padding: 10px;
}

.campo-ano {
  grid-area: ano;
  padding: 10px;
}

.campo-disponibilidade {
  grid-area: disponibilidade;
  padding: 10px;
}

.campo-site {
  grid-area: site;
  padding: 10px;
}

.campo-myanimelist {
  grid-area: myanimelist;
  padding: 10px;
}

.campo-tipo {
  grid-area: tipo;
  padding: 10px;
}

.campo-sinopse {
  grid-area: sinopse;
  padding: 10px;
}

.campo-actions {
  grid-area: actions;
  padding: 10px;
}
</style>