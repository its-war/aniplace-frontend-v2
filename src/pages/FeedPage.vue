<template>
  <v-main style="margin-top: 15px">
    <div class="feed-page">
      <section class="posts">
        <PostagensComponent/>
      </section>
      <aside class="aside-post">
        <TopUsersComponent/>
        <div class="text-center" style="margin-top: 20px">
          <AdsComponent :vertical="true"/>
        </div>
      </aside>
    </div>
  </v-main>
</template>

<script>
import PostagensComponent from "@/components/postagens/PostagensComponent.vue";
import TopUsersComponent from "@/components/globalComponents/TopUsersComponent.vue";
import AdsComponent from "@/components/globalComponents/AdsComponent.vue";
export default {
  name: "FeedPage",
  components: { AdsComponent, TopUsersComponent, PostagensComponent }
}
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
  padding: 50px 10px 10px;
}
</style>