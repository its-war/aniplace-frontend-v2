import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomeBodyComponent from "@/components/globalComponents/HomeBodyComponent.vue";
import AnimePageComponent from "@/pages/AnimePageComponent.vue";
import AnimesPage from "@/pages/AnimesPage.vue";
import adblock from "@/utils/adblock";
import mainStore from "@/stores/mainStore";
import userStore from "@/stores/userStore";
import LoginView from "@/views/LoginView.vue";
import EpisodioPage from "@/pages/EpisodioPage.vue";
import CadastroView from "@/views/CadastroView.vue";

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
          path: 'animes/:pagina',
          name: 'Animes',
          component: AnimesPage
        },
        {
          path: 'anime/:idAnime/episodio/:temporada/:numero/online',
          name: 'Episódio',
          component: EpisodioPage
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/cadastro',
      name: 'Cadastro',
      component: CadastroView
    }
  ],
  scrollBehavior(to){
    if(to.hash){
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: 'smooth'
          })
        }, 1000)
      })
    }else{
      return {top: 0}
    }
  }
})

router.beforeEach(async (to, from, next) => {
  const main = mainStore();
  const user = userStore();
  adblock((block) => {
    main.setAdblock(block);
  });

  main.setLoading(true);

  let token = window.localStorage.getItem('router-verify-data');
  if(token){
    if(token.length > 0){
      try{
        let userdata = await main.getLogin();
        user.setUser(userdata);
      }catch {
        console.log('Requisição não autorizada.');
      }
    }
  }

  let logged = main.isLogged;

  if(logged){
    if(to.name !== 'Login'){
      next();
    }else{
      next({name: 'Home'});
    }
  }else{
    next();
  }
})

router.afterEach(() => {
  window.scrollTo(0, 0);
  const main = mainStore();
  main.setLoading(false);
})

export default router
