import config from "../env.js";


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cable");

  let idSoporte = -1;

  (async function () {
    idSoporte = await obtenerIdSoporteDeUrl();
    if (idSoporte) {
      await obtenerProblema(idSoporte);
      crearSelectYBoton();
      await ArmadoJsonWisp();
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const idContrato = urlParams.get("idContrato");

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
    if (urlParams.get("doc")) {
      rellenarDocNombre(urlParams.get("doc"));
    }

    if (urlParams.get("idsoporte")) {
      return urlParams.get("idsoporte");
    }
    else {
      return null;
    }
  }


  async function ArmadoJsonCable() {
    const respuesta = await fetch(`${config.HOST}Json/spCABL.json`);
    const datos = await respuesta.json();

    datos.parametroscable.periodo = document.getElementById("slcPeriodo").value === "1" ? "mensual" : "contado";
    datos.parametroscable.potencia = parseInt(document.getElementById("txtPotencia").value) || 0;
    datos.parametroscable.sintonizador = parseInt(document.getElementById("txtSintonizador").value) || 0;

    datos.parametroscable.triplexor.requiere = document.getElementById("txtNumTriplexor").value !== '';
    datos.parametroscable.triplexor.cantidad = parseInt(document.getElementById("txtNumTriplexor").value) || 0;
    datos.parametroscable.triplexor.tipo = document.getElementById("slcTriplexor").value === "2" ? "activo" : "pasivo";

    datos.parametroscable.spliter = [
      { cantidad: parseInt(document.getElementById("txtNumSpliter").value) || 0, tipo: document.getElementById("slcSpliter").value }
    ];

    datos.parametroscable.cable = parseInt(document.getElementById("txtCable").value) || 0;
    datos.parametroscable.conectores = parseInt(document.getElementById("txtConector").value) || 0;

    // Fill cambioscable section similarly
    datos.cambioscable.periodo = document.getElementById("slcPeriodoCambio").value === "1" ? "mensual" : "contado";
    datos.cambioscable.potencia = parseInt(document.getElementById("txtPotenciaCambio").value) || 0;
    datos.cambioscable.sintonizador = parseInt(document.getElementById("txtSintonizadorCambio").value) || 0;

    datos.cambioscable.triplexor.requiere = document.getElementById("txtNumTriplexorCambio").value !== '';
    datos.cambioscable.triplexor.cantidad = parseInt(document.getElementById("txtNumTriplexorCambio").value) || 0;
    datos.cambioscable.triplexor.tipo = document.getElementById("slcTriplexorCambio").value === "2" ? "activo" : "pasivo";

    datos.cambioscable.spliter = [
      { cantidad: parseInt(document.getElementById("txtNumSpliterCambio").value) || 0, tipo: document.getElementById("slcSpliterCambio").value }
    ];

    datos.cambioscable.cable = parseInt(document.getElementById("txtCableCambio").value) || 0;
    datos.cambioscable.conectores = parseInt(document.getElementById("txtConectorCambio").value) || 0;

    // Crea el objeto data con toda la información
    const data = {
      idSoporte: idSoporte,
      idTecnico: JSON.stringify(user['idUsuario']),
      idTipoSoporte: document.getElementById("slcTipoSoporte").value,
      soporte: datos,
      idUserUpdate: JSON.stringify(user['idUsuario']),
      descripcion_solucion: document.getElementById("txtaProceSolucion").value
    };

    return data;
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
      console.log(result);

    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }

  // Agrega el evento submit para el formulario
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = await ArmadoJsonCable();
    console.log(data)
    await guardarSoporte(data); // Llama a guardarSoporte con el objeto data
  });

});