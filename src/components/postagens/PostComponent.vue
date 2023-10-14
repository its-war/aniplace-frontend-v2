<template>
  <article style="width: 100%">
    <div class="postagem">
      <v-btn v-if="user.idUser === $store.user.getIdUser" icon flat style="position: absolute; top: 0; right: 0">
        <v-icon icon="mdi-dots-vertical"/>
        <v-menu activator="parent">
          <v-list>
            <v-list-item @click="deletePanel = true">Excluir</v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <div class="postagem-header">
        <div class="usuario-info">
          <img v-if="$props.user.foto" :src="$getImg($props.user.foto, 'user/foto')" alt="Foto do Usuário" class="foto-usuario">
          <div class="nome-usuario">{{$props.user.nome}}</div>
        </div>
        <div v-if="user.idUser !== $store.user.getIdUser" style="margin-right: 0" class="postagem-data">{{getTime}}</div>
        <div v-else class="postagem-data">{{getTime}}</div>
      </div>
      <div class="postagem-conteudo">
        <p>{{$props.texto}}</p>
        <!-- Se houver uma imagem na postagem, você pode adicioná-la aqui -->
        <div class="img-container" v-if="$props.imagem">
          <v-img @click="imgFull = true" class="img-post" cover aspect-ratio="16/9" :src="$getImg($props.imagem, 'post')" alt="Imagem da Postagem"/>
          <v-icon @click="imgFull = true" icon="mdi-arrow-expand" size="80" class="icon-img"/>
        </div>
      </div>
      <div class="postagem-footer">

        <v-btn v-if="$store.main.isLogged" variant="text" @click="curtir" :size="isMobile?'x-small':'default'">
          <v-icon v-if="userHasCurtirda" icon="mdi-heart" color="red"/>
          <v-icon v-else icon="mdi-heart-outline"/>
          {{$props.curtidas.total}}
        </v-btn>
        <span v-else style="margin-right: 8px" :style="isMobile?'font-size: 10px':''">
          <v-icon icon="mdi-heart" color="red"/>{{$props.curtidas.total}}
        </span>

        <v-btn v-if="!activeComments" @click="activeComments = true" prepend-icon="mdi-comment-text" text="Comentários" color="success" variant="text"></v-btn>
        <v-btn v-if="activeComments" @click="activeComments = false" prepend-icon="mdi-comment-off" text="Ocultar Comentários" color="warning" variant="text"></v-btn>

      </div>

      <ComentariosComponent v-if="activeComments" :id-origem="$props.idPostagem" :tipo="3"/>
    </div>

    <v-dialog width="auto" height="auto" scrollable v-model="imgFull">
      <v-img :aspect-ratio="1" width="600" :src="$getImg($props.imagem, 'post')" alt="Imagem da Postagem"/>
    </v-dialog>
  </article>
  <v-dialog v-model="deletePanel" persistent width="auto">
    <v-card>
      <v-card-title :style="isMobile?'font-size: 10px':''">Tem certeza que deseja excluir a postagem?</v-card-title>
      <v-card-actions>
        <v-btn prepend-icon="mdi-cancel"
               color="success"
               :size="isMobile?'small':'default'"
               @click="deletePanel = false">Cancelar</v-btn>
        <v-spacer/>
        <v-btn append-icon="mdi-delete"
               color="red"
               :size="isMobile?'small':'default'"
               @click="excluirPost">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ComentariosComponent from "@/components/comments/ComentariosComponent.vue";
export default {
  name: "PostComponent",
  components: { ComentariosComponent },
  props: {
    idPostagem: {
      type: Number,
      required: true
    },
    texto: {
      type: String,
      default: null
    },
    imagem: {
      type: String,
      default: null
    },
    registro: {
      type: String,
      required: true
    },
    user: {
      type: Object,
      required: true
    },
    curtidas: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    imgFull: false,
    loadingCurtir: false,
    activeComments: false,
    deletePanel: false
  }),
  computed: {
    getTime(){
      const agora = new Date();
      const dataComentario = new Date(this.$props.registro);
      const diferencaEmSegundos = Math.floor((agora - dataComentario) / 1000);

      if (diferencaEmSegundos < 60) {
        return 'agora mesmo';
      } else if (diferencaEmSegundos < 3600) {
        const minutos = Math.floor(diferencaEmSegundos / 60);
        return `há ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
      } else if (diferencaEmSegundos < 86400) {
        const horas = Math.floor(diferencaEmSegundos / 3600);
        return `há ${horas} hora${horas !== 1 ? 's' : ''}`;
      } else if (diferencaEmSegundos < 2592000) {
        const dias = Math.floor(diferencaEmSegundos / 86400);
        return `há ${dias} dia${dias !== 1 ? 's' : ''}`;
      } else if (diferencaEmSegundos < 31536000) {
        const meses = Math.floor(diferencaEmSegundos / 2592000);
        return `há ${meses} mês${meses !== 1 ? 'es' : ''}`;
      } else {
        const anos = Math.floor(diferencaEmSegundos / 31536000);
        return `há ${anos} ano${anos !== 1 ? 's' : ''}`;
      }
    },
    isMobile(){
      return this.$store.main.isMobile;
    },
    userHasCurtirda(){
      for(let i = 0; i < this.$props.curtidas.users.length; i++){
        if(this.$props.curtidas.users[i] === this.$store.user.getIdUser){
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    curtir(){
      this.loadingCurtir = true;
      this.axios.post('post/curtir', {
        idPostagem: this.$props.idPostagem
      }).then((response) => {
        if(!response.data.erro){
          this.$emit('hasCurtir', response.data.curtiu, this.$props.idPostagem);
        }
      }).finally(() => {
        this.loadingCurtir = false;
      });
    },
    excluirPost(){
      this.axios.delete('post/delete', {
        data: {
          idPostagem: this.$props.idPostagem
        }
      }).then((response) => {
        if(response.data.deletou){
          this.deletePanel = false;
          this.$emit('hasDeletePost', this.$props.idPostagem);
        }
      });
    }
  },
  emits: ['hasCurtir', 'hasDeletePost']
}
</script>

<style scoped>
.postagem {
  position: relative;
  background-color: rgb(30,30,30);
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.postagem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.usuario-info {
  display: flex;
  align-items: center;
}

.foto-usuario {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.nome-usuario {
  font-weight: bold;
}

.postagem-data {
  color: #888;
  margin-right: 50px;
  cursor: pointer;
}

.postagem-data:hover {
  color: white;
  text-decoration: underline;
}

.postagem-conteudo {
  font-size: 16px;
  line-height: 1.5;
}

.postagem-conteudo .img-post {
  max-width: 100%;
  max-height: 100%;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 10px;
  transition: filter 300ms;
}

.img-container:hover .img-post {
  filter: brightness(50%);
}

.img-container:hover .icon-img {
  filter: brightness(100%);
  opacity: 1;
}

.img-container {
  padding: 0;
  width: 100%;
  height: 400px;
  position: relative;
}

.icon-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  opacity: 0;
  transition: opacity 200ms;
}

.postagem-footer {
  padding: 10px 10px 0;
}
</style>