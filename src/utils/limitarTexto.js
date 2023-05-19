export default function limitarTexto(texto, limite) {
    if (texto.length > limite) {
        return texto.substring(0, limite) + "...";
    } else {
        return texto;
    }
}