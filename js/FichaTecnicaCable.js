window.addEventListener("DOMContentLoaded", (event) => {
    const txtCantCable = document.getElementById('txtCantCable');
    const txtPrecioCable = document.getElementById('txtPrecioCable');
    const txtCostoCable = document.getElementById('txtCostoCable');

    const txtCantConector = document.getElementById('txtCantConector');
    const txtPrecioConector = document.getElementById('txtPrecioConector');
    const txtCostoConector = document.getElementById('txtCostoConector');
    function calcularCostos() {
        // Cálculo del costo del cable
        const cantCable = parseFloat(txtCantCable.value) || 0;
        const precioCable = parseFloat(txtPrecioCable.value) || 0;
        const costoCable = cantCable * precioCable;
        txtCostoCable.value = costoCable.toFixed(2);

        const cantConector = parseFloat(txtCantConector.value) || 0;
        const precioConector = parseFloat(txtPrecioConector.value) || 0;
        const costoConector = cantConector * precioConector;
        txtCostoConector.value = costoConector.toFixed(2);
    }
    function ActualizarCantidadSintotizador() {
        const cantidad = document.querySelectorAll('#mdlSintotizadorBody .card').length;
        document.getElementById('txtCantSintotizador').value = cantidad;
        document.getElementById('txtCostoAlquiler').value = cantidad * 40;
    }
    function AgregarSintotizador() {
        const card = document.createElement('div');
        card.className = 'card mt-2';

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Sintetizador</h5>
                <p class="card-text"><strong>Marca y Modelo:</strong></p>
                <p class="card-text"><strong>Serie:</strong></p>
                <button class="btn btn-danger btn-sm mt-2 btnEliminar">Eliminar</button>
            </div>
        `;

        document.getElementById('mdlSintotizadorBody').appendChild(card);

        card.querySelector('.btnEliminar').addEventListener('click', function () {
            card.remove();
            ActualizarCantidadSintotizador()
        });

        ActualizarCantidadSintotizador()
    }

    txtCantCable.addEventListener('input', calcularCostos);
    txtCantConector.addEventListener('input', calcularCostos);

    document.getElementById('btnAñadirSintotizador').addEventListener('click', function () {
        AgregarSintotizador();
    });

});