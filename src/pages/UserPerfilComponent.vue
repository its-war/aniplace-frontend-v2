<template>
  <v-main>
    <div class="perfil-user">
      <div class="perfil-header" style="height: 500px;"
           @mouseout="showEditCapa = false"
           @mouseover="showEditCapa = true">
        <v-img v-if="user.capa" :src="$getImg(user.capa, 'user/capa')" height="500px" width="100%" :cover="true" />
        <Transition>
          <v-progress-linear :indeterminate="true" color="red" v-if="loading.capa" />
        </Transition>
        <Transition>
          <v-btn v-show="showEditCapa"
                 icon="mdi-pencil"
                 @click="dialog.capa.active = true"
                 v-if="isLogged && $store.user.getIdUser === user.idUser"
                 :flat="true"
                 :style="user.capa ? 'bottom: 20px' : 'bottom: 260px'"
                 style="position: absolute; right: 20px" />
        </Transition>
        <div class="text-center" :style="user.capa ? 'margin-top: -250px' : ''">
          <v-avatar
            v-if="user.foto"
            @mouseout="showEditFoto = false"
            @mouseover="showEditFoto = true"
            size="300px" style="border: 2px solid red">
            <v-img :src="$getImg(user.foto, 'user/foto')" :cover="true" width="300px" height="300px" aspect-ratio="1" />
            <Transition>
              <v-btn v-show="showEditFoto" v-if="isLogged && $store.user.getIdUser === user.idUser" icon="mdi-pencil"
                     :flat="true" @click="dialog.foto.active = true"
                     style="position: absolute; top: 80px; right: 15px" />
            </Transition>
          </v-avatar>
          <v-avatar
            v-else
            size="300px"
            color="brown"
            style="position: relative"
            @mouseout="showEditFoto = false"
            @mouseover="showEditFoto = true">
            <Transition>
              <div class="text-center" v-if="loading.foto">
                <v-progress-circular indeterminate size="200" width="6" color="red" />
              </div>
            </Transition>
            <span class="text-h1">{{ userIniciais }}</span>
            <Transition>
              <v-btn v-show="showEditFoto" v-if="isLogged && $store.user.getIdUser === user.idUser" icon="mdi-pencil"
                     :flat="true" @click="dialog.foto.active = true"
                     style="position: absolute; top: 80px; right: 15px" />
            </Transition>
          </v-avatar>
          <div style="background-color: #212121; padding-top: 55px; margin-top: -50px">
            <h5 style="font-style: italic">{{ getRankingUser }}</h5>
            <h1>{{ user.nome }}</h1>
          </div>
        </div>
      </div>
      <div class="perfil-body" style="position: relative; z-index: 1"
           :style="user.capa ? 'margin-top: 130px' : 'margin-top: -115px'">
        <div class="perfil-info">
          <v-list style="padding: 15px; overflow: hidden">
            <h2>Informações do Usuário</h2>
            <v-btn icon="mdi-pencil" :flat="true" style="position: absolute; top: 0; right: 0; z-index: 2" />
            <div class="text-center">
              <v-progress-circular indeterminate size="80" color="red" v-if="loading.info" />
            </div>
            <v-list-item v-if="user.biografia">{{ user.biografia }}</v-list-item>
            <v-list-item style="font-style: italic" v-if="user.pronome">{{ user.pronome }}</v-list-item>
            <v-list-item v-if="getUserIdade">Idade: {{ getUserIdade }} anos</v-list-item>
            <v-list-item v-if="getRegistro">Registro: {{ getRegistro }}</v-list-item>
            <v-list-item v-if="user.genero">Gênero: {{ user.genero }}</v-list-item>
            <v-list-item v-if="user.animeFavorito">
              Anime Favorito:
              <span
                @click="goRoute('Anime', {id: user.animeFavorito.idAnime})">
                {{ user.animeFavorito.nome }}
              </span>
            </v-list-item>
            <v-list-item v-if="user.personagemFavorito">Personagem Favorito: {{ user.personagemFavorito }}</v-list-item>
            <v-list-item v-if="user.username">Nome de usuário: {{ user.username }}</v-list-item>
            <v-list-item v-if="user.email">Email: {{ user.email }}</v-list-item>
            <v-list-item v-if="getStatus">Status atual: {{ getStatus }}</v-list-item>
            <v-list-item v-if="user.ranking">Ranking: {{ getRankingUser }}</v-list-item>
          </v-list>
          <div class="text-center" style="margin-top: 20px">
            <AdsComponent :vertical="true" />
          </div>
          <div class="atividade-recente" style="margin-top: 20px">
            <h3 style="text-align: center">Atividade Recente</h3>
            <v-list>
              <v-list-item>Naruto</v-list-item>
              <v-list-item>Bleach</v-list-item>
              <v-list-item>One Piece</v-list-item>
              <v-list-item>Darling</v-list-item>
              <v-list-item>Isekai Nonbiri</v-list-item>
              <v-list-item>Tsuki ga Muchibuki</v-list-item>
              <v-list-item>Tensei Shitara</v-list-item>
              <v-list-item>Shingeki</v-list-item>
              <v-list-item>Absolute Duo</v-list-item>
              <v-list-item>Tate no Yuusha</v-list-item>
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
            <v-tab :value="2">Lista de Animes</v-tab>
            <v-tab :value="3">Lista de Mangas</v-tab>
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
        <v-dialog v-if="isLogged" v-model="dialog.foto.active" width="65%">
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

        <v-dialog v-if="isLogged" v-model="dialog.capa.active" width="65%">
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
      </div>
    </div>
    <div style="height: 500px;"></div>
  </v-main>
</template>

<script>
import img from "@/assets/user-capa-1.jpg";
import PostagensComponent from "@/components/postagens/PostagensComponent.vue";
import AdsComponent from "@/components/globalComponents/AdsComponent.vue";

export default {
  name: "UserPerfilComponent",
  components: { AdsComponent, PostagensComponent },
  computed: {
    getImg() {
      if (img) {
        return img;
      } else {
        return null;
      }
    },
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
    }
  },
  data: () => ({
    tab: null,
    showEditFoto: false,
    showEditCapa: false,
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
      atividade: false
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
      }
    }
  }),
  async mounted() {
    //this.loading.info = true;
    if (this.$route.params.id) {
      this.user = await this.$store.main.getUserPerfil(this.$route.params.id);
      this.loading.info = false;
      this.loading.foto = false;
      this.loading.capa = false;
    } else {
      this.loading.info = false;
      this.loading.foto = false;
      this.loading.capa = false;
      this.user = this.$store.user.getUserPerfil;
    }
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
</style>