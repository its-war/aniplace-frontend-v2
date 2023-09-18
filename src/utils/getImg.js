import config from "../../config";

export default function getImg(img, contexto){
    const apiUrl = import.meta.env.MODE === 'production' ? config.production : config.development;
    return apiUrl + '/img/' + contexto + '/' + img;
}