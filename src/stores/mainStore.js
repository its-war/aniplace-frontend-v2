import {defineStore} from "pinia";

export default defineStore('main', {
    state: () => ({
        adblock: false,
        login: false,
        mobile: false,
        loading: false
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
        }
    }
});