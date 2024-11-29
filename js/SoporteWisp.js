import config from "../env.js";
import { FichaSoporte, inicializarDataTable } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("frmRegistroWisp");
  const urlParams = new URLSearchParams(window.location.search);
  const serv = urlParams.get("tiposervicio");

  let idSoporte = -1;

  async function obtenerIdSoporteDeUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("idsoporte");
  }

  function crearSelectYBoton() {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row g-2 mb-2";

    const selectDiv = document.createElement("div");
    selectDiv.className = "col-md ";

    const labelSelect = document.createElement("label");
    labelSelect.innerText = "Tipo de Soporte";
    selectDiv.appendChild(labelSelect);

    const selectSoporte = document.createElement("select");
    selectSoporte.id = "slcTipoSoporte";
    selectSoporte.className = "form-control";
    selectSoporte.required = true;
    selectDiv.appendChild(selectSoporte);
    rowDiv.appendChild(selectDiv);

    (async () => {
      const respuesta = await fetch(`${config.HOST}/app/controllers/Soporte.controllers.php?operacion=listarTipoSoporte`);
      const datos = await respuesta.json();
      selectSoporte.innerHTML = "";
      datos.forEach((element) => {
        const option = new Option(
          `${element.tipo_soporte}`,
          element.id_tipo_soporte
        );
        selectSoporte.append(option);
      });
    })();

    const buttonDiv = document.createElement("div");
    buttonDiv.className = "col-md d-flex align-items-end";

    const guardarBtn = document.createElement("button");
    guardarBtn.id = "btnGuardarFicha";
    guardarBtn.className = "btn btn-primary";
    guardarBtn.type = "submit";
    guardarBtn.textContent = "Guardar Ficha";

    buttonDiv.appendChild(guardarBtn);
    rowDiv.appendChild(buttonDiv);


    const solutionTextarea = document.getElementById("txtaProceSolucion");
    solutionTextarea.parentNode.parentNode.appendChild(rowDiv);
  }

  async function obtenerProblema(idSoporte) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const data = await respuesta.json();
    $("#txtaEstadoInicial").val(data[0].descripcion_problema);
  }

  async function rellenarDocNombre(doct) {
    const respuesta = await fetch(`${config.HOST}/app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`);
    const data = await respuesta.json();
    console.log(data);

    $("#txtCliente").val(data[0].nombre);
    $("#txtNrodocumento").val(doct);
  }

  async function datosFichaWisp(doct) {
    const datawisp = await FichaSoporte(doct);
    rellenarDocNombre(urlParams.get("doc"));
    $("#txtPlan").val(JSON.parse(datawisp[0].ficha_instalacion).parametros.plan);
    console.log(JSON.parse(datawisp[0].ficha_instalacion).parametros);

    $("#txtBase").val(JSON.parse(datawisp[0].ficha_instalacion).parametros.base[0]);

    const fichaInstalacion = datawisp.find(item => {
      const ficha = JSON.parse(item.ficha_instalacion);
      return ficha.parametros !== undefined;
    });

    console.log(JSON.parse(fichaInstalacion.ficha_instalacion));

    if (fichaInstalacion) {
      const ficha = JSON.parse(fichaInstalacion.ficha_instalacion); // Definir la ficha aquí
      const parametros = ficha.ConfiRouter;
      console.log(parametros);
      const routers = parametros;
      console.log(routers.length);

      if (routers.length > 1) {
        const routerSelectDiv = document.createElement("div");
        routerSelectDiv.className = "col-md mb-2 text-end";

        const labelRouterSelect = document.createElement("label");
        labelRouterSelect.innerText = "Seleccionar Router";
        routerSelectDiv.appendChild(labelRouterSelect);

        const routerSelect = document.createElement("select");
        routerSelect.id = "slcRouter";
        routerSelect.className = "form-control";
        routerSelect.required = true;
        routerSelectDiv.appendChild(routerSelect);

        routers.forEach((router, index) => {
          const option = new Option(`Router ${index + 1}`, index);
          routerSelect.append(option);
        });

        routerSelect.value = 0;
        $("#txtIp").val(routers[0].ConfiRouter.wan);
        $("#txtSenial").val(ficha.parametros.signalStrength);

        routerSelect.addEventListener("change", (event) => {
          const selectedIndex = event.target.value;
          $("#txtIp").val(routers[selectedIndex].ConfiRouter.wan);
          $("#txtSenial").val(ficha.parametros.signalStrength);
        });

        form.parentNode.insertBefore(routerSelectDiv, form);
      } else {
        $("#txtIp").val(routers[0].ConfiRouter.wan);
        $("#txtSenial").val(ficha.parametros.signalStrength);
      }
    }
  }


  (async function () {
    idSoporte = await obtenerIdSoporteDeUrl();
    if (idSoporte) {
      await obtenerProblema(idSoporte);
      await datosFichaWisp(idSoporte);
      crearSelectYBoton();
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.get("idReporte");
      await reporte(urlParams.get("idReporte"));
    }
  })();

  async function reporte(idRe) {
    const respuesta = await fetch(`${config.HOST}/app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idRe}`);
    const data = await respuesta.json();
    console.log(data);
    const datawisp = await FichaSoporte(idRe);
    $("#txtPlan").val(JSON.parse(datawisp[0].ficha_instalacion).parametros.plan);

    rellenarDocNombre(data[0].nro_doc);

    // Define soporte como data[0]
    const soporte = data[0];

    // Parámetros Wireless
    const parametros = JSON.parse(soporte.soporte).WISP.parametros;
    const txtBase = document.getElementById('txtBase');
    const txtIp = document.getElementById('txtIp');
    const txtSenial = document.getElementById('txtSenial');

    txtBase.value = parametros.base;
    txtIp.value = parametros.ip;
    txtSenial.value = parametros.senal;

    // Deshabilitar los campos
    txtBase.setAttribute('disabled', 'true');
    txtIp.setAttribute('disabled', 'true');
    txtSenial.setAttribute('disabled', 'true');

    // Estado Inicial
    const txtaEstadoInicial = document.getElementById('txtaEstadoInicial');
    txtaEstadoInicial.value = soporte.descripcion_problema;
    txtaEstadoInicial.setAttribute('disabled', 'true');

    // Cambios Wireless
    const cambios = JSON.parse(soporte.soporte).WISP.cambios;
    const txtBaseNuevo = document.getElementById('txtBaseNuevo');
    const txtIpNuevo = document.getElementById('txtIpNuevo');
    const txtSenialNuevo = document.getElementById('txtSenialNuevo');

    txtBaseNuevo.value = cambios.nuevaBase;
    txtIpNuevo.value = cambios.nuevoIP;
    txtSenialNuevo.value = cambios.senal;

    txtBaseNuevo.setAttribute('disabled', 'true');
    txtIpNuevo.setAttribute('disabled', 'true');
    txtSenialNuevo.setAttribute('disabled', 'true');

    // Procedimiento de Solución
    const txtaProceSolucion = document.getElementById('txtaProceSolucion');
    txtaProceSolucion.value = soporte.descripcion_solucion;
    txtaProceSolucion.setAttribute('disabled', 'true');
  }



  async function ArmadoJsonWisp() {
    const Response = await fetch(`${config.HOST}/app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const result = await Response.json();

    let soporte = result[0].soporte ? JSON.parse(result[0].soporte) : {};

    const existeClave = Object.keys(soporte).includes(serv);

    if (!existeClave) {
      soporte[serv] = {
        parametros: {
          base: document.getElementById("txtBase").value,
          ip: document.getElementById("txtIp").value,
          senal: document.getElementById("txtSenial").value,
        },
        cambios: {
          nuevaBase: document.getElementById("txtBaseNuevo").value,
          nuevoIP: document.getElementById("txtIpNuevo").value,
          senal: document.getElementById("txtSenialNuevo").value,
        },
      };
    }

    return soporte;
  }


  async function guardarSoporte(data) {
    try {
      const response = await fetch(`${config.HOST}/app/controllers/Soporte.controllers.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operacion: 'actualizarSoporte',
          data: {
            idSoporte: idSoporte,
            idTecnico: user['idUsuario'],
            idTipoSoporte: document.getElementById("slcTipoSoporte").value,
            soporte: data,
            idUserUpdate: user['idUsuario'],
            descripcion_solucion: document.getElementById("txtaProceSolucion").value,
          },
        }),
      });

      const result = await response.json();
      console.log(result.status);
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = await ArmadoJsonWisp();
    if (await ask("¿Desea guardar la ficha?")) {
      await guardarSoporte(data)
      window.location.href = `${config.HOST}views/Soporte/listarSoporte`;
    }
  });

});
