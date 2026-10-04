// Se carga en el <head> sin defer: marca que hay JavaScript antes del primer pintado,
// para que el menu movil y la animacion de la portada no parpadeen.
document.documentElement.classList.add("js");
