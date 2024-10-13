import config from "../env.js";

document.addEventListener("DOMContentLoaded", function () {
  const userid = JSON.stringify(user["idUsuario"]);

  function $(id) {
    return document.getElementById(id);
  }

  let idPersonaEncontrada = null; 

  $("btnBuscar").addEventListener("click", async () => {
    const dni = $("txtNumDocumentoPersona").value;

    if (!dni) {
      showToast("Debes ingresar un número de documento válido.", "WARNING");
      return;
    }

    try {
      const respuesta = await fetch(
        `${config.HOST}app/controllers/Persona.controllers.php?operacion=buscarPersonaDni&dni=${dni}`
      );
      if (!respuesta.ok) {
        throw new Error("Error en la solicitud al servidor.");
      }
      const data = await respuesta.json();
      console.log(data);

      if (data.length > 0 && data[0].id_persona) {
        const persona = data[0];
        idPersonaEncontrada = persona.id_persona;

        $("txtNombre").value = persona.nombres;
        $("txtApe").value = persona.apellidos; 
        $("txtEmail").value = persona.email; 
        $("txtTelefono").value = persona.telefono; 
        $("txtNombre").disabled = true;
        $("txtApe").disabled = true;
        $("txtEmail").disabled = false;
        $("txtUsuario").disabled = false;
        $("txtContrasenia").disabled = false;
        $("slcRol").disabled = false;

        showToast("Persona encontrada en la base de datos.", "SUCCESS");
      } else {
        const persona = await BuscarPersonaAPI("obtenerDni", dni);
        if (persona) {
          $("txtNombre").value = persona.nombres;
          $("txtApe").value = `${persona.apellidoPaterno} ${persona.apellidoMaterno}`;
          $("txtNombre").disabled = true;
          $("txtApe").disabled = true;
          $("txtEmail").disabled = false;
          $("txtUsuario").disabled = false;
          $("txtContrasenia").disabled = false;
          $("slcRol").disabled = false;

          showToast("Persona registrada desde la API.", "INFO");
          idPersonaEncontrada = await RegistrarPersona(dni);
        } else {
          showToast("No se encontraron datos en la API externa.", "INFO");
        }
      }
    } catch (error) {
      console.error("Error al buscar persona:", error);
      showToast("Ocurrió un error al buscar la persona.", "ERROR");
    }
  });

  const obtenerRoles = async () => {
    try {
      const respuesta = await fetch(
        `${config.HOST}app/controllers/Rol.controllers.php?operacion=listarRoles`
      );
      if (!respuesta.ok) {
        throw new Error("Error al obtener los roles.");
      }
      const data = await respuesta.json();
      data.forEach((element) => {
        const option = new Option(element.rol, element.id);
        $("slcRol").add(option);
      });
    } catch (error) {
      console.error("Error al cargar los roles:", error);
    }
  };

  async function BuscarPersonaAPI(operacion, dni) {
    try {
      const respuesta = await fetch(
        `${config.HOST}app/controllers/Persona.controllers.php?operacion=${operacion}&dni=${dni}`
      );
      if (!respuesta.ok) {
        throw new Error("Error al conectarse a la API externa.");
      }
      return await respuesta.json();
    } catch (error) {
      console.error("Error en BuscarPersonaAPI:", error);
      return null;
    }
  }

  async function RegistrarPersona(dni) {
    try {
      const formData = new FormData();
      formData.append("operacion", "registrarPersona");
      formData.append("tipoDoc", $("slcDocumento").value);
      formData.append("nroDoc", dni);
      formData.append("apellidos", $("txtApe").value);
      formData.append("nombres", $("txtNombre").value);
      formData.append("telefono", $("txtTelefono").value);
      formData.append("nacionalidad", $("slcNacionalidad").value);
      formData.append("email", $("txtEmail").value);
      formData.append("idUsuario", userid);

      const respuesta = await fetch(
        `${config.HOST}app/controllers/Persona.controllers.php`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!respuesta.ok) {
        throw new Error("Error al registrar la persona.");
      }
      const data = await respuesta.json();
      console.log("Respuesta de búsqueda:", data);
      return data.id_persona;
    } catch (error) {
      console.error("Error al registrar persona:", error);
      return null;
    }
  }

  async function RegistrarUsuario(idPersona) {
    try {
      const formData = new FormData();
      formData.append("operacion", "registrarUsuario");
      formData.append("idPersona", idPersona);
      formData.append("nombreUsuario", $("txtUsuario").value);
      formData.append("clave", $("txtContrasenia").value);
      formData.append("idUsuario", userid);

      const respuesta = await fetch(
        `${config.HOST}app/controllers/Usuario.controllers.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!respuesta.ok) {
        throw new Error("Error al registrar el usuario.");
      }

      const data = await respuesta.json();

      if (data.success) {
        showToast("Usuario registrado con éxito", "SUCCESS");
      } else {
        showToast("Error al registrar el usuario: " + data.message, "ERROR");
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      showToast("Ocurrió un error: " + error.message, "ERROR");
    }
  }

  const configurarSelectsDocumento = () => {
    const slcNacionalidad = $("slcNacionalidad");
    const slcDocumento = $("slcDocumento");
    const peruanoOpcion = new Option("Peruano", "Peruano");
    peruanoOpcion.id = "peruanoOpcion";

    $("txtNumDocumentoPersona").addEventListener("input", cambiarslc);

    function cambiarslc() {
      const length = $("txtNumDocumentoPersona").value.length;

      if (length === 8) {
        if (
          ![...slcNacionalidad.options].some(
            (option) => option.value === "Peruano"
          )
        ) {
          slcNacionalidad.add(peruanoOpcion);
        }
        slcDocumento.value = "DNI";
        slcDocumento.disabled = true;
        slcNacionalidad.value = "Peruano";
        slcNacionalidad.disabled = true;
      } else {
        if (
          [...slcNacionalidad.options].some(
            (option) => option.value === "Peruano"
          )
        ) {
          slcNacionalidad.remove(
            slcNacionalidad.querySelector("#peruanoOpcion").index
          );
        }
        slcDocumento.disabled = false;

        if (length === 12) {
          slcDocumento.value = "PAS";
        } else if (length === 10) {
          slcDocumento.value = "CAR";
        } else {
          slcDocumento.value = "";
        }
        slcNacionalidad.disabled = false;
      }
    }
  };

  (async function iniciarAplicacion() {
    await obtenerRoles();
    configurarSelectsDocumento();
  })();

  $("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log(idPersonaEncontrada);
    if (!idPersonaEncontrada) {
      showToast("Debes buscar una persona primero.", "WARNING");
      return;
    }

    try {
      await RegistrarUsuario(idPersonaEncontrada);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      showToast("Ocurrió un error al registrar el usuario.", "ERROR");
    }
  });
});
