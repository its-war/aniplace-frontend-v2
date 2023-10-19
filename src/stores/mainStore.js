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
        lastRoutePath: ''
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
        }
    }
});