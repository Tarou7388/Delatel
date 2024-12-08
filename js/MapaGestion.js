import config from "../env.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener('DOMContentLoaded', async () => {
  let Map, Circle, Polyline, AdvancedMarkerElement, mapa

  const accesos = await Herramientas.permisos();

  let marcadorPrincipal = null;

  let Coordenadas = null;

  let datosCajas = [];
  let datosSectores = [];

  let sectorCercano = null;

  let marcadoresMufas = [];
  let marcadoresSectores = [];
  let marcadoresCajas = [];
  let lineasCables = [];

  let idCajaRegistro = "";
  let lineaCableGuardar = [];
  let nombreCaja = "";
  let descripcionCaja = "";
  let numeroEntradasCaja = "";
  let direccionCaja = "";
  let coordenadasCaja = "";

  let idMufaRegistro = "";

  let banderaCable = false;

  let line = null;

  const params = { cajas: true, mufas: true, cables: true, sectores: true };

  async function initMap(params) {

    ({ Map, Circle, Polyline } = await google.maps.importLibrary("maps"));
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
    if (params.cables) {
      await eventoCables();
    }
    if (params.sectores) {
      await eventoSectores();
    }

  }

  async function agregarCaja() {
    const coordenadasEnviar = `${coordenadasCaja.lat},${coordenadasCaja.lng}`;
    let paramsEnviar = new FormData();
    paramsEnviar.append("operacion", "registrarCaja");
    paramsEnviar.append("nombre", nombreCaja);
    paramsEnviar.append("descripcion", descripcionCaja);
    paramsEnviar.append("numeroEntradas", numeroEntradasCaja);
    paramsEnviar.append("idSector", sectorCercano);
    paramsEnviar.append("direccion", direccionCaja);
    paramsEnviar.append("coordenadas", coordenadasEnviar);
    paramsEnviar.append("idUsuario", user.idUsuario);
    const response = await fetch(`${config.HOST}app/controllers/Caja.controllers.php?operacion=agregarCaja`, {
      method: "POST",
      body: paramsEnviar
    });
    const data = await response.json();
    idCajaRegistro = data[0].id_caja;
  }

  async function agregarCable() {
    let paramsEnviar = new FormData();
    paramsEnviar.append("operacion", "registrarLinea");
    paramsEnviar.append("idMufa", idMufaRegistro);
    paramsEnviar.append("idCaja", idCajaRegistro);
    paramsEnviar.append("coordenadas", JSON.stringify(lineaCableGuardar));
    paramsEnviar.append("idUsuario", user.idUsuario);

    const response = await fetch(`${config.HOST}app/controllers/Caja.controllers.php?operacion=agregarLinea`, {
      method: "POST",
      body: paramsEnviar
    });
    const data = await response.json();
    console.log(data);
    if(data.error){
      showToast(data.error.message, "ERROR");
    }else{
      showToast("Registrado Correctamente", "SUCCESS");
    }
  }

  async function buscarMarcadorCercano(datos, coordenadas) {
    let menorDistancia = 1000000;
    let marcadorCercano = null;
    datos.forEach(marcador => {
      const distancia = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(marcador.latLng[0], marcador.latLng[1]),
        new google.maps.LatLng(coordenadas.lat, coordenadas.lng)
      )
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        marcadorCercano = marcador;
      }
    });
    const params = {
      marcador: marcadorCercano,
      distancia: menorDistancia
    }
    return params;
  }

  document.querySelector("#formAgregarCaja").addEventListener("submit", async (e) => {
    e.preventDefault();
    nombreCaja = document.querySelector("#nombreCaja").value;
    descripcionCaja = document.querySelector("#descripcionCaja").value;
    numeroEntradasCaja = document.querySelector("#numEntradasCaja").value;
    direccionCaja = document.querySelector("#direccionCaja").value;
    coordenadasCaja = Coordenadas;

    const marcador = await buscarMarcadorCercano(datosSectores, coordenadasCaja);
    sectorCercano = marcador.marcador.id_sector;
    banderaCable = true;
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregar'));
    modal.hide();
  });

  async function eventocajas() {
    datosCajas = await obtenerDatosAnidado(`${config.HOST}app/controllers/Caja.controllers.php?operacion=listarCajas`);
    marcadoresCajas = await marcadoresAnidado(datosCajas, "cajaNAP");
  }

  async function eventomufas() {
    const datos = await obtenerDatosPlano(`${config.HOST}app/controllers/Mufas.controllers.php?operacion=listarMufas`);
    marcadoresMufas = await marcadoresPlano(datos, "mufa");

    for (let i = 0; i < marcadoresMufas.length; i++) {
      marcadoresMufas[i].addListener('click', async (e) => {
        if (banderaCable) {
          idMufaRegistro = datos[i].id_mufa;
          const json = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          lineaCableGuardar.push(json);
          banderaCable = false;
          if(ask("¿Desea guardar la caja?")){
            await agregarCaja();
            await agregarCable();
          }
        }
      });
    }
  }

  async function eventoCables() {
    const response = await fetch(`${config.HOST}app/controllers/Lineas.controllers.php?operacion=getLineas`);
    const data = await response.json();
    data.forEach(linea => {
      const line = new google.maps.Polyline({
        path: linea.coordenadas,
        geodesic: true,
        strokeColor: "#FF0000",
      });
      lineasCables.push(line);
      line.setMap(mapa);
    });
  }

  async function eventoSectores() {
    datosSectores = await obtenerDatosPlano(`${config.HOST}app/controllers/Sector.controllers.php?operacion=listarSectoresMapa`);
    marcadoresSectores = await marcadoresPlano(datosSectores, "sector");
  }

  async function marcadoresPlano(datos, img2) {
    let marcadorarreglo = [];
    datos.forEach(item => {
      const img = document.createElement('img');
      img.src = `${config.HOST}image/${img2}.png`;
      const marcador = new AdvancedMarkerElement({
        position: { lat: item.latLng[0], lng: item.latLng[1] },
        map: mapa,
        title: item.nombre,
        content: img
      });
      marcadorarreglo.push(marcador);
      marcador.addListener('click', () => {
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
        ventanaInfo.open({
          anchor: marcador,
          map: mapa,
          shouldFocus: false,
        });
      });
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
        latLng,
        ...item
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

  async function updateMap() {
    const params1 = {};
    params1.cajas = document.querySelector("#chkCajas").checked;
    params1.mufas = document.querySelector("#chkMufas").checked;
    params1.cables = document.querySelector("#chkCables").checked;
    params1.sectores = document.querySelector("#chkSectores").checked;

    if (params1.cajas != params.cajas) {
      if (params1.cajas) {
        await eventocajas();
      } else {
        marcadoresCajas.forEach(marcador => {
          marcador.forEach(item => {
            item.setMap(null);
          });
        });
      }
    }
    if (params1.mufas != params.mufas) {
      if (params1.mufas) {
        await eventomufas();
      } else {
        marcadoresMufas.forEach(marcador => {
          marcador.forEach(item => {
            item.setMap(null);
          });
        });
      }
    }
    if (params1.cables != params.cables) {
      if (params1.cables) {
        await eventoCables();
      } else {
        lineasCables.forEach(linea => {
          linea.setMap(null);
        });
      }
    }
    if (params1.sectores != params.sectores) {
      if (params1.sectores) {
        await eventoSectores();
      } else {
        marcadoresSectores.forEach(marcador => {
          marcador.setMap(null);
        });
      }
    }

    params.cajas = params1.cajas;
    params.mufas = params1.mufas;
    params.cables = params1.cables;
    params.sectores = params1.sectores;
  }

  async function marcarLineaCable(json) {
    if (!coordenadasCajaGuardada) {
      lineaCableGuardar.push(coordenadasCaja);
      coordenadasCajaGuardada = true;
    }

    lineaCableGuardar.push(json);
    console.log(lineaCableGuardar);

    if (line) {
      line.setMap(null);
    }
    line = new google.maps.Polyline({
      path: lineaCableGuardar,
      geodesic: true,
      strokeColor: "#FF0000",
    });

    line.setPath(lineaCableGuardar);
    line.setMap(mapa);
  }

  document.querySelector("#btnActualizar").addEventListener("click", () => {
    updateMap();
  })

  await initMap(params);

  let coordenadasCajaGuardada = false;

  mapa.addListener('click', (event) => {
    const latLng = event.latLng.toJSON();
    Coordenadas = { lat: latLng.lat, lng: latLng.lng };

    if (marcadorPrincipal) {
      marcadorPrincipal.setMap(null);
    }

    marcadorPrincipal = new AdvancedMarkerElement({
      position: latLng,
      map: mapa,
      title: "Marcador"
    });

    if (Coordenadas != null) {
      document.querySelector("#modalAgregarCaja").disabled = false;
    }
    if (banderaCable) {
      const json = { lat: latLng.lat, lng: latLng.lng };
      console.log(json);
      marcarLineaCable(json);
    }
  });

});

