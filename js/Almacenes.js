import config from "../env.js";
import * as mapa from "./Mapa.js";
import * as Herramientas from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", async () => {

  async function cargarMapa() {
    await mapa.iniciarMapa({}, "map", "modal");
    mapa.obtenerCoordenadasClick();
    document.querySelector("#map").addEventListener("click", async () => {
      $("#CoordenadaModel").val(mapa.ultimaCoordenada.latitud + "," + mapa.ultimaCoordenada.longitud);
    });
  }

  


  (async function () {
    await cargarMapa();
  })();
});
