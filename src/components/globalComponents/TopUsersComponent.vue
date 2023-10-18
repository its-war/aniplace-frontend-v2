<template>
  <div class="user-ranking">
    <h3 style="padding-left: 13px"><v-icon icon="mdi-podium" color="yellow"/> Top Usuários</h3>
    <div class="text-center" v-if="loading">
      <v-progress-circular indeterminate size="60" color="red"/>
    </div>
    <div v-else>
      <v-list v-if="topUsers.length > 0" density="compact" style="border-radius: 10px;">
        <v-list-item v-for="(user, i) in topUsers" :key="i"
                     @click="goPerfil(user.idUser)"
                     :prepend-icon="`mdi-numeric-${i + 1}`">
          {{user.nome}}
        </v-list-item>
      </v-list>
      <h4 v-else>Ainda não há atividade de usuários.</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopUsersComponent",
  data: () => ({
    topUsers: [],
    loading: false
  }),
  methods: {
    goPerfil(idUser){
      this.$router.push({name: 'Perfil', params: {id: idUser}});
    },
    carregarTopUsers(){
      this.loading = true;
      this.axios.get('user/getTopUsers').then((response) => {
        this.topUsers = response.data.users;
      }).catch(() => {
        this.topUsers = [];
      }).finally(() => {
        this.loading = false;
      });
    }
  },
  mounted() {
    this.carregarTopUsers();
  }
}
</script>

<style scoped>

</style>