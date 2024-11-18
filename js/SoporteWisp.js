import config from "../env.js";
import { inicializarDataTable } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("frmRegistroWisp");

  let idSoporte = -1;

  (async function () {
    const idSoporte = await obtenerIdSoporteDeUrl();
    if (idSoporte) {
      await obtenerProblema(idSoporte);
      crearSelectYBoton();
    }
  })();


  async function obtenerProblema(idSoporte) {
    const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const data = await respuesta.json();
    console.log(data);

    $("#txtaEstadoInicial").val(data[0].descripcion_problema);
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

  async function rellenarDocNombre(doct) {
    const respuesta = await fetch(`${config.HOST}/app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`);
    const data = await respuesta.json();
    console.log(data);
    $("#txtCliente").val(data[0].nombre);
    $("#txtNrodocumento").val(doct);
  }

  async function obtenerIdSoporteDeUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    rellenarDocNombre(urlParams.get("doc"));

    return urlParams.get("idsoporte");
  }


  async function ArmadoJsonWisp() {
    const respuesta = await fetch(`${config.HOST}Json/spWISP.json`);
    const datos = await respuesta.json();

    console.log(datos);

    // Obtiene los valores de los campos y los asigna al JSON de soporte
    datos.parametros.base = document.getElementById("txtBase").value;
    datos.parametros.ip = document.getElementById("txtIp").value;
    datos.parametros.senal = document.getElementById("txtSenial").value;

    datos.cambios.nuevaBase = document.getElementById("txtBaseNuevo").value;
    datos.cambios.nuevoIP = document.getElementById("txtIpNuevo").value;
    datos.cambios.senal = document.getElementById("txtSenialNuevo").value;

    // Crea el objeto data con toda la información
    const data = {
      idSoporte: idSoporte,
      idTecnico: JSON.stringify(user['idUsuario']),
      idTipoSoporte: document.getElementById("slcTipoSoporte").value,
      soporte: datos,
      idUserUpdate: JSON.stringify(user['idUsuario']),
      descripcion_solucion: document.getElementById("txtaProceSolucion").value
    };

    console.log(data)

    return data; // Retorna el objeto data para ser usado en guardarSoporte
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
          data,
        }),
      });

      const result = await response.json();
      console.log(result.status);
      if (result.status == "success") {// Llama a guardarSoporte con el objeto data
        window.location.href = `${config.HOST}views/Soporte/`;// Redirecciona a la página de soporte tras lograrse el registro del JSON exitoso
      }

    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }

  // Agrega el evento submit para el formulario
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = await ArmadoJsonWisp(); // Espera a que ArmadoJsonWisp devuelva los datos
    if (await guardarSoporte(data)) {// Llama a guardarSoporte con el objeto data
      window.location.href = `${config.HOST}views/Soporte/`;// Redirecciona a la página de soporte tras lograrse el registro del JSON exitoso
    }
  });

});
