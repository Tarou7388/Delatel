const select = document.getElementById('planSelect');
    var myModal = document.getElementById('myModal')
    var myInput = document.getElementById('myInput')

    document.getElementById('planSelect').addEventListener('change', function () {
    const wisp = document.getElementById('lstWisp');
    const gpon = document.getElementById('lstGpon');
    const cable = document.getElementById('lstCable');
    const selectedValue = this.value;

    // Ocultar todas las secciones primero
    wisp.setAttribute('hidden', true);
    gpon.setAttribute('hidden', true);
    cable.setAttribute('hidden', true);

    // Mostrar la sección correspondiente al plan seleccionado
    if (selectedValue == 1) {
        wisp.removeAttribute('hidden');
    } else if (selectedValue == 2) {
        gpon.removeAttribute('hidden');
    } else if (selectedValue == 3) {
        cable.removeAttribute('hidden');
    } else if (selectedValue == 4) {
        gpon.removeAttribute('hidden');
        cable.removeAttribute('hidden');
    } else if (selectedValue == 5) {
        wisp.removeAttribute('hidden');
        cable.removeAttribute('hidden');
    } else if (selectedValue == 6) {
        wisp.removeAttribute('hidden');
        gpon.removeAttribute('hidden');
    }
});

// Cerrar el modal automáticamente cuando se selecciona un plan
document.getElementById('planSelect').addEventListener('change', function() {
    var modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
    modal.hide();
});