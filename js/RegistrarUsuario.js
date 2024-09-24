document.addEventListener("DOMContentLoaded", function () {

  // Función para obtener un elemento por su ID
  function $(id) {
    return document.getElementById(id);
  }

  (function () {
    // Obtener elementos del DOM
    const slcNacionalidad = $("slcNacionalidad");
    const slcDocumento = $("slcDocumento");
    
    // Crear opción para nacionalidad peruana
    const peruanoOpcion = new Option('Peruano', 'Peruano');
    peruanoOpcion.id = 'peruanoOpcion';

    // Añadir evento de entrada al campo de número de documento
    $("txtNumDocumentoPersona").addEventListener('input', cambiarslc);

    // Función para manejar cambios en el campo de número de documento
    function cambiarslc() {
      const length = $("txtNumDocumentoPersona").value.length;

      // Si el número de dígitos es 8
      if (length === 8) {
        // Agregar la opción 'Peruano' si no existe
        if (![...slcNacionalidad.options].some(option => option.value === 'Peruano')) {
          slcNacionalidad.add(peruanoOpcion);
        }
        // Establecer tipo de documento como 'DNI'
        slcDocumento.value = 'DNI';
        slcDocumento.disabled = true; // Deshabilitar selección de tipo de documento
        slcNacionalidad.value = 'Peruano'; // Establecer nacionalidad
        slcNacionalidad.disabled = true; // Deshabilitar selección de nacionalidad
      } else {
        // Si ya hay una opción 'Peruano', removerla
        if ([...slcNacionalidad.options].some(option => option.value === 'Peruano')) {
          slcNacionalidad.remove(slcNacionalidad.querySelector('#peruanoOpcion').index);
        }
        slcDocumento.disabled = false; // Habilitar selección de tipo de documento

        // Asignar tipo de documento según el número de caracteres
        if (length === 12) {
          slcDocumento.value = 'PAS'; // Pasaporte
        } else if (length === 10) {
          slcDocumento.value = 'CAR'; // Carnet de extranjería
        } else {
          slcDocumento.value = ''; // Restablecer el valor si no se cumplen las condiciones
        }
        slcNacionalidad.disabled = false; // Habilitar selección de nacionalidad
      }
    }
  })();
});
