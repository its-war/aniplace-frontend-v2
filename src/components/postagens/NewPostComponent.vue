<template>
  <v-btn @click="activeForm = !activeForm" :text="activeForm?'Ocultar':'Nova Postagem'" :prepend-icon="activeForm?'mdi-minus':'mdi-plus'" color="info" variant="outlined"/>

  <Transition>
    <div v-if="activeForm">
      <h4>Escreva uma nova postagem</h4>
      <v-textarea
        style="margin-top: 10px"
        auto-grow
        counter
        color="info"
        :rules="rules"
        base-color="info"
        no-resize
        :loading="loading"
        v-model="texto"
        rows="3"
        label="Descrição da postagem..."
        variant="outlined"></v-textarea>

      <div class="campo-fotoPreview" style="position: relative">
        <v-img v-if="imgPreview"
               width="50%"
               style="margin: auto; border-radius: 10px"
               aspect-ratio="16/9"
               :src="imgPreview"
               :cover="true"/>
        <v-btn v-if="imgPreview"
               icon="mdi-close"
               flat
               @click="resetarFoto"
               style="position: absolute; top: 0; right: 0"/>
      </div>

      <v-file-input @change="handleFotoChange"
                    v-show="!imgPreview"
                    v-model="img"
                    accept="image/*"
                    :loading="loading"
                    v-on:click:clear="resetarFoto"
                    label="Selecione uma imagem para a postagem"
                    base-color="info"
                    color="info"
                    variant="outlined">
        <template v-slot:selection>
          {{$limitarTexto(img[0].name, 25)}}
        </template>
      </v-file-input>

      <v-btn
        text="Postar"
        :loading="loading"
        append-icon="mdi-send"
        @click="newPost"
        variant="outlined"
        color="success"/>
    </div>
  </Transition>
</template>

<script>
export default {
  name: "NewPostComponent",
  data: () => ({
    texto: '',
    img: null,
    imgPreview: null,
    rules: [v => v.length <= 500 || 'Máximo 500 caracteres'],
    loading: false,
    activeForm: false
  }),
  methods: {
    handleFotoChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.imgPreview = URL.createObjectURL(file);
      } else {
        this.imgPreview = null;
      }
    },
    resetarFoto(){
      this.img = null;
      this.imgPreview = null
    },
    newPost(){
      if(this.texto.length > 0 || this.img){
        this.loading = true;
        const form = new FormData();
        if(this.texto.length > 0){
          form.append('texto', this.texto);
        }
        if(this.img){
          form.append('imagem', this.img[0]);
        }

        this.axios.post('post/newPost', form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          if(response.data.post){
            this.texto = '';
            this.img = null;
            this.imgPreview = null;
            this.$emit('newPost', response.data.post);
            this.$socket.emit('userActivity', this.$store.user.getIdUser);
          }
        }).finally(() => {
          this.loading = false;
        });
      }
    }
  },
  emits: ['newPost']
}
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
</style>