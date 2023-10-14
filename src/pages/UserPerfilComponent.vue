<template>
  <v-main>
    <div class="perfil-user">
      <div class="perfil-header" style="height: 500px;">
        <v-img :src="getImg" aspect-ratio="16/9" cover/>
        <div class="text-center" style="margin-top: -250px">
          <v-avatar
            :image="$getImg($store.user.getFoto, 'user/foto')"
            size="300px" style="border: 2px solid red"/>
          <div style="background-color: #212121; padding-top: 55px; margin-top: -50px">
            <h5 style="font-style: italic">Fundador</h5>
            <h1>Karlos Warney</h1>
          </div>
        </div>
      </div>
      <div class="perfil-body">
        <div class="perfil-info">
          <v-list style="padding: 15px">
            <v-btn icon="mdi-pencil" flat style="position: absolute; top: 0; right: 0"/>
            <v-list-item>Desenvolvedor Full Stack júnior. Node.js | Vue.js | MySQL | MongoDB</v-list-item>
            <v-list-item style="font-style: italic">ele/dele</v-list-item>
            <v-list-item>Idade: 25 anos</v-list-item>
            <v-list-item>Registro: 12/03/2023</v-list-item>
            <v-list-item>Gênero: masculino</v-list-item>
            <v-list-item>Anime Favorito: One Piece</v-list-item>
          </v-list>
        </div>
        <div class="perfil-data-section"></div>
      </div>
      <div class="perfil-footer"></div>
    </div>
    <div style="height: 500px;"></div>
  </v-main>
</template>

<script>
import img from '@/assets/user-capa-1.jpg';

export default {
  name: "UserPerfilComponent",
  computed: {
    getImg(){
      if(img){
        return img;
      }else{
        return null;
      }
    }
  }
}
</script>

<style scoped>
.perfil-user {
  width: 100%;
}

.perfil-header {
  width: 100%;
  position: relative;
  z-index: 1;
}

.perfil-body {
  width: 100%;
  display: grid;
  grid-template-areas: "info data data";
  grid-template-columns: 25% 35% 40%;
  margin-top: 130px;
}

.perfil-info {
  grid-area: info;
  position: relative;
}

.perfil-data-section {
  grid-area: data;
}
</style>