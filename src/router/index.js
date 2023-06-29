import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomeBodyComponent from "@/components/globalComponents/HomeBodyComponent.vue";
import AnimePageComponent from "@/components/globalComponents/AnimePageComponent.vue";
import AnimesPage from "@/pages/AnimesPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
      children: [
        {
          path: '',
          name: 'Home',
          component: HomeBodyComponent
        },
        {
          path: 'anime/:id',
          name: 'Anime',
          component: AnimePageComponent
        },
        {
          path: 'animes',
          name: 'Animes',
          component: AnimesPage
        }
      ]
    }
  ]
})

export default router
