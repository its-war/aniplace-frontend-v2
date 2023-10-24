<template>
  <NewPostComponent
    v-if="isLogged"
    @newPost="hasNewPost"
  />

  <PostComponent v-for="(post, i) in newPosts" :key="post.idPostagem"
                 :id-postagem="post.idPostagem"
                 :texto="post.texto"
                 :imagem="post.imagem"
                 :registro="post.registro"
                 :user="post.user"
                 :curtidas="post.curtidas"
                 @hasCurtir="curtirNewPostEvent"
                 @hasDeletePost="deletePost"
  />

  <PostComponent v-for="(post, i) in postagens" :key="post.idPostagem"
                 :id-postagem="post.idPostagem"
                 :texto="post.texto"
                 :imagem="post.imagem"
                 :registro="post.registro"
                 :user="post.user"
                 :curtidas="post.curtidas"
                 @hasCurtir="curtirPostEvent"
                 @hasDeletePost="deletePost"
  />

  <div class="text-center" v-if="loadingPage">
    <v-progress-circular color="red" size="70" indeterminate/>
  </div>

  <div v-if="postagens.length === 0">
    <h1 style="text-align: center; margin-top: 20px">Ainda não há postagens cadastradas.</h1>
  </div>
</template>

<script>
import PostComponent from "@/components/postagens/PostComponent.vue";
import NewPostComponent from "@/components/postagens/NewPostComponent.vue";
export default {
  name: "PostagensComponent",
  components: { NewPostComponent, PostComponent },
  data: () => ({
    postagens: [],
    newPosts: [],
    loadingPage: false,
    paginator: {
      pagina: 0,
      totalPaginas: 1
    }
  }),
  computed: {
    isLogged(){
      return this.$store.main.isLogged;
    }
  },
  methods: {
    hasNewPost(post){
      post.user = {
        idUser: this.$store.user.getIdUser,
        nome: this.$store.user.getNome,
        foto: this.$store.user.getFoto
      }
      post.curtidas = {
        users: [],
        total: 0
      }
      this.newPosts.unshift(post);
    },
    carregarPosts(){
      this.paginator.pagina = this.paginator.pagina + 1;
      if(this.paginator.pagina <= this.paginator.totalPaginas){
        this.loadingPage = true;
        this.axios.get('post/getPostagens', {
          params: {
            pagina: this.paginator.pagina,
            idUser: this.$props.idUser ?? 0
          }
        }).then((response) => {
          this.postagens = this.postagens.concat(response.data.postagens);
          this.paginator.totalPaginas = response.data.totalPaginas;
        }).finally(() => {
          this.loadingPage = false;
        });
      }
    },
    curtirPostEvent(curtiu, idPostagem){
      for (let i = 0; i < this.postagens.length; i++) {
        if(this.postagens[i].idPostagem === idPostagem){
          if(curtiu){
            this.postagens[i].curtidas.total = this.postagens[i].curtidas.total + 1;
            this.postagens[i].curtidas.users.push(this.$store.user.getIdUser);
          }else{
            this.postagens[i].curtidas.total = this.postagens[i].curtidas.total - 1;
            this.postagens[i].curtidas.users = this.postagens[i].curtidas.users.filter(
              id => id !== this.$store.user.getIdUser
            );
          }
        }
      }
    },
    curtirNewPostEvent(curtiu, idPostagem){
      for (let i = 0; i < this.newPosts.length; i++) {
        if(this.newPosts[i].idPostagem === idPostagem){
          if(curtiu){
            this.newPosts[i].curtidas.total = this.newPosts[i].curtidas.total + 1;
            this.newPosts[i].curtidas.users.push(this.$store.user.getIdUser);
          }else{
            this.newPosts[i].curtidas.total = this.newPosts[i].curtidas.total - 1;
            this.newPosts[i].curtidas.users = this.newPosts[i].curtidas.users.filter(
              id => id !== this.$store.user.getIdUser
            );
          }
        }
      }
    },
    onScroll(){
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollY + windowHeight + 200 >= documentHeight) {
        this.carregarPosts();
      }
    },
    deletePost(idPostagem){
      this.newPosts = this.newPosts.filter(p => p.idPostagem !== idPostagem);
      this.postagens = this.postagens.filter(p => p.idPostagem !== idPostagem);
    }
  },
  mounted() {
    this.carregarPosts();
    window.addEventListener("scroll", this.onScroll);
  },
  props: {
    idUser: {
      type: Number,
      default: null
    }
  }
}
</script>

<style scoped>

</style>