import config from "../env.js";

document.addEventListener('DOMContentLoaded', async () => {
  let Map, Circle, Polyline, AdvancedMarkerElement, mapa

const params = { cajas: true, mufas: true };

async function initMap(params) {

  ({ Map } = await google.maps.importLibrary("maps"));
  ({ AdvancedMarkerElement } = await google.maps.importLibrary("marker"));
  // The location of the center of the map
  const posicionInicial = { lat: -13.417077, lng: -76.136585 };
  
  // The map, centered at the specified location
  mapa = new Map(document.getElementById('map'), {
    zoom: 13,
    center: posicionInicial,
    mapId: "DEMO_MAP_ID",
  });

  if (params.cajas) {
    await eventocajas();
  };
  if (params.mufas) {
    await eventomufas();
  }
  
}

async function eventocajas() {
  const datos = await obtenerDatosAnidado(`${config.HOST}app/controllers/Caja.controllers.php?operacion=listarCajas`);
  await marcadoresAnidado(datos, "cajaNAP");
}

async function eventomufas() {
  const datos = await obtenerDatosAnidado(`${config.HOST}app/controllers/Mufas.controllers.php?operacion=listarMufas`);
  console.log(datos);
  await marcadoresAnidado(datos, "mufa");
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

await initMap(params);

mapa.addListener('click', (event) => {
  const latLng = event.latLng.toJSON();
  console.log(latLng);
});

});

