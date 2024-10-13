import config from "../env.js";

window.addEventListener("DOMContentLoaded", function () {
  const slcPlanes = document.querySelector("#slcPlanes");
  const txtPrecio = document.querySelector("#txtPrecioContactabilidad");
  const dni = document.querySelector("#txtDniContactabilidad");
  const txtNombres = document.querySelector("#txtNombreContactabilidad");
  const txtApellidos = document.querySelector("#txtApellidosContactabilidad");
  const btnBuscar = document.querySelector("#btnBuscarDni");
  const slcNacionalidad = document.querySelector("#slcTipoDoc");

  //Listar Planes con sus Precios
  const fetchPlanes = async () => {
    const respuesta = await fetch(
      `${config.HOST}app/controllers/Paquete.controllers.php?operacion=listarPaquetes`
    );
    return await respuesta.json();
  };

  // Listar Personas de Contactabilidad
  const fetchPersonas = async () => {
    const response = await fetch(
      `${config.HOST}app/controllers/Contactabilidad.controllers.php?operacion=obtenerContactos`
    );
    return await response.json();
  };

  //Cargar Planes
  const cargarPlanes = async () => {
    const dataPlanes = await fetchPlanes();
    dataPlanes.forEach((paquete) => {
      const option = document.createElement("option");
      const id = `${paquete.id}-${paquete.servicio}-${paquete.precio}`;
      option.value = id;
      option.textContent = paquete.servicio;
      slcPlanes.appendChild(option);
    });
  };

  //Cargar Personas
  const cargarPersonas = async () => {
    const dataPersonas = await fetchPersonas();
    const tbody = document.querySelector(
      "#listarPersonasContactabilidad tbody"
    );

    dataPersonas.forEach((personas) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
      <td class="text-center">${personas.id_contactabilidad}</td>
      <td class="text-center">${personas.nombre_contacto}</td>
      <td class="text-center">${personas.telefono}</td>
      <td class="text-center">${personas.fecha_hora_contacto}</td>
      <td class="text-center">${personas.direccion_servicio}</td>
      <td>
        <button class="btn btn-sm btn-primary text-center">Detalles</button>
      </td>
    `;
      tbody.appendChild(tr);
    });

    var tabla = await new DataTable("#listarPersonasContactabilidad", {
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      columnDefs: [
        { width: "5%", targets: 0 },
        { width: "15%", targets: 1 },
        { width: "10%", targets: 2 },
        { width: "30%", targets: 3 },
        { width: "30%", targets: 4 },
        { width: "10%", targets: 5 },
      ],
      paging: true,
      searching: true,
      info: true,
      lengthChange: false,
    });
  };

  const gestionarCambioPlan = () => {
    slcPlanes.addEventListener("change", function () {
      const selectedValue = slcPlanes.value;
      if (selectedValue) {
        const [id, servicio, precio] = selectedValue.split("-");
        txtPrecio.value = precio;
      } else {
        txtPrecio.value = "";
      }
    });
  };

  (async function iniciarAplicacion() {
    await cargarPlanes();
    await cargarPersonas();
    gestionarCambioPlan();
  })();

  function ObtenerDataDNI(operacion, dni) {
    fetch(
      `${
        config.HOST
      }app/controllers/Persona.controllers.php?operacion=${operacion}&dni=${encodeURIComponent(
        dni
      )}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener la información");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.nombres && data.apellidoPaterno) {
          txtNombres.value = data.nombres;
          txtApellidos.value = `${data.apellidoPaterno} ${
            data.apellidoMaterno || ""
          }`.trim();
        } else {
          showToast(
            "No se encontraron datos para el DNI proporcionado",
            "WARNING"
          );
        }
      })
      .catch((error) => {
        showToast(
          "Error al obtener la información de la persona: " + error.message,
          "ERROR"
        );
      });
  }

  function verificarCamposContactos() {
    const camposPersona = [
      slcTipoDocumento,
      txtNumDocumentoPersona,
      txtNombresPersona,
      txtApellidosPersona,
      txtTelefono,
      txtEmail,
      txtDireccion,
      txtReferencia,
      txtcoordenadasPersona,
    ];

    for (let campo of camposPersona) {
      if (campo.value.trim() === "") {
        showToast(
          "Por favor, complete todos los campos de la persona.",
          "WARNING"
        );
        return true;
      }
    }

    return false;
  }

  function manejarDocumentoNacionalidad() {
    dni.addEventListener("input", function () {
      const length = dni.value.length;

      if (length === 8) {
        slcTipoDoc.value = "DNI";
        slcTipoDoc.disabled = true;
      } else {
        slcTipoDoc.disabled = false;

        // Cambiar el tipo de documento según la longitud
        if (length === 12) {
          slcTipoDoc.value = "PAS";
        } else if (length === 10) {
          slcTipoDoc.value = "CAR";
        } else {
          slcTipoDoc.value = "";
        }
      }
    });
  }

  (() => {
    manejarDocumentoNacionalidad();
  })();

  btnBuscar.addEventListener("click", () => {
    ObtenerDataDNI("obtenerDni", txtDniContactabilidad.value);
  });
});
