<template>
  <div class="new-comment">
    <h2 :style="isMobile?'font-size: 14px':''"
        style="margin-bottom: 10px"
        v-if="$store.main.isLogged">Deixe um comentário</h2>

    <h2 :style="isMobile?'font-size: 14px':''"
        v-if="!$store.main.isLogged">Faça login para poder comentar</h2>
    <v-textarea label="Escreva o comentário..."
                v-model="texto"
                v-if="$store.main.isLogged"
                :auto-grow="true"
                rows="2"
                :counter="true"
                :rules="rules"
                variant="outlined"/>
    <v-spacer v-if="$store.main.isLogged"/>
    <v-btn @click="salvarComentario"
           variant="tonal"
           v-if="$store.main.isLogged"
           :loading="loading"
           append-icon="mdi-send"
           color="info">Publicar</v-btn>
  </div>
</template>

<script>
export default {
  name: "NewComentario",
  data: () => ({
    texto: '',
    rules: [v => v.length <= 255 || 'Máximo 255 caracteres'],
    loading: false
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
    salvarComentario(){
      this.loading = true;
      if(this.texto.length > 0 && this.texto.length <= 255){
        this.axios.post('comentario/inserir', {
          texto: this.texto,
          tipo: this.$props.tipo,
          idOrigem: this.$props.idOrigem,
          idUser: this.$store.user.getIdUser
        }).then((response) => {
          if(response.data.comentario){
            this.$emit('hasNewComment', response.data.comentario);
            this.texto = '';
            this.$socket.emit('userActivity', this.$store.user.getIdUser);
          }
        }).finally(() => {
          this.loading = false;
        });
      }
    }
  },
  computed: {
    isMobile(){
      return this.$store.main.isMobile;
    }
  }
};
</script>

<style scoped>
.new-comment {
  padding: 10px;
}

.new-comment h2 {
  padding-left: 20px;
}
</style>