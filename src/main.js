import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { io } from 'socket.io-client'
import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
import config from '../config';

const apiUrl = import.meta.env.MODE === 'production' ? config.production : config.development;

import limitarTexto from "@/utils/limitarTexto";
import getImg from "@/utils/getImg";

// Store
import mainStore from "@/stores/mainStore";
import userStore from "@/stores/userStore";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi'
    },
    theme: {
        defaultTheme: 'dark'
    }
});

const app = createApp(App)

const axiosInstance = axios.create({baseURL: apiUrl + '/api', withCredentials: true});
axiosInstance.interceptors.response.use(response => {
        return response;
    },
    error => {
        const originalRequest = error.config;

        // Verifique se ocorreu um erro de autenticação (401) e se não é uma requisição de renovação do token
        if (error.response.status === 401 && !originalRequest._retry) {
            const refreshToken = localStorage.getItem('userdata');

            // Verifique se o token de atualização existe
            if (refreshToken) {
                // Faça uma requisição para renovar o token
                return axiosInstance
                    .put('user/refresh-token', { refreshToken })
                    .then((response) => {
                        if(response.data.login){
                            localStorage.setItem('userdata', response.data.userdata);
                            localStorage.setItem('router-verify-data', response.data.tokenRouterVerify);
                        }
                        originalRequest._retry = true;
                        return axiosInstance(originalRequest);
                    })
                    .catch(() => {
                        //window.location.href='/login';
                    });
            } else {
                //window.location.href='/login';
            }
        }

        return Promise.reject(error);
    }
);
axiosInstance.defaults.withCredentials = true;
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('router-verify-data');

        if (token) {
            config.headers.Authorization = token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(VueAxios, axiosInstance)
app.use(VuePlyr, {
    plyr: {
        controls: [
            'play-large',
            // 'restart',
            'rewind',
            'play',
            'fast-forward',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
            //'captions',
            'settings',
            //'pip',
            //'airplay',
            // 'download',
            'fullscreen',
        ],
        i18n: {
            restart: 'Reiniciar',
            rewind: 'Voltar {seektime}s',
            play: 'Play',
            pause: 'Pause',
            fastForward: 'Avançar {seektime}s',
            seek: 'Buscar',
            seekLabel: '{currentTime} / {duration}',
            played: 'Played',
            buffered: 'Buffered',
            currentTime: 'Tempo atual',
            duration: 'Duração',
            volume: 'Volume',
            mute: 'Mudo',
            unmute: 'Desmutar',
            enableCaptions: 'Ativar legenda',
            disableCaptions: 'Desativar legenda',
            download: 'Baixar',
            enterFullscreen: 'Entrar na tela cheia',
            exitFullscreen: 'Sair da tela cheia',
            frameTitle: '{title}',
            captions: 'Legendas',
            settings: 'Configurações',
            pip: 'PIP',
            menuBack: 'Voltar ao menu anterior',
            speed: 'Velocidade',
            normal: 'Normal',
            quality: 'Qualidade',
            loop: 'Repetição',
            start: 'Início',
            end: 'Fim',
            all: 'Todos',
            reset: 'Resetar',
            disabled: 'Desativado',
            enabled: 'Ativado',
            advertisement: 'Anúncio',
            qualityBadge: {
                2160: '4K',
                1440: 'HD',
                1080: 'Full HD',
                720: 'HD',
                576: 'SD',
                480: 'SD',
            },
        },
    }
})

// Store Instance
const store = {
    main: mainStore(),
    user: userStore()
}

// Global Properties
app.config.globalProperties.$store = store;
app.config.globalProperties.$limitarTexto = limitarTexto
app.config.globalProperties.$getImg = getImg
app.config.globalProperties.$socket = io(apiUrl)

app.mount('#app')

window._axios = axiosInstance
