<template>
  <v-app-bar id="appbar" style="transition: 300ms;" class="appbar-transparent" elevation="0">
    <v-app-bar-nav-icon @click.stop="menuMobile = !menuMobile" v-show="getLarguraJanela < 1000"/>
    <v-toolbar-title>
      <div class="d-flex" style="align-items: center">
        <img :src="getImg" alt="Logo" style="width: 70px"/>
        <span>Aniplace</span>
      </div>
    </v-toolbar-title>
    <template v-slot:append>
      <v-btn tag="a" v-show="getLarguraJanela >= 1000">Home</v-btn>
      <v-btn tag="a" v-show="getLarguraJanela >= 1000">Animes</v-btn>
      <v-btn tag="a" v-show="getLarguraJanela >= 1000">Em Lançamento</v-btn>
      <v-text-field placeholder="Pesquisar..."
                    append-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    class="search-field"
                    v-show="getLarguraJanela >= 550"></v-text-field>
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="menuMobile" class="drawer-mobile">
    <div class="btn-group">
      <v-btn class="btn-menu" density="compact" variant="tonal" tag="a" v-show="getLarguraJanela < 1000">Home</v-btn>
      <v-btn class="btn-menu" density="compact" variant="tonal" tag="a" v-show="getLarguraJanela < 1000">Animes</v-btn>
      <v-btn class="btn-menu" density="compact" variant="tonal" tag="a" v-show="getLarguraJanela < 1000">Em Lançamento</v-btn>
    </div>
    <v-text-field class="btn-menu" placeholder="Pesquisar..."
                  append-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  v-show="getLarguraJanela < 550"></v-text-field>
  </v-navigation-drawer>
  <CarouselComponent/>
  <HomeBodyComponent/>
</template>

<script>
import { useDisplay } from 'vuetify';
import CarouselComponent from "@/components/carousel/CarouselComponent.vue";
import HomeBodyComponent from "@/components/globalComponents/HomeBodyComponent.vue";
import img from "@/assets/logo-final.png";
export default {
  components: {HomeBodyComponent, CarouselComponent},
  computed: {
    getLarguraJanela(){
      if(useDisplay().width.value >= 1000){
        this.fecharDrawer();
      }
      return useDisplay().width.value;
    },
    getImg(){
      if(img){
        return img;
      }else{
        return null;
      }
    }
  },
  data: () => ({
    menuMobile: false
  }),
  methods: {
    fecharDrawer(){
      this.menuMobile = false;
    }
  },
  mounted() {
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
</script>

<style scoped>
.search-field {
  width: 300px;
  margin-left: 8px;
  margin-top: 22px;
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
</style>