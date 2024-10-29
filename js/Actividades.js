import config from "../env.js";
import * as mapa from "./Mapa.js";
window.addEventListener("DOMContentLoaded", function () {
  let actividad = null;
  const contenido = document.getElementById("contenido");
  async function cargarActividades() {
    const response = await fetch(`${config.HOST}app/controllers/Usuario.controllers.php?operacion=obtenerPermisos`);
    const data = await response.json();
    actividad = data.actividades.actividad;
  }

  (async () => {
    await cargarActividades();
    await seleccionarActividad();
  })();

  async function seleccionarActividad() {
    switch (actividad) {
      case 'Mapa':
        cargarMapa();
        break;
      case 'Soporte':
        cargarSoporte();
        break;
      case 'Contratos':
        cargarContratos();
        break;
      case 'Kardex':
        cargarKardex();
        break;
      case 'Fichas':
        break;
    }
  }

  async function cargarMapa() {
    contenido.innerHTML = `
    <div id="map" style="height: 700px;"></div>
    `;
    await mapa.iniciarMapa();
  }

  async function cargarSoporte() {
    contenido.innerHTML = `
    <table class="table table-striped" id="tablaSoporte">
      <thead>
        <tr>
          <th>ID</th>
          <th>Fecha Asistencia</th>
          <th>Tipo Soporte</th>
          <th>Direccion</th>
          <th>Prioridad</th>
        </tr>
      </thead>
      <tbody id="tbodySoporte">
      </tbody>
    </table>
    `
    const tbodySoporte = document.getElementById("tbodySoporte");
    const response = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=FiltrarSoportePrioridad`);
    const data = await response.json();
    console.log(data);
    data.forEach(soporte => {
      let rowClass = '';
      if (soporte.prioridad === 'Alta') {
        rowClass = 'bg-danger';
      } else if (soporte.prioridad === 'Media') {
        rowClass = 'bg-warning';
      } else if (soporte.prioridad === 'Baja') {
        rowClass = 'bg-success';
      }

      tbodySoporte.innerHTML += `
        <tr>
          <td>${soporte.id_soporte}</td>
          <td>${soporte.fecha_hora_asistencia}</td>
          <td>${soporte.tipo_soporte}</td>
          <td>${soporte.direccion_servicio}</td>
          <td class="${rowClass}">${soporte.prioridad}</td>
        </tr>
      `;
    });
  }

  async function cargarContratos(){
    contenido.innerHTML = `
    <table class="table table-striped" id="tablaContratos">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre Cliente</th>
          <th>Direccion</th>
          <th>Paquete</th>
          <th>Servicio</th>
        </tr>
      </thead>
      <tbody id="tbodyContratos">
      </tbody>
    </table>
    `
    const tbodyContratos = document.getElementById("tbodyContratos");
    const response = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=listarContratos`);
    const data = await response.json();
    console.log(data);
    data.forEach(contrato => {
      tbodyContratos.innerHTML += `
        <tr>
          <td>${contrato.id_contrato}</td>
          <td>${contrato.nombre_cliente}</td>
          <td>${contrato.direccion_servicio}</td>
          <td>${contrato.paquete}</td>
          <td>${contrato.servicio}</td>
        </tr>
      `;
    })
  }

  async function cargarKardex(){
    contenido.innerHTML = `
    <table class="table table-striped" id="tablaKardex">
      <thead>
        <tr>
          <th>ID</th>
          <th>Fecha</th>
          <th>Marca</th>
          <th>Tipo</th>
          <th>Saldo</th>
          <th>Motivo</th>
        </tr>
      </thead>
      <tbody id="tbodyKardex">
      </tbody>
    </table>
    `
    const tbodyKardex = document.getElementById("tbodyKardex");
    const response = await fetch(`${config.HOST}app/controllers/Kardex.controllers.php?operacion=listarKardex`);
    const data = await response.json();
    console.log(data);
    data.forEach(kardex => {
      tbodyKardex.innerHTML += `
        <tr>
          <td>${kardex.id_kardex}</td>
          <td>${kardex.marca}</td>
          <td>${kardex.tipo_producto}</td>
          <td>${kardex.saldo_total}</td>
          <td>${kardex.motivo}</td>
        </tr>
      `;
    })
  }

  async function cargarFichas(params) {
    
  }

});