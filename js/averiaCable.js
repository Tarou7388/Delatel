import config from "../env.js";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idContrato = urlParams.get("idContrato");
  const form = document.getElementById("frmRegistroWisp");

  let idSoporte = -1;

  if (obtenerIdSoporteDeUrl()) {
    idSoporte = obtenerIdSoporteDeUrl();
    crearSelectYBoton();
  }

  if (idContrato) {
    try {
      const response = await fetch(`${config.HOST}app/controllers/Averias.controllers.php?operacion=buscarAveriaPorContrato&valor=${idContrato}`);
      const averias = await response.json();

      if (averias.length === 0) {
        showToast("No tienes ninguna avería", "INFO");
      } else {
        const averia = averias[0]; // Asumimos que solo obtienes una avería por contrato
        const soporteData = JSON.parse(averia.soporte);

        // Asignar valores a los campos de "Datos del Cliente"
        document.getElementById("txtNrodocumento").value = averia.id_soporte;
        document.getElementById("txtCliente").value = averia;
        document.getElementById("txtFecha").value = averia.fecha_hora_solicitud.split(" ")[0];

        // Parámetros Técnicos
        document.getElementById("slcPeriodo").value = soporteData.parametroscable.periodo[0];
        document.getElementById("txtPotencia").value = soporteData.parametroscable.potencia;
        document.getElementById("txtSintonizador").value = soporteData.parametroscable.sintonizador;
        document.getElementById("txtNumTriplexor").value = soporteData.parametroscable.triplexor.cantidad;
        document.getElementById("slcTriplexor").value = soporteData.parametroscable.triplexor.tipo[0];
        document.getElementById("txtNumSpliter").value = soporteData.parametroscable.spliter[0].cantidad;
        document.getElementById("slcSpliter").value = soporteData.parametroscable.spliter[0].tipo;
        document.getElementById("txtCable").value = soporteData.parametroscable.cable;
        document.getElementById("txtConector").value = soporteData.parametroscable.conectores;

        // Estado Inicial
        document.getElementById("txtaEstadoInicial").value = averia.descripcion_solucion;

        // Cambios Técnicos
        document.getElementById("slcPeriodo").value = soporteData.cambioscable.periodo[0];
        document.getElementById("txtPotencia").value = soporteData.cambioscable.potencia;
        document.getElementById("txtSintonizador").value = soporteData.cambioscable.sintonizador;
        document.getElementById("txtNumTriplexor").value = soporteData.cambioscable.triplexor.cantidad;
        document.getElementById("slcTriplexor").value = soporteData.cambioscable.triplexor.tipo[0];
        document.getElementById("txtNumSpliter").value = soporteData.cambioscable.spliter[0].cantidad;
        document.getElementById("slcSpliter").value = soporteData.cambioscable.spliter[0].tipo;
        document.getElementById("txtCable").value = soporteData.cambioscable.cable;
        document.getElementById("txtConector").value = soporteData.cambioscable.conectores;

        // Procedimiento de Solución
        document.getElementById("txtaProceSolucion").value = averia.descripcion_solucion;
      }
    } catch (error) {
      console.error("Error al obtener las averías:", error);
    }
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


    const selectPrioridadDiv = document.createElement("div");
    selectPrioridadDiv.className = "col-md ";

    const labelPrioridad = document.createElement("label");
    labelPrioridad.innerText = "Prioridad";
    selectPrioridadDiv.appendChild(labelPrioridad);

    const selectPrioridad = document.createElement("select");
    selectPrioridad.id = "slcPrioridad";
    selectPrioridad.className = "form-control";
    selectPrioridad.required = true;
    selectPrioridadDiv.appendChild(selectPrioridad);
    rowDiv.appendChild(selectPrioridadDiv);


    const opcionesPrioridad = ["Alta", "Media", "Baja"];
    opcionesPrioridad.forEach((prioridad) => {
      const option = new Option(prioridad, prioridad.toLowerCase());
      selectPrioridad.append(option);
    });


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



  function obtenerIdSoporteDeUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("idsoporte");
  }



  async function ArmadoJsonWisp() {
    const respuesta = await fetch(`${config.HOST}Json/spWISP.json`);
    const datos = await respuesta.json();

    datos.parametros.base = $("#txtBaseWisp").value;
    datos.parametros.ip = $("#txtIpWisp").value;
    datos.parametros.senal = $("#txtSenialWisp").value;

    datos.cambios.nuevaBase = $("#txtCambiosBaseWisp").value;
    datos.cambios.nuevoIP = $("#txtCambiosIpWisp").value;
    datos.cambios.senal = $("#txtCambiosSenialWisp").value;

    const data = {
      "idSoporte": idSoporte,
      "idTecnico": JSON.stringify(user['idUsuario']),
      "idTipoSoporte": document.getElementById("slcTipoSoporte"),
      "prioridad": document.getElementById("slcPrioridad"),
      "soporte": datos,
      "idUserUpdate": JSON.stringify(user['idUsuario']),
    };


    console.log(JSON.stringify(data));
  }


  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    ArmadoJsonWisp();
  });

});
