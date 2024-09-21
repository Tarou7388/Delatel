import config from '../env.js';
window.addEventListener('DOMContentLoaded', function () {
  if (permisos[0].permisos.soporte.leer != 1) {
    window.location.href = `${config.HOST}views`;
  }
  var today = new Date().toISOString().split('T')[0];
  document.getElementById('txtFecha').value = today;
  
  const dropdownItems = document.querySelectorAll('.list-group-item');
  const dropdownButton = document.getElementById('btnModal');

  dropdownItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const value = this.getAttribute('data-value');
      const name = this.getAttribute('data-name');

      // Actualiza el texto del botón con el data-name
      dropdownButton.textContent = name;
      dropdownButton.setAttribute('data-value', value);

      // Oculta el modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
      modal.hide();

      // Llama a la función para actualizar las secciones basadas en el valor seleccionado
      updateSections(value);
    });
  });

  function updateSections(value) {
    const wisp = document.getElementById('lstWisp');
    const gpon = document.getElementById('lstGpon');
    const cable = document.getElementById('lstCable');

    // Ocultar todas las secciones primero
    wisp.setAttribute('hidden', true);
    gpon.setAttribute('hidden', true);
    cable.setAttribute('hidden', true);

    // Mostrar la sección correspondiente al plan seleccionado
    if (value == 1) {
      wisp.removeAttribute('hidden');
    } else if (value == 2) {
      gpon.removeAttribute('hidden');
    } else if (value == 3) {
      cable.removeAttribute('hidden');
    }
  }
});
