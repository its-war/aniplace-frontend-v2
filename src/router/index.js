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
import AdminPageView from "@/admin/pages/AdminPageView.vue";
import AdminHomeComponent from "@/admin/components/AdminHomeComponent.vue";
import AnimeCadastroComponent from "@/admin/components/anime/AnimeCadastroComponent.vue";
import SelecionarAnimeComponent from "@/admin/components/anime/SelecionarAnimeComponent.vue";
import AnimeAddTemporadaForm from "@/admin/components/anime/AnimeAddTemporadaForm.vue";
import AnimeAddEpisodioComponent from "@/admin/components/anime/AnimeAddEpisodioComponent.vue";
import EditarEpisodioComponent from "@/admin/components/anime/EditarEpisodioComponent.vue";

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
        },
        {
          path: 'admin/',
          component: AdminPageView,
          children: [
            {
              path: '',
              name: 'Admin Home',
              component: AdminHomeComponent
            },
            {
              path: 'anime/cadastro',
              name: 'Cadastrar Anime',
              component: AnimeCadastroComponent
            },
            {
              path: 'anime/selecionar',
              name: 'Selecionar Anime',
              component: SelecionarAnimeComponent
            },
            {
              path: 'anime/add/temporada/:idAnime',
              name: 'Cadastrar Temporada',
              component: AnimeAddTemporadaForm
            },
            {
              path: 'anime/add/episodio/:idAnime',
              name: 'Cadastrar Episódio',
              component: AnimeAddEpisodioComponent
            },
            {
              path: 'anime/editar/episodio',
              name: 'Editar Episódio',
              component: EditarEpisodioComponent
            }
          ]
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
        console.log('Erro na requisição.');
      }
    }
  }

  let logged = main.isLogged;

  let rota = to.path.split('/')[1];

  if(logged){
    if(rota === 'admin'){
      if(user.getRanking > 5){
        next();
      }else{
        next({name: 'Home'});
      }
    }else if(to.name !== 'Login'){
      next();
    }else{
      next({name: 'Home'});
    }
  }else{
    if(rota === 'admin'){
      next({name: 'Home'});
    }else{
      next();
    }
  }
})

router.afterEach((to) => {
  document.title = to.name.toString() + ' — Aniplace';
  window.scrollTo(0, 0);
  const main = mainStore();
  main.setLoading(false);
})

export default router
