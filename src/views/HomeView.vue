<template>
  <v-app-bar id="appbar" style="transition: 300ms; overflow: visible" :class="!isMobile?'appbar-transparent':''" elevation="0">
    <v-app-bar-nav-icon @click.stop="menuMobile = !menuMobile"  v-show="isMobile || isAdmin"/>
    <v-toolbar-title style="user-select: none" @click.left="goRoute('Home')" @click.middle.prevent="abrirNovaAba('/')">
      <div class="d-flex" style="align-items: center">
        <img :src="getImg" alt="Logo" style="width: 70px; pointer-events: none"/>
        <span style="cursor: pointer">Aniplace</span>
      </div>
    </v-toolbar-title>
    <template v-slot:append>
      <v-btn
        tag="a"
        v-show="!isMobile"
        @click.middle.prevent="abrirNovaAba('/')"
        @click.left="goRoute('Home')">Home</v-btn>

      <v-btn
        tag="a"
        v-show="!isMobile"
        @click.middle.prevent="abrirNovaAba('/animes/1')"
        @click.left="goRoute('Animes', {pagina: 1})">Animes</v-btn>

      <v-btn
        v-show="false"
        tag="a"
        @click.middle.prevent="abrirNovaAba('/feed/')"
        @click.left="goRoute('Feed')">Feed</v-btn><!-- v-show="!isMobile" -->

      <v-btn
        v-if="isAdmin"
        v-show="!isMobile"
        tag="a"
        @click.middle.prevent="abrirNovaAba('/admin/')"
        @click.left="goRoute('Admin Home')">Admin</v-btn><!-- v-show="!isMobile" -->

      <v-btn icon tag="a" v-show="!isMobile">
        <v-avatar v-if="isLogged && $store.user.getFoto" :image="$getImg($store.user.getFoto, 'user/foto')"></v-avatar>
        <v-icon v-else icon="mdi-account"/>
        <v-menu activator="parent">
          <v-list v-if="isLogged">
            <v-list-item @click="logout">
              <v-list-item-title>Sair</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-list v-else>
            <v-list-item @click="goRoute('Login')">
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item>
            <v-list-item @click="goRoute('Cadastro')">
              <v-list-item-title>Cadastro</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
      <div v-if="!isMobile" class="search-field" v-click-outside="searchClickOut">
        <v-text-field placeholder="Pesquisar..."
                      append-inner-icon="mdi-magnify"
                      variant="outlined"
                      density="compact"
                      v-model="pesquisa.text"
                      @keyup="pesquisar"
                      @focus="pesquisa.resultado.length > 0 ? pesquisa.painel = true : false"
                      v-on:keydown.enter="search(pesquisa.text)"></v-text-field>
        <v-card v-show="pesquisa.painel" style="position: absolute; top: 60px; right: 10px; z-index: 100" width="300px" height="400px">
          <div v-if="pesquisa.resultado.length > 0" class="search-result-box">
            <div class="anime-search" v-for="(anime, i) in pesquisa.resultado" :key="i" @click="goRoute('Anime', {id: anime.idAnime})">
              <div class="anime-img">
                <img :src="$getImg(anime.foto, 'anime/foto')" alt=""/>
              </div>
              <div class="anime-nome">
                <span>{{$limitarTexto(anime.nome, 30)}}</span>
                <div style="bottom: 0">
                  <span style="font-size: 9px">{{anime.ano}}</span>
                  <span style="font-size: 9px" v-if="anime.audio === 1">Dublado/Legendado</span>
                  <span style="font-size: 9px" v-if="anime.audio === 2">Legendado</span>
                  <span style="font-size: 9px" v-if="anime.audio === 3">Dublado</span>
                  <div>
                    <div v-for="(genero, g) in anime.generos" :key="g" style="display: inline-block">
                      <span v-if="g <= 3" style="display: inline-block; font-size: 9px; background-color: #c30000; color: white; border-radius: 3px; padding: 1px 2px; margin: 1px 2px 0 0">{{genero.nome}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="pesquisa.resultado.length >= 15"
                 @click="search(pesquisa.text)"
                 class="anime-search"
                 style="height: 50px">
              <span style="margin: auto; text-decoration: underline">
                Exibir todos os resultados
              </span>
            </div>
          </div>
        </v-card>
      </div>
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="activeDrawer" :rail="onAdminPage" :expand-on-hover="onAdminPage" class="drawer-mobile">

    <template v-slot:prepend>
      <v-list density="compact">
        <v-list-group value="avatar">
          <template v-slot:activator="{props}">
            <v-list-item
                v-if="isLogged"
                v-bind="props"
                lines="two"
                :prepend-avatar="$store.user.getFoto ? $getImg($store.user.getFoto, 'user/foto') : null"
                :prepend-icon="$store.user.getFoto ? null : $getImg($store.user.getFoto, 'user/foto')"
                :title="$store.user.getPrimeiroNome"
                subtitle="Online"
            ></v-list-item>

            <v-list-item
                v-else
                v-bind="props"
                lines="one"
                title="Conta"
            ></v-list-item>
          </template>

          <v-list-item v-if="isLogged" @click="logout" prepend-icon="mdi-location-exit" title="Sair" value="sair"></v-list-item>

          <v-list-item v-if="!isLogged" @click="goRoute('Login')" prepend-icon="mdi-login" title="Login" value="login"></v-list-item>
          <v-list-item v-if="!isLogged" @click="goRoute('Cadastro')" prepend-icon="mdi-account-plus" title="Cadastro" value="cadastro"></v-list-item>
        </v-list-group>
      </v-list>
    </template>

    <v-divider></v-divider>

    <v-list density="compact" :nav="true">
      <v-list-item
        @click.left="goRoute('Home')"
        @click.middle.prevent="abrirNovaAba('/')"
        prepend-icon="mdi-home-city"
        title="Home"
        value="home"></v-list-item>

      <v-list-item
        @click.left="goRoute('Animes', {pagina: 1})"
        @click.middle.prevent="abrirNovaAba('/animes/1')"
        prepend-icon="mdi-animation-play"
        title="Animes"
        value="animes"></v-list-item>

      <v-list-item v-if="false" prepend-icon="mdi-note-text" title="Feed" value="feed"></v-list-item>

      <v-list-group value="Admin" v-if="isAdmin">
        <template v-slot:activator="{props}">
          <v-list-item prepend-icon="mdi-security" title="Admin" value="admin" v-bind="props"></v-list-item>
        </template>

        <v-list-item
          @click.left="goRoute('Admin Home')"
          @click.middle.prevent="abrirNovaAba('/admin/')"
          title="Admin Home"
          value="admin"></v-list-item>

        <v-list-item title="Usuários" value="usuarios"></v-list-item>
        <v-list-item title="Reportes" value="reportes"></v-list-item>

        <v-list-group value="AdminAnime">
          <template v-slot:activator="{props}">
            <v-list-item v-bind="props" title="Animes" value="admin-animes"></v-list-item>
          </template>

          <v-list-item @click="goRoute('Cadastrar Anime')" title="Cadastrar" value="cadastrar-animes"></v-list-item>
          <v-list-item title="Listar" value="listar-animes"></v-list-item>
          <v-list-item @click="goRoute('Selecionar Anime')" title="Add. Episódio" value="cadastrar-episodios"></v-list-item>

          <v-list-group value="AdminAnimeEditar">
            <template v-slot:activator="{props}">
              <v-list-item v-bind="props" title="Editar" value="admin-animes"></v-list-item>
            </template>

            <v-list-item title="Anime" value="editar-anime"></v-list-item>
            <v-list-item @click="goRoute('Editar Episódio')" title="Episódio" value="editar-episodio"></v-list-item>
          </v-list-group>
        </v-list-group>
        <v-list-group value="AdminDestaques">
          <template v-slot:activator="{props}" title="Destaques">
            <v-list-item
              v-bind="props"
              title="Destaques"
              value="admin-destaques">
              <template v-slot:title>Destaques</template>
            </v-list-item>
          </template>

          <v-list-item @click="goRoute('Cadastrar Destaque')" title="Add" value="add-destaque"></v-list-item>
        </v-list-group>
      </v-list-group>
    </v-list>
    <v-text-field class="btn-menu" placeholder="Pesquisar..."
                  :append-inner-icon="mobileSearch.length > 0 ? 'mdi-redo' : 'mdi-magnify'"
                  variant="outlined"
                  v-if="isMobile"
                  density="compact"
                  color="red"
                  v-model="mobileSearch"
                  v-on:click:appendInner="search(mobileSearch)"
                  v-on:keydown.enter="search(mobileSearch)"
    ></v-text-field>
  </v-navigation-drawer>
  <div class="dispachar-click" style="display: none"></div>
  <router-view v-slot="{Component}">
    <transition @enter="fadeIn" @leave="fadeOut">
      <component :is="Component"/>
    </transition>
  </router-view>
  <FooterComponent/>
</template>

<script>
import { useDisplay } from 'vuetify';
import img from "@/assets/logo-final.png";
import FooterComponent from "@/components/globalComponents/FooterComponent.vue";
import {useFadeIn, useFadeOut} from '@/utils/animations';
import config from "../../config";
export default {
  components: {FooterComponent},
  computed: {
    getLarguraJanela(){
      return useDisplay().width.value;
    },
    getImg(){
      if(img){
        return img;
      }else{
        return null;
      }
    },
    isLogged(){
      return this.$store.main.isLogged;
    },
    isMobile(){
      return this.$store.main.isMobile;
    },
    activeDrawer(){
      if(this.isLogged){
        if(this.isAdmin){
          let rota = this.$route.path.split('/')[1];
          if(rota === 'admin'){
            return true;
          }else{
            return this.menuMobile;
          }
        }else{
          return this.menuMobile;
        }
      }else{
        return this.menuMobile;
      }
    },
    isAdmin(){
      return this.isLogged && this.$store.user.getRanking > 5;
    },
    onAdminPage(){
      return this.$route.path.split('/')[1] === 'admin';
    }
  },
  data: () => ({
    menuMobile: false,
    pesquisa: {
      text: '',
      resultado: [],
      painel: false
    },
    mobileSearch: ''
  }),
  methods: {
    goRoute(nomeRota, params = false){
      this.pesquisa.painel = false;
      this.pesquisa.resultado = [];
      this.pesquisa.text = '';
      this.$router.push({name: nomeRota, params: params});
      if(this.isMobile){
        this.menuMobile = false;
      }
      this.menuMobile = false;
    },
    abrirNovaAba(path = '/'){
      const apiUrl = import.meta.env.MODE === 'production' ? config.production : config.development;
      window.open(apiUrl + path, '_blank');
    },
    pesquisar(){
      if(this.pesquisa.text.length >= 1){
        this.axios.get('anime/pesquisa?texto=' + this.pesquisa.text + '&pagina=1').then((value) => {
          this.pesquisa.painel = true;
          this.pesquisa.resultado = value.data.animes;
        });
      }else{
        this.pesquisa.painel = false;
        this.pesquisa.resultado = [];
      }
    },
    fadeIn(){
      return useFadeIn;
    },
    fadeOut(){
      return useFadeOut;
    },
    search(texto){
      if(texto.length > 0){
        this.$router.push({name: 'Animes', params: {pagina: 1}, query: {text: texto}});
        this.pesquisa.painel = false;
        this.pesquisa.text = '';
        this.pesquisa.resultado = [];
      }
    },
    logout(){
      this.axios.get('user/logout').then((response) => {
        if(response.data.logout){
          this.$store.main.setLogin(false);
          this.$store.user.setUserdata(response.data.userBasicData);
          localStorage.setItem('userdata', '');
          localStorage.setItem('router-verify-data', '');
          if(this.$route.path.split('/')[1] === 'admin'){
            this.$router.push({name: 'Home'});
          }
        }
      });
    },
    searchClickOut(){
      this.pesquisa.painel = false;
    }
  },
  mounted() {
    if(!this.isMobile){
      let appbar = document.getElementById('appbar');
      document.addEventListener('scroll', () => {
        if(window.scrollY === 0){
          appbar.classList.add('appbar-transparent');
        }else{
          appbar.classList.remove('appbar-transparent');
        }
      });
    }
  }
}
</script>

<style scoped>
.search-field {
  width: 300px;
  margin-left: 8px;
  margin-top: 22px;
}

.anime-search {
  width: 100%;
  height: 140px;
  display: flex;
  transition: 250ms ease-in-out;
  cursor: pointer;
}

.anime-search:hover {
  background-color: #5f5f5f;
}

.anime-img {
  padding: 8px;
  height: 140px;
}

.anime-img img {
  height: 100%;
  border-radius: 5px;
}

.anime-nome {
  padding: 8px 8px 8px 0;
  font-size: 14px;
}

.anime-nome span {
  display: block;
}

.drawer-mobile {
  margin: auto;
}

.btn-group {
  width: 100%;
  padding-top: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.btn-menu {
  width: 90%;
  margin: 7px auto;
}

.appbar-transparent {
  /*background-color: rgb(18, 18, 18, .25) !important;*/
  background: linear-gradient( to bottom, rgba(0, 0, 0, 0.51) 0%, #00000005 100% ) !important;
}

.search-result-box {
  overflow-y: auto;
  height: 100%;
}

.search-result-box::-webkit-scrollbar {
  width: 2px;
}

.search-result-box::-webkit-scrollbar-thumb {
  background-color: dodgerblue;
}

.search-result-box::-webkit-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}

.search-result-box::-ms-scrollbar {
  width: 2px;
}

.search-result-box::-ms-scrollbar-thumb {
  background-color: dodgerblue;
}

.search-result-box::-ms-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}

.search-result-box::-moz-scrollbar {
  width: 2px;
}

.search-result-box::-moz-scrollbar-thumb {
  background-color: dodgerblue;
}

.search-result-box::-moz-scrollbar-track {
  background-color: rgba(59, 59, 59, 0.5);
}
</style>