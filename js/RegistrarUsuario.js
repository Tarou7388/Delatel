import config from '../env.js';

document.addEventListener("DOMContentLoaded", function () {
  const userid = JSON.stringify(user["idUsuario"]); // Suponiendo que el ID de usuario ya está disponible

  // Función utilitaria para obtener elementos por ID
  function $(id) {
    return document.getElementById(id);
  }

  // 1. Funcionalidad del input de DNI: actualiza los dropdowns según la longitud de la entrada
  (function () {
    const slcNacionalidad = $("slcNacionalidad");
    const slcDocumento = $("slcDocumento");
    const peruanoOpcion = new Option('Peruano', 'Peruano');
    peruanoOpcion.id = 'peruanoOpcion';

    $("txtNumDocumentoPersona").addEventListener('input', cambiarslc);

    function cambiarslc() {
      const length = $("txtNumDocumentoPersona").value.length;

      if (length === 8) {
        if (![...slcNacionalidad.options].some(option => option.value === 'Peruano')) {
          slcNacionalidad.add(peruanoOpcion);
        }
        slcDocumento.value = 'DNI';
        slcDocumento.disabled = true;
        slcNacionalidad.value = 'Peruano';
        slcNacionalidad.disabled = true;
      } else {
        if ([...slcNacionalidad.options].some(option => option.value === 'Peruano')) {
          slcNacionalidad.remove(slcNacionalidad.querySelector('#peruanoOpcion').index);
        }
        slcDocumento.disabled = false;

        if (length === 12) {
          slcDocumento.value = 'PAS';
        } else if (length === 10) {
          slcDocumento.value = 'CAR';
        } else {
          slcDocumento.value = '';
        }
        slcNacionalidad.disabled = false;
      }
    }
  })();

  let idPersonaEncontrada = null; // Variable para almacenar el id_persona

  // 2. Búsqueda de persona
  $("btnBuscar").addEventListener("click", async () => {
    const dni = $("txtNumDocumentoPersona").value;

    if (!dni) {
      showToast("Debes ingresar un número de documento válido.", "WARNING");
      return;
    }

    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Personas.controlles.php?Operacion=siExiste&DNI=${dni}`);
      if (!respuesta.ok) {
        throw new Error("Error en la solicitud al servidor.");
      }
      const data = await respuesta.json();

      if (data.id_persona) {
        idPersonaEncontrada = data.id_persona;
        showToast("Persona encontrada en la base de datos.", "SUCCESS");
      } else {
        const persona = await BuscarPersonaAPI('getapi', dni);
        if (persona) {
          // Llenar los campos con los datos obtenidos de la API
          $("txtNombre").value = persona.nombres;
          $("txtApe").value = `${persona.apellidoPaterno} ${persona.apellidoMaterno}`;
          $("txtNombre").disabled = true;
          $("txtApe").disabled = true;
          $("txtEmail").disabled = false;
          $("txtUsuario").disabled = false;
          $("txtContrasena").disabled = false;
          $("slcRol").disabled = false;

          // Registrar persona en la base de datos para obtener id_persona
          idPersonaEncontrada = await RegistrarPersona(dni);
          showToast("Persona registrada desde la API.", "INFO");
        } else {
          showToast("No se encontraron datos en la API externa.", "INFO");
        }
      }
    } catch (error) {
      console.error("Error al buscar persona:", error);
      showToast("Ocurrió un error al buscar la persona.", "ERROR");
    }
  });

  // 3. Obtener todos los roles
  (async function () {
    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Roles.controllers.php?operacion=getAllRol`);
      if (!respuesta.ok) {
        throw new Error("Error al obtener los roles.");
      }
      const data = await respuesta.json();
      data.forEach(element => {
        const option = new Option(element.rol, element.id);
        $("slcRol").add(option);
      });
    } catch (error) {
      console.error("Error al cargar los roles:", error);
    }
  })();

  // 4. Buscar datos de una persona en la API externa
  async function BuscarPersonaAPI(operacion, dni) {
    try {
      const respuesta = await fetch(`${config.HOST}app/controllers/Personas.controlles.php?Operacion=${operacion}&dni=${dni}`);
      if (!respuesta.ok) {
        throw new Error("Error al conectarse a la API externa.");
      }
      return await respuesta.json();
    } catch (error) {
      console.error("Error en BuscarPersonaAPI:", error);
      return null;
    }
  }

  // 5. Registrar persona en la base de datos
  async function RegistrarPersona(dni) {
    try {
      const formData = new FormData();
      formData.append('nacionalidad', $("slcNacionalidad").value);
      formData.append('tipo_doc', $("slcDocumento").value);
      formData.append('nro_doc', dni);
      formData.append('nombres', $("txtNombre").value);
      formData.append('apellidos', $("txtApe").value);
      formData.append('telefono', $("txtTelefono").value);
      formData.append('email', $("txtEmail").value);
      formData.append('iduser_create', userid);

      const respuesta = await fetch(`${config.HOST}app/controllers/Personas.controlles.php`, {
        method: 'POST',
        body: formData
      });
      if (!respuesta.ok) {
        throw new Error("Error al registrar la persona.");
      }
      const data = await respuesta.json();
      return data.id_persona;
    } catch (error) {
      console.error("Error al registrar persona:", error);
      return null;
    }
  }

  // 6. Registrar usuario
  async function RegistrarUsuario(idPersona) {
    try {
      const formData = new FormData();
      formData.append('id_persona', idPersona);
      formData.append('usuario', $("txtUsuario").value);
      formData.append('contrasena', $("txtContrasena").value);
      formData.append('rol', $("slcRol").value);
      formData.append('iduser_create', userid);

      const respuesta = await fetch(`${config.HOST}/controllers/Usuario.controller.php`, {
        method: 'POST',
        body: formData
      });

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

  // 7. Envío del formulario de registro
  $("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();

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
