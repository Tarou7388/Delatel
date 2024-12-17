import config from "../env.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener('DOMContentLoaded', async () => {
  let Map, Circle, Polyline, AdvancedMarkerElement, mapa

  const accesos = await Herramientas.permisos();

  let marcadorPrincipal = null;

  let Coordenadas = null;

  let CablePrincipal = null;

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

  (async () => {
    cargarSelect();
  })();

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

  async function cargarSelect() {
    const response = await fetch(`${config.HOST}app/controllers/Distritos.controllers.php?operacion=buscarDistrito&valor=1102`);
    const data = await response.json();
    const select = document.querySelector("#buscarDistrito");
    data.forEach(item => {
      const option = document.createElement("option");
      option.value = item.id_distrito;
      option.text = item.distrito;
      select.appendChild(option);
    });
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
    if (data.error) {
      showToast(data.error.message, "ERROR");
    } else {
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

  document.querySelector("#formAgregarMufa").addEventListener("submit", async (e) => {
    e.preventDefault();
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarMufa2'));
    if(await ask("¿Desea guardar la mufa?")){
      agregarMufa();
    }
    modal.hide();
  });

  document.querySelector("#formAgregarSector").addEventListener("submit", async (e) => {
    e.preventDefault();
    if(await ask("¿Desea guardar el sector?")){
      agregarSector();
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarSector2'));
    modal.hide();
  });

  async function eventocajas() {
    datosCajas = await obtenerDatosAnidado(`${config.HOST}app/controllers/Caja.controllers.php?operacion=listarCajas`);
    marcadoresCajas = await marcadoresAnidado(datosCajas, "rojo");
  }

  async function eventomufas() {
    const datos = await obtenerDatosPlano(`${config.HOST}app/controllers/Mufas.controllers.php?operacion=listarMufas`);
    marcadoresMufas = await marcadoresPlano(datos, "verde");

    for (let i = 0; i < marcadoresMufas.length; i++) {
      marcadoresMufas[i].addListener('click', async (e) => {
        if (banderaCable) {
          idMufaRegistro = datos[i].id_mufa;
          const json = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          lineaCableGuardar.push(json);
          banderaCable = false;
          if (await ask("¿Desea guardar la caja?")) {
            await agregarCaja();
            await agregarCable();
            marcadoresCajas.forEach(marcador => {
              marcador.forEach(item => {
                item.setMap(null);
              });
            });
            eventocajas();
            lineasCables.forEach(linea => {
              linea.setMap(null);
            });
            eventoCables();
            marcadorPrincipal.setMap(null);
          }
        }
      });
    }
  }

  async function eventoCables() {
    const response = await fetch(`${config.HOST}app/controllers/Lineas.controllers.php?operacion=getLineas`);
    const data = await response.json();
    data.forEach((linea, index) => {
      const line = new google.maps.Polyline({
        path: linea.coordenadas,
        geodesic: true,
        strokeColor: index === 0 ? "#227093" : "#cd6133",
        strokeWeight: index === 0 ? 7 : 3
      });
      lineasCables.push(line);
      line.setMap(mapa);
    });
    CablePrincipal = lineasCables[0];
    CablePrincipal.addListener('click', async (e) => {
      blooquearbotones(true, false, true);
      Coordenadas = `${e.latLng.lat()},${e.latLng.lng()}`;
      marcadorPrincipalEvento(e.latLng.toJSON());
    });
  }

  async function agregarSector() {
    const coordenadasEnviar = `${Coordenadas.lat},${Coordenadas.lng}`;
    const paramsEnviar = new FormData();
    paramsEnviar.append("operacion", "registrarSector");
    paramsEnviar.append("idDistrito", document.querySelector("#buscarDistrito").value);
    paramsEnviar.append("sector", document.querySelector("#nombreSector").value);
    paramsEnviar.append("descripcion", document.querySelector("#descripcionSector").value);
    paramsEnviar.append("coordenadas", coordenadasEnviar);
    paramsEnviar.append("idUsuario", user.idUsuario);
    const response = await fetch(`${config.HOST}app/controllers/Sector.controllers.php`, {
      method: "POST",
      body: paramsEnviar
    });
    const data = await response.json();
    if(data.error){
      showToast(data.error.message, "ERROR");
      console.log(data.error);
    }else{
      showToast("Registrado Correctamente", "SUCCESS");
      marcadoresSectores.forEach(marcador => {
        marcador.setMap(null);
      });
      eventoSectores();
    }
  }

  async function agregarMufa() {
    const paramsEnviar = new FormData();
    paramsEnviar.append("operacion", "registrarMufa");
    paramsEnviar.append("nombre", document.querySelector("#nombreMufa").value);
    paramsEnviar.append("descripcion", document.querySelector("#descripcionMufa").value);
    paramsEnviar.append("coordenadas", Coordenadas);
    paramsEnviar.append("direccion", document.querySelector("#direccionMufa").value);
    paramsEnviar.append("id_usuario", user.idUsuario);
    const response = await fetch(`${config.HOST}app/controllers/Mufas.controllers.php`, {
      method: "POST",
      body: paramsEnviar
    });
    const data = await response.json();
    if(data.error){
      showToast(data.error.message, "ERROR");
    }else{
      showToast("Registrado Correctamente", "SUCCESS");
      marcadoresMufas.forEach(marcador => {
        marcador.setMap(null);
      });
      eventomufas();
    }
  }

  async function blooquearbotones(caja, mufa, sector) {
    document.querySelector("#modalAgregarCaja").disabled = caja;
    document.querySelector("#modalAgregarMufa").disabled = mufa;
    document.querySelector("#modalAgregarSector").disabled = sector;
  }

  async function eventoSectores() {
    datosSectores = await obtenerDatosPlano(`${config.HOST}app/controllers/Sector.controllers.php?operacion=listarSectoresMapa`);
    marcadoresSectores = await marcadoresPlano(datosSectores, "azul");
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
          marcador.setMap(null);
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

  async function marcadorPrincipalEvento(latLng) {
    if (marcadorPrincipal) {
      marcadorPrincipal.setMap(null);
    }

    marcadorPrincipal = new AdvancedMarkerElement({
      position: latLng,
      map: mapa,
      title: "Marcador"
    });
  }

  document.querySelector("#btnActualizar").addEventListener("click", () => {
    updateMap();
  })

  await initMap(params);

  let coordenadasCajaGuardada = false;

  mapa.addListener('click', (event) => {
    const latLng = event.latLng.toJSON();
    Coordenadas = { lat: latLng.lat, lng: latLng.lng };

    blooquearbotones(false, true, false);
    marcadorPrincipalEvento(latLng)

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

