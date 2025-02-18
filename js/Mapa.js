import config from "../env.js";
import * as Herramientas from "./Herramientas.js";
export const emitter = new Herramientas.EventEmitter();

let Map, Circle, Polyline, AdvancedMarkerElement, mapa;
let datosCajas = [];
let datosAntenas = [];
let marcador = null;
let marcadorCoordenada = null
let circulosCajas = [];
let circulosAntenas = [];
let marcadoresCajas = [];
let marcadoresMufas = [];
let marcadoresAntenas = [];
let datosMufas = [];
export let ultimaCoordenada = null; 

export let idCaja = null;
export let idSector = null;
export let nombreSector = null;
let ubicacionMarcador;
let posicionMarcador; 

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
  arreglo.forEach(marcador => {
    const posicionMarcador = new google.maps.LatLng(marcador.latLng[0], marcador.latLng[1]);
    const distancia = google.maps.geometry.spherical.computeDistanceBetween(posicionMarcador, marcadorCoordenada);
    if ((!marcadorMasCercano || distancia < marcadorMasCercano.distancia) && condicion(marcador)) {
      marcadorMasCercano = { ...marcador, distancia };
    }
  });
  return marcadorMasCercano;
}

export async function iniciarMapa(params = { cajas: true, mufas: true, antena: true }, id = "map", renderizado = "modal") {
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
  }
  
  if (params.mufas) {
    await eventomufas();
  }
  if (params.antena) {
    await eventoantena();
  }

  const buscarBtn = document.getElementById('buscarBtn');
  if (buscarBtn) {
    buscarBtn.addEventListener('click', async () => {
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
            if (marcadorMasCercano) {
              if (marcadorMasCercano.distancia <= 1000) {
                idCaja = marcadorMasCercano.id_caja;
                datosCajas.forEach(subArray => {
                  subArray.forEach(cajas => {
                    if (cajas.id_sector == marcadorMasCercano.id_sector) {
                      idSector = cajas.id_sector;
                    }
                  });
                });
                document.getElementById('btnGuardarModalMapa').disabled = false;
              }
            }
          });
        });
      });
      circulosAntenas.forEach(subArray => {
        subArray.forEach(circulo => {
          circulo.addListener('click', async (e) => {
            const marcadorMasCercano = await buscarMarcadorCercano(datosAntenas[circulo.idValue]);

            if (marcadorMasCercano) {
              if (marcadorMasCercano.distancia <= 4000) {
                document.getElementById('btnGuardarModalMapa').disabled = false;
              }
            }
          });
        });
      });
      const btnGuardarModalMapa = document.getElementById('btnGuardarModalMapa');
      if (btnGuardarModalMapa) {
        btnGuardarModalMapa.addEventListener('click', () => {
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
      }
      break;
    case "pagina":
      eventoMapa(true);
      circulosCajas.forEach(subArray => {
        subArray.forEach(circulo => {
          circulo.addListener('click', async (e) => {
            const idSector = circulo.idValue;
            const response = await fetch(`${config.HOST}app/controllers/Sector.controllers.php?operacion=buscarSector&idSector=${idSector}`);
            const data = await response.json();
            nombreSector = data[0].sector;
            emitter.emit('funcionEjecutada');
          });
        });
      });
      break;
    default:
      break;
  }
}

async function eventocajas() {
  const datos = await obtenerDatosAnidado(`${config.HOST}app/controllers/Caja.controllers.php?operacion=listarCajas`);
  datosCajas = datos;
  console.log(datos);
  circulosCajas = await circulosAnidado(datos, "#0984e3");
  marcadoresCajas = await marcadoresAnidado(datos, "cajaNAP");
}

async function eventomufas() {
  const datos = await obtenerDatosPlano(`${config.HOST}app/controllers/Mufas.controllers.php?operacion=listarMufas`);
  marcadoresMufas = await marcadoresPlano(datos, "mufa");
  datosMufas = datos;
}

async function eventoantena() {
  datosAntenas = await obtenerDatosAnidado(`${config.HOST}app/controllers/Antenas.controllers.php?operacion=listarAntenas`);
  marcadoresAntenas = await marcadoresAnidado(datosAntenas, "antena");
  circulosAntenas = await circulosAnidado(datosAntenas, "#e84393", 4000);

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

async function circulosAnidado(datos, color, distancia = 1000) {
  let arregloCirculo = [];
  datos.forEach(subArray => {
    subArray.forEach(async item => {
      const circulo = new Circle({
        center: { lat: item.latLng[0], lng: item.latLng[1] },
        radius: distancia,
        map: mapa,
        strokeColor: color,
        strokeOpacity: 0.3,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.01,
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
      posicionMarcador = posicion; 

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

  datosCajas.forEach(subArray => {
    subArray.forEach(caja => {
      if (caja.latLng && caja.latLng.length === 2) {
        const posicionCaja = new google.maps.LatLng(caja.latLng[0], caja.latLng[1]);
        const circulo = new google.maps.Circle({
          center: posicionCaja,
          radius: 1000,
          map: mapa,
          strokeColor: "transparent",
          strokeOpacity: 0,
          strokeWeight: 0,
          fillColor: "transparent",
          fillOpacity: 0
        });

        const distancia = google.maps.geometry.spherical.computeDistanceBetween(posicionBuscada, circulo.getCenter());
        if (distancia <= circulo.getRadius()) {
          posicionDentroDeCirculo = true;
          idSectorEncontrado = caja.id_sector;
        }
      }
    });
  });

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

    console.log("Coordenadas obtenidas:", ultimaCoordenada);
  });
}


