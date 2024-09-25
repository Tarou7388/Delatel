import config from '../env.js';

document.addEventListener("DOMContentLoaded", function () {

  function $(id) {
    return document.getElementById(id);
  }

  // Funcionalidad del input de DNI -> Al detectar 8 caracteres actualiza. 
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

  //Verificar la existencia de una persona.
  $("btnBuscar").addEventListener("click", async () => {
    const dni = $("txtNumDocumentoPersona").value;

    await fetch(`${config.HOST}/controllers/Personas.controlles.php?Operacion=siExiste&DNI=${dni}`)
      .then(respuesta => respuesta.json())
      .then(data => {
        if (!data) {
          BuscarPersonaAPI("getapi", txtNumDocumentoPersona.value);
        } else {
          PersonaEncontrada(data);
        }
      });
  });

  //Funcion de obtencion de los Roles
  (async function () {
    await fetch(`${config.HOST}/controllers/Roles.controllers.php?operacion=getAllRol`)
      .then(respuesta => respuesta.json())
      .then(data => {
        data.forEach(element => {
          const option = new Option(element.rol, element.id);
          $("slcRol").add(option);
        });
      });
  }());


  async function PersonaEncontrada(value) {
    $("txtNombre").value = await value.nombres;
    $("txtApe").value = await value.apellidos;
    $("slcNacionalidad").value = value.nacionalidad;
    $("txtEmail").value = await value.email;

    $("txtNombre").disabled = true;
    $("txtApe").disabled = true;
    $("txtEmail").disabled = true;

    console.log(value);
  }

  //En proceso
  function BuscarPersonaAPI(operacion, dni) {
    fetch(
      `${config.HOST}controllers/Personas.controlles.php?Operacion=${operacion}&dni=${encodeURIComponent(
        dni
      )}`
    )
      .then((response) => response.json())
      .then((data) => {

        txtNombresPersona.value = data.nombres ?? "";
        txtApellidosPersona.value = (data.apellidoPaterno ?? "") + (data.apellidoMaterno ? " " + data.apellidoMaterno : "");
      })
      .catch((e) => {
        alert("Persona no encontrada, verifique DNI")
      });
  }

  $("confirmRegister").addEventListener("click", async () => {
    const form = document.getElementById("registerForm");
    const formData = new FormData(form);
    await RegistrarUsuario(formData);
  });

  async function RegistrarUsuario(formData) {
    await fetch(`${config.HOST}/controllers/RegistrarUsuario.controller.php`, {
      method: 'POST',
      body: formData
    })
      .then(respuesta => respuesta.json())
      .then(data => {
        if (data.success) {
          alert("Usuario registrado con éxito");
          window.location.href = "index.php";
        } else {
          alert("Error al registrar el usuario: " + data.message);
        }
      });
  }

  //Complementacion si la persona no ha sido registrada.
  function Traerinputs() {

  }

});
