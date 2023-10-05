<template>
  <NewComentario @hasNewComment="insertNewComment" :tipo="$props.tipo" :id-origem="$props.idOrigem"/>
  <div class="comentario">
    <h2 v-if="comentarios.length === 1"
        :style="isMobile?'font-size: 14px':''">{{comentarios.length}} Comentário</h2>
    <h2 v-else-if="comentarios.length > 1"
        :style="isMobile?'font-size: 14px':''">{{comentarios.length}} Comentários</h2>

    <v-select label="Ordenar por:"
              v-if="comentarios.length > 0"
              :items="[{value: 1, title: 'Comentários Antigos'}, {value: 2, title: 'Comentários Recentes'}]"
              :style="isMobile?'':'width: 300px; position: absolute; top: 0; right: 0'"
              v-model="ordemComments"
              v-on:update:modelValue="carregarComentarios"
              :disabled="loading"
              variant="underlined"
              item-value="value"
              item-title="title"/>
    <div v-if="comentarios.length > 0" class="comment-section">
      <ComentarioComponent v-for="(comentario, i) in comentarios" :key="comentario.idComentario"
                           :id-comentario="comentario.idComentario"
                           :tipo="$props.tipo"
                           :id-origem="$props.idOrigem"
                           :texto="comentario.texto"
                           :user="comentario.user"
                           :registro="comentario.registro"
                           :curtidas="comentario.curtidas"
                           :editado="comentario.editado"
                           @hasCurtida="computarCurtida"
                           @atualizarComentario="updateComentario"
                           @hasDeleteComentario="removerComentario"
      />
    </div>
    <div v-else class="comment-section">
      <v-progress-circular v-if="loading" indeterminate :size="isMobile?35:70" color="info"/>
      <h2 :style="isMobile?'font-size: 14px':''" v-else>Ainda não há comentários.</h2>
    </div>
  </div>
</template>

<script>
/*
* ## tipos de comentarios com base no local onde eles aparecerão ##
* 1 - episodio
* 2 - anime
* 3 - post
* */
import ComentarioComponent from "@/components/comments/ComentarioComponent.vue";
import NewComentario from "@/components/comments/NewComentario.vue";
export default {
  name: "ComentariosComponent",
  components: { NewComentario, ComentarioComponent},
  data: () => ({
    ordemComments: 1,
    comentarios: [],
    loading: true
  }),
  props: {
    tipo: {
      type: Number,
      required: true
    },
    idOrigem: {
      type: Number,
      required: true
    }
  },
  methods: {
    insertNewComment(comentario){
      this.comentarios.unshift(comentario);
    },
    carregarComentarios(){
      this.comentarios = [];
      this.loading = true;
      this.axios.get('comentario/listar', {
        params: {
          tipo: this.$props.tipo,
          idOrigem: this.$props.idOrigem,
          ordem: this.ordemComments
        }
      }).then((response) => {
        this.comentarios = response.data.comentarios.map(comentario => ({...comentario})) ?? [];
      }).finally(() => {
        this.loading = false;
      });
    },
    computarCurtida(hasCurtida, idComentario){
      for(let i = 0; i < this.comentarios.length; i++){
        if(this.comentarios[i].idComentario === idComentario){
          if(hasCurtida){
            this.comentarios[i].curtidas.total = this.comentarios[i].curtidas.total + 1;
            this.comentarios[i].curtidas.users.push(this.$store.user.getIdUser);
          }else{
            this.comentarios[i].curtidas.total = this.comentarios[i].curtidas.total - 1;
            this.comentarios[i].curtidas.users = this.comentarios[i].curtidas.users.filter(
              id => id !== this.$store.user.getIdUser
            );
          }
        }
      }
    },
    updateComentario(idComentario, texto){
      for(let i = 0; i < this.comentarios.length; i++){
        if(this.comentarios[i].idComentario === idComentario){
          this.comentarios[i].texto = texto;
          this.comentarios[i].editado = true;
        }
      }
    },
    removerComentario(idComentario){
      this.comentarios = this.comentarios.filter(comment => comment.idComentario !== idComentario);
    }
  },
  mounted() {
    this.carregarComentarios();
  },
  computed: {
    isMobile(){
      return this.$store.main.isMobile;
    }
  }
}
</script>

<style scoped>
.comentario {
  padding: 10px;
  position: relative;
}

.comentario h2 {
  margin-left: 15px;
}

.comment-section {
  width: 100%;
  margin: 15px auto;
}
</style>