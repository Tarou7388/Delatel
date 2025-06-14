import config from '../env.js';
import * as Herramientas from "../js/Herramientas.js";

window.idContratoSeleccionado = null;
let tecnicoid = 0;

window.addEventListener('DOMContentLoaded', async () => {

  const botonBuscar = document.querySelector('#btnNrodocumento');
  const txtContratoObservacion = document.querySelector('#txtContratoObservacion');
  const formIncidencia = document.querySelector("#form-Incidencia");
  const slcPrioridad = document.querySelector("#slcPrioridad");
  const txtDescripcion = document.querySelector("#txtDescripcion");
  const txtSolucion = document.querySelector("#txtSolucion");
  const slcContratos = document.querySelector("#slcContratos");
  const txtNombreAvz = document.querySelector("#txtnombrebAvz");
  const txtApellidoAvz = document.querySelector("#txtapellidobAvz");
  const btnBusquedaAvanzada = document.querySelector("#btnBusquedaAvanzada");
  const btnModal = document.getElementById('ModeloAbrir');
  const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
  let login = await Herramientas.obtenerLogin();

  document.getElementById('txtFecha').value = new Date().toISOString().split('T')[0];

  async function busquedaAvanzada(nombre, apellido) {
    if (!nombre.trim()) {
      showToast("Por favor complete los campos de búsqueda avanzada", "INFO");
      return;
    }

    try {
      const response = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarPorNombreApellido&nombres=${encodeURIComponent(nombre)}&apellidos=${encodeURIComponent(apellido)}`);
      const data = await response.json();

      if (data.length > 1) {
        mostrarSelectorResultados(data);
      } else if (data.length === 1) {
        const dni = data[0].codigo_cliente;
        document.getElementById('txtNrodocumento').value = dni;
        await BuscarcontratoNDoc(dni);
        myModal.hide();
      } else {
        showToast("No se encontraron resultados, verifique los campos", "ERROR");
      }
    } catch (error) {
      console.error("Error en búsqueda avanzada:", error);
      showToast("Ocurrió un error al realizar la búsqueda avanzada", "ERROR");
    }
  }


  function mostrarSelectorResultados(data) {
    const select = document.createElement('select');
    select.classList.add('form-select', 'mb-3');
    select.id = 'selectResultados';

    data.forEach(cliente => {
      const option = document.createElement('option');
      option.value = cliente.codigo_cliente;
      option.textContent = `${cliente.nombre_cliente} - ${cliente.telefono_cliente}`;
      select.appendChild(option);
    });

    const listMulticontratos = document.getElementById('listMulticontratos');
    listMulticontratos.innerHTML = "";
    listMulticontratos.appendChild(select);

    select.addEventListener('change', async () => {
      const selectedDni = select.value;
      document.getElementById('txtNrodocumento').value = selectedDni;
      await BuscarcontratoNDoc(selectedDni);
      myModal.hide();
    });
  }

  async function BuscarcontratoNDoc(numdocumento) {
    if (!numdocumento) {
      showToast("El número de documento es obligatorio", "INFO");
      return;
    }

    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${numdocumento}`);
      const data = await respuesta.json();

      if (data[0]) {
        document.getElementById('txtCliente').value = data[0].nombre;
        await obtenerContratosCliente(data[0].id_cliente);
      } else {
        showToast("No se encontraron resultados, verifique el Documento ingresado", "INFO");
      }
    } catch (error) {
      console.error("Error al buscar contrato por documento:", error);
      showToast("Ocurrió un error al buscar el contrato", "ERROR");
    }
  }

  function PrioridadAcciones(val) {
    if (val === "Incidencia") {
      txtSolucion.setAttribute("required", "true");
      txtSolucion.removeAttribute("disabled");
      tecnicoid = login.idUsuario;
    } else {
      txtSolucion.removeAttribute("required");
      txtSolucion.setAttribute("disabled", "true");
      txtSolucion.value = "";
      tecnicoid = 0;
    }
  }

  async function registrarIncidencia() {
    const datos = {
      operacion: "registrarSoporte",
      idContrato: idContratoSeleccionado,
      id_tecnico: tecnicoid,
      descripcionProblema: txtDescripcion.value,
      descripcionSolucion: txtSolucion.value,
      prioridad: slcPrioridad.value,
      idUsuario: login.idUsuario
    };

    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php`, {
        method: "POST",
        body: JSON.stringify(datos),
        headers: { "Content-Type": "application/json" }
      });

      const data = await respuesta.json();
      if (data.status === "success") {
        showToast("Registrado Correctamente", "SUCCESS");
        formIncidencia.reset();
      } else {
        showToast(data.message, "ERROR");
      }
    } catch (error) {
      console.error("Error al registrar incidencia:", error);
      showToast("Ocurrió un error al registrar la incidencia", "ERROR");
    }
  }

  botonBuscar.addEventListener("click", async () => {
    const dni = document.getElementById('txtNrodocumento').value;
    await BuscarcontratoNDoc(dni);
  });

  formIncidencia.addEventListener("submit", async (event) => {
    event.preventDefault();
    const cliente = document.getElementById('txtCliente').value;

    if (cliente) {
      if (await ask("¿Desea registrar esta incidencia?")) {
        await registrarIncidencia();
      }
    } else {
      showToast("El campo cliente no puede estar vacío", "ERROR");
    }
  });

  btnBusquedaAvanzada.addEventListener("click", async () => {
    await busquedaAvanzada(txtNombreAvz.value, txtApellidoAvz.value);
  });

  slcPrioridad.addEventListener("change", () => {
    PrioridadAcciones(slcPrioridad.value);
  });

  btnModal.addEventListener("click", () => {
    myModal.show();
  });

  async function obtenerContratosCliente(clienteId) {
    if (!clienteId) return console.error("ID de cliente no válido");

    try {
      $(slcContratos).empty();

      const datos = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerContratoPorCliente&id=${clienteId}`)
        .then(res => res.json());

      if (Array.isArray(datos) && datos.length > 0) {
        datos.forEach(c => {
          console.log("Contrato:", c);
          const opt = new Option(`${c.tipos_servicio}`, c.id_contrato);
          opt.dataset.nota = c.nota;
          opt.dataset.direccion = c.direccion_servicio;
          opt.dataset.paquete = c.paquete;
          slcContratos.add(opt);
        });


        $(slcContratos).select2({
          minimumResultsForSearch: Infinity,
          width: '100%',
          theme: "bootstrap-5",
          allowClear: true,
          placeholder: "Seleccione un Contrato",
          templateResult: function (data) {
            console.log("Data:", data);
            if (!data.id) return data.text;
            const el = data.element.dataset;
            return $(`
            <div style="white-space: normal; font-size: 0.85em;">
              <strong>${data.text}</strong><br>
              Dir.: ${el.direccion}<br>
              Paquete: ${el.paquete}
            </div>
            `);
          },
          templateSelection: data => data.text
        });

        if (datos.length === 1) {
          $(slcContratos).val(datos[0].id_contrato).trigger('change');
          txtContratoObservacion.value = `${datos[0].nota} | ${datos[0].direccion_servicio}`;
          idContratoSeleccionado = datos[0].id_contrato;
        }
      }
    } catch (e) {
      console.error("Error al obtener contratos:", e);
      showToast("Ocurrió un error al obtener los contratos", "ERROR");
    }

    $(slcContratos).off('change').on('change', function () {
      const opt = this.selectedOptions[0];
      idContratoSeleccionado = this.value;
      console.log("Contrato seleccionado:", idContratoSeleccionado);
      txtContratoObservacion.value = opt ? `${opt.dataset.nota} | ${opt.dataset.direccion}` : '';
    });
  }


  $(".select2me").parent("div").children("span").children("span").children("span").css("height", " calc(3.5rem + 2px)");
  $(".select2me").parent("div").children("span").children("span").children("span").children("span").css("margin-top", "18px");
  $(".select2me").parent("div").find("label").css("z-index", "1");
});
