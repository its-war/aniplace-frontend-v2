import {defineStore} from "pinia";

export default defineStore('user', {
    state: () => ({
        idUser: 0,
        nome: '',
        ranking: 0,
        foto: '',
        userdata: {},
        userPerfil: null
    }),
    getters: {
        getIdUser: (state) => {
            return state.idUser;
        },
        getPrimeiroNome: (state) => {
            return state.nome.split(' ')[0];
        },
        getNome: (state) => {
            return state.nome;
        },
        getRanking: (state) => {
            return state.ranking;
        },
        getFoto: (state) => {
            return state.foto;
        },
        getUser: (state) => {
            return {idUser: state.idUser, nome: state.nome, ranking: state.ranking, foto: state.foto};
        },
        getUserdata: (state) => {
            return state.userdata;
        },
        getUserPerfil: (state) => {
            return state.userPerfil;
        }
    },
    actions: {
        setUser(user){
            this.idUser = user.idUser;
            this.nome = user.nome;
            this.ranking = user.ranking;
            this.foto = user.foto;
        },
        setId(id){
            this.idUser = id;
        },
        setNome(nome){
            this.nome = nome;
        },
        setRanking(rank){
            this.ranking = rank;
        },
        setFoto(foto){
            this.foto = foto;
        },
        setUserdata(user){
            this.userdata = user;
        },
        setUserPerfil(user){
            this.userPerfil = user;
        }
    }
});