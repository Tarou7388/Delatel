import config from "../env.js";
let Map, Circle, Polyline, AdvancedMarkerElement, mapa;
let datosCajas = [];
let marcador = null;
let marcadorCoordenada = null
let circulosCajas = [];
let marcadoresCajas = [];
let marcadoresMufas = [];
let datosMufas = [];

export let idCaja = null;
export let idSector = null;

async function obtenerDatosPlano(url) {
  const respuesta = await fetch(url);
  const data = await respuesta.json();
  let datos = [];
  data.forEach((item) => {
    const { coordenadas, descripcion, nombre, direccion } = item;
    const latLng = coordenadas.split(',').map(Number);
    datos.push({
      nombre,
      descripcion,
      latLng,
      direccion,
    });
  });
  return datos;
}

async function obtenerDatosAnidado(url) {
  const respuesta = await fetch(url);
  const data = await respuesta.json();
  let datos = [];
  data.forEach((item) => {
    const idKeys = Object.keys(item).filter(key => key.startsWith('id'));
    const { coordenadas, descripcion, nombre, direccion } = item;
    const idValue = idKeys.length > 1 ? item[idKeys[1]] : null;

    if (!datos[idValue]) {
      datos[idValue] = [];
    }
    const latLng = coordenadas.split(',').map(Number);
    datos[idValue].push({
      ...item,
      latLng,
      idValue
    });
  });
  return datos;
}

async function buscarMarcadorCercano(arreglo, condicion = () => true) {
  let marcadorMasCercano = null;
  let distanciaMinima = 1000;
  arreglo.forEach(marcador => {
    const posicionMarcador = new google.maps.LatLng(marcador.latLng[0], marcador.latLng[1]);
    const distancia = google.maps.geometry.spherical.computeDistanceBetween(posicionMarcador, marcadorCoordenada);
    if (distancia < distanciaMinima && condicion(marcador)) {
      marcadorMasCercano = marcador;
      distanciaMinima = distancia;
    }
  });
  return marcadorMasCercano;
}

export async function iniciarMapa(params = { cajas: true, mufas: true }, id = "map", renderizado = "modal") {
  const posicionInicial = { lat: -13.417077, lng: -76.136585 };
  ({ Map, Circle, Polyline } = await google.maps.importLibrary("maps"));
  ({ AdvancedMarkerElement } = await google.maps.importLibrary("marker"));

  mapa = new Map(document.getElementById(id), {
    zoom: 13,
    center: posicionInicial,
    mapId: "DEMO_MAP_ID",
  });

  if (params.cajas) {
    await eventocajas();
  };
  if (params.mufas) {
    eventomufas();
  }
  if (document.getElementById('CoordenadaModel')) {
    document.getElementById('buscarBtn').addEventListener('click', async () => {
      const CoordenadaModel = document.getElementById('CoordenadaModel').value;
      await buscarCoordenadas(CoordenadaModel.split(',')[0], CoordenadaModel.split(',')[1]);
    });
  }

  switch (renderizado) {
    case "modal":
      eventoMapa(false);
      circulosCajas.forEach(subArray => {
        subArray.forEach(circulo => {
          circulo.addListener('click', async (e) => {
            const marcadorMasCercano = await buscarMarcadorCercano(datosCajas[circulo.idValue], (marcador) => marcador.numero_entradas > 0);
            idCaja = marcadorMasCercano.id_caja;
            if (marcadorMasCercano) {
              datosCajas.forEach(subArray => {
                subArray.forEach(cajas => {
                  if (cajas.id_sector == marcadorMasCercano.id_sector) {
                    idSector = cajas.id_sector;
                  }
                });
              });
              document.getElementById('btnGuardarModalMapa').disabled = false;
            }
          });
        });
      });
      document.getElementById('btnGuardarModalMapa').addEventListener('click', () => {
        if (marcadorCoordenada != null) {
          const modal = bootstrap.Modal.getInstance(document.getElementById('ModalMapa'));
          if (document.getElementById('txtCoordenadasMapa')) {
            document.getElementById('txtCoordenadasMapa').value = `${marcadorCoordenada.lat()},${marcadorCoordenada.lng()}`;
            document.getElementById('txtCoordenadasMapa').dispatchEvent(new Event('change', { bubbles: true }));
          }
          if (document.getElementById('txtCoordenadas')) {
            document.getElementById('txtCoordenadas').value = `${marcadorCoordenada.lat()},${marcadorCoordenada.lng()}`;
          }
          if (document.getElementById('txtCoordenadasPersona')) {
            document.getElementById('txtCoordenadasPersona').value = `${marcadorCoordenada.lat()},${marcadorCoordenada.lng()}`;
          }
        }
      });
      break;
    case "pagina":
      eventoMapa(true);
      break;
    default:
      break;
  }
}

async function eventocajas() {
  const datos = await obtenerDatosAnidado(`${config.HOST}app/controllers/Caja.controllers.php?operacion=listarCajas`);
  datosCajas = datos;
  circulosCajas = await circulosAnidado(datos, "#0984e3");
  marcadoresCajas = await marcadoresAnidado(datos, "cajaNAP");
}

async function eventomufas() {
  const datos = await obtenerDatosPlano(`${config.HOST}app/controllers/Mufas.controllers.php?operacion=listarMufas`);
  marcadoresMufas = await marcadoresPlano(datos, "mufa");
  datosMufas = datos;
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
  mapa.addListener('click', async (e) => {
    marcadorCoordenada = valor ? e.latLng : null;
    if (marcador) marcador.setMap(null);
    marcador = new AdvancedMarkerElement({
      position: e.latLng,
      map: mapa,
      title: "Marcador"
    });
    if (marcadorCoordenada == null) {
      if (document.getElementById('btnGuardarModalMapa')) {
        document.getElementById('btnGuardarModalMapa').disabled = true;
      }
    }
  });
}

async function ObtenerCordenadas(objeto) {
  objeto.addListener('click', (e) => {
    marcadorCoordenada = e.latLng;
    if (marcador) marcador.setMap(null);
    marcador = new AdvancedMarkerElement({
      position: e.latLng,
      map: mapa,
      title: "Marcador"
    });
  });
}

async function circulosAnidado(datos, color) {
  let arregloCirculo = [];
  datos.forEach(subArray => {
    subArray.forEach(async item => {
      const circulo = new Circle({
        center: { lat: item.latLng[0], lng: item.latLng[1] },
        radius: 1000,
        map: mapa,
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        idValue: item.idValue
      });
      await ObtenerCordenadas(circulo);
      if (!arregloCirculo[item.idValue]) arregloCirculo[item.idValue] = [];
      arregloCirculo[item.idValue].push(circulo);
    });
  });
  return arregloCirculo;
}

async function marcadoresPlano(datos) {
  let marcadorarreglo = [];
  datos.forEach(item => {
    const img = document.createElement('img');
    img.src = `${config.HOST}image/mufa.png`;
    const marcador = new AdvancedMarkerElement({
      position: { lat: item.latLng[0], lng: item.latLng[1] },
      map: mapa,
      title: item.nombre,
      content: img
    });
    marcadorarreglo.push(marcador);
  });
  return marcadorarreglo;
}

async function marcadoresAnidado(datos, icono) {
  let marcadorarreglo = [];
  datos.forEach(subArray => {
    subArray.forEach(item => {
      const img = document.createElement('img');
      img.src = `${config.HOST}image/${icono}.png`;
      const marcador = new AdvancedMarkerElement({
        position: { lat: item.latLng[0], lng: item.latLng[1] },
        map: mapa,
        title: item.nombre,
        content: img
      });
      const ventanaInfo = new google.maps.InfoWindow({
        content: `
        <div id="content">
          <h1 id="firstHeading" class="firstHeading">${item.nombre}</h1>
          <div id="bodyContent">
            <p>${item.descripcion}</p>
            <p>Coordenadas: ${item.latLng}</p>
          </div>
        </div>`,
        ariaLabel: "Demo InfoWindow",
      });
      marcador.addListener('click', () => {
        ventanaInfo.open({
          anchor: marcador,
          map: mapa,
          shouldFocus: false,
        });
      });
      if (!marcadorarreglo[item.idValue]) marcadorarreglo[item.idValue] = [];
      marcadorarreglo[item.idValue].push(marcador);
    });
  });
  return marcadorarreglo;
}

async function buscarCoordenadas(latitud, longitud) {
  const posicion = new google.maps.LatLng(latitud, longitud);
  mapa.setCenter(posicion);
  mapa.setZoom(15);

  if (marcador) {
    marcador.setMap(null);
  }

  marcador = new AdvancedMarkerElement({
    position: posicion,
    map: mapa,
    title: "Ubicación buscada"
  });

  let clickDisparado = false;
  circulosCajas.forEach(subArray => {
    subArray.forEach(circulo => {
      if (!clickDisparado && google.maps.geometry.spherical.computeDistanceBetween(posicion, circulo.getCenter()) <= circulo.getRadius()) {
        google.maps.event.trigger(circulo, 'click', {
          latLng: posicion
        });
        clickDisparado = true;
      }
    });
  });

  if (!clickDisparado) {
    google.maps.event.trigger(mapa, 'click', {
      latLng: posicion
    });
  }
}

function initMap() {
  // Inicializar el mapa
  mapa = new google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
  });
}

export async function buscarCercanos(idCaja) {
  const response = await fetch(`${config.HOST}app/controllers/Caja.controllers.php?operacion=listarCajasSectorIdCaja&idCaja=${idCaja}`);
  const data = await response.json();
  console.log(data);
  return data;
}

export async function renderizarCoordenadaMapa(id) {
  try {
    // Hacer la solicitud HTTP para obtener las coordenadas
    const response = await fetch(`http://localhost/Delatel/app/controllers/Contrato.controllers.php?operacion=obtenerCoordenadasbyId&id=${id}`);
    const data = await response.json();

    if (data && data.length > 0 && data[0].coordenada) {
      const coordenada = data[0].coordenada.split(',');
      const latitud = coordenada[0];
      const longitud = coordenada[1];

      console.log('Coordenadas obtenidas:', latitud, longitud);

      // Crear una nueva posición y centrar el mapa
      const posicion = new google.maps.LatLng(latitud, longitud);
      mapa.setCenter(posicion);
      mapa.setZoom(15);
      // Eliminar el marcador anterior, si existe
      if (marcador) {
        marcador.setMap(null);
      }

      const img = document.createElement('img');
      img.src = `${config.HOST}image/contrato.png`;
      
      marcador = new google.maps.Marker({
        position: posicion,
        map: mapa,
        title: "Ubicación buscada",
        content: img
      });

      console.log('Nueva posición del mapa:', posicion.lat(), posicion.lng());
    } else {
      console.error('No se encontraron coordenadas en la respuesta.');
    }
  } catch (error) {
    console.error('Error al obtener las coordenadas:', error);
  }
}