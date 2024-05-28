import { query, where, collection, getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { useCollection } from "vuefire";
import { firebaseApp } from "@/firebase/index";

const tableName = 'generos';
const database = getFirestore(firebaseApp);
const tableCollection = collection(database, tableName);

export default class Genero {
  static async getGenerosAnime(generos){
    try{
      generos = generos.split(',');
      generos = generos.map(genero => Number(genero));
      let listGeneros = [];
      for (let i = 0; i < generos.length; i++) {
        const docRef = doc(tableCollection, `/${generos[i]}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          listGeneros.push({id: docSnap.id, ...docSnap.data()});
        }
      }
      return listGeneros;
    } catch (e) {
      console.error(e);
    }
  }

  static async getAll(){
    try{
      return await useCollection(tableCollection);
    } catch (e) {
      console.error(e);
    }
  }

  static async save(genero, idGenero = null){
    try{
      if(idGenero){
        genero.idGenero = idGenero;
      }
      const documentRef = idGenero ? doc(tableCollection, `/${idGenero}`) : doc(tableCollection);
      await setDoc(documentRef, genero);
      return documentRef.id;
    } catch (e) {
      console.error(e);
    }
  }
}