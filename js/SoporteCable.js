import config from "../env.js";
import { FichaSoporte, inicializarDataTable } from "./Herramientas.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cable");
  const urlParams = new URLSearchParams(window.location.search);
  const serv = urlParams.get("tiposervicio");

  let idSoporte = -1;

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


    const solutionTextarea = document.getElementById("txtaEstadoFinal");
    solutionTextarea.parentNode.parentNode.appendChild(rowDiv);
  }

  async function LlenarDatos(doct) {
    const respuesta = await fetch(`${config.HOST}/app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${doct}`);
    const data = await respuesta.json();
    console.log(data);


    const datacable = await FichaSoporte(doct);
    const CableData = JSON.parse(datacable[0].ficha_instalacion).cable;
    const Plan = JSON.parse(datacable[0].ficha_instalacion).fibraoptica.plan
    console.log(Plan)
    console.log(CableData);
    console.log(CableData.potencia);
    console.log(CableData.sintonizadores.length);
    console.log(CableData.spliter);
    console.log(CableData.triplexor);

    let cantidadSintonizador = CableData.sintonizadores.length;

    document.getElementById("txtPotencia").value = CableData.potencia;
    document.getElementById("txtPlan").value = Plan;
    document.getElementById("txtSintonizador").value = cantidadSintonizador;

    document.getElementById("txtCliente").value = data[0].nombre;
    document.getElementById("txtNrodocumento").value = doct;
  }

  async function obtenerIdSoporteDeUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("doc")) {
      LlenarDatos(urlParams.get("doc"));
    }

    if (urlParams.get("idsoporte")) {
      return urlParams.get("idsoporte");
    }
    else {
      return null;
    }
  }

  (async function () {
    idSoporte = await obtenerIdSoporteDeUrl();
    if (idSoporte) {
      await obtenerProblema(idSoporte);
      crearSelectYBoton();
      await ArmadoJsonCable();
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
            const averia = averias[0];
            const soporteData = JSON.parse(averia.soporte);

            document.getElementById("txtNrodocumento").value = averia.id_soporte;
            document.getElementById("txtCliente").value = averia;
            document.getElementById("txtFecha").value = averia.fecha_hora_solicitud.split(" ")[0];

            document.getElementById("txtPotencia").value = soporteData.parametroscable.potencia;
            document.getElementById("txtSintonizador").value = soporteData.parametroscable.sintonizador;
            document.getElementById("txtNumTriplexor").value = soporteData.parametroscable.triplexor.cantidad;
            document.getElementById("slcTriplexor").value = soporteData.parametroscable.triplexor.tipo[0];
            document.getElementById("txtNumSpliter").value = soporteData.parametroscable.spliter[0].cantidad;
            document.getElementById("slcSpliter").value = soporteData.parametroscable.spliter[0].tipo;
            document.getElementById("txtCable").value = soporteData.parametroscable.cable;
            document.getElementById("txtConector").value = soporteData.parametroscable.conectores;

            document.getElementById("txtaEstadoInicial").value = averia.descripcion_solucion;

            document.getElementById("txtPotencia").value = soporteData.cambioscable.potencia;
            document.getElementById("txtSintonizador").value = soporteData.cambioscable.sintonizador;
            document.getElementById("txtNumTriplexor").value = soporteData.cambioscable.triplexor.cantidad;
            document.getElementById("slcTriplexor").value = soporteData.cambioscable.triplexor.tipo[0];
            document.getElementById("txtNumSpliter").value = soporteData.cambioscable.spliter[0].cantidad;
            document.getElementById("slcSpliter").value = soporteData.cambioscable.spliter[0].tipo;
            document.getElementById("txtCable").value = soporteData.cambioscable.cable;
            document.getElementById("txtConector").value = soporteData.cambioscable.conectores;

            document.getElementById("txtaEstadoFinal").value = averia.descripcion_solucion;
          }
        } catch (error) {
          console.error("Error al obtener las averías:", error);
        }
      }
    }
  })();

  async function ArmadoJsonCable() {
    const Response = await fetch(`${config.HOST}/app/controllers/Soporte.controllers.php?operacion=ObtenerDatosSoporteByID&idSoporte=${idSoporte}`);
    const result = await Response.json();

    let soporte = result[0].soporte ? JSON.parse(result[0].soporte) : {};

    const existeClave = Object.keys(soporte).includes(serv);

    if (!existeClave) {
      soporte[serv] = {
        parametroscable: {
          potencia: parseInt(document.getElementById("txtPotencia").value) || 0,
          sintonizador: parseInt(document.getElementById("txtSintonizador").value) || 0,
          triplexor: document.getElementById("slcTriplexor").value === "2" ? "activo" :
            (document.getElementById("slcTriplexorCambio").value === "3" ? "pasivo" : "no lleva"),
          spliter: [
            { cantidad: parseInt(document.getElementById("txtNumSpliter").value) || 0, tipo: document.getElementById("slcSpliter").value }
          ],
          cable: parseInt(document.getElementById("txtCable").value) || 0,
          conectores: parseInt(document.getElementById("txtConector").value) || 0,
        },
        cambioscable: {
          potencia: parseInt(document.getElementById("txtPotenciaCambio").value) || 0,
          sintonizador: parseInt(document.getElementById("txtSintonizadorCambio").value) || 0,
          triplexor: document.getElementById("slcTriplexorCambio").value === "2" ? "activo" :
            (document.getElementById("slcTriplexorCambio").value === "3" ? "pasivo" : "no lleva"),
          spliter: [
            { cantidad: parseInt(document.getElementById("txtNumSpliterCambio").value) || 0, tipo: document.getElementById("slcSpliterCambio").value }
          ],
          cable: parseInt(document.getElementById("txtCableCambio").value) || 0,
          conectores: parseInt(document.getElementById("txtConectorCambio").value) || 0,
        }
      }
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
            descripcion_solucion: document.getElementById("txtaEstadoFinal").value,
          },
        }),
      });

      const result = await response.json();
      console.log(result.status);
      if (result.status === "success") {
        // Lógica para éxito
        console.log("Soporte actualizado correctamente.");
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = await ArmadoJsonCable();
    if(await ask("¿Desea guardar la ficha?"))
    {
      await guardarSoporte(data);
      
      window.location.href = `${config.HOST}views/Soporte/listarSoporte`; 
    }
  });

});
