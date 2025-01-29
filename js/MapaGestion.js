import config from "../env.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener('DOMContentLoaded', async () => {
  let Map, Circle, Polyline, AdvancedMarkerElement, mapa

  const accesos = await Herramientas.permisos();

  let marcadorPrincipal = null;
  let Coordenadas = null;
  let CablePrincipal = null;
  let sectorCercano = null;
  let line = null;
  let datosCajas = [];
  let datosSectores = [];
  let marcadoresMufas = [];
  let marcadoresSectores = [];
  let marcadoresCajas = [];
  let lineasCables = [];
  let lineaPrincipal = [];
  let lineaCableGuardar = [];
  let datosLimitesDistritos = [];
  let datosAntenas = [];
  let marcadoresAntenas = [];
  let limitesDistritos = [];
  let idDistrito = "";
  let idCajaRegistro = "";
  let nombreCaja = "";
  let descripcionCaja = "";
  let numeroEntradasCaja = "";
  let direccionCaja = "";
  let coordenadasCaja = "";
  let idMufaRegistro = "";
  let CablePrincipalGuardar = "";
  let coordenadasCajaGuardada = false;
  let lineaPrincipalAgregando = true;
  let banderaCable = false;
  let cablePrincipalInicio = true;
  let idSector = "";
  let login = await Herramientas.obtenerLogin();
  let idAntena = "";
  const params = { cajas: true, mufas: true, cables: true, sectores: true , antenas: true};

  (async () => {
    await initMap(params);
    limitesDistritos.forEach(item => {
      item.addListener('click', async (event) => {
        const latLng = event.latLng.toJSON();
        Coordenadas = { lat: latLng.lat, lng: latLng.lng };
        idDistrito = item.idDistrito;
        console.log(idDistrito);
        if (lineaPrincipalAgregando) {
          blooquearbotones(false, true, false, false, true, true, true, true, true);
        }
        marcadorPrincipalEvento(latLng)

        if (banderaCable) {
          const json = { lat: latLng.lat, lng: latLng.lng };
          marcarLineaCable(json);
        }
        if (CablePrincipalGuardar != "") {
          const json = { lat: latLng.lat, lng: latLng.lng };
          marcarLineaCable(json);
        }
      });
    });
  })();

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

  async function blooquearbotones(caja, mufa, sector, antena ,principal, eliminarCaja, eliminarmufa, eliminarsector, eliminarantena) {
    document.querySelector("#modalAgregarCaja").disabled = caja;
    document.querySelector("#modalAgregarMufa").disabled = mufa;
    document.querySelector("#modalAgregarSector").disabled = sector;
    document.querySelector("#modalAgregarAntena").disabled = antena;
    document.querySelector("#btnActualizarPrincipal").disabled = principal;
    document.querySelector("#btnEliminarCaja").disabled = eliminarCaja;
    document.querySelector("#btnEliminarMufa").disabled = eliminarmufa;
    document.querySelector("#btnEliminarSector").disabled = eliminarsector;
    document.querySelector("#btnEliminarAntena").disabled = eliminarantena;
  }

  async function updateMap() {
    const params1 = {};
    params1.cajas = document.querySelector("#chkCajas").checked;
    params1.mufas = document.querySelector("#chkMufas").checked;
    params1.cables = document.querySelector("#chkCables").checked;
    params1.sectores = document.querySelector("#chkSectores").checked;
    params1.antenas = document.querySelector("#chkAntenas").checked;

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
    if (params1.antenas != params.antenas) {
      if (params1.antenas) {
        await eventoAntena();
      } else {
        marcadoresAntenas.forEach(marcador => {
          marcador.setMap(null);
        });
      }
    }

    params.cajas = params1.cajas;
    params.mufas = params1.mufas;
    params.cables = params1.cables;
    params.sectores = params1.sectores;
    params.antenas = params1.antenas;
  }

  /* Inicia mapa aqui */
  async function initMap(params) {

    ({ Map, Circle, Polyline } = await google.maps.importLibrary("maps"));
    ({ AdvancedMarkerElement } = await google.maps.importLibrary("marker"));

    const posicionInicial = { lat: -13.417077, lng: -76.136585 };

    mapa = new Map(document.getElementById('map'), {
      zoom: 13,
      center: posicionInicial,
      mapId: "DEMO_MAP_ID",
    });

    const responseLimites = await fetch(`${config.HOST}app/controllers/Distritos.controllers.php?operacion=listarLimites&valor=1102`);
    const dataLimites = await responseLimites.json();
    datosLimitesDistritos = dataLimites;

    dataLimites.forEach(item => {
      const limites = item.limites.map(punto => ({ lat: punto.lat, lng: punto.lng }));

      const strokeColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      const fillColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

      const poligono = new google.maps.Polygon({
        paths: limites,
        strokeColor: strokeColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: fillColor,
        fillOpacity: 0.35,
        idDistrito: item.id_distrito
      });
      poligono.setMap(mapa);
      limitesDistritos.push(poligono);
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
    if (params.antenas) {
      await eventoAntena();
    }

  }
  /* Inicia mapa aqui */

  async function agregarCaja() {
    const coordenadasEnviar = `${coordenadasCaja.lat},${coordenadasCaja.lng}`;
    const nombreCajaEnviar = nombreCaja + document.querySelector("#codigoNombre").textContent;
    let paramsEnviar = new FormData();
    paramsEnviar.append("operacion", "registrarCaja");
    paramsEnviar.append("nombre", nombreCajaEnviar);
    paramsEnviar.append("descripcion", descripcionCaja);
    paramsEnviar.append("numeroEntradas", numeroEntradasCaja);
    paramsEnviar.append("idSector", sectorCercano);
    paramsEnviar.append("direccion", direccionCaja);
    paramsEnviar.append("coordenadas", coordenadasEnviar);
    paramsEnviar.append("idUsuario", login.idUsuario);
    const response = await fetch(`${config.HOST}app/controllers/Caja.controllers.php?operacion=agregarCaja`, {
      method: "POST",
      body: paramsEnviar
    });
    const data = await response.json();
    if (data.error) {
      showToast(data.error.message, "ERROR");
      idCajaRegistro = "";
    } else {
      idCajaRegistro = data[0].id_caja;
    }
  }

  async function agregarCable() {
    let paramsEnviar = new FormData();
    paramsEnviar.append("operacion", "registrarLinea");
    paramsEnviar.append("idMufa", idMufaRegistro);
    paramsEnviar.append("idCaja", idCajaRegistro);
    paramsEnviar.append("coordenadas", JSON.stringify(lineaCableGuardar));
    paramsEnviar.append("idUsuario", login.idUsuario);

    const response = await fetch(`${config.HOST}app/controllers/Caja.controllers.php?operacion=agregarLinea`, {
      method: "POST",
      body: paramsEnviar
    });
    const data = await response.json();
    if (data.error) {
      showToast(data.error.message, "ERROR");
    } else {
      showToast("Registrado Correctamente", "SUCCESS");
    }
  }

  async function agregarSector() {
    const coordenadasEnviar = `${Coordenadas.lat},${Coordenadas.lng}`;
    const paramsEnviar = new FormData();
    paramsEnviar.append("operacion", "registrarSector");
    paramsEnviar.append("idDistrito", idDistrito);
    paramsEnviar.append("sector", document.querySelector("#nombreSector").value);
    paramsEnviar.append("descripcion", document.querySelector("#descripcionSector").value);
    paramsEnviar.append("coordenadas", coordenadasEnviar);
    paramsEnviar.append("idUsuario", login.idUsuario);
    const response = await fetch(`${config.HOST}app/controllers/Sector.controllers.php`, {
      method: "POST",
      body: paramsEnviar
    });
    const data = await response.json();
    if (data.error) {
      showToast(data.error.message, "ERROR");
    } else {
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
    paramsEnviar.append("id_usuario", login.idUsuario);
    const response = await fetch(`${config.HOST}app/controllers/Mufas.controllers.php`, {
      method: "POST",
      body: paramsEnviar
    });
    const data = await response.json();
    if (data.error) {
      showToast(data.error.message, "ERROR");
    } else {
      showToast("Registrado Correctamente", "SUCCESS");
      marcadoresMufas.forEach(marcador => {
        marcador.setMap(null);
      });
      eventomufas();
    }
  }

  async function eventocajas() {
    datosCajas = await obtenerDatosAnidado(`${config.HOST}app/controllers/Caja.controllers.php?operacion=listarCajas`);
    marcadoresCajas = await marcadoresAnidado(datosCajas, "cajaNAP");
    marcadoresCajas.forEach((marcador, index1) => {
      marcador.forEach((item, index2) => {
        item.addListener('click', async () => {
          blooquearbotones(true, true, true, true, true, false, true, true, true);
          idCajaRegistro = datosCajas[index1][index2].id_caja;
        });
      });
    });
  }

  async function agregarAntena() {
    const coordenadasEnviar = `${Coordenadas.lat},${Coordenadas.lng}`;
    const paramsEnviar = new FormData();
    console.log(login.idUsuario);
    paramsEnviar.append("operacion", "registrarAntena");
    paramsEnviar.append("nombre", document.querySelector("#nombreAntena").value);
    paramsEnviar.append("descripcion", document.querySelector("#descripcionAntena").value);
    paramsEnviar.append("direccion", document.querySelector("#direccionAntena").value);
    paramsEnviar.append("coordenadas", coordenadasEnviar);
    paramsEnviar.append("idDistrito", idDistrito);
    paramsEnviar.append("idUsuario", login.idUsuario);
    const response = await fetch(`${config.HOST}app/controllers/Antenas.controllers.php`, {
      method: "POST",
      body: paramsEnviar
    });
    const data = await response.json();
    console.log(data);
    if (data.error) {
      showToast(data.error.message, "ERROR");
    } else {
      showToast("Registrado Correctamente", "SUCCESS");
      marcadoresAntenas.forEach(marcador => {
        marcador.forEach(item => {
          item.setMap(null);
        });
      });
      eventoAntena();
    }
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
          if (await ask("¿Desea guardar la caja?")) {
            await agregarCaja();
            if (idCajaRegistro != "") {
              await agregarCable();
            }
            line.setMap(null);
            idCajaRegistro = "";
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
            lineaCableGuardar = [];
            coordenadasCajaGuardada = false;
            marcadorPrincipal.setMap(null);
          }
        }else{
          idMufaRegistro = datos[i].id_mufa;
          blooquearbotones(true, true, true, true, true, true, false, true, true);
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
    data[0].coordenadas.forEach(item => {
      lineaPrincipal.push({ lat: item.lat, lng: item.lng });
    });
    CablePrincipal = lineasCables[0];
    CablePrincipal.addListener('click', async (e) => {
      if (lineaPrincipalAgregando) {
        blooquearbotones(true, false, true, true, true, true, true, true, true);
      }
      Coordenadas = `${e.latLng.lat()},${e.latLng.lng()}`;
      marcadorPrincipalEvento(e.latLng.toJSON());
    });
    const puntos = [
      { lat: CablePrincipal.getPath().getArray()[0].lat(), lng: CablePrincipal.getPath().getArray()[0].lng(), condicion: "inicio" },
      { lat: CablePrincipal.getPath().getArray()[CablePrincipal.getPath().getArray().length - 1].lat(), lng: CablePrincipal.getPath().getArray()[CablePrincipal.getPath().getArray().length - 1].lng(), condicion: "fin" }
    ];
    puntos.forEach(async (punto, index) => {
      const img = document.createElement('img');
      img.src = `${config.HOST}image/cable.png`;
      const marcador = new AdvancedMarkerElement({
        position: { lat: punto.lat, lng: punto.lng },
        map: mapa,
        title: "Principal",
        content: img,
      });
      marcador.addListener('click', () => {
        if (cablePrincipalInicio) {
          CablePrincipalGuardar = punto.condicion;
          const { condicion, ...puntoSinCondicion } = punto;
          lineaCableGuardar.push(puntoSinCondicion);
          cablePrincipalInicio = false;
          showToast("Agregando linea principal", "INFO");
          lineaPrincipalAgregando = false;
          coordenadasCajaGuardada = true;
          blooquearbotones(true, true, true, true, false, true, true, true, true);
        }
      });
    });
  }

  async function eventoSectores() {
    datosSectores = await obtenerDatosPlano(`${config.HOST}app/controllers/Sector.controllers.php?operacion=listarSectoresMapa`);
    marcadoresSectores = await marcadoresPlano(datosSectores, "azul");
    marcadoresSectores.forEach((marcador, index) => {
      marcador.addListener('click', async (e) => {
        idSector = datosSectores[index].id_sector;
        blooquearbotones(true, true, true, true, true, true, true, false, true);
      });
    });
  }

  async function eventoAntena() {
    datosAntenas = await obtenerDatosAnidado(`${config.HOST}app/controllers/Antenas.controllers.php?operacion=listarAntenas`);
    marcadoresAntenas = await marcadoresAnidado(datosAntenas, "antena");
    marcadoresAntenas.forEach((marcador, index1) => {
      marcador.forEach((item, index2) => {
        item.addListener('click', async () => {
          idAntena = datosAntenas[index1][index2].id_antena;
          blooquearbotones(true, true, true, true, true, true, true, true, false);
        });
      });
    });
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

  async function marcarLineaCable(json) {
    if (!coordenadasCajaGuardada) {
      lineaCableGuardar.push(coordenadasCaja);
      coordenadasCajaGuardada = true;
    }

    lineaCableGuardar.push(json);

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

  async function agregarLineasPrincipal(coordenadas) {
    const paramsEnviar = new FormData();
    paramsEnviar.append("operacion", "actualizarLineas");
    paramsEnviar.append("id", -1);
    paramsEnviar.append("coordenadas", JSON.stringify(coordenadas));
    paramsEnviar.append("idUsuario", login.idUsuario);
    const response = await fetch(`${config.HOST}app/controllers/Lineas.controllers.php`, {
      method: "POST",
      body: paramsEnviar
    });
    const data = await response.json();
  }

  document.querySelector("#btnActualizar").addEventListener("click", () => {
    updateMap();
  })

  document.querySelector("#formAgregarCaja").addEventListener("submit", async (e) => {
    e.preventDefault();
    nombreCaja = document.querySelector("#nombreCaja").value;
    descripcionCaja = document.querySelector("#descripcionCaja").value;
    numeroEntradasCaja = document.querySelector("#numEntradasCaja").value;
    direccionCaja = document.querySelector("#direccionCaja").value;
    coordenadasCaja = Coordenadas;
    const marcador = await buscarMarcadorCercano(datosSectores, coordenadasCaja);
    if(marcador.marcador == null){
      showToast("No se encontro sector cercano", "ERROR");
      return;
    }else if(marcador.distancia > 1000){
      showToast("El sector esta muy lejos", "INFO");
    }else{
      showToast("Dibuje el cableado", "INFO");
      sectorCercano = marcador.marcador.id_sector;
      banderaCable = true;
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregar'));
      modal.hide();
      document.querySelector("#formAgregarCaja").reset();
    }
  });

  document.querySelector("#formAgregarMufa").addEventListener("submit", async (e) => {
    e.preventDefault();
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarMufa2'));
    if (await ask("¿Desea guardar la mufa?")) {
      agregarMufa();
    }
    document.querySelector("#formAgregarMufa").reset();
    modal.hide();
  });

  document.querySelector("#formAgregarSector").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (await ask("¿Desea guardar el sector?")) {
      agregarSector();
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarSector2'));
    document.querySelector("#formAgregarSector").reset();
    modal.hide();
  });

  document.querySelector("#formAgregarAntena").addEventListener("submit", async (e) => {
    e.preventDefault();
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarAntena2'));
    if (await ask("¿Desea guardar la antena?")) {
      agregarAntena();
    }
    modal.hide();
  });

  document.querySelector("#numEntradasCaja").addEventListener("change", (e) => {
    if (document.querySelector("#numEntradasCaja").value == 8) {
      document.querySelector("#codigoNombre").textContent = "-08";
    } else if (document.querySelector("#numEntradasCaja").value == 16) {
      document.querySelector("#codigoNombre").textContent = "-16";
    }
  });

  document.querySelector("#btnActualizarPrincipal").addEventListener("click", async () => {
    if (await ask("¿Desea guardar la linea principal?")) {
      const coordenadasEnviar3 = [];
      if (CablePrincipalGuardar == "inicio") {
        lineaCableGuardar.forEach(item => {
          coordenadasEnviar3.push(item);
        });
        lineaPrincipal.forEach(item => {
          coordenadasEnviar3.push(item);
        });
      } else if (CablePrincipalGuardar == "fin") {
        lineaPrincipal.forEach(item => {
          coordenadasEnviar3.push(item);
        });
        lineaCableGuardar.forEach(item => {
          coordenadasEnviar3.push(item);
        });
      }
      await agregarLineasPrincipal(coordenadasEnviar3);
      showToast("Linea principal guardada", "SUCCESS");
      lineaPrincipalAgregando = false;
    };
  });

  document.querySelector("#btnEliminarCaja").addEventListener("click", async () => {
    const response = await fetch(`${config.HOST}app/controllers/Caja.controllers.php?operacion=cajaUso&idCaja=${idCajaRegistro}`);
    const data = await response.json();
    if(data[0].uso && data[0].uso == true){
      showToast("La caja esta en uso", "ERROR");
    }
    else{
      if (await ask("¿Desea eliminar la caja?")) {
        const datos = JSON.stringify({
          idCaja: idCajaRegistro,
          idUsuario: login.idUsuario,
          operacion: "eliminarCaja"
         });
        const response = await fetch(`${config.HOST}app/controllers/Caja.controllers.php`, {
          method: "PUT",
          body: datos
        });
        const data2 = await response.json();
        if (data2.error) {
          showToast(data2.error.message, "ERROR");
        } else {
          showToast("Eliminado Correctamente", "SUCCESS");
          idCajaRegistro = "";
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
        }
      }
    }
  });

  document.querySelector("#btnEliminarMufa").addEventListener("click", async () => {
    const response = await fetch(`${config.HOST}app/controllers/Mufas.controllers.php?operacion=mufaUso&idMufa=${idMufaRegistro}`);
    const data = await response.json();
    if(data[0].uso && data[0].uso == true){
      showToast("La mufa esta en uso", "ERROR");
    }
    else{
      if (await ask("¿Desea eliminar la mufa?")) {
        const datos = JSON.stringify({
          idMufa: idMufaRegistro,
          idUsuario: login.idUsuario,
          operacion: "eliminarMufa"
         });
        const response = await fetch(`${config.HOST}app/controllers/Mufas.controllers.php`, {
          method: "PUT",
          body: datos
        });
        const data2 = await response.json();
        if (data2.error) {
          showToast(data2.error.message, "ERROR");
        } else {
          showToast("Eliminado Correctamente", "SUCCESS");
          marcadoresMufas.forEach(marcador => {
            marcador.setMap(null);
          });
          eventomufas();
        }
      }
    }
  });

  document.querySelector("#btnEliminarAntena").addEventListener("click", async () => {
    if (await ask("¿Desea eliminar la antena?")) {
      const datos = JSON.stringify({
        idAntena: idAntena,
        idUsuario: login.idUsuario,
        operacion: "inhabilitarAntena"
       });
      const response = await fetch(`${config.HOST}app/controllers/Antenas.controllers.php`, {
        method: "PUT",
        body: datos
      });
      const data = await response.json();
      if (data.error) {
        showToast(data.error.message, "ERROR");
      } else {
        showToast("Eliminado Correctamente", "SUCCESS");
        marcadoresAntenas.forEach(marcador => {
          marcador.forEach(item => {
            item.setMap(null);
          });
        });
        eventoAntena();
      }
    }
  });
  
  document.querySelector("#btnEliminarSector").addEventListener("click", async () => {
    if (await ask("¿Desea desactivar el sector?")) {
      const datos = JSON.stringify({
        idSector: idSector,
        idUsuario: login.idUsuario,
        operacion: "desactivarSector"
       });
      const response = await fetch(`${config.HOST}app/controllers/Sector.controllers.php`, {
        method: "PUT",
        body: datos
      });
      const data = await response.json();
      if (data.error) {
        showToast(data.error.message, "ERROR");
      } else {
        showToast("Desactivado Correctamente", "SUCCESS");
        marcadoresSectores.forEach(marcador => {
          marcador.setMap(null);
        });
        eventoSectores();
      }
    }
  });

});

