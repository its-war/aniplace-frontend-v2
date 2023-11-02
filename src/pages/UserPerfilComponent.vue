<template>
  <div :style="isMobile?'margin-top: 65px':''">
    <div class="perfil-user">
      <div class="perfil-header" style="height: 500px;" :style="isMobile?'height: 200px':''"
           @mouseout="showEditCapa = false"
           @mouseover="showEditCapa = true">
        <v-img v-if="user.capa"
               :src="$getImg(user.capa, 'user/capa')"
               :height="isMobile?'200px':'500px'"
               width="100%" :cover="true" />
        <Transition>
          <v-progress-linear :indeterminate="true" color="red" v-if="loading.capa" />
        </Transition>
        <Transition>
          <v-btn v-show="showEditCapa"
                 icon="mdi-pencil"
                 @click="dialog.capa.active = true"
                 v-if="isLogged && $store.user.getIdUser === user.idUser"
                 :flat="true"
                 :style="user.capa ? 'bottom: 20px' : isMobile?'bottom: 110px':'bottom: 260px'"
                 style="position: absolute; right: 20px" />
        </Transition>
        <div class="text-center" :style="user.capa ? isMobile?'margin-top: -100px':'margin-top: -250px' : ''">
          <v-avatar
            v-if="user.foto"
            @mouseout="showEditFoto = false"
            @mouseover="showEditFoto = true"
            :size="isMobile?'150px':'300px'" style="border: 2px solid red">
            <v-img :src="$getImg(user.foto, 'user/foto')" :cover="true" :width="isMobile?'150px':'300px'"
                   :height="isMobile?'150px':'300px'" aspect-ratio="1" />
            <Transition>
              <v-btn v-show="showEditFoto" v-if="isLogged && $store.user.getIdUser === user.idUser" icon="mdi-pencil"
                     :flat="true" @click="dialog.foto.active = true"
                     :size="isMobile?'x-small':'default'"
                     style="position: absolute; top: 80px; right: 15px" />
            </Transition>
          </v-avatar>
          <v-avatar
            v-else
            :size="isMobile?'150px':'300px'"
            color="brown"
            style="position: relative"
            @mouseout="showEditFoto = false"
            @mouseover="showEditFoto = true">
            <Transition>
              <div class="text-center" v-if="loading.foto">
                <v-progress-circular indeterminate :size="isMobile?'80':'200'" :width="isMobile?'3':'6'" color="red" />
              </div>
            </Transition>
            <span :class="isMobile?'text-h3':'text-h1'">{{ userIniciais }}</span>
            <Transition>
              <v-btn v-show="showEditFoto" v-if="isLogged && $store.user.getIdUser === user.idUser" icon="mdi-pencil"
                     :flat="true" @click="dialog.foto.active = true"
                     style="position: absolute; top: 80px; right: 15px" />
            </Transition>
          </v-avatar>
          <div style="background-color: #212121; padding-top: 55px; margin-top: -50px">
            <h5 style="font-style: italic" :style="isMobile?'font-size: 10px':''">{{ getRankingUser }}</h5>
            <h1 :style="isMobile?'font-size: 17px':''">{{ user.nome }}</h1>
          </div>
        </div>
      </div>
      <div class="perfil-body" style="position: relative; z-index: 1"
           :style="user.capa ?
                isMobile?`grid-template-areas: 'info info info' 'data data data'; margin-top: 110px`
                    :
                'margin-top: 130px'
            : isMobile?`margin-top: 0; grid-template-areas: 'info info info' 'data data data'`:'margin-top: -115px'">
        <div class="perfil-info">
          <v-list
            @mouseover="showEditInfo = true"
            @mouseout="showEditInfo = false"
            style="padding: 15px; overflow: hidden">
            <h2>Informações do Usuário</h2>
            <Transition>
              <v-btn v-show="showEditInfo"
                     v-if="isLogged && user.idUser === $store.user.getIdUser"
                     icon="mdi-pencil"
                     :flat="true"
                     @click="showPainelEditUser"
                     style="position: absolute; top: 0; right: 0; z-index: 2" />
            </Transition>
            <div class="text-center">
              <v-progress-circular indeterminate size="80" color="red" v-if="loading.info" />
            </div>
            <v-list-item v-if="user.biografia">
              <div v-html="getBioSecure"></div>
            </v-list-item>
            <v-list-item style="font-style: italic" v-if="user.pronome">{{ user.pronome }}</v-list-item>
            <v-list-item v-if="getUserIdade">Idade: {{ getUserIdade }} anos</v-list-item>
            <v-list-item v-if="getRegistro">Registro: {{ getRegistro }}</v-list-item>
            <v-list-item v-if="user.genero">Gênero: {{ user.genero }}</v-list-item>
            <v-list-item v-if="user.animeFavorito">
              Anime Favorito:
              <span
                @click="goRoute('Anime', {id: user.animeFavorito.idAnime})">
                {{ user.animeFavorito.nome }}
              </span><!-- TODO: corrigir problema da rota ao entrar na mesma rota sem dar update na pagina -->
            </v-list-item>
            <v-list-item v-if="user.personagemFavorito">Personagem Favorito: {{ user.personagemFavorito }}</v-list-item>
            <v-list-item v-if="user.username && user.idUser === $store.user.getIdUser">Nome de usuário: {{ user.username
              }}
            </v-list-item>
            <v-list-item v-if="user.email && user.idUser === $store.user.getIdUser">Email: {{ user.email }}
            </v-list-item>
            <v-list-item v-if="getStatus">Status atual: {{ getStatus }}</v-list-item>
            <v-list-item v-if="user.ranking && user.idUser === $store.user.getIdUser">Ranking: {{ getRankingUser }}
            </v-list-item>
          </v-list>
          <div class="text-center" style="margin-top: 20px">
            <AdsComponent :vertical="true" />
          </div>
          <div class="atividade-recente" style="margin-top: 20px">
            <h3 style="text-align: center">Atividade Recente</h3>
            <v-list style="overflow: hidden">
              <div class="text-center">
                <h4 v-if="atividadeRecente.length === 0 && !loading.atividade">
                  Ainda não há atividade.
                </h4>
                <v-progress-circular indeterminate size="80" color="red" v-if="loading.atividade" />
              </div>
              <v-list-item
                @click="goRoute('Anime', {id: anime.idAnime})"
                v-for="anime in atividadeRecente"
                :key="anime.idAnime">
                {{ anime.nome }}
              </v-list-item>
            </v-list>
          </div>
        </div>
        <div class="perfil-data-section">
          <v-tabs
            v-model="tab"
            color="info"
            align-tabs="center"
            style="margin-bottom: 10px; z-index: 1; position: relative"
          >
            <v-tab :value="1">Postagens</v-tab>
            <v-tab v-if="false" :value="2">Lista de Animes</v-tab>
            <v-tab v-if="false" :value="3">Lista de Mangas</v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item :value="1">
              <PostagensComponent v-if="user.idUser" :id-user="user.idUser" />
              <h2 v-else>Não há postagens.</h2>
            </v-window-item>
          </v-window>
        </div>
      </div>
      <div class="perfil-footer">
        <v-dialog v-if="isLogged" v-model="dialog.foto.active" width="95%">
          <v-card width="100%" style="padding: 20px">
            <v-card-text>
              <div class="campo-fotoPreview" style="position: relative">
                <v-img v-if="dialog.foto.preview"
                       width="45%"
                       style="margin: auto; border-radius: 10px"
                       aspect-ratio="1"
                       :src="dialog.foto.preview"
                       :cover="true" />
                <v-btn v-if="dialog.foto.preview"
                       icon="mdi-close"
                       :flat="true"
                       @click="resetarFoto"
                       style="position: absolute; top: 0; right: 0" />
              </div>

              <v-row :no-gutters="true">
                <v-col sm="12">
                  <v-file-input @change="handleFotoChange"
                                v-show="!dialog.foto.preview"
                                v-model="dialog.foto.img"
                                accept="image/*"
                                v-on:click:clear="resetarFoto"
                                label="Selecione uma imagem para adicionar ao seu perfil"
                                base-color="info"
                                color="info"
                                variant="outlined">
                    <template v-slot:selection>
                      {{ $limitarTexto(dialog.foto.img[0].name, 25) }}
                    </template>
                  </v-file-input>
                </v-col>
              </v-row>
              <h3 style="color: #007bff">Recomendado: 500x500px</h3>
              <h3 style="color: red" v-if="dialog.foto.uploadErro.length > 0">{{ dialog.foto.uploadErro }}</h3>
            </v-card-text>
            <Transition>
              <v-card-actions v-if="dialog.foto.img">
                <v-spacer />
                <v-btn variant="tonal" @click="uploadFoto" :loading="dialog.foto.loading"
                       color="success" append-icon="mdi-upload"
                       text="Atualizar Foto" />
              </v-card-actions>
            </Transition>
          </v-card>
        </v-dialog>

        <v-dialog v-if="isLogged" v-model="dialog.capa.active" width="95%">
          <v-card width="100%" style="padding: 20px">
            <v-card-text>
              <div class="campo-fotoPreview" style="position: relative">
                <v-img v-if="dialog.capa.preview"
                       width="75%"
                       style="margin: auto; border-radius: 10px"
                       aspect-ratio="16/9"
                       :src="dialog.capa.preview"
                       :cover="true" />
                <v-btn v-if="dialog.capa.preview"
                       icon="mdi-close"
                       :flat="true"
                       @click="resetarCapa"
                       style="position: absolute; top: 0; right: 0" />
              </div>

              <v-file-input @change="handleCapaChange"
                            v-show="!dialog.capa.preview"
                            v-model="dialog.capa.img"
                            accept="image/*"
                            v-on:click:clear="resetarCapa"
                            label="Selecione uma imagem para adicionar ao seu perfil como capa"
                            base-color="info"
                            color="info"
                            variant="outlined">
                <template v-slot:selection>
                  {{ $limitarTexto(dialog.capa.img[0].name, 25) }}
                </template>
              </v-file-input>
              <h3 style="color: #007bff">Recomendado: 950x500px</h3>
              <h3 style="color: red" v-if="dialog.capa.uploadErro.length > 0">{{ dialog.capa.uploadErro }}</h3>
            </v-card-text>
            <Transition>
              <v-card-actions v-if="dialog.capa.img">
                <v-spacer />
                <v-btn variant="tonal" @click="uploadCapa" :loading="dialog.capa.loading"
                       color="success" append-icon="mdi-upload"
                       text="Atualizar Foto" />
              </v-card-actions>
            </Transition>
          </v-card>
        </v-dialog>

        <v-dialog v-if="isLogged" v-model="dialog.info.active" width="95%" :persistent="dialog.info.loading">
          <v-card width="100%" style="padding: 10px">
            <v-card-title>Editar Informações</v-card-title>
            <v-btn :flat="true"
                   icon="mdi-close"
                   style="position: absolute; top: 0; right: 0"
                   :disabled="dialog.info.loading"
                   @click="dialog.info.active = false" />
            <v-form v-model="dialog.info.formValid" ref="form" :fast-fail="true">
              <v-card-text class="form-scroll-blue" :style="isMobile?'max-height: 300px':''" style="max-height: 500px; overflow-y: auto">

                <v-text-field v-model="dialog.info.user.apelido" label="Apelido" variant="outlined" />

                <v-select v-model="dialog.info.user.pronome"
                          label="Pronome"
                          item-title="text"
                          item-value="value"
                          :items="[{ text: 'Ele/dele', value: 'ele/dele' }, { text: 'Ela/dela', value: 'ela/dela' }, { text: 'Edu/delu', value: 'elu/delu' }]"
                          variant="outlined" />

                <v-select v-model="dialog.info.user.genero"
                          label="Gênero"
                          :items="[{ text: 'Masculino', value: 'masculino' }, { text: 'Feminino', value: 'feminino' }, { text: 'Não-binário', value: 'não-binário' }, { text: 'Não quero informar', value: 'não quero informar' }]"
                          item-title="text"
                          item-value="value"
                          variant="outlined" />

                <div v-if="dialog.info.user.animeFavorito">
                  <h3>Anime Favorito:</h3>
                  <div class="anime-item-busca-fav"
                       style="width: 300px; display: inline-block; padding: 10px; margin-bottom: 10px">
                    <div style="width: 100%">
                      <v-img :src="$getImg(dialog.info.user.animeFavorito.capa, 'anime/capa')"
                             aspect-ratio="16/9"
                             style="border-radius: 10px"
                             width="100%" :cover="true" />
                      <h4 style="text-align: center">{{ $limitarTexto(dialog.info.user.animeFavorito.nome, 25) }}</h4>
                    </div>
                  </div>
                </div>
                <v-btn v-if="dialog.info.user.animeFavorito"
                       @click="dialog.info.user.animeFavorito = null"
                       style="margin-bottom: 15px"
                       text="Mudar Favorito"
                       color="success" variant="tonal" />

                <v-text-field
                  v-if="!dialog.info.user.animeFavorito"
                  v-model="dialog.info.animeBusca.texto"
                  @keyup="carregarBusca"
                  label="Anime Favorito"
                  placeholder="Digite o nome do anime"
                  variant="outlined" />

                <div style="width: 100%; padding: 10px; max-height: 450px; overflow-y: auto"
                     v-if="dialog.info.animeBusca.active">
                  <h5 style="margin-bottom: 10px">Selecione o anime</h5>
                  <div class="anime-item-busca-fav"
                       style="width: 25%; display: inline-block; padding: 10px"
                       @click="selecionarAnimeFavorito(anime)"
                       v-for="anime in dialog.info.animeBusca.resultado" :key="anime.idAnime">
                    <div style="width: 100%">
                      <v-img :src="$getImg(anime.capa, 'anime/capa')"
                             aspect-ratio="16/9"
                             style="border-radius: 10px"
                             width="100%" :cover="true" />
                      <h5 style="text-align: center">{{ $limitarTexto(anime.nome, 25) }}</h5>
                    </div>
                  </div>
                </div>

                <v-text-field v-model="dialog.info.user.personagemFavorito" label="Personagem Favorito"
                              variant="outlined" />

                <v-textarea
                  v-model="dialog.info.user.biografia"
                  label="Biografia"
                  :auto-grow="true"
                  rows="2"
                  counter
                  :clearable="true"
                  :rules="biografiaRules"
                  variant="outlined" />
                <v-text-field
                  v-model="dialog.info.user.nascimento"
                  label="Data de Nascimento"
                  placeholder="dd/mm/aaaa"
                  :rules="dateRules"
                  @input="dataMask"
                  @keydown="deleteBarra"
                  variant="outlined" />

                <v-text-field
                  label="Senha atual"
                  :placeholder="dialog.info.showPassword ? 'Abc@1234' : '********'"
                  v-model="dialog.info.user.senha"
                  :rules="senhaRules"
                  variant="outlined"
                  :append-inner-icon="dialog.info.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  v-on:click:appendInner="dialog.info.showPassword = !dialog.info.showPassword"
                  :type="dialog.info.showPassword ? 'text' : 'password'"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn @click="salvarInformacoes" :loading="dialog.info.loading" text="Salvar"
                       prepend-icon="mdi-content-save-outline" color="success"
                       variant="tonal" />
                <v-btn @click="dialog.info.active = false" :disabled="dialog.info.loading" text="Cancelar"
                       append-icon="mdi-cancel" color="red-accent-2"
                       variant="tonal" />
              </v-card-actions>
            </v-form>
          </v-card>
          <v-snackbar color="red" v-model="dialog.info.activeErro">
            <div class="text-center">
              {{ dialog.info.uploadErro }}
            </div>
          </v-snackbar>
        </v-dialog>
      </div>
    </div>
    <div style="height: 100px;"></div>
  </div>
</template>

<script>
import PostagensComponent from "@/components/postagens/PostagensComponent.vue";
import AdsComponent from "@/components/globalComponents/AdsComponent.vue";
import DOMPurify from "dompurify";

export default {
  name: "UserPerfilComponent",
  components: { AdsComponent, PostagensComponent },
  computed: {
    userIniciais() {
      let nome = this.user.nome;
      if (nome) {
        const palavras = nome.split(" ");
        if (palavras.length === 1) {
          return nome.substring(0, 2);
        } else {
          const iniciais = palavras
            .map(nome => nome.charAt(0))
            .join("");
          return iniciais.slice(0, 2);
        }
      }
      return "";
    },
    getRankingUser() {
      if (this.user.ranking) {
        return this.rankings[this.user.ranking - 1];
      }
      return "";
    },
    getUserIdade() {
      if (this.user.nascimento) {
        const dataNascimento = new Date(this.user.nascimento);
        const hoje = new Date();
        const diff = hoje - dataNascimento;
        return Math.floor(diff / 31536000000);
      }
      return false;
    },
    getRegistro() {
      if (this.user.registro) {
        const dataRegistro = new Date(this.user.registro);
        const hoje = new Date();
        const diffEmMilissegundos = hoje - dataRegistro;
        const milissegundosPorDia = 24 * 60 * 60 * 1000;
        const diasPassados = Math.floor(diffEmMilissegundos / milissegundosPorDia);
        const mesesPassados = Math.floor(diasPassados / 30);
        const anosPassados = Math.floor(mesesPassados / 12);
        const mesesRestantes = mesesPassados % 12;
        const diasRestantes = diasPassados - (mesesPassados * 30);
        let tempoDesdeRegistro = `Há`;
        if (anosPassados > 0) {
          tempoDesdeRegistro += ` ${anosPassados} ${anosPassados === 1 ? "ano" : "anos"}`;
        }
        if (mesesRestantes > 0) {
          tempoDesdeRegistro += ` ${anosPassados > 0 ? "e " : ""}${mesesRestantes} ${mesesRestantes === 1 ? "mês" : "meses"}`;
        }
        if (diasRestantes > 0) {
          tempoDesdeRegistro += ` ${mesesRestantes > 0 ? "e " : ""}${diasRestantes} ${diasRestantes === 1 ? "dia" : "dias"}`;
        }

        return tempoDesdeRegistro;
      }
      return false;
    },
    getStatus() {
      if (this.user.status) {
        return this.status[this.user.status - 1];
      }
      return false;
    },
    isLogged() {
      return this.$store.main.isLogged;
    },
    dateRules() {
      return [
        (v) => {
          // Implemente a lógica de validação da data aqui
          if (v.length === 0) {
            return true;
          } else {
            if (this.isValidDate(v) && this.isUserAgeValid(v)) {
              return true; // Data válida
            }
            return "Data de nascimento inválida ou idade inferior a 10 anos";
          }
        }
      ];
    },
    nomeRules() {
      return [
        v => !!v || "Nome é obrigatório",
        v => /^[A-Za-zÀ-ú\sçÇ]+$/.test(v) || "Nome de usuário não pode conter números",
        v => {
          let vSplit = v.split(" ");
          if (vSplit.length < 2) {
            return "Nome inválido";
          }
          for (const vs of vSplit) {
            if (vs.length < 1) {
              return "Nome inválido";
            }
          }
          return true;
        }
      ];
    },
    emailRules() {
      return [
        v => !!v || "Email é obrigatório",
        v => {
          let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return !!emailRegex.test(v) || "Email inválido";
        },
        v => {
          let emailFrangs = v.split("@").pop();
          const emailAllowed = ["gmail.com", "hotmail.com", "outlook.com", "me.com", "icloud.com", "yahoo.com"];
          return !!emailAllowed.includes(emailFrangs) || "Email inválido, somente @gmail.com, @hotmail.com, @outlook.com, @me.com, @icloud.com e @yahoo.com";
        }
      ];
    },
    biografiaRules() {
      return [
        v => v.length <= 255 || "Biografia não pode conter mais que 255 caracteres"
      ];
    },
    getBioSecure() {
      return DOMPurify.sanitize(this.user.biografia.replace(/\n/g, "<br/>"), {
        USE_PROFILES: {
          html: true
        },
        ALLOWED_TAGS: [
          "b", "br", "i", "strong", "em"
        ]
      });
    },
    senhaRules() {
      return [
        (e) => !!e || "Senha é obrigatória para alterar qualquer informação do usuário",
        e => e.length >= 8 || "Senha deve conter pelo menos 8 caracteres"
      ];
    },
    isMobile() {
      return this.$store.main.isMobile;
    }
  },
  data: () => ({
    tab: null,
    showEditFoto: false,
    showEditCapa: false,
    showEditInfo: false,
    user: {
      idUser: null,
      nome: null,
      username: null,
      email: null,
      status: null,
      ranking: null,
      foto: null,
      capa: null,
      apelido: null,
      biografia: null,
      pronome: null,
      nascimento: null,
      registro: null,
      genero: null,
      animeFavorito: null,
      personagemFavorito: null
    },
    loading: {
      foto: true,
      capa: true,
      info: true,
      post: false,
      atividade: true
    },
    rankings: [
      "Novato",                 //1
      "Membro",                 //2
      "Usuário Ativo",          //3
      "Criador de Conteúdo",    //4
      "Doador - Usuário VIP",   //5
      "Tradutor",               //6
      "Encoder",                //7
      "Uploader",               //8
      "Moderador",              //9
      "Administrador",          //10
      "Fundador"                //11
    ],
    status: [
      "Ativo",
      "Em observação",
      "Banido",
      "Inativo",
      "Desativado"
    ],
    dialog: {
      foto: {
        active: false,
        img: null,
        preview: null,
        uploadErro: "",
        loading: false
      },
      capa: {
        active: false,
        img: null,
        preview: null,
        uploadErro: "",
        loading: false
      },
      info: {
        active: false,
        loading: false,
        uploadErro: "",
        activeErro: false,
        user: {
          apelido: null,
          pronome: null,
          genero: null,
          nascimento: "",
          animeFavorito: null,
          personagemFavorito: null,
          biografia: null,
          senha: ""
        },
        animeBusca: {
          active: false,
          texto: "",
          resultado: []
        },
        showPassword: false,
        formValid: false
      }
    },
    atividadeRecente: []
  }),
  mounted() {
    this.carregarPerfil();
  },
  methods: {
    goRoute(nomeRota, params = null) {
      if (params) {
        this.$router.push({ name: nomeRota, params: params });
      } else {
        this.$router.push({ name: nomeRota });
      }
    },
    handleFotoChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.dialog.foto.preview = URL.createObjectURL(file);
      } else {
        this.dialog.foto.preview = null;
      }
    },
    handleCapaChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.dialog.capa.preview = URL.createObjectURL(file);
      } else {
        this.dialog.capa.preview = null;
      }
    },
    resetarFoto() {
      this.dialog.foto.img = null;
      this.dialog.foto.preview = null;
    },
    resetarCapa() {
      this.dialog.capa.img = null;
      this.dialog.capa.preview = null;
    },
    uploadFoto() {
      if (this.dialog.foto.img) {
        const form = new FormData();
        form.append("foto", this.dialog.foto.img[0]);
        this.axios.post("user/setFoto", form, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }).then((response) => {
          if (response.data.foto) {
            this.user.foto = response.data.foto;
            this.$store.user.setFoto(response.data.foto);
            this.resetarFoto();
            this.dialog.foto.active = false;
          }
        });
      }
    },
    uploadCapa() {
      if (this.dialog.capa.img) {
        const form = new FormData();
        form.append("capa", this.dialog.capa.img[0]);
        this.axios.post("user/setCapa", form, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }).then((response) => {
          if (response.data.capa) {
            this.user.capa = response.data.capa;
            this.$store.user.setFoto(response.data.capa);
            this.resetarCapa();
            this.dialog.capa.active = false;
          }
        });
      }
    },
    carregarAtividades() {
      this.axios.get("user/getAtividades", {
        params: {
          idUser: this.user.idUser
        }
      }).then((res) => {
        this.atividadeRecente = res.data.animes;
      }).finally(() => {
        this.loading.atividade = false;
      });
    },
    async carregarPerfil() {
      if (this.$route.params.id) {
        this.user = await this.$store.main.getUserPerfil(this.$route.params.id);
        this.carregarAtividades();
        this.loading.info = false;
        this.loading.foto = false;
        this.loading.capa = false;
      } else {
        this.loading.info = false;
        this.loading.foto = false;
        this.loading.capa = false;
        this.user = this.$store.user.getUserPerfil;
        this.carregarAtividades();
      }
    },
    dataMask(event) {
      if (event.key !== "Backspace") {
        let value = event.target.value;
        let length = value.length;
        if (length >= 10) {
          event.target.value = value.slice(0, 10);
          return;
        }
        if (event.key !== "/" && (length === 2 || length === 5) && event.key !== "Backspace") {
          event.target.value += "/";
        }
        event.target.value = event.target.value.replace(/[^0-9/]/g, "");
      }
    },
    deleteBarra(e) {
      if (e.key === "Backspace") {
        const inputValue = e.target.value;
        if (inputValue.charAt(inputValue.length - 1) === "/") {
          e.target.value = inputValue.slice(0, inputValue.length - 1);
        }
      }
    },
    isValidDate(dateStr) {
      const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!datePattern.test(dateStr)) {
        return false;
      }
      const [day, month, year] = dateStr.split("/");
      const date = new Date(year, month - 1, day); // Mês é base 0
      return (
        date.getDate() === parseInt(day, 10) &&
        date.getMonth() === month - 1 &&
        date.getFullYear() === parseInt(year, 10)
      );
    },
    isUserAgeValid(dateStr) {
      if (this.isValidDate(dateStr)) {
        const [day, month, year] = dateStr.split("/").map(Number); // Converte as partes em números
        const inputDate = new Date(year, month - 1, day); // Mês é base 0
        const currentDate = new Date();

        const age = currentDate.getFullYear() - inputDate.getFullYear();

        if (
          inputDate.getMonth() > currentDate.getMonth() ||
          (inputDate.getMonth() === currentDate.getMonth() && inputDate.getDate() > currentDate.getDate())
        ) {
          return age >= 10;
        }

        return age >= 11;
      }
      return false;
    },
    nomeMaiusculo(event) {
      event.target.value = event.target.value
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    },
    carregarBusca() {
      if (this.dialog.info.animeBusca.texto.length > 0) {
        this.axios.get("anime/pesquisa", {
          params: {
            texto: this.dialog.info.animeBusca.texto,
            pagina: 1
          }
        }).then((res) => {
          this.dialog.info.animeBusca.active = true;
          this.dialog.info.animeBusca.resultado = res.data.animes;
        });
      }
    },
    selecionarAnimeFavorito(anime) {
      this.dialog.info.user.animeFavorito = {
        idAnime: anime.idAnime,
        nome: anime.nome,
        capa: anime.capa
      };
      this.dialog.info.animeBusca.active = false;
      this.dialog.info.animeBusca.resultado = [];
      this.dialog.info.animeBusca.texto = "";
    },
    showPainelEditUser() {
      let n = this.user.nascimento ? new Date(this.user.nascimento) : false;
      this.dialog.info.user = {
        nome: this.user.nome ?? "",
        apelido: this.user.apelido ?? "",
        email: this.user.email ?? "",
        pronome: this.user.pronome ?? "",
        genero: this.user.genero ?? "",
        nascimento: n ? `${n.getDate().toString().padStart(2, "0")}/${(n.getMonth() + 1).toString().padStart(2, "0")}/${n.getFullYear()}` : "",
        animeFavorito: this.user.animeFavorito,
        personagemFavorito: this.user.personagemFavorito ?? "",
        biografia: this.user.biografia ?? ""
      };
      this.dialog.info.active = true;
    },
    async salvarInformacoes() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        this.dialog.info.loading = true;
        const form = {
          apelido: this.dialog.info.user.apelido.length > 0 ? this.dialog.info.user.apelido : null,
          pronome: this.dialog.info.user.pronome,
          genero: this.dialog.info.user.genero,
          nascimento: this.dialog.info.user.nascimento.length === 10 ? this.dialog.info.user.nascimento : null,
          personagemFavorito: this.dialog.info.user.personagemFavorito ? this.dialog.info.user.personagemFavorito : null,
          biografia: this.dialog.info.user.biografia.length > 0 ? this.dialog.info.user.biografia : null,
          senha: this.dialog.info.user.senha
        };

        if (this.dialog.info.user.animeFavorito) {
          form.animeFavorito = this.dialog.info.user.animeFavorito.idAnime;
        } else {
          form.animeFavorito = 0;
        }

        this.axios.put("user/update", form).then(async (res) => {
          if (res.data.user) {
            this.user = await this.$store.main.getUserPerfil(this.user.idUser);
            this.dialog.info.active = false;
          } else {
            this.dialog.info.uploadErro = res.data.msg;
            this.dialog.info.activeErro = true;
          }
        }).finally(() => {
          this.dialog.info.loading = false;
        });
      }
    }
  },
  watch: {
    "$route.params.id"() {
      this.carregarPerfil();
    }
  }
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.perfil-user {
  width: 100%;
}

.perfil-header {
  width: 100%;
  position: relative;
  z-index: 1;
}

.perfil-body {
  width: 90%;
  display: grid;
  grid-template-areas: "info data data";
  grid-template-columns: 35% 25% 40%;
  margin: auto;
}

.perfil-info {
  grid-area: info;
  position: relative;
}

.perfil-data-section {
  grid-area: data;
  padding: 0 20px 20px;
}

.anime-item-busca-fav {
  transition: 200ms ease-in-out;
  border-radius: 8px;
  cursor: pointer;
}

.anime-item-busca-fav:hover {
  background-color: rgb(70, 70, 70);
}

.form-scroll-blue::-webkit-scrollbar {
  width: 2px;
}

.form-scroll-blue::-webkit-scrollbar-thumb {
  background-color: dodgerblue;
}

.form-scroll-blue::-webkit-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}

.form-scroll-blue::-ms-scrollbar {
  width: 2px;
}

.form-scroll-blue::-ms-scrollbar-thumb {
  background-color: dodgerblue;
}

.form-scroll-blue::-ms-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}

.form-scroll-blue::-moz-scrollbar {
  width: 2px;
}

.form-scroll-blue::-moz-scrollbar-thumb {
  background-color: dodgerblue;
}

.form-scroll-blue::-moz-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}
</style>