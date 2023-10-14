<template>
  <v-main style="margin-top: 15px">
    <div class="feed-page">
      <section class="posts">
        <PostagensComponent/>
      </section>
      <aside class="aside-post"></aside>
    </div>
  </v-main>
</template>

<script>
import PostagensComponent from "@/components/postagens/PostagensComponent.vue";
export default {
  name: "FeedPage",
  components: { PostagensComponent }
};
</script>

<style scoped>
.feed-page {
  display: grid;
  grid-template-areas: "post post aside";
  grid-template-columns: 40% 30% 30%;
  width: 80%;
  margin: auto;
}

.posts {
  grid-area: post;
}

.aside-post {
  grid-area: aside;
}
</style>