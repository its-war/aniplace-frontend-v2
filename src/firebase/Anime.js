import { firebaseApp } from './index'
import { useCollection } from 'vuefire'
import {
  collection,
  doc,
  endBefore,
  getDoc,
  getFirestore,
  limit,
  limitToLast,
  orderBy,
  query,
  setDoc,
  startAfter,
  where
} from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

import pica from 'pica'
import imageCompression from 'browser-image-compression'

const picaInstance = pica();

const tableName = 'animes';
const database = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const tableCollection = collection(database, tableName);

export default class Anime {
  static async listAll(){
    try{
      return await useCollection(tableCollection);
    } catch (e) {
      console.error(e);
    }
  }

  static async getById(idAnime){
    try{
      const documentRef = doc(tableCollection, idAnime);
      const docSnap = await getDoc(documentRef);
      if(docSnap.exists()){
        return {id: docSnap.id, ...docSnap.data()}
      }else{
        return null;
      }
    } catch (e) {
      console.error(e);
    }
  }

  static async getFirstPage(pageSize = 10, orderField = 'nome', mode = 'asc'){
    try{
      const q = query(
        tableCollection,
        orderBy(orderField, mode),
        limit(pageSize + 1)
      );
      return await useCollection(q);
    }catch (e) {
      console.error(e);
    }
  }

  static async getNextPage(lastItemOrderFieldValue, pageSize = 10, orderField = 'nome', mode = 'asc'){
    try{
      const q = query(
        tableCollection,
        orderBy(orderField, mode),
        startAfter(lastItemOrderFieldValue),
        limit(pageSize + 1)
      );
      return await useCollection(q);
    } catch (e) {
      console.error(e);
    }
  }

  static async getPreviousPage(firstItemOrderFieldValue, pageSize = 10, orderField = 'nome', mode = 'asc'){
    try{
      const q  = query(
        tableCollection,
        orderBy(orderField, mode),
        endBefore(firstItemOrderFieldValue),
        limitToLast(pageSize + 1)
      );
    } catch (e) {
      console.error(e);
    }
  }

  static async save(anime, idAnime = null){
    try{
      const documentRef = idAnime ? doc(tableCollection, `/${idAnime}`) : doc(tableCollection);
      await setDoc(documentRef, anime);
      return documentRef.id;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * @description Envia uma foto/capa do anime
   * @param idAnime
   * @param type ('foto' | 'capa')
   * @param imgFile
   * @param imgName
   * @returns {Promise<string>}
   */
  static upload(idAnime, type, imgFile, imgName = null){
    return new Promise(async (resolve, reject) => {
      try{
        imgFile = await prepareImage(imgFile, type);

        const referencia = imgName ? ref(storage, `img/anime/${type}/${imgName}`) :
          ref(storage, `img/anime/${type}/anime-${type}-${idAnime}.jpg`);
        uploadBytes(referencia, imgFile).then((value) => {
          if(value){
            Anime.getAnimeImgUrl(idAnime, type).then(resolve);
          }
        });
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }

  static getAnimeImgUrl(idAnime, type, imgName = null){
    return new Promise((resolve, reject) => {
      try{
        const referencia = imgName ? ref(storage, `img/anime/${type}/${imgName}`) :
          ref(storage, `img/anime/${type}/anime-${type}-${idAnime}.jpg`);
        getDownloadURL(referencia).then(url => {
          resolve(url);
        })
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }

  static async getMaisAcessados(){
    try{
      const q = query(
        tableCollection,
        where('acessos', '>', 0),
        where('status', '==', 1),
        orderBy('acessos', 'desc'),
        limit(25)
      );
      return await useCollection(q);
    } catch (e) {
      console.error(e);
    }
  }
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

async function resizeImage(file, type) {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const dimensions = {
    "foto": [900, 1280],
    "capa": [1920, 1080]
  }

  const TARGET_WIDTH = dimensions[type][0];
  const TARGET_HEIGHT = dimensions[type][1];

  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;

  return picaInstance.resize(img, canvas, {
    unsharpAmount: 80,
    unsharpRadius: 0.6,
    unsharpThreshold: 2
  });
}

async function convertToJpg(canvas) {
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));
  const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
  const options = {
    maxSizeMB: 1,
    useWebWorker: true
  };
  return imageCompression(file, options);
}

async function prepareImage(file, type){
  const resizedImage = await resizeImage(file, type);
  return await convertToJpg(resizedImage);
}