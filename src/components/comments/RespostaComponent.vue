<template>
  <div class="comment2" style="margin: auto" :style="isMobile?'width: 85%; padding: 10px':''">
    <div class="user-info">
      <img v-if="$props.user.foto" :src="$getImg($props.user.foto, 'user/foto')"
           @click="goUser"
           alt="Foto do Usuário" class="user-image" :style="isMobile?'width: 20px; height: 20px':''">
      <div class="user" @click="goUser" :style="isMobile?'font-size: 9px; margin-top: 4px':''">{{$props.user.nome}}</div>
      <div class="timestamp" :style="isMobile?'font-size: 8px':''">{{$props.editado ? '(editado) - ' : ''}}{{getTime}}</div>
    </div>
    <div class="comment-text" :style="isMobile?'font-size: 10px':''">
      {{$props.texto}}
    </div>
    <div class="actions">
      <v-btn v-if="$store.main.isLogged"
             variant="text"
             :size="isMobile?'x-small':'default'"
             @click="curtir">
        <v-icon v-if="userHasCurtirda" icon="mdi-heart" color="red"/>
        <v-icon v-else icon="mdi-heart-outline"/>
        {{$props.curtidas.total}}
      </v-btn>
      <span v-else style="margin-right: 8px" :style="isMobile?'font-size: 10px':''">
        <v-icon icon="mdi-heart" color="red"/>{{$props.curtidas.total}}
      </span>
    </div>
    <div class="dropdown" v-click-outside="closeDropdown">
      <v-btn @click="optDropdown = !optDropdown"
             color="red"
             icon="mdi-dots-vertical"
             :size="isMobile?'x-small':'default'"
             variant="text" class="button"></v-btn>
      <div class="dropdown-content" v-show="optDropdown">
        <span>Reportar</span>
        <span v-if="$store.main.isLogged && $store.user.getIdUser === $props.user.idUser"
              @click="abrirEdicao">Editar</span>
        <span v-if="$store.main.isLogged && $store.user.getIdUser === $props.user.idUser"
              @click="deletePainel = true; optDropdown = false">Excluir</span>
      </div>
    </div>
  </div>
  <v-dialog v-model="edicao.painel" persistent width="auto">
    <v-card>
      <v-card-title>Editar Resposta</v-card-title>
      <v-card-text>
        <v-btn icon="mdi-close"
               variant="text"
               style="position: absolute; top: 0; right: 0"
               @click="edicao.painel = false"></v-btn>
        <v-textarea label="Edite sua resposta..."
                    v-model="edicao.texto"
                    rows="2"
                    :counter="true"
                    :rules="edicao.rules"
                    :loading="edicao.loading"
                    variant="outlined"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn variant="text"
               color="success"
               :loading="edicao.loading"
               @click="editarResposta"
               append-icon="mdi-content-save-edit">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deletePainel" persistent width="auto">
    <v-card>
      <v-card-title :style="isMobile?'font-size: 10px':''">Tem certeza que deseja excluir a resposta?</v-card-title>
      <v-card-actions>
        <v-btn prepend-icon="mdi-cancel"
               color="success"
               :size="isMobile?'small':'default'"
               @click="deletePainel = false">Cancelar</v-btn>
        <v-spacer/>
        <v-btn append-icon="mdi-delete"
               color="red"
               :size="isMobile?'small':'default'"
               @click="excluirResposta">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "RespostaComponent",
  data: () => ({
    optDropdown: false,
    edicao: {
      texto: '',
      loading: false,
      painel: false,
      rules: [v => v.length <= 100 || 'Máximo 100 caracteres'],
    },
    deletePainel: false
  }),
  methods: {
    closeDropdown(){
      this.optDropdown = false;
    },
    curtir(){
      this.loadingCurtir = true;
      this.axios.post('comentario/curtirResposta', {
        idResposta: this.$props.idResposta
      }).then((response) => {
        if(!response.data.erro){
          this.$emit('hasCurtida', response.data.curtir, this.$props.idResposta);
          if(response.data.curtir){
            this.$socket.emit('userActivity', this.$store.user.getIdUser);
          }
        }
      });
    },
    editarResposta(){
      if(this.edicao.texto.length > 0 && this.edicao.texto.length <= 100){
        this.edicao.loading = true;
        this.axios.put('comentario/editar', {
          opcao: 2,
          id: this.$props.idResposta,
          texto: this.edicao.texto
        }).then((response) => {
          if(response.data.editar){
            this.$emit('atualizarResposta', this.$props.idResposta, this.edicao.texto);
            this.edicao.painel = false;
          }
        }).finally(() => {
          this.edicao.loading = false;
        });
      }
    },
    abrirEdicao(){
      this.edicao.texto = this.$props.texto;
      this.edicao.painel = true;
      this.optDropdown = false;
    },
    excluirResposta(){
      this.axios.delete('comentario/delete', {
        data: {
          opcao: 2,
          id: this.$props.idResposta
        }
      }).then((response) => {
        if(response.data.delete){
          this.$emit('hasDeleteResposta', this.$props.idResposta);
          this.respostas = [];
          this.deletePainel = false;
        }
      });
    },
    goUser(){
      if(this.$props.user.idUser === this.$store.user.getIdUser){
        this.$router.push({name: 'Meu Perfil'});
      }else{
        this.$router.push({name: 'Perfil', params: {id: this.$props.user.idUser}});
      }
    }
  },
  props: {
    idResposta: {
      type: Number,
      required: true
    },
    texto: {
      type: String,
      required: true
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
    },
    editado: {
      type: Boolean,
      required: true
    }
  },
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
    userHasCurtirda(){
      for(let i = 0; i < this.$props.curtidas.users.length; i++){
        if(this.$props.curtidas.users[i] === this.$store.user.getIdUser){
          return true;
        }
      }
      return false;
    },
    isMobile(){
      return this.$store.main.isMobile;
    }
  },
  emits: ['hasCurtida', 'atualizarResposta', 'hasDeleteResposta']
}
</script>

<style scoped>
/* Estilos para cada comentário */
.comment2 {
  margin: 10px auto;
  border-left: 5px solid #ccc;
  width: 70%;
  padding: 10px 10px 10px 20px;
  position: relative;
}
.comment2 .user-info {
  display: flex;
  align-items: flex-start;
  justify-content: left;
}
.comment2 .user-info .user {
  font-weight: bold;
  margin-top: 10px;
  cursor: pointer;
}

.comment2 .user-info .user:hover {
  text-decoration: underline;
}

.comment2 .user-info .timestamp {
  font-size: 12px;
  position: absolute;
  top: 0;
  right: 10px;
}
.comment2 .comment-text {
  margin-top: 10px;
}
/* Estilos para a foto do usuário */
.user-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
}
/* Estilos para os botões */
.comment2 .actions button {
  cursor: pointer;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
}
/* Estilos para o dropdown */
.dropdown .button {
  position: absolute;
  top: 17px;
  right: 0;
}
.dropdown-content {
  position: absolute;
  right: 0;
  top: 55px;
  background-color: rgb(10,10,10);
  border-radius: 10px;
  padding: 0;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  overflow: hidden;
}
.dropdown-content span {
  display: block;
  color: #ffffff;
  text-align: center;
  width: 100%;
  cursor: pointer;
  padding: 6px 0;
  transition: 200ms;
}
.dropdown-content span:hover {
  background-color: rgb(100,100,100);
}
</style>