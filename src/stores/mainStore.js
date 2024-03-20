import {defineStore} from "pinia";

export default defineStore('main', {
    state: () => ({
        adblock: false,
        login: false,
        mobile: false,
        loading: false,
        animeList: [],
        totalPages: 1,
        tituloVerTodos: '',
        adsActive: true,
        lastRoutePath: '',
        snackbar: {
            show: false,
            text: '',
            color: 'success',
            timeout: 10000,
            icon: 'mdi-check'
        }
    }),
    getters: {
        getAdblockValue: (state) => {
            return state.adblock;
        },
        isLogged: (state) => {
            return state.login;
        },
        isMobile: (state) => {
            return state.mobile;
        },
        isLoading: (state) => {
            return state.loading;
        },
        getAnimeList: (state) => {
            return state.animeList;
        },
        getTotalPages: (state) => {
            return state.totalPages;
        },
        getTituloVerTodos: (state) => {
            return state.tituloVerTodos;
        },
        getAdsActive: (state) => {
            return state.adsActive;
        },
        getLastRoutePath: (state) => {
            return state.lastRoutePath;
        },
        getSnackbar: (state) => {
            return state.snackbar;
        }
    },
    actions: {
        setAdblock(value){
            this.adblock = value;
        },
        setLogin(value){
            this.login = value;
        },
        setMobile(value){
            this.mobile = value;
        },
        setLoading(value){
            this.loading = value;
        },
        getLogin(){
            return new Promise((resolve, reject) => {
                window._axios.get('user/verify-frontend-router').then((response) => {
                    if(response.data.authorization){
                        this.setLogin(true);
                        resolve(response.data.user);
                    }else{
                        resolve(false);
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
        },
        setAdsOff(){
            //
        },
        setAnimeList(animeList){
            this.animeList = animeList;
        },
        setTotalPages(total){
            this.totalPages = total;
        },
        setTituloVerTodos(titulo){
            this.tituloVerTodos = titulo;
        },
        getAdsActiveConfig(){
            return new Promise((resolve, reject) => {
                window._axios.get('ads/adsActive').then((response) => {
                    resolve(response.data.adsActive);
                }).catch(() => {
                    resolve(true);
                });
            });
        },
        setAdsActive(value){
            this.adsActive = value;
        },
        setLastRoutePath(value){
            this.lastRoutePath = value;
        },
        getUserPerfil(idUser){
            return new Promise((resolve, reject) => {
                window._axios.get('user/getPublicPerfil', {
                    params: {
                        idUser: idUser
                    }
                }).then((response) => {
                    if(response.data.user){
                        resolve(response.data.user);
                    }else{
                        resolve(null);
                    }
                }).catch(() => {
                    resolve(null);
                });
            });
        },
        /**
         *
         * @param show {Boolean}
         * @param text {String}
         * @param color {String}
         * @param timeout {Number}
         * @param icon {String}
         */
        setSnackbar(show, text, color = 'success', timeout = 10000, icon = 'mdi-check') {
            this.snackbar.show = show;
            this.snackbar.text = text;
            this.snackbar.color = color;
            this.snackbar.timeout = timeout;
            this.snackbar.icon = icon;
        },
        closeSnackbar(){
            this.snackbar.show = false;
        }
    }
});