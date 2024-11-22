import config from "../env.js";
import { inicializarDataTable } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("frmRegistroWisp");
  const urlParams = new URLSearchParams(window.location.search);
  const serv = urlParams.get("tiposervicio");

  let idSoporte = -1;

  async function obtenerIdSoporteDeUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    rellenarDocNombre(urlParams.get("doc"));

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
    console.log(data);

    $("#txtaEstadoInicial").val(data[0].descripcion_problema);
  }

  async function rellenarDocNombre(doct) {
    const respuesta = await fetch(`${config.HOST}/app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`);
    const data = await respuesta.json();
    console.log(data);
    $("#txtCliente").val(data[0].nombre);
    $("#txtNrodocumento").val(doct);
  }

  (async function () {
    idSoporte = await obtenerIdSoporteDeUrl();
    if (idSoporte) {
      await obtenerProblema(idSoporte);
      crearSelectYBoton();
    }
  })();


  async function ArmadoJsonWisp() {
    const Response = await fetch(`${config.HOST}/app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const result = await Response.json();

    let soporte = result[0].soporte ? JSON.parse(result[0].soporte) : {};

    // Verificar si 'serv' ya existe entre las claves de 'soporte'
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
