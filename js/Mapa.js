import config from "../env.js";

let mapa;
let circulos = [];
let marcadorActivo = null;
export let marcadorMasCercano = null;

export async function posicionActual(e) {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  if (marcadorActivo) marcadorActivo.setMap(null);
  marcadorActivo = new AdvancedMarkerElement({
    position: { lat: e.latLng.lat(), lng: e.latLng.lng() },
    map: mapa,
  });
}

export async function obtenerDatos() {
  const respuesta = await fetch(`${config.HOST}app/controllers/Caja.controllers.php?operacion=listarCajas`);
  const data = await respuesta.json();
  let datos = [];
  data.forEach(({ id_caja, nombre, descripcion, numero_entradas, id_sector, coordenadas }) => {
    if (!datos[id_sector]) {
      datos[id_sector] = [];
    }
    datos[id_sector].push({
      id: id_caja,
      latLng: coordenadas.split(',').map(Number),
      nombre,
      descripcion,
      idSector: id_sector,
      nEntradas: numero_entradas
    });
  });
  console.log(datos);
  return datos;
}

async function encontrarPuntoMasCercano(latClick, lonClick, marcadores) {
  const clickLatLng = new google.maps.LatLng(latClick, lonClick);
  let marcadormas = null;
  let distanciaMinima = 1000;
  for (let i = 0; i < marcadores.length; i++) {
    const marcador = marcadores[i];
    const posicionMarcador = new google.maps.LatLng(marcador.latLng[0], marcador.latLng[1]);
    const distancia = google.maps.geometry.spherical.computeDistanceBetween(posicionMarcador, clickLatLng);
    if (distancia < distanciaMinima && marcador.nEntradas > 0) {
      marcadormas = marcador.nombre;
      distanciaMinima = distancia;
    }
  }
  const datos = {
    marcadormas,
    distancia: distanciaMinima,
    coordenadas: `${latClick}, ${lonClick}`
  }
  marcadorMasCercano = datos;
}

export async function iniciarMapa() {
  const posicionInicial = { lat: -13.417077, lng: -76.136585 };
  const { Map, Circle } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  mapa = new Map(document.getElementById("map"), {
    zoom: 16,
    center: posicionInicial,
    mapId: "DEMO_MAP_ID",
  });

  const datos = await obtenerDatos();

  datos.forEach(subArray => {
    subArray.forEach(({ latLng, nombre, descripcion, idSector }) => {
      const posicion = { lat: latLng[0], lng: latLng[1] };
      const marcador = new AdvancedMarkerElement({
        map: mapa,
        position: posicion,
        title: nombre
      });

      const ventanaInfo = new google.maps.InfoWindow({
        content: `
        <div id="content">
          <h1 id="firstHeading" class="firstHeading">${nombre}</h1>
          <div id="bodyContent">
            <p>${descripcion}</p>
            <p>Coordenadas: ${latLng}</p>
          </div>
        </div>`,
        ariaLabel: "Demo InfoWindow",
      });

      marcador.addListener("click", () => ventanaInfo.open({ anchor: marcador, map: mapa }));

      const circulo = new Circle({
        map: mapa,
        center: posicion,
        radius: 1000,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        name: nombre,
      });
      if (!circulos[idSector]) {
        circulos[idSector] = [];
      }
      circulos[idSector].push(circulo);

      circulosCajaCercana(circulo, datos[idSector], circulos[idSector]);

      mapa.addListener("click", async (e) => {
        console.log("Has hecho click en:", e.latLng.lat(), e.latLng.lng());
        await mapa.posicionActual(e);
        alert('Zona sin cobertura');
      });
    });
  });
}

async function circulosCajaCercana(circulo, datosIdSector) {
  circulo.addListener("click", async (e) => {
    await posicionActual(e);
    await encontrarPuntoMasCercano(e.latLng.lat(), e.latLng.lng(), datosIdSector);
  });
}