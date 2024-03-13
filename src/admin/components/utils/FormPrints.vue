<template>
  <v-row :no-gutters="true">
    <v-col sm="12" cols="12" class="pa-5">
      <span>Adicione prints para o anime</span><br />
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
    <v-col cols="12" sm="2" class="pa-2" v-for="(img, i) in renderizarPrints" :key="i"
           style="position: relative">
      <v-img :src="img" class="d-flex align-center" height="130" width="auto" aspect-ratio="16/9" />
      <v-btn icon="mdi-close" style="position: absolute; top: 0; right: 0" @click="removerPrint(img)" />
    </v-col><!-- aqui renderiza os prints que já existiam no anime na hora do carregamento -->

    <v-col cols="12" sm="2" class="pa-2" v-for="(img, i) in renderizarPrintsLocais" :key="i"
           style="position: relative">
      <v-img :src="img" class="d-flex align-center" height="130" width="auto" aspect-ratio="16/9" />
      <v-btn icon="mdi-close" style="position: absolute; top: 0; right: 0" @click="removerPrint(i, 2)" />
    </v-col><!-- aqui renderiza os prints locais que forem adicionados pelos botões 'Adicionar' abaixo -->

    <v-col cols="12" sm="2" class="pa-2" v-for="n in slotsDisponiveis" :key="n">
      <v-card class="d-flex align-center" height="130" color="grey-lighten-1" @click="abrirSelecionarPrints">
        <v-icon icon="mdi-plus" size="45px" class="ma-auto" />
        <span class="ma-auto">Adicionar</span>
      </v-card>
    </v-col><!-- aqui renderiza os botões 'Adicionar' na quantidade de slots disponíveis -->
  </v-row>

  <v-btn v-if="hasModification" @click="salvarPrints" :loading="loading" text="Salvar Prints" prepend-icon="mdi-content-save" color="success" style="margin-left: 10px"/>
  <v-btn v-if="hasModification" @click="resetar" :loading="loading" text="Resetar" prepend-icon="mdi-reload" color="info" style="margin-left: 10px"/>
</template>

<script>
export default {
  name: "FormPrints",
  data: () => ({
    prints: [],
    printsLocais: [],
    slotsDisponiveis: 5,
    deletions: [],
    loading: false
  }),
  computed: {
    renderizarPrints() {
      const files = [];
      for (let i = 0; i < this.prints.length; i++) {
        files.push(this.$getImg(this.prints[i], "anime/print"));
      }
      return files;
    },
    renderizarPrintsLocais() {
      const files = [];
      for (let i = 0; i < this.printsLocais.length; i++) {
        files.push(URL.createObjectURL(this.printsLocais[i]));
      }
      return files;
    },
    hasModification(){
      if(this.printsLocais.length > 0){
        return true;
      }
      if(this.$props.animePrints !== "p"){
        if(this.prints.length !== this.$props.animePrints.split("_").length){
          return true;
        }
      }

      return false;
    }
  },
  methods: {
    abrirSelecionarPrints() {
      this.$refs.prints.click();
    },
    /**
     * @param img
     * @param opcao 1 = prints, 2 = printsLocais
     */
    removerPrint(img, opcao = 1) {
      if (opcao === 1) {
        if (this.prints.includes(img.split("/").pop())) {
          this.prints.splice(this.prints.indexOf(img.split("/").pop()), 1);
          this.deletions.push(img.split("/").pop());
        }
      } else {
        this.printsLocais.splice(img, 1);
      }
      this.slotsDisponiveis = this.slotsDisponiveis + 1;
    },
    inputPrintsEvent(event) {
      let limiteIndex = this.slotsDisponiveis > event.target.files.length ? event.target.files.length : this.slotsDisponiveis;
      for (let i = 0; i < limiteIndex; i++) {
        if(this.slotsDisponiveis > 0){
          this.printsLocais.push(event.target.files[i]);
          this.slotsDisponiveis = this.slotsDisponiveis - 1;
        }
      }
    },
    setPrints(){
      if (this.$props.animePrints !== "p") {
        this.prints = this.$props.animePrints.split("_");
        this.slotsDisponiveis = this.slotsDisponiveis - this.prints.length;
      }
    },
    resetar(){
      this.prints = [];
      this.printsLocais = [];
      this.slotsDisponiveis = 5;
      this.deletions = [];
      this.setPrints();
    },
    salvarPrints(){
      this.loading = true;
      const form = new FormData();

      for (let i = 0; i < this.printsLocais.length; i++) {
        form.append('imgs', this.printsLocais[i]);
      }
      form.append('idAnime', this.$props.idAnime);
      if(this.prints.length > 0){
        for (let i = 0; i < this.prints.length; i++) {
          form.append('manter', this.prints);
        }
      }
      if(this.deletions.length > 0){
        for (let i = 0; i < this.deletions.length; i++) {
          form.append('deletions', this.deletions);
        }
      }

      this.axios.put('admin/anime/alterarPrints', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        console.log(res.data);
        this.$emit('reloadAnime');
      }).finally(() => {
        this.loading = false;
      });
    }
  },
  props: {
    animePrints: {
      type: String,
      required: true
    },
    idAnime: {
      type: Number,
      required: true
    }
  },
  mounted() {
    this.setPrints();
  }
};
</script>

<style scoped>

</style>