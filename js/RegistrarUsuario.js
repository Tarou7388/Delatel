import config from "../env.js";
import * as Herramientas from "../js/Herramientas.js";

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const login = await Herramientas.obtenerLogin();
    const userid = login.idUsuario;
    const accesos = await Herramientas.permisos();

    const $ = (id) => document.getElementById(id);

    let idPersonaEncontrada = null;

    const fetchData = async (url, options = {}) => {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    };

    const buscarPersonaDni = async (dni) => {
      const url = `${config.HOST}app/controllers/Persona.controllers.php?operacion=buscarPersonaDni&dni=${dni}`;
      return await fetchData(url);
    };

    const buscarPersonaAPI = async (operacion, dni) => {
      const url = `${config.HOST}app/controllers/Persona.controllers.php?operacion=${operacion}&dni=${dni}`;
      return await fetchData(url);
    };

    const verificarUsuarioExistente = async (nroDoc) => {
      try {
        const url = `${config.HOST}app/controllers/Persona.controllers.php?operacion=buscarPersonaDni&dni=${nroDoc}`;
        const data = await fetchData(url);

        console.log(data);

        return data[0].id_usuario;
      } catch (error) {
        return false;
      }
    };

    const registrarPersona = async (dni) => {
      if (!accesos?.personas?.crear) return null;

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

      const url = `${config.HOST}app/controllers/Persona.controllers.php`;
      const data = await fetchData(url, { method: "POST", body: formData });
      return data[0]?.id_persona;
    };

    const registrarUsuario = async (idPersona) => {
      const formData = new FormData();
      formData.append("operacion", "registrarUsuarios");
      formData.append("idPersona", idPersona);
      formData.append("nombreUsuario", $("txtUsuario").value);
      formData.append("clave", $("txtContrasenia").value);
      formData.append("idUsuario", userid);

      const url = `${config.HOST}app/controllers/Usuario.controllers.php`;
      const data = await fetchData(url, { method: "POST", body: formData });

      if (data) {
        showToast("Usuario registrado con éxito", "SUCCESS");
        return data[0]?.id_usuario;
      } else {
        showToast("Usuario ya registrado", "ERROR");
        return null;
      }
    };

    const registrarResponsable = async (idUsuarioR) => {
      try {
        const formData = new FormData();
        formData.append("operacion", "registrarResponsable");
        formData.append("idUsuario", idUsuarioR);
        formData.append("idRol", $("slcRol").value);
        formData.append("FechaInicio", new Date().toISOString().slice(0, 19).replace('T', ' '));
        formData.append("idUsuarioCreador", userid);

        const url = `${config.HOST}app/controllers/Responsable.controllers.php`;
        const data = await fetchData(url, { method: "POST", body: formData });

        if (!data) {
          showToast("Error en asignar Rol", "ERROR");
          console.log(data);
        } else {
          showToast("Rol asignado correctamente", "SUCCESS");
        }
      } catch (error) {
        console.error("Error al registrar responsable:", error);
        showToast("Ocurrió un error al asignar el Rol", "ERROR");
      }
    };

    const verificarRequisitosContrasenia = () => {
      const pass = $("txtContrasenia").value;
      const requisitos = [
        pass.length >= 8,
        /[0-9]/.test(pass),
        /[a-z]/.test(pass),
        /[!@#$%^&*(),.?":{}|<>]/.test(pass),
        /[A-Z]/.test(pass)
      ];

      requisitos.forEach((cumplido, index) => {
        reqs[index].style.color = cumplido ? "green" : "red";
      });

      return requisitos.every(Boolean);
    };

    const configurarSelectsDocumento = () => {
      const slcNacionalidad = $("slcNacionalidad");
      const slcDocumento = $("slcDocumento");
      const peruanoOpcion = new Option("Peruano", "Peruano");
      peruanoOpcion.id = "peruanoOpcion";

      $("txtNumDocumentoPersona").addEventListener("input", () => {
        const length = $("txtNumDocumentoPersona").value.length;

        if (length === 8) {
          if (![...slcNacionalidad.options].some(option => option.value === "Peruano")) {
            slcNacionalidad.add(peruanoOpcion);
          }
          slcDocumento.value = "DNI";
          slcDocumento.disabled = true;
          slcNacionalidad.value = "Peruano";
          slcNacionalidad.disabled = true;
        } else {
          if ([...slcNacionalidad.options].some(option => option.value === "Peruano")) {
            slcNacionalidad.remove(slcNacionalidad.querySelector("#peruanoOpcion").index);
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
      });
    };

    const obtenerRoles = async () => {
      const url = `${config.HOST}app/controllers/Rol.controllers.php?operacion=listarRoles`;
      const data = await fetchData(url);
      data.forEach(element => {
        const option = new Option(element.rol, element.id_rol);
        $("slcRol").add(option);
      });
    };

    $("btnBuscar").addEventListener("click", async () => {
      const dni = $("txtNumDocumentoPersona").value;

      if (!dni) {
        showToast("Debes ingresar un número de documento válido.", "WARNING");
        return;
      }

      try {
        const data = await buscarPersonaDni(dni);

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
          const personaAPI = await buscarPersonaAPI("obtenerDni", dni);

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

    $("registerForm").addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!verificarRequisitosContrasenia()) {
        showToast("La contraseña no cumple con los requisitos necesarios.", "ERROR");
        return;
      }

      const DniPersona = $("txtNumDocumentoPersona").value;
      const usuarioExistente = await verificarUsuarioExistente(DniPersona);

      if (usuarioExistente != null) {
        showToast("Esta persona ya esta registrada con un usuario", "ERROR");
        return;
      }

      if (accesos?.usuarios?.crear) {
        if (!idPersonaEncontrada) {
          const dni = $("txtNumDocumentoPersona").value;
          if (!dni) {
            showToast("Debes buscar una persona primero.", "WARNING");
            return;
          }

          const idNuevaPersona = await registrarPersona(dni);

          if (!idNuevaPersona) {
            showToast("No se pudo registrar la persona.", "ERROR");
            return;
          }

          idPersonaEncontrada = idNuevaPersona;
        }

        const usuarioRegistrado = await registrarUsuario(idPersonaEncontrada);

        if (usuarioRegistrado) {
          await registrarResponsable(usuarioRegistrado);
          $("registerForm").reset();
        }
      } else {
        showToast("No tienes permisos para registrar usuario", "ERROR");
      }
    });

    const reqs = $("ulRequisitos").getElementsByTagName("li");

    $("txtContrasenia").addEventListener("focus", () => {
      $("ulRequisitos").hidden = false;
      verificarRequisitosContrasenia();
    });
    $("txtContrasenia").addEventListener("input", verificarRequisitosContrasenia);
    $("txtContrasenia").addEventListener("blur", () => $("ulRequisitos").hidden = true);

    await obtenerRoles();
    configurarSelectsDocumento();
  } catch (error) {
    console.error("Error en la aplicación:", error);
  }
});