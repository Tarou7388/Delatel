import config from "../env.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async function () {
  const userid = JSON.stringify(user["idUsuario"]);
  const accesos = await Herramientas.permisos()

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

      const data = await respuesta.json();

      if (data.length > 0 && data[0].id_persona) {
        const persona = data[0];
        idPersonaEncontrada = persona.id_persona;

        $("txtNombre").value = persona.nombres;
        $("txtApe").value = persona.apellidos;
        $("txtEmail").value = persona.email;
        $("txtTelefono").value = persona.telefono;
        $("txtNombre").disabled = true;
        $("txtApe").disabled = true;
        $("txtEmail").disabled = true;
        $("txtTelefono").disabled = true;
        $("txtUsuario").disabled = false;
        $("txtContrasenia").disabled = false;
        $("slcRol").disabled = false;

        showToast("Persona encontrada en la base de datos.", "SUCCESS");
      } else {
        const personaAPI = await BuscarPersonaAPI("obtenerDni", dni);

        if (personaAPI) {
          $("txtNombre").value = personaAPI.nombres;
          $("txtApe").value = personaAPI.apellidos;
          $("txtEmail").disabled = false;
          $("txtTelefono").disabled = false;
          $("txtUsuario").disabled = false;
          $("txtContrasenia").disabled = false;
          $("slcRol").disabled = false;

          showToast("Persona encontrada en la API externa. Completa los campos restantes EMAIL - TELEFONO", "INFO");
        } else {
          showToast("No se encontraron datos en la API externa.", "ERROR");
        }
      }
    } catch (error) {
      console.error("Error al buscar persona:", error);
      showToast("Ocurrió un error al buscar la persona.", "ERROR");
    }
  });

  async function VerificarUserN() {
    const params = new FormData();
    params.append("operacion", "buscarNombre");
    params.append("nombreUser", $("txtUsuario").value);

    const respuesta = await fetch(`${config.HOST}app/controllers/Usuario.controllers.php`, {
      method: 'POST',
      body: params
    });
    const data = await respuesta.json();
    return data;
  };

  async function BuscarPersonaAPI(operacion, dni) {
    try {
      const respuesta = await fetch(
        `${config.HOST}app/controllers/Persona.controllers.php?operacion=${operacion}&dni=${dni}`
      );

      const data = await respuesta.json();

      return {
        tipoDoc: data.tipoDocumento,
        nroDoc: data.numeroDocumento,
        apellidos: `${data.apellidoPaterno} ${data.apellidoMaterno}`,
        nombres: data.nombres,
        telefono: $("txtTelefono").value,
        nacionalidad: $("slcNacionalidad").value,
        email: $("txtEmail").value,
        idUsuario: userid
      };
    } catch (error) {
      showToast("No se pudo encontrar a la persona con el API.", "ERROR");

      return null;
    }
  };

  async function RegistrarPersona(dni) {
    if (accesos?.personas?.crear) {
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
        return data[0].id_persona;
      } catch (error) {
        console.error("Error al registrar persona:", error);
        return null;
      }
    }

  }
  async function RegistrarUsuario(idPersona) {
    try {
      const formData = new FormData();
      formData.append("operacion", "registrarUsuarios");
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
      const data = await respuesta.json();

      if (data) {
        showToast("Usuario registrado con éxito", "SUCCESS");

        return data[0].id_usuario;
      }
      else { showToast("Usuario ya registrado", "ERROR"); }

    } catch (error) {
      showToast("Error al registrar usuario:" + error, "ERROR");
    }
  };

  async function registrarResponsable(idUsuarioR) {
    const formData = new FormData();
    formData.append("operacion", "registrarResponsable");
    formData.append("idUsuario", idUsuarioR);
    formData.append("idRol", $("slcRol").value);
    formData.append("FechaInicio", new Date().toISOString().slice(0, 19).replace('T', ' '));
    formData.append("idUsuarioCreador", userid);

    const respuesta = await fetch(
      `${config.HOST}app/controllers/Responsable.controllers.php`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await respuesta.json();
    console.log(data);

    if (data.guardado == false) {
      showToast("Error en asignar Rol", "ERROR");
    }
  };

  $("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!verificarReqs()) {
      showToast("La contraseña no cumple con los requisitos necesarios.", "ERROR");
      return; 
    }

    const NombreUser = await VerificarUserN();

    if (accesos?.usuarios?.crear) {
      if (NombreUser) {
        showToast("Nombre repetido, ingrese uno válido e inténtelo de nuevo", "ERROR");
      } else {
        if (!idPersonaEncontrada) {
          const dni = $("txtNumDocumentoPersona").value;
          if (!dni) {
            showToast("Debes buscar una persona primero.", "WARNING");
            return;
          }

          const idNuevaPersona = await RegistrarPersona(dni);

          if (!idNuevaPersona) {
            showToast("No se pudo registrar la persona.", "ERROR");
            return;
          }

          idPersonaEncontrada = idNuevaPersona;
        }

        const usuarioregistrado = await RegistrarUsuario(idPersonaEncontrada);

        await registrarResponsable(usuarioregistrado);
      }
    }else {
      showToast("No tienes permisos para registrar usuario", "ERROR")
    }
  });

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
        const option = new Option(element.rol, element.id_rol);
        document.getElementById("slcRol").add(option);
      });
    } catch (error) {
      console.error("Error al cargar los roles:", error);
    }
  };

  function verificarReqs() {
    const pass = $("txtContrasenia").value;

    const reqsCumplidos = [
      pass.length >= 8,
      /[0-9]/.test(pass),
      /[a-z]/.test(pass),
      /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      /[A-Z]/.test(pass)
    ];

    reqsCumplidos.forEach((cumplido, index) => {
      reqs[index].style.color = cumplido ? "green" : "red";
    });

    return reqsCumplidos.every(Boolean);
  }

  (async function iniciarAplicacion() {
    await obtenerRoles();
    configurarSelectsDocumento();
  })();

  const reqs = $("ulRequisitos").getElementsByTagName("li");

  $("txtContrasenia").addEventListener("focus", () => { $("ulRequisitos").hidden = false; verificarReqs() });
  $("txtContrasenia").addEventListener("input", verificarReqs);
  $("txtContrasenia").addEventListener("blur", () => $("ulRequisitos").hidden = true);

});
