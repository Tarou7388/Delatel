
let mapa;
let circulos = [];
let datos = [];
let coordenadas = 0;
let marcadorMasCercano = null;
let marcadorActivo = null;

//await obtenerDatos();

async function posicionActual(e) {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  if (marcadorActivo) marcadorActivo.setMap(null);
  marcadorActivo = new AdvancedMarkerElement({
    position: { lat: e.latLng.lat(), lng: e.latLng.lng() },
    map: mapa,
  });
  marcadorClickeado = marcadorActivo;
}

async function obtenerDatos() {
  const respuesta = await fetch("http://localhost/mapas/controlador.php?operacion=listar");
  const data = await respuesta.json();
  data.forEach(({ id_caja, coordenadas, nombre, descripcion, id_sector, n_entradas_disponibles }) => {
    if (!datos[id_sector]) {
      datos[id_sector] = [];
    }
    datos[id_sector].push({
      id: id_caja,
      latLng: coordenadas.split(',').map(Number),
      nombre,
      descripcion,
      idSector: id_sector,
      nEntradas: n_entradas_disponibles
    });
  });

  console.log(datos);
}

async function encontrarPuntoMasCercano(latClick, lonClick, marcadores, circulos) {
  const clickLatLng = new google.maps.LatLng(latClick, lonClick);
  let circulosEnInterseccion = [];
  marcadorMasCercano = null;
  let distanciaMinima = Infinity;
  circulos.forEach(circulo => {
    const centro = circulo.getCenter();
    const radio = circulo.getRadius();
    const distancia = google.maps.geometry.spherical.computeDistanceBetween(clickLatLng, centro);
    if (distancia <= radio) {
      circulosEnInterseccion.push(circulo);
    }
  });
  if (circulosEnInterseccion.length > 2) {
    circulosEnInterseccion.forEach(circulo => {
      marcadores.forEach(marcador => {
        const posicionMarcador = new google.maps.LatLng(marcador.latLng[0], marcador.latLng[1]);
        const distancia = google.maps.geometry.spherical.computeDistanceBetween(posicionMarcador, circulo.getCenter());
        if (distancia <= circulo.getRadius() && marcador.nEntradas > 0) {
          marcadorMasCercano = marcador.nombre;
          distanciaMinima = distancia;
          return;
        }
      });
      if (marcadorMasCercano) {
        return;
      }
    });
  } else {
    marcadores.forEach(marcador => {
      const posicionMarcador = new google.maps.LatLng(marcador.latLng[0], marcador.latLng[1]);
      const distancia = google.maps.geometry.spherical.computeDistanceBetween(posicionMarcador, clickLatLng);
      if (distancia < distanciaMinima && marcador.nEntradas > 0) {
        marcadorMasCercano = marcador.nombre;
        distanciaMinima = distancia;
      } else {
        console.log('No hay cajas disponibles');
      }
    });
  }
  const datos = {
    marcadorMasCercano,
    distancia: distanciaMinima
  }
  return marcadorMasCercano;
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
  /* datos.forEach(subArray => {

    subArray.forEach(({ latLng, nombre, direccion, idSector }) => {
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
            <p><b>${nombre}</b>, ${direccion}</p>
            <p>NOMBRE: ${nombre}</p>
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
    });
  });

  mapa.addListener("click", async (e) => {
    console.log("Has hecho click en:", e.latLng.lat(), e.latLng.lng());
    coordenadas = 0;
    await posicionActual(e);
    alert('Zona sin cobertura');
  }); */

}

async function circulosCajaCercana(circulo, datosIdSector, circulosIdSector) {
  circulo.addListener("click", async (e) => {
    await posicionActual(e);
    marcadorMasCercano = await encontrarPuntoMasCercano(e.latLng.lat(), e.latLng.lng(), datosIdSector, circulosIdSector);
    coordenadas = `${e.latLng.lat()},${e.latLng.lng()}`;
    console.log('El marcador más cercano está en:', marcadorMasCercano);
  })
}

//document.querySelector("#btnmodal").addEventListener("click", iniciarMapa);

/* document.querySelector("#btnGuardar").addEventListener("click", () => {
  if (coordenadas === 0) {
    alert('Debe seleccionar una caja');
  } else if (confirm('¿Desea guardar la caja?')) {
    console.log(marcadorMasCercano);
    console.log(coordenadas);
  }
}); */