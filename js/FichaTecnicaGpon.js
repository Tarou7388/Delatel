window.addEventListener("DOMContentLoaded", (event) => {
    
    function AgregarRepetidor(){
        const cardContainer = document.getElementById("cardContainer");
        const contenidoCarta = document.getElementById("cardsRow");
        const nuevoRepetidor = document.createElement("div");

        const ssid = document.getElementById("txtSsidRepetidor").value;
        const contrasenia = document.getElementById("txtContraseniaRepetidor").value;
        const marcaModelo = document.getElementById("slcMarcaModeloRepetidor").value;
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
        document.getElementById("slcMarcaModeloRepetidor").value = "";
        document.getElementById("txtIpRepetidor").value = "";
        $("#mdlRepetidor").modal("hide");
    };
    document.getElementById("btnAñadirRepetidor").addEventListener("click", function () {
        AgregarRepetidor();
    });
});
