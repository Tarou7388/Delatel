import config from '../env.js';
document.addEventListener("DOMContentLoaded", () => {

    const txtCantCable = document.getElementById('txtCantCable');
    const txtPrecioCable = document.getElementById('txtPrecioCable');
    const txtCostoCable = document.getElementById('txtCostoCable');

    const txtCantConector = document.getElementById('txtCantConector');
    const txtPrecioConector = document.getElementById('txtPrecioConector');
    const txtCostoConector = document.getElementById('txtCostoConector');

    let flagFichaInstalacion = false;

    (async () => {
        const response = await fetch(`${config.HOST}controllers/contrato.controllers.php?operacion=obtenerFichaInstalacion&id=${idContrato}`);
        const data = await response.json();
        console.log(data);  
        document.getElementById('txtUsuario').value = data[0].nombre_cliente;
        document.getElementById('txtPlan').value = data[0].servicio;
        if(data[0].ficha_instalacion){
            flagFichaInstalacion = true;
        }else{
            flagFichaInstalacion = false;
        }
    })();

    function eu() {
        const txtUsuario = document.querySelector("#txtUsuario").value
        const txtPlan = document.querySelector("#txtPlan").value
        const txtClaveAcceso = document.querySelector("#txtClaveAcceso").value
        const txtPotencia = document.querySelector("#txtPotenciaFibra").value
        const txtSsdi = document.querySelector("#txtSsdi").value
        const txtSeguridad = document.querySelector("#txtSeguridad").value
        const txtMarcaModelo = document.querySelector("#txtMarcaModelo").value
        const slcBanda = document.querySelector("#slcBanda").value;
        const txtAntenas = document.querySelector("#txtAntenas").value;
        const chkCatv = document.querySelector("#chkCatv").checked;
        const txtaDetallesModen = document.querySelector("#txtaDetallesModen").value;

        const jsonData = {
            fibraoptica: {
              usuario: txtUsuario,
              claveacceso: txtClaveAcceso,
              plan: txtPlan,
              potencia: parseInt(txtPotencia),
              moden: {
                ssid: txtSsdi,
                seguridad: txtSeguridad,
                marca: txtMarcaModelo,
                banda: slcBanda.split(','), // Asumiendo que slcBanda es una cadena separada por comas
                numeroantena: parseInt(txtAntenas),
                catv: chkCatv
              },
              repetidor: {},
              detalles: txtaDetallesModen
            }
          };
          
          console.log(JSON.stringify(jsonData, null, 2));
    };

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

    function AgregarRepetidor() {
        const cardContainer = document.getElementById("cardContainer");
        const contenidoCarta = document.getElementById("cardsRow");
        const nuevoRepetidor = document.createElement("div");

        const ssid = document.getElementById("txtSsidRepetidor").value;
        const contrasenia = document.getElementById("txtContraseniaRepetidor").value;
        const marcaModelo = document.getElementById("txtMarcaModeloRepetidor").value;
        const ip = document.getElementById("txtIpRepetidor").value;

        nuevoRepetidor.innerHTML = `
            <div class="card mb-2">
                <div class="card-body">
                    <h5 class="card-title">Repetidor Nuevo</h5>
                    <div class="row">
                        <div class="col-6">
                            <p class="card-text"><strong>SSID:</strong> ${ssid}</p>
                        </div>
                        <div class="col-6">
                            <p class="card-text"><strong>Contraseña:</strong> ${contrasenia}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <p class="card-text"><strong>Producto:</strong> ${marcaModelo}</p>
                        </div>
                        <div class="col-6">
                            <p class="card-text"><strong>IP:</strong> ${ip}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (cardContainer.hidden) {
            cardContainer.removeAttribute('hidden');
        }

        contenidoCarta.appendChild(nuevoRepetidor);
        document.getElementById("txtSsidRepetidor").value = "";
        document.getElementById("txtContraseniaRepetidor").value = "";
        document.getElementById("txtMarcaModeloRepetidor").value = "";
        document.getElementById("txtIpRepetidor").value = "";
        $("#mdlRepetidor").modal("hide");
    };

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
        //AgregarSintotizador();
    });

    document.getElementById("btnAñadirRepetidor").addEventListener("click", function () {
        eu();
        //AgregarRepetidor();
    });
});
