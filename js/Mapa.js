import config from "../env.js";
import * as Herramientas from "./Herramientas.js";
export const emitter = new Herramientas.EventEmitter();

let Map, Circle, Polygon, AdvancedMarkerElement, mapa, InfoWindow;
let marcador = null;
let marcadorCoordenada = null
let marcadoresCajas = [];

let circles = [];
let unionPolygons = [];
let unionPolygon = null;
let RADIO = 1000; // Radio de 1 km
const BATCH_SIZE = 150;
let COLOR = "#6c5ce7";
let union = null;
let puntosMarcador = turf.featureCollection([]);

export let ultimaCoordenada = null;
export let marcadoresCercanos = [];
export let idCaja = null;
export let idSector = null;
export let nombreSector = null;
let ubicacionMarcador;

export async function encontrarMarcadoresCercanos(coordenadaClick, radio = 1000) {
  const puntoClick = turf.point([coordenadaClick.lng, coordenadaClick.lat]);

  // Filtrar marcadores que están dentro del radio especificado (en metros)
  const marcadoresEnRadio = puntosMarcador.features.filter(marcador => {
    const punto = turf.point([marcador.geometry.coordinates[0], marcador.geometry.coordinates[1]]);
    const distancia = turf.distance(puntoClick, punto, { units: 'meters' });
    return distancia <= radio;
  });

  // Convertir a formato GeoJSON FeatureCollection
  return turf.featureCollection(marcadoresEnRadio);
}

async function iniciarRenderizadoPorLotes() {
  let index = 0;

  const procesarLote = () => {
    const batch = circles.slice(index, index + BATCH_SIZE);
    batch.forEach(datos => {
      const circle = new google.maps.Circle({
        center: { lat: datos.lat, lng: datos.lng },
        radius: RADIO
      });

      // Convertir el círculo en un polígono y fusionarlo con la unión actual
      const newPolygon = turf.circle([datos.lng, datos.lat], RADIO, {
        steps: 40, // Reducir el número de pasos para mejorar el rendimiento
        units: 'meters'
      });

      union = union ? turf.union(union, newPolygon) : newPolygon;
    });

    // Actualizar el polígono en el mapa
    actualizarPoligonoEnMapa(union);

    // Actualizar el progreso
    index += BATCH_SIZE;
    const progress = Math.min((index / circles.length) * 100, 100);

    // Procesar el siguiente lote si hay más círculos
    if (index < circles.length) {
      setTimeout(procesarLote, 100); // Esperar 100 ms antes de procesar el siguiente lote
    }
  };

  // Iniciar el procesamiento del primer lote
  procesarLote();
}

async function actualizarPoligonoEnMapa(union) {

  unionPolygons.forEach(polygon => polygon.setMap(null));
  unionPolygons = []; // Reiniciar el arreglo de polígonos

  // Eliminar el polígono de unión anterior (si existe)
  if (unionPolygon) {
    unionPolygon.setMap(null);
  }

  // Verificar si la unión es un multipolígono
  if (union.geometry.type === 'MultiPolygon') {
    // Si es un multipolígono, mostrar cada polígono por separado
    union.geometry.coordinates.forEach(polygonCoords => {
      const polygon = new google.maps.Polygon({
        paths: polygonCoords[0].map(coord => ({ lat: coord[1], lng: coord[0] })),
        strokeColor: COLOR,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: COLOR + '55',
        fillOpacity: 0.2,
        map: mapa
      });
      unionPolygons.push(polygon);
      polygon.addListener('click', async (e) => {
        eventoPoligonos(e);
      });  
    });

  } else {
    // Si es un solo polígono, mostrarlo directamente
    unionPolygon = new google.maps.Polygon({
      paths: union.geometry.coordinates[0].map(coord => ({ lat: coord[1], lng: coord[0] })),
      strokeColor: COLOR,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: COLOR + '55',
      fillOpacity: 0.25,
      map: mapa
    });

    unionPolygon.addListener('click', async (e) => {
      eventoPoligonos(e);
    });
  }
}

async function eventoPoligonos(e) {
  marcadorCoordenada = { lat: e.latLng.lat(), lng: e.latLng.lng() };
  if (marcador == null) {
    marcador = new AdvancedMarkerElement({
      position: e.latLng,
      map: mapa,
      title: "Marcador"
    });
  } else {
    marcador.setMap(null);
    marcador = new AdvancedMarkerElement({
      position: e.latLng,
      map: mapa,
      title: "Marcador"
    });
  }
  marcadoresCercanos = await encontrarMarcadoresCercanos({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  marcadoresCercanos = marcadoresCercanos.features
  if (document.querySelector('#btnGuardarModalMapa')) {
    document.querySelector('#btnGuardarModalMapa').disabled = false;
  }
}

export async function iniciarMapa(objetoRender = "Cajas", id = "map", renderizado = "modal", coordenadaCualquiera = false) {
  const posicionInicial = { lat: -13.417077, lng: -76.136585 };
  ({ Map, Circle, Polygon, InfoWindow } = await google.maps.importLibrary("maps"));
  ({ AdvancedMarkerElement } = await google.maps.importLibrary("marker"));

  let infoWindow = new InfoWindow();

  mapa = new Map(document.getElementById(id), {
    zoom: 13,
    center: posicionInicial,
    mapId: "DEMO_MAP_ID",
  });
  if (objetoRender == "Cajas") {
    const response = await fetch(`${config.HOST}app/controllers/Caja.controllers.php?operacion=listarCajas`);
    const datosCajas = await response.json();
    datosCajas.forEach(caja => {
      const coordenada = caja.coordenadas.split(',');
      const latitud = parseFloat(coordenada[0]);
      const longitud = parseFloat(coordenada[1]);
      const img = document.createElement('img');
      img.src = `${config.HOST}image/cajaNAP.png`;
      const marcador = new AdvancedMarkerElement({
        position: { lat: latitud, lng: longitud },
        map: mapa,
        title: caja.idCaja,
        content: img,
      });
      marcador.addListener('click', async (e) => {
        if (infoWindow) {
          infoWindow.close
        }
        const contentString = `
          <div id="content">
            <div id="siteNotice"></div>
            <h1 id="firstHeading" class="firstHeading">${caja.nombre}</h1>
            <div id="bodyContent">
              <p><b>Id:</b> ${caja.id_caja}</p>
              <p><b>Descripcion :</b> ${caja.descripcion}</p>
              <p><b>Sector:</b> ${caja.sector}</p>
              <p><b>Coordenadas:</b> ${caja.coordenadas}</p>
            </div>
          </div>
        `;
        infoWindow.setContent(contentString);
        infoWindow.open(mapa, marcador);
      });
      circles.push({ lat: latitud, lng: longitud });
      marcadoresCajas.push({ id: caja.id_caja, lat: latitud, lng: longitud, idSector: caja.id_sector });
      puntosMarcador.features.push(turf.point([longitud, latitud], { id: caja.id_caja, idSector: caja.id_sector }));
    });
    RADIO = 1000;
    COLOR = "#6c5ce7";
    await iniciarRenderizadoPorLotes();
  } else if (objetoRender == "Antenas") {
    const response = await fetch(`${config.HOST}app/controllers/Antenas.controllers.php?operacion=listarAntenas`);
    const datosAntenas = await response.json();
    datosAntenas.forEach(antena => {
      const coordenada = antena.coordenadas.split(',');
      const latitud = parseFloat(coordenada[0]);
      const longitud = parseFloat(coordenada[1]);
      const img = document.createElement('img');
      img.src = `${config.HOST}image/antena.png`;
      const marcador = new AdvancedMarkerElement({
        position: { lat: latitud, lng: longitud },
        map: mapa,
        title: antena.idAntena,
        content: img,
      });
      marcador.addListener('click', async (e) => {
        if (infoWindow) {
          infoWindow.close
        }
        const contentString = `
          <div id="content">
            <div id="siteNotice"></div>
            <h1 id="firstHeading" class="firstHeading">${antena.nombre}</h1>
            <div id="bodyContent">
              <p><b>Id:</b> ${antena.idAntena}</p>
              <p><b>Descripcion :</b> ${antena.descripcion}</p>
              <p><b>Coordenadas:</b> ${antena.coordenadas}</p>
            </div>
          </div>
        `;
        infoWindow.setContent(contentString);
        infoWindow.open(mapa, marcador);
      });
      circles.push({ lat: latitud, lng: longitud });
      puntosMarcador.features.push(turf.point([longitud, latitud], { id: antena.idAntena }));
    });
    RADIO = 1500;
    COLOR = "#ee5253";
    await iniciarRenderizadoPorLotes();
  }

  if (document.querySelector('#inputGroupCoordenada')) {
    document.querySelector('#buscarCoordenada').addEventListener('click', async () => {
      if (document.querySelector('#CoordenadaModel').value != '') {
        const coordenada = document.querySelector('#CoordenadaModel').value.split(',');
        const latitud = parseFloat(coordenada[0]);
        const longitud = parseFloat(coordenada[1]);
        const posicion = new google.maps.LatLng(latitud, longitud);
        mapa.setCenter(posicion);
        mapa.setZoom(15);
        if (ubicacionMarcador) ubicacionMarcador.setMap(null);
        if (marcador) marcador.setMap(null);
        marcador = new AdvancedMarkerElement({
          position: posicion,
          map: mapa,
          title: "Marcador"
        });
        const punto = turf.point([longitud, latitud]);
        const dentroDelPoligono = turf.booleanPointInPolygon(punto, union);

        if (dentroDelPoligono) {
          document.querySelector('#btnGuardarModalMapa').disabled = false;
          marcadoresCercanos = await encontrarMarcadoresCercanos({ lat: latitud, lng: longitud });
          marcadoresCercanos = marcadoresCercanos.features
          marcadorCoordenada = { lat: latitud, lng: longitud };
        } else {
          document.querySelector('#btnGuardarModalMapa').disabled = true;
        }
        document.querySelector('#btnGuardarModalMapa').disabled = coordenadaCualquiera ? false : true;
      }
    });
  }

  switch (renderizado) {
    case "modal":
      eventoMapa(coordenadaCualquiera);
      const btnGuardarModalMapa = document.getElementById('btnGuardarModalMapa');
      if (btnGuardarModalMapa) {
        btnGuardarModalMapa.addEventListener('click', () => {
          if (marcadorCoordenada != null) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('ModalMapa'));
            if (document.getElementById('txtCoordenadasMapa')) {
              document.getElementById('txtCoordenadasMapa').value = `${marcadorCoordenada.lat},${marcadorCoordenada.lng}`;
              document.getElementById('txtCoordenadasMapa').dispatchEvent(new Event('change', { bubbles: true }));
            }
            if (document.getElementById('txtCoordenadas')) {
              document.getElementById('txtCoordenadas').value = `${marcadorCoordenada.lat},${marcadorCoordenada.lng}`;
            }
            if (document.getElementById('txtCoordenadasPersona')) {
              document.getElementById('txtCoordenadasPersona').value = `${marcadorCoordenada.lat},${marcadorCoordenada.lng}`;
            }
            localStorage.setItem('marcadoresCercanos', JSON.stringify(marcadoresCercanos));
            emitter.emit('coordenadaEncontrada');
          }
        });
      }
      break;
    case "pagina":
      eventoMapa(true);
      /*       circulosCajas.forEach(subArray => {
              subArray.forEach(circulo => {
                circulo.addListener('click', async (e) => {
                  const idSector = circulo.idValue;
                  const response = await fetch(`${config.HOST}app/controllers/Sector.controllers.php?operacion=buscarSector&idSector=${idSector}`);
                  const data = await response.json();
                  nombreSector = data[0].sector;
                  emitter.emit('funcionEjecutada');
                });
              });
            }); */
      break;
    default:
      break;
  }
}

export async function eliminarMapa() {

  // Limpiar el arreglo de círculos
  circles = [];

  // Eliminar todos los polígonos almacenados en unionPolygons
  if (unionPolygons.length > 0) {
    unionPolygons.forEach(polygon => polygon.setMap(null));
    unionPolygons = []; // Reiniciar el arreglo de polígonos
  }

  // Eliminar el polígono de unión principal (si existe)
  if (unionPolygon) {
    unionPolygon.setMap(null);
    unionPolygon = null;
  }

  // Limpiar el mapa y otros elementos
  mapa = null;
  marcadoresCajas = [];
  union = null;
  puntosMarcador = turf.featureCollection([]);

  // Eliminar el marcador si existe
  if (marcador) {
    marcador.setMap(null);
    marcador = null;
  }
}

export async function actualizarMapa(id = "map2") {
  const params = {
    cajas: document.getElementById('checkCajas').checked,
    mufas: document.getElementById('checkMufas').checked
  };
  eliminarElementosAnidados(circulosCajas);
  eliminarElementosAnidados(marcadoresCajas);
  eliminarElementosAnidados(marcadoresMufas);
  if (params.cajas) {
    eventocajas();
  }
  if (params.mufas) {
    eventomufas();
  }
}

async function eventoMapa(valor) {
  if(valor){
    mapa.addListener('click', async (e) => {
      marcadorCoordenada = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      if (marcador) marcador.setMap(null);
      marcador = new AdvancedMarkerElement({
        position: e.latLng,
        map: mapa,
        title: "Marcador"
      });
      if (document.getElementById('btnGuardarModalMapa')) {
        document.getElementById('btnGuardarModalMapa').disabled = false;
      }
    });
  }
}

export async function buscarCercanos(idCaja) {
  const response = await fetch(`${config.HOST}app/controllers/Caja.controllers.php?operacion=listarCajasSectorIdCaja&idCaja=${idCaja}`);
  const data = await response.json();
  return data;
}

export async function renderizarCoordenadaMapa(id) {
  try {
    const response = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerCoordenadasbyId&id=${id}`);
    const data = await response.json();

    if (data && data.length > 0 && data[0].coordenada) {
      const coordenada = data[0].coordenada.split(',');
      const latitud = parseFloat(coordenada[0]);
      const longitud = parseFloat(coordenada[1]);

      const posicion = new google.maps.LatLng(latitud, longitud);
      mapa.setCenter(posicion);
      mapa.setZoom(15);
      const img = `${config.HOST}image/ubicacionCliente.png`;

      ubicacionMarcador = new google.maps.Marker({
        position: posicion,
        map: mapa,
        title: "Ubicación buscada",
        icon: img,
      });
    } else {
      console.error('No se encontraron coordenadas en la respuesta.');
    }
  } catch (error) {
    console.error('Error al obtener las coordenadas:', error);
  }
}

export async function buscarCoordenadassinMapa(latitud, longitud) {
  const datos = await obtenerDatosAnidado(`${config.HOST}app/controllers/Caja.controllers.php?operacion=listarCajas`);
  datosCajas = datos;

  const posicionBuscada = new google.maps.LatLng(latitud, longitud);
  let posicionDentroDeCirculo = false;
  let idSectorEncontrado = null;

  if (!posicionDentroDeCirculo) {
    console.warn("La posición no está dentro de ningún círculo.");
  }

  return idSectorEncontrado;
}

export function obtenerCoordenadasClick() {
  mapa.addListener("click", (e) => {
    ultimaCoordenada = {
      latitud: e.latLng.lat(),
      longitud: e.latLng.lng()
    };

    if (marcador) marcador.setMap(null);

    marcador = new AdvancedMarkerElement({
      position: e.latLng,
      map: mapa,
      title: "Marcador"
    });
  });
}


