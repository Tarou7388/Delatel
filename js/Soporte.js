import config from '../env.js';

window.idContratoSeleccionado = null;
let tecnicoid = 0;

window.addEventListener('DOMContentLoaded', () => {
  // Referencias a los elementos del DOM
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

  // Configurar la fecha actual en el input
  document.getElementById('txtFecha').value = new Date().toISOString().split('T')[0];

  // Función: Búsqueda avanzada
  async function busquedaAvanzada(nombre, apellido) {
    if (!nombre.trim()) {
      showToast("Por favor complete los campos de búsqueda avanzada", "INFO");
      return;
    }

    try {
      console.log("Iniciando búsqueda avanzada...");
      const response = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarPorNombreApellido&nombres=${encodeURIComponent(nombre)}&apellidos=${encodeURIComponent(apellido)}`);
      const data = await response.json();
      console.log("Resultado de búsqueda avanzada:", data);

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
      console.log("Cliente seleccionado:", selectedDni);
      await BuscarcontratoNDoc(selectedDni);
      myModal.hide();
    });
  }

  // Función: Obtener contratos de cliente
  async function obtenerContratosCliente(clienteId) {
    if (!clienteId) {
      console.error("ID de cliente no válido");
      return;
    }

    try {
      slcContratos.innerHTML = "";

      const opcionInicial = document.createElement('option');
      opcionInicial.value = "";
      opcionInicial.disabled = true;
      opcionInicial.selected = true;
      opcionInicial.textContent = "Seleccione un Contrato";
      slcContratos.appendChild(opcionInicial);

      const respuesta = await fetch(`${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerContratoPorCliente&id=${clienteId}`);
      const datos = await respuesta.json();

      if (Array.isArray(datos) && datos.length > 0) {
        datos.forEach(element => {
          const option = document.createElement('option');
          option.value = element.id_contrato;
          option.textContent = ` | ${element.tipos_servicio} | ${element.direccion_servicio}`;
          option.dataset.nota = element.nota;
          option.dataset.direccion = element.direccion_servicio;
          slcContratos.appendChild(option);
        });

        if (datos.length === 1) {
          slcContratos.selectedIndex = 1;
          const unicoContrato = datos[0];
          txtContratoObservacion.value = `${unicoContrato.nota} | ${unicoContrato.direccion_servicio}`;
          idContratoSeleccionado = unicoContrato.id_contrato;
        }
      }
    } catch (error) {
      console.error("Error al obtener contratos:", error);
      showToast("Ocurrió un error al obtener los contratos", "ERROR");
    }

    slcContratos.addEventListener('change', () => {
      idContratoSeleccionado = slcContratos.value;
      const selectedOption = slcContratos.options[slcContratos.selectedIndex];
      if (selectedOption.value) {
        const nota = selectedOption.dataset.nota;
        const direccion = selectedOption.dataset.direccion;
        txtContratoObservacion.value = `${nota} | ${direccion}`;
      } else {
        txtContratoObservacion.value = '';
      }
    });
  }



  // Función: Buscar contrato por documento
  async function BuscarcontratoNDoc(numdocumento) {
    if (!numdocumento) {
      showToast("El número de documento es obligatorio", "INFO");
      return;
    }

    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Cliente.controllers.php?operacion=buscarClienteDoc&valor=${numdocumento}`);
      const data = await respuesta.json();
      console.log("Cliente encontrado:", data);

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

  // Función: Cambiar prioridad
  function PrioridadAcciones(val) {
    if (val === "Incidencia") {
      txtSolucion.setAttribute("required", "true");
      txtSolucion.removeAttribute("disabled");
      tecnicoid = user["idUsuario"];
      console.log("Campo Solución habilitado");
    } else {
      txtSolucion.removeAttribute("required");
      txtSolucion.setAttribute("disabled", "true");
      txtSolucion.value = "";
      tecnicoid = 0;
      console.log("Campo Solución deshabilitado");
    }
  }

  // Función: Registrar incidencia
  async function registrarIncidencia() {
    const datos = {
      operacion: "registrarSoporte",
      idContrato: idContratoSeleccionado,
      id_tecnico: tecnicoid,
      descripcionProblema: txtDescripcion.value,
      descripcionSolucion: txtSolucion.value,
      prioridad: slcPrioridad.value,
      idUsuario: user["idUsuario"]
    };

    console.log("Datos a enviar:", datos);

    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Soporte.controllers.php`, {
        method: "POST",
        body: JSON.stringify(datos),
        headers: { "Content-Type": "application/json" }
      });

      const data = await respuesta.json();
      console.log("Respuesta al registrar incidencia:", data);

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

  // Eventos
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
});
