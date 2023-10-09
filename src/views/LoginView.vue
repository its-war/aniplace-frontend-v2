<template>
  <div class="bg-lc">
    <div id="login" class="container-login">
      <div class="logo" @click="goRoute('Home')"></div>
      <div class="options">
        <div id="botao-login2" class="login l-color2">Fazer Login</div>
      </div>
      <form>
        <v-text-field prepend-inner-icon="mdi-at" v-model="login.username" label="Nome de usuário" placeholder="ex: davi95" density="compact"></v-text-field>

        <v-text-field prepend-inner-icon="mdi-lock-outline" v-on:click:appendInner="eye = !eye" :append-inner-icon="eye?'mdi-eye-outline':'mdi-eye-off-outline'" :type="eye?'text':'password'" v-model="login.senha" label="Senha" placeholder="********" density="compact"></v-text-field>

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
            <v-text-field @keyup.enter="doLogin" v-model="login.texto" label="Digite o código da imagem" placeholder="Ex: gh57He" density="compact"></v-text-field>
          </div>
        </div>

        <v-btn v-if="!erroCaptcha" class="l-color2" :loading="loading" @click="doLogin" append-icon="mdi-send">Entrar</v-btn>
      </form>
      <div style="display: flex; width: 100%; justify-content: center; font-size: 12px; margin-top: 10px">
        <p>
          Não possui uma conta? <a @click="goCadastro" href="/cadastro" style="color: #33b3f7">Cadastre-se</a>
        </p>
      </div>

      <v-snackbar v-model="snackbar">
        {{snackbarText}}
        <template v-slot:actions>
          <v-btn @click="snackbar = false" text="Ok" color="pink"/>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data: () => ({
    captcha: {
      idCaptcha: 0,
      svg: false,
      registro: ''
    },
    login: {
      username: '',
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
          this.login.idCaptcha = this.captcha.idCaptcha;
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
    doLogin(){
      if(this.login.senha.length >= 8 && this.login.username.length > 0 && this.login.texto.length > 0){
        this.loading = true;
        this.axios.post('user/login', this.login).then((value) => {
          if(value.data.login){
            this.$store.main.setLogin(true);
            this.$store.user.setUser(value.data.userBasicData);
            localStorage.setItem('userdata', value.data.userdata);
            localStorage.setItem('router-verify-data', value.data.tokenRouterVerify);
            this.$router.push({name: 'Home'});
          }else{
            this.snackbarText = value.data.error;
            this.snackbar = true;
          }
        }).finally(() => {
          this.loading = false;
        });
      }
    },
    goCadastro(e){
      e.preventDefault();
      this.$router.push({name: 'Cadastro'});
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