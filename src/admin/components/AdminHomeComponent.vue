<template>
  <div class="admin-home-main">
    <div class="admin-home-resumo">
      <v-card variant="tonal" style="margin: 5px" color="success">
        <v-card-title>Usuários</v-card-title>
        <v-card-text>
          Abas ativas: {{ infos.user.active === 1 ? infos.user.active + ' (esta aba)' : infos.user.active }} <br/>
          Total cadastrados: {{infos.user.totalUsers}} <br/>
          Banidos: {{infos.user.usersBanidos}}
        </v-card-text>
      </v-card> <!-- TODO: terminar de criar a pagina home de admin e depois criar as telas das rotas de admin do site -->

      <v-card variant="tonal" style="margin: 5px" color="primary">
        <v-card-title>Animes</v-card-title>
        <v-card-text>
          Cadastrados: {{ infos.anime.totalAnimes }} <br/>
          Completos: {{ infos.anime.animesCompletos }} <br/>
          Em Lançamento: {{ infos.anime.animesLancamento }}
        </v-card-text>
      </v-card>

      <v-card variant="tonal" style="margin: 5px" color="secondary">
        <v-card-title>Episódios</v-card-title>
        <v-card-text>
          Cadastrados: {{ infos.episodio.totalEpisodios }} <br/>
          Visualizações média por episodio: {{infos.episodio.media}} <br/>
        </v-card-text>
      </v-card>

      <v-card variant="tonal" style="margin: 5px" color="warning">
        <v-card-title>Reportes</v-card-title>
        <v-card-text>
          Total Recebidos: {{infos.report.totalReports}} <br/>
          Pendentes: {{infos.report.pendentes}} <br/>
        </v-card-text>
      </v-card>
    </div>
    <div class="admin-home-tabela">
      <v-data-table ref="table"
          :headers="dados.animes.headers"
          :items-per-page-options="tableData.perPage"
          :items-per-page-text="'Animes por página'"
          :no-data-text="'Não há dados para exibir.'"
          :page-text="''"
          :items="dados.animes.list"
          class="elevation-1">
        <template v-slot:top>
          <v-toolbar :flat="true">
            <v-toolbar-title>Ultimos Animes</v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-slot:item.nome="{item}"><span @click="goAnime(item.idAnime)" class="link-nome" :title="item.nome">{{$limitarTexto(item.nome, 22)}}</span></template>
        <template v-slot:item.dia="{item}">{{semana[item.dia - 1]}}</template>
        <template v-slot:item.status="{item}">{{status[item.status - 1]}}</template>
        <template v-slot:item.acessos="{item}"><ViewCountComponent :views="item.acessos" :short="true"/></template>
      </v-data-table>

      <v-data-table style="margin-top: 10px"
                    :headers="dados.users.headers"
                    :items-per-page-options="tableData.perPage"
                    :items-per-page-text="'Usuários por página'"
                    :no-data-text="'Não há dados para exibir.'"
                    :page-text="''"
                    :items="dados.users.list"
                    class="elevation-1">
        <template v-slot:top>
          <v-toolbar :flat="true">
            <v-toolbar-title>Ultimos Usuários</v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-slot:item.nome="{item}">{{$limitarTexto(item.nome, 22)}}</template>
        <template v-slot:item.email="{item}"><span :title="item.email">{{$limitarTexto(item.email, 20)}}</span></template>
        <template v-slot:item.ranking="{item}">{{rankings[item.ranking - 1]}}</template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import {VDataTable} from 'vuetify/labs/VDataTable'
import ViewCountComponent from "@/components/ViewCountComponent.vue";

export default {
  name: "AdminHomeComponent",
  data: () => ({
    dados: {
      animes: {
        headers: [
          {
            title: 'ID',
            align: 'start',
            key: 'idAnime'
          },
          {title: 'Nome', key: 'nome'},
          {title: 'Status', key: 'status'},
          {title: 'Dia de Lançamento', key: 'dia'},
          {title: 'Acessos', key: 'acessos'}
        ],
        list: []
      },
      users: {
        headers: [
          {
            title: 'ID',
            align: 'start',
            key: 'idUser'
          },
          {title: 'Nome', key: 'nome'},
          {title: 'Email', key: 'email'},
          {title: 'Status', key: 'status'},
          {title: 'Ranking', key: 'ranking'}
        ],
        list: []
      }
    },
    tableData: {
      perPage: [
        {value: 10, title: '10'},
        {value: 25, title: '25'},
        {value: 50, title: '50'},
        {value: 100, title: '100'},
        {value: -1, title: 'Tudo'}
      ]
    },
    semana: [
        'Domingo',
        'Segunda',
        'Terça',
        'Quarta',
        'Quinta',
        'Sexta',
        'Sábado'
    ],
    status: [
        'Completo',
        'Em Lançamento',
        'Incompleto'
    ],
    rankings: [
        'Novato',                 //1
        'Membro',                 //2
        'Usuário Ativo',          //3
        'Criador de Conteúdo',    //4
        'Doador - Usuário VIP',   //5
        'Tradutor',               //6
        'Encoder',                //7
        'Uploader',               //8
        'Moderador',              //9
        'Administrador',          //10
        'Fundador'                //11
    ],
    infos: {
      anime: {
        totalAnimes: 0,
        animesCompletos: 0,
        animesLancamento: 0
      },
      user: {
        active: 0,
        usersBanidos: 0,
        totalUsers: 0
      },
      episodio: {
        media: 0.0,
        totalEpisodios: 0
      },
      report: {
        totalReports: 0,
        pendentes: 0
      }
    }
  }),
  components: { ViewCountComponent, VDataTable},
  methods: {
    carregarTudo(){
      this.carregarActiveUsers();
      this.carregarUsersInfo();
      this.carregarAnimesInfo();
      this.carregarEpisodiosInfo();
      this.carregarReportsInfo();
      this.carregarAnimes();
      this.carregarUsers();
    },
    carregarAnimes(){
      this.axios.get('admin/anime/getUltimosAnimes').then((response) => {
        this.dados.animes.list = response.data.animes;
        console.log(this.dados.animes.list);
      });
    },
    carregarUsers(){
      this.axios.get('admin/user/listar').then((response) => {
        this.dados.users.list = response.data.users;
      });
    },
    carregarAnimesInfo(){
      this.axios.get('admin/anime/getAnimesInfo').then((response) => {
        this.infos.anime = response.data;
      });
    },
    carregarActiveUsers(){
      this.$socket.emit('getActiveUsers');
    },
    carregarUsersInfo(){
      this.axios.get('admin/user/getUsersInfo').then((response) => {
        this.infos.user.totalUsers = response.data.totalUsers;
        this.infos.user.usersBanidos = response.data.usersBanidos;
      });
    },
    carregarEpisodiosInfo(){
      this.axios.get('admin/episodio/getEpisodiosInfo').then((response) => {
        this.infos.episodio = response.data;
      });
    },
    carregarReportsInfo(){
      this.axios.get('admin/report/getReportsInfo').then((response) => {
        this.infos.report = response.data;
      });
    },
    goAnime(idAnime){
      this.$router.push({name: 'Anime', params: {id: idAnime}});
    }
  },
  mounted() {
    this.carregarTudo();

    this.$socket.on('getActiveUsers', (activeUsers) => {
      this.infos.user.active = activeUsers;
    });
  }
}
</script>

<style scoped>
.admin-home-main {
  padding: 15px;
  display: grid;
  grid-template-areas: "resumo tabela tabela";
  grid-template-columns: 25% 40% 35%;
}

.admin-home-resumo {
  grid-area: resumo;
}

.admin-home-tabela {
  padding: 5px;
  grid-area: tabela;
}

.link-nome {
  cursor: pointer;
}

.link-nome:hover {
  text-decoration: underline;
  color: rgb(0,150,255);
}
</style>