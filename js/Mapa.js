import config from "../env.js";
let mapa;
let circulos = [];
let marcadorActivo = null;
export let marcadorMasCercano = null;

let Map, Circle, AdvancedMarkerElement;

async function posicionActual(e) {
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
  data.forEach((item) => {
    const idKey = Object.keys(item).find(key => key.startsWith('id'));
    const idKeys = Object.keys(item).filter(key => key.startsWith('id'));
    const idValue = idKeys.length > 1 ? item[idKeys[1]] : null;
    const id_sector = item.id_sector;

    if (!datos[idValue]) {
      datos[idValue] = [];
    }
    const latLng = item.coordenadas.split(',').map(Number);
    const { coordenadas, ...resto } = item;
    datos[idValue].push({
      ...resto,
      latLng: latLng
    });
  });
  return datos;
}
let i = 0;
export async function obtenerDatosDesconocidos(url) {
  const respuesta = await fetch(url);
  const data = await respuesta.json();
  const datos = data;
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
    if (distancia < distanciaMinima && marcador.numero_entradas > 0) {
      marcadormas = marcador.nombre;
      distanciaMinima = distancia;
      document.querySelector('#btnGuardarCoordenadas').disabled = false;
    }
  }
  const datos = {
    marcadormas,
    distancia: distanciaMinima,
    coordenadas: `${latClick}, ${lonClick}`
  }
  marcadorMasCercano = datos;
}

export async function iniciarMapa(url = '', id = 'map', botonguardar = '') {
  document.querySelector('#btnGuardarCoordenadas').disabled = true;
  const posicionInicial = { lat: -13.417077, lng: -76.136585 };
  ({ Map, Circle } = await google.maps.importLibrary("maps"));
  ({ AdvancedMarkerElement } = await google.maps.importLibrary("marker"));


  mapa = new Map(document.getElementById(id), {
    zoom: 16,
    center: posicionInicial,
    mapId: "DEMO_MAP_ID",
  });

  if (url != '') {
    const datos = await obtenerDatosDesconocidos(url);
    await procesarDatosDesconocidos(datos, mapa);
  } else {
    const datos = await obtenerDatos();
    await procesarDatosCajas(datos, mapa, botonguardar);
  }
}

async function procesarDatosDesconocidos(datos, mapa) {
  datos.forEach(subArray => {
    subArray.forEach(({ nombre, descripcion }) => {
      const posicion = { lat: -13.417077, lng: -76.136585 };
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
          </div>
        </div>`,
        ariaLabel: "Demo InfoWindow",
      });

      marcador.addListener("click", () => ventanaInfo.open({ anchor: marcador, map: mapa }));
    });
  });

}

async function procesarDatosCajas(datos, mapa, botonguardar) {
  datos.forEach(subArray => {
    subArray.forEach(({ latLng, nombre, descripcion, id_sector }) => {
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

      marcadorMasCercano = null;
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
      if (!circulos[id_sector]) {
        circulos[id_sector] = [];
      }
      circulos[id_sector].push(circulo);

      circulosCajaCercana(circulo, datos[id_sector]);
    });
  });
  mapa.addListener("click", async (e) => {
    await posicionActual(e);
    marcadorMasCercano = null;
    if (botonguardar != '') {
      document.getElementById(botonguardar).disabled = true;
    }
    showToast("No hay Cobertura en esta Zona", "WARNING");
  });
}

async function circulosCajaCercana(circulo, datosIdSector) {
  circulo.addListener("click", async (e) => {
    await posicionActual(e);
    await encontrarPuntoMasCercano(e.latLng.lat(), e.latLng.lng(), datosIdSector);
  });
}