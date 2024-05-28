import Anime from './Anime'
import Genero from './Genero'

export default function install(app){
  app.provide('repository', {
    animes: Anime,
    generos: Genero
  });
}