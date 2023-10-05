<template>
  <div class="bg-lc">
    <div id="login" class="container-login">
      <div class="logo" @click="goRoute('Home')"></div>
      <div class="options">
        <div id="botao-login2" class="login l-color2">Cadastro</div>
      </div>
      <form>
        <v-text-field prepend-inner-icon="mdi-account-circle-outline" v-model="cadastro.nome" label="Nome e sobrenome" placeholder="ex: Lucas Oliveira" density="compact"></v-text-field>

        <v-text-field prepend-inner-icon="mdi-at" v-model="cadastro.username" hint="Isso apenas será usado para entrar no site." label="Nome de usuário" placeholder="ex: davi95" density="compact"></v-text-field>

        <v-text-field prepend-inner-icon="mdi-email-outline" v-model="cadastro.email" hint="Aceitamos apenas emails do Google, Microsoft, Apple e Yahoo." label="Email" placeholder="ex: roberto.gomes55@gmail.com" density="compact"></v-text-field>

        <v-text-field prepend-inner-icon="mdi-lock-outline" v-on:click:appendInner="eye = !eye" :append-inner-icon="eye?'mdi-eye-outline':'mdi-eye-off-outline'" :type="eye?'text':'password'" v-model="cadastro.senha" label="Senha" placeholder="********" density="compact"></v-text-field>

        <div v-if="erroCaptcha" style="margin: auto; width: 100%">
          <span>Captcha expirado, solicite outro:</span>
          <v-btn @click="getCaptcha(captcha.idCaptcha)" :block="true" append-icon="mdi-reload" color="success">Carregar Captcha</v-btn>
        </div>
        <div v-else>
          <div v-show="!captcha.svg" style="margin: auto">
            <span>Carregando Captcha...</span>
            <v-progress-linear color="rgba(0, 123, 255, 1.0)" :indeterminate="true"></v-progress-linear>
          </div>

          <div v-show="captcha.svg" style="width: 100%">
            <div id="captcha"></div>
            <v-text-field v-model="cadastro.texto" label="Digite o código da imagem" placeholder="Ex: gh57He" density="compact"></v-text-field>
          </div>
        </div>

        <v-btn v-if="!erroCaptcha" class="l-color2" :loading="loading" @click="doCadastro" append-icon="mdi-account-plus-outline">Cadastrar</v-btn>
      </form>
      <div style="display: flex; width: 100%; justify-content: center; font-size: 12px; margin-top: 10px">
        <p>
          Possui uma conta? <a @click="goLogin" href="/login" style="color: #33b3f7">Faça login</a>
        </p>
      </div>

      <v-snackbar v-model="snackbar" color="red">
        {{snackbarText}}
        <template v-slot:actions>
          <v-btn @click="snackbar = false" text="Ok"/>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "CadastroView",
  data: () => ({
    captcha: {
      idCaptcha: 0,
      svg: false,
      registro: ''
    },
    cadastro: {
      nome: '',
      username: '',
      email: '',
      senha: '',
      idCaptcha: null,
      texto: ''
    },
    loading: true,
    erroCaptcha: false,
    eye: false,
    snackbar: false,
    snackbarText: ''
  }),
  methods: {
    goRoute(routeName){
      this.$router.push({name: routeName});
    },
    async getCaptcha(idCaptcha = false){
      this.erroCaptcha = false;
      try{
        let url = 'user/getCaptcha';

        if(idCaptcha){
          url = 'user/getCaptcha?idCaptcha=' + idCaptcha;
        }

        this.axios.get(url).then((response) => {
          this.captcha = response.data;
          this.cadastro.idCaptcha = this.captcha.idCaptcha;
          let el = document.getElementById('captcha');
          el.innerHTML = this.captcha.svg;

          setTimeout(() => {
            this.erroCaptcha = true;
          }, 120000);
        }).finally(() => {
          this.loading = false;
        });
      }catch(error){
        console.log(error);
      }
    },
    doCadastro(){
      if(this.cadastro.senha.length >= 1
          && this.cadastro.username.length > 0
          && this.cadastro.nome.length > 0
          && this.cadastro.email.length > 0
          && this.cadastro.texto.length > 0){

        this.loading = true;

        this.axios.post('user/inserir', this.cadastro).then((value) => {
          if(value.data.cadastro){
            this.$store.main.setLogin(true);
            this.$store.user.setUser(value.data.userBasicData);
            localStorage.setItem('userdata', value.data.userdata);
            localStorage.setItem('router-verify-data', value.data.tokenRouterVerify);
            this.$router.push({name: 'Home'});
          }else{
            if(typeof value.data.error === 'string'){
              this.snackbarText = value.data.error;
              this.snackbar = true;
            }else{
              if(value.data.error[0].path === 'username'){
                this.snackbarText = value.data.error[0].msg;
              }else if(value.data.error[0].path === 'email'){
                this.snackbarText = value.data.error[0].msg;
              }else if(value.data.error[0].path === 'nome'){
                this.snackbarText = 'Não é permitido símbolos ou números no nome.';
              }else if(value.data.error[0].path === 'senha'){
                this.snackbarText = 'Senha deve conter pelo menos 8 (oito) dígitos.';
              }else if(value.data.error[0].path === 'texto'){
                this.snackbarText = 'Preencha o captcha.';
              }
              this.snackbar = true;
            }
          }
        }).finally(() => {
          this.loading = false;
        });
      }else{
        this.snackbarText = 'Há campos vazios.';
        this.snackbar = true;
      }
    },
    goLogin(e){
      e.preventDefault();
      this.$router.push({name: 'Login'});
    }
  },
  mounted() {
    this.getCaptcha();
  }
}
</script>

<style scoped>
#captcha * {
  margin: auto;
  font-family: "Arial Black",sans-serif;
}

.bg-lc {
  margin: 0;
  padding: 0;
  background-image: url("@/assets/bg-lc.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  backdrop-filter: blur(12px) !important;
}

input::placeholder {
  font-family: Aqua_Grotesque, sans-serif;
}

.hidden {
  display: none;
}
.logo {
  width: 170px;
  height: 170px;
  background-image: url("@/assets/logo-final.png");
  background-size: cover;
  background-position: center;
  margin: 0 auto;
  cursor: pointer;
}

.options {
  width: 100%;
  height:35px;
  border-radius: 5px;
  margin-bottom: 10px;

}
.register {
  width: 50%;
  background-color: rgba(0, 123, 255, 1.0);
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
  height:100%;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.r-color2 {
  background-color: rgba(0, 76, 179, 1)!important;
}
.l-color2 {
  background-color: rgba(0, 123, 255, 1.0)!important;
}
.login {
  background-color: rgba(0, 76, 179, 1);
  width: 100%;
  color:white;
  display: flex;
  justify-content: center;
  align-items: center;
  height:100%;
}

.container-registro {
  height: 600px;
  width: 350px;
  padding: 20px;
  color:white;
  border-radius: 5px;
  border-top-left-radius: 70px;
  background-color: rgba(0, 0, 0, 0.3);
}

.container-login {
  width: 350px;
  padding: 10px 20px;
  color:white;
  border-radius: 5px;
  border-top-right-radius: 70px;
  background-color: rgba(0, 0, 0, .5);
}

form {
  display: flex;
  flex-direction: column;
}

label {
  color: rgba(255, 255, 255, 0.4);
  font-family: Aqua_Grotesque, sans-serif;
  margin-bottom: 5px;

}

input {
  padding: 10px;
  margin-bottom: 10px;
  border: 0 solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s ease;
  background-color: rgba(0, 0, 0, 0.2);
  color:white;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.3);
  text-align:center;
}

input:focus {
  outline: none;
  border: 0 solid black;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);

}
input[type="submit"] {
  background-color: #007bff;
  color: white;
  width: 50%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 10px;
  transition: background-color 0.8s ease;
}

.container-login input[type="submit"] {
  margin-top: 156px;
}

input[type="submit"]:hover {
  background-color: #0056b3;
}

@media screen and (max-width: 1366px) {
  .container-registro {
    zoom: 0.8;
  }
  .container-login {
    zoom: 0.8;
  }
}
</style>