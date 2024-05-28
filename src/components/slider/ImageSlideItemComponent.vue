<script>
export default {
  name: "ImageSlideItemComponent",
  inject: ['repository'],
  data: () => ({
    img: null
  }),
  props: {
    nome: {
      type: String,
      required: true
    },
    foto: {
      type: String,
      required: true
    }
  },
  computed: {
    getFoto(){
      if(this.isFirebase){
        if(this.img){
          return this.img;
        }
      }else{
        return this.$getImg(this.$props.foto, 'anime/capa');
      }

      return false;
    },
    isFirebase(){
      return this.isFirebaseApiOrigin;
    }
  },
  async created() {
    if(this.isFirebase){
      this.img = await this.repository.animes.getAnimeImgUrl(null, 'capa', this.$props.foto);
    }
  }
};
</script>

<template>
  <v-skeleton-loader type="image" v-if="!getFoto"/>
  <img :src="getFoto" :alt="$props.nome" style="height: 100%" v-else/>
</template>

<style scoped>

</style>