import Anime from './Anime'

export default function install(app){
  app.provide('repository', {
    animes: Anime
  });
}