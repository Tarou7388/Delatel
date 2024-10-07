import config from '../env.js';
window.addEventListener('DOMContentLoaded', function () {
  // if (permisos[0].permisos.soporte.leer != 1) {
  //   window.location.href = `${config.HOST}views`;
  // }
  const wisp = document.getElementById('lstWisp');
  const gpon = document.getElementById('lstGpon');
  const cable = document.getElementById('lstCable');

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

  const checkbox1 = document.getElementById('chkCatv1');
  const checkboxText1 = document.getElementById('checkboxText1');
  const checkbox2 = document.getElementById('chkCatv2');
  const checkboxText2 = document.getElementById('checkboxText2');

  function updateSections(value) {
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
  checkbox1.addEventListener('change', function () {
    checkboxText1.textContent = this.checked ? 'Sí' : 'No';
  });

  checkbox2.addEventListener('change', function () {
    checkboxText2.textContent = this.checked ? 'Sí' : 'No';
  });
});
