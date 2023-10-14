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
import VerTodosComponent from "@/components/globalComponents/VerTodosComponent.vue";
import UserPerfilComponent from "@/pages/UserPerfilComponent.vue";
import FeedPage from "@/pages/FeedPage.vue";

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
              component: SelecionarAnimeComponent,
              props: {
                opcao: 1
              }
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
            },
            {
              path: 'destaque/cadastrar',
              name: 'Cadastrar Destaque',
              component: SelecionarAnimeComponent,
              props: {
                opcao: 2
              }
            }
          ]
        },
        {
          path: 'episodios/ver-todos',
          name: 'Ver todos os episódios',
          component: VerTodosComponent,
          props: {
            isAnime: false
          }
        },
        {
          path: 'animes/ver-todos',
          name: 'Ver todos os animes',
          component: VerTodosComponent,
          props: {
            isAnime: true
          }
        },
        {
          path: 'user/perfil',
          name: 'Perfil',
          component: UserPerfilComponent
        },
        {
          path: 'feed',
          name: 'Feed',
          component: FeedPage
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
  let urlAtual = window.location.href;
  if(urlAtual.includes('db.aniplace.top')){
    window.location.href = 'https://aniplace.top';
  }
  if(urlAtual.includes('realm.dragonsoul.com.br')){
    window.location.href = 'https://dragonsoul.com.br';
  }

  const main = mainStore();
  const user = userStore();
  adblock((block) => {
    main.setAdblock(block);
  });

  let adsActive = await main.getAdsActiveConfig();
  main.setAdsActive(adsActive);

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
    if(user.getRanking === 5 || user.getRanking >= 10){
      main.setAdsOff();
    }

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
