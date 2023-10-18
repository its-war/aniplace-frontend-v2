<template>
  <div class="comment">
    <div class="user-info">
      <img v-if="$props.user.foto" :src="$getImg($props.user.foto, 'user/foto')"
           alt="Foto do Usuário" class="user-image"
           :style="isMobile?'width: 30px; height: 30px':''">
      <div class="user" :style="isMobile?'font-size: 11px':''">{{$props.user.nome}}</div>
      <div class="timestamp" :style="isMobile?'font-size: 8px':''">{{$props.editado ? '(editado) - ' : ''}}{{getTime}}</div>
    </div>
    <div class="comment-text" :style="isMobile?'font-size: 10px; padding-left: 0':''">
      {{$props.texto}}
    </div>
    <div class="actions">

      <v-btn v-if="$store.main.isLogged" variant="text" @click="curtir" :size="isMobile?'x-small':'default'">
        <v-icon v-if="userHasCurtirda" icon="mdi-heart" color="red"/>
        <v-icon v-else icon="mdi-heart-outline"/>
        {{$props.curtidas.total}}
      </v-btn>
      <span v-else style="margin-right: 8px" :style="isMobile?'font-size: 10px':''">
        <v-icon icon="mdi-heart" color="red"/>{{$props.curtidas.total}}
      </span>

      <v-btn v-if="$store.main.isLogged"
             @click="showRespostaForm = !showRespostaForm"
             prepend-icon="mdi-comment-quote"
             color="success"
             :size="isMobile?'x-small':'default'"
             variant="text">Responder</v-btn>

      <v-btn @click="showRespostas = !showRespostas"
             color="primary"
             v-if="respostas.length > 0"
             :size="isMobile?'x-small':'default'"
             :prepend-icon="showRespostas ? 'mdi-comment-remove' : 'mdi-comment-eye'"
             variant="text">{{showRespostas ? isMobile ? 'Ocultar' : 'Ocultar Respostas' : isMobile ? 'Ver Res.' : 'Ver Respostas'}}</v-btn>

      <div class="dropdown" v-click-outside="closeDropdown">
        <v-btn @click="optDropdown = !optDropdown"
               :size="isMobile?'x-small':'default'"
               color="red"
               icon="mdi-dots-vertical"
               variant="text"
               class="button"></v-btn>

        <div class="dropdown-content" v-show="optDropdown">
          <span>Reportar</span>
          <span v-if="$store.main.isLogged && $store.user.getIdUser === $props.user.idUser"
                @click="abrirEdicao">Editar</span>
          <span v-if="$store.main.isLogged && $store.user.getIdUser === $props.user.idUser"
                @click="deletePainel = true; optDropdown = false">Excluir</span>
        </div>
      </div>
    </div>
    <div class="form-resposta" v-if="showRespostaForm" style="padding-top: 10px">
      <v-text-field label="Digite sua resposta..."
                    density="compact"
                    v-model="textResposta"
                    :counter="true"
                    :rules="rules"
                    :loading="loading"
                    style="margin-right: 15px"
                    variant="outlined"/>
      <v-btn :append-icon="isMobile?'':'mdi-send'"
             :text="isMobile?'':'Publicar'"
             :icon="isMobile?'mdi-send':false"
             style="margin-top: 2px"
             :size="isMobile?'small':'default'"
             @click="responder"
             :loading="loading"
             variant="text"/>
    </div>
    <div class="respostas" v-if="showRespostas">
      <RespostaComponent v-for="(resposta, i) in respostas" :key="resposta.idResposta"
                         :id-resposta="resposta.idResposta"
                         :texto="resposta.texto"
                         :registro="resposta.registro"
                         :user="resposta.user"
                         :curtidas="resposta.curtidas"
                         :editado="resposta.editado"
                         @hasCurtida="computarCurtidaResposta"
                         @atualizarResposta="updateResposta"
                         @hasDeleteResposta="removerResposta"
      />
    </div>
    <v-dialog v-model="edicao.painel" persistent width="auto">
      <v-card>
        <v-card-title>Editar Comentário</v-card-title>
        <v-card-text>
          <v-btn icon="mdi-close"
                 variant="text"
                 style="position: absolute; top: 0; right: 0"
                 @click="edicao.painel = false"></v-btn>
          <v-textarea label="Edite o comentário..."
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
                 @click="editarComentario"
                 append-icon="mdi-content-save-edit">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deletePainel" persistent width="auto">
      <v-card>
        <v-card-title :style="isMobile?'font-size: 10px':''">Tem certeza que deseja excluir o comentário?</v-card-title>
        <v-card-actions>
          <v-btn prepend-icon="mdi-cancel"
                 color="success"
                 :size="isMobile?'small':'default'"
                 @click="deletePainel = false">Cancelar</v-btn>
          <v-spacer/>
          <v-btn append-icon="mdi-delete"
                 color="red"
                 :size="isMobile?'small':'default'"
                 @click="excluirComentario">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import RespostaComponent from "@/components/comments/RespostaComponent.vue";

export default {
  name: "ComentarioComponent",
  components: {RespostaComponent},
  data: () => ({
    optDropdown: false,
    showRespostas: false,
    textResposta: '',
    loading: false,
    showRespostaForm: false,
    rules: [v => v.length <= 100 || 'Máximo 100 caracteres'],
    loadingCurtir: false,
    respostas: [],
    edicao: {
      texto: '',
      loading: false,
      painel: false,
      rules: [v => v.length <= 100 || 'Máximo 255 caracteres'],
    },
    deletePainel: false
  }),
  methods: {
    closeDropdown(){
      this.optDropdown = false;
    },
    curtir(){
      this.loadingCurtir = true;
      this.axios.post('comentario/curtirComentario', {
        idComentario: this.$props.idComentario
      }).then((response) => {
        if(!response.data.erro){
          this.$emit('hasCurtida', response.data.curtir, this.$props.idComentario);
          if(response.data.curtir){
            this.$socket.emit('userActivity', this.$store.user.getIdUser);
          }
        }
      });
    },
    responder(){
      if(this.textResposta.length > 0){
        this.loading = true;
        this.axios.post('comentario/responder', {
          texto: this.textResposta,
          idComentario: this.$props.idComentario
        }).then((response) => {
          if(response.data.resposta){
            this.respostas.push(response.data.resposta);
            this.textResposta = '';
            this.showRespostas = true;
            this.$socket.emit('userActivity', this.$store.user.getIdUser);
          }
        }).finally(() => {
          this.loading = false;
        });
      }
    },
    listarRespostas(){
      this.respostas = [];
      this.axios.get('comentario/listarRespostas', {
        params: {
          idComentario: this.$props.idComentario
        }
      }).then((response) => {
        this.respostas = response.data.respostas.map(resposta => ({ ...resposta }));
      });
    },
    computarCurtidaResposta(hasCurtir, idResposta){
      for(let i = 0; i < this.respostas.length; i++){
        if(this.respostas[i].idResposta === idResposta){
          if(hasCurtir){
            this.respostas[i].curtidas.total = this.respostas[i].curtidas.total + 1;
            this.respostas[i].curtidas.users.push(this.$store.user.getIdUser);
          }else{
            this.respostas[i].curtidas.total = this.respostas[i].curtidas.total - 1;
            this.respostas[i].curtidas.users = this.respostas[i].curtidas.users.filter(
              id => id !== this.$store.user.getIdUser
            );
          }
        }
      }
    },
    abrirEdicao(){
      this.edicao.texto = this.$props.texto;
      this.edicao.painel = true;
      this.optDropdown = false;
    },
    editarComentario(){
      if(this.edicao.texto.length > 0 && this.edicao.texto.length <= 255){
        this.edicao.loading = true;
        this.axios.put('comentario/editar', {
          opcao: 1,
          id: this.$props.idComentario,
          texto: this.edicao.texto
        }).then((response) => {
          if(response.data.editar){
            this.$emit('atualizarComentario', this.$props.idComentario, this.edicao.texto);
            this.edicao.painel = false;
          }
        }).finally(() => {
          this.edicao.loading = false;
        });
      }
    },
    updateResposta(idResposta, texto){
      for(let i = 0; i < this.respostas.length; i++){
        if(this.respostas[i].idResposta === idResposta){
          this.respostas[i].texto = texto;
          this.respostas[i].editado = true;
        }
      }
    },
    excluirComentario(){
      this.axios.delete('comentario/delete', {
        data: {
          opcao: 1,
          id: this.$props.idComentario
        }
      }).then((response) => {
        if(response.data.delete){
          this.$emit('hasDeleteComentario', this.$props.idComentario);
          this.respostas = [];
          this.deletePainel = false;
        }
      });
    },
    removerResposta(idResposta){
      this.respostas = this.respostas.filter(r => r.idResposta !== idResposta);
    }
  },
  props: {
    idComentario: {
      type: Number,
      required: true
    },
    tipo: {
      type: Number,
      required: true
    },
    idOrigem: {
      type: Number,
      required: true
    },
    texto: {
      type: String,
      required: true
    },
    user: {
      type: Object,
      required: true
    },
    registro: {
      type: String,
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
  mounted() {
    this.respostas = [];
    this.listarRespostas();
  },
  emits: ['hasDeleteComentario', 'atualizarComentario', 'hasCurtida']
}
</script>

<style scoped>
/* Estilos para cada comentário */
.comment {
  border-bottom: 1px solid #ccc;
  margin: 10px 0;
  padding: 10px;
  position: relative;
}
.comment .user-info {
  display: flex;
  align-items: flex-start;
  justify-content: left;
}
.comment .user-info .user {
  font-weight: bold;
  margin-top: 10px;
}
.comment .user-info .timestamp {
  font-size: 12px;
  position: absolute;
  top: 0;
  right: 0;
}
.comment .comment-text {
  margin-top: 10px;
  padding-left: 20px;
}
/* Estilos para a foto do usuário */
.user-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
/* Estilos para os botões */
.comment .actions {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.comment .actions button {
  cursor: pointer;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
}
/* Estilos para o dropdown */
.dropdown {
  display: inline-block;
}
.dropdown .button {
  position: absolute;
  top: 18px;
  right: 0;
}
.dropdown-content {
  position: absolute;
  right: 0;
  top: 60px;
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
.respostas {
  width: 100%;
}

.form-resposta {
  display: flex;
  flex-direction: row;
}
</style>