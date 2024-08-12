<?php require_once "../header.php"; ?>

<div class="container-fluid px-4">
    <h2 class="mt-4">Control de WISP</h2>

    <!-- Primer Card -->
    <div class="card mb-4">
        <div class="card-header">
            <h4>Parámetros Generales</h4>
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col-3">
                    <label for="equipo">Equipo:</label>
                    <input type="text" id="equipo" class="form-control">
                </div>
                <div class="col-3">
                    <label for="frecuencia">Frecuencia:</label>
                    <input type="text" id="frecuencia" class="form-control">
                </div>
                <div class="col-3">
                    <label for="base">Base:</label>
                    <input type="text" id="base" class="form-control">
                </div>
                <div class="col-3">
                    <label for="subbase">Sub-Base:</label>
                    <input type="text" id="subbase" class="form-control">
                </div>
                <div class="col-3">
                    <label for="signal-strength">Signal Strength:</label>
                    <input type="text" id="signal-strength" class="form-control">
                </div>
                <div class="col-3">
                    <label for="noise-floor">Noise Floor:</label>
                    <input type="text" id="noise-floor" class="form-control">
                </div>
                <div class="col-3">
                    <label for="transmit-ccq">Transmit CCQ:</label>
                    <input type="text" id="transmit-ccq" class="form-control">
                </div>
                <div class="col-3">
                    <label for="txrx-rate">TX/RX Rate:</label>
                    <input type="text" id="txrx-rate" class="form-control">
                </div>
            </div>
        </div>
    </div>

    <!-- Segundo Card -->
    <div class="card mb-4">
        <div class="card-header">
            <h4>Configuración de Red</h4>
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col">
                    <label for="wan">WAN:</label>
                    <input type="text" id="wan" class="form-control">
                </div>
                <div class="col">
                    <label for="mascara">Máscara:</label>
                    <input type="text" id="mascara" class="form-control">
                </div>
                <div class="col">
                    <label for="puerta-enlace">Puerta de Enlace:</label>
                    <input type="text" id="puerta-enlace" class="form-control">
                </div>
                <div class="col">
                    <label for="dns1">DNS 1:</label>
                    <input type="text" id="dns1" class="form-control">
                </div>
                <div class="col">
                    <label for="dns2">DNS 2:</label>
                    <input type="text" id="dns2" class="form-control">
                </div>
            </div>
        </div>
    </div>

    <!-- Tercer Card -->
    <div class="card mb-4">
        <div class="card-header">
            <h4>Configuración LAN</h4>
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col">
                    <label for="lan">LAN:</label>
                    <input type="text" id="lan" class="form-control">
                </div>
                <div class="col">
                    <label for="acceso">Acceso:</label>
                    <input type="text" id="acceso" class="form-control">
                </div>
                <div class="col">
                    <label for="ssid">SSID:</label>
                    <input type="text" id="ssid" class="form-control">
                </div>
                <div class="col">
                    <label for="seguridad">Seguridad:</label>
                    <input type="text" id="seguridad" class="form-control">
                </div>
                <div class="col">
                    <label for="otros">Otros:</label>
                    <input type="text" id="otros" class="form-control">
                </div>
            </div>
        </div>
    </div>

    <!-- Cuarto Card -->
    <div class="container mt-5">
        <div class="card">
            <div class="card-header">
                <h4>Detalle Costos</h4>
            </div>
            <div class="card-body">
                <!-- Fila 1 -->
                <div class="row g-3">
                    <div class="col-3">
                        <label for="costo-antena1">Costo Antena:</label>
                        <input type="text" id="costo-antena1" class="form-control">
                    </div>
                    <div class="col-3">
                        <label for="categoria1"></label>
                        <select id="categoria1" class="form-control">
                            <option value="">Seleccionar</option>
                            <option value="1">Contado</option>
                            <option value="2">Mensual</option>
                        </select>
                    </div>
                    <div class="col-3">
                        <label for="condicion1">Condición:</label>
                        <input type="text" id="condicion1" class="form-control">
                    </div>
                </div>

                <!-- Fila 2 -->
                <div class="row g-3 mt-3">
                    <div class="col-3">
                        <label for="costo-router">Costo Router:</label>
                        <input type="text" id="costo-router" class="form-control">
                    </div>
                    <div class="col-3">
                        <label for="categoria2"></label>
                        <select id="categoria2" class="form-control">
                            <option value="">Seleccionar</option>
                            <option value="1">Contado</option>
                            <option value="2">Mensual</option>
                        </select>
                    </div>
                    <div class="col-3">
                        <label for="periodo">Periodo:</label>
                        <input type="text" id="periodo" class="form-control">
                    </div>
                </div>

                <!-- Fila 3 -->
                <div class="row g-3 mt-3">
                    <div class="col-3">
                        <label for="subtotal">Sub-Total:</label>
                        <input type="text" id="subtotal" class="form-control">
                    </div>
                    <div class="col-3">
                        <label for="categoria3"></label>
                        <select id="categoria3" class="form-control">
                            <option value="">Seleccionar</option>
                            <option value="1">Contado</option>
                            <option value="2">Mensual</option>
                        </select>
                    </div>
                    <div class="col-3">
                        <label for="finicio">Fecha Inicio:</label>
                        <input type="text" id="finicio" class="form-control">
                    </div>
                </div>

                <!-- Fila 4 -->
                <div class="row g-3 mt-3">
                    <div class="col-3">
                        <label for="adelanto">Adelanto:</label>
                        <input type="text" id="adelanto" class="form-control">
                    </div>
                    <div class="col-3">
                        <label for="categoria4"></label>
                        <select id="categoria4" class="form-control">
                            <option value="">Seleccionar</option>
                            <option value="1">Contado</option>
                            <option value="2">Mensual</option>
                        </select>
                    </div>
                    <div class="col-3">
                        <label for="ftermino">Fecha de Termino:</label>
                        <input type="text" id="ftermino" class="form-control">
                    </div>
                </div>

                <!-- Fila 5 -->
                <div class="row g-3 mt-3">
                    <div class="col-3">
                        <label for="saldo">Saldo:</label>
                        <input type="text" id="saldo" class="form-control">
                    </div>
                    <div class="col-3">
                        <label for="categoria5"></label>
                        <input type="text" id="categoria5" class="form-control">
                    </div>
                    <div class="col-3">
                        <label for="costo-total">Costo Total:</label>
                        <input type="text" id="costo-total" class="form-control">
                    </div>
                </div>

                <!-- Fila 6 -->
                <div class="row g-3 mt-3">
                    <div class="col-3">
                        <label for="pago-adicional">Pago Adicional:</label>
                        <input type="text" id="pago-adicional" class="form-control">
                    </div>
                    <div class="col-3">
                        <label for="categoria6"></label>
                        <input type="text" id="categoria6" class="form-control">
                    </div>
                    <div class="col-3">
                        <label for="equipos">Equipos:</label>
                        <div class="row g-3">
                            <div class="form-check col-4">
                                <input class="form-check-input" type="checkbox" value="" id="equipos-cpe-litebeam">
                                <label class="form-check-label" for="equipos-cpe-litebeam">
                                    CPE LiteBeam
                                </label>
                            </div>
                            <div class="form-check col-4">
                                <input class="form-check-input" type="checkbox" value="" id="equipos-router-tplink" checked>
                                <label class="form-check-label" for="equipos-router-tplink">
                                    Router TPlink
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Fila 7 -->
                <div class="row g-3 mt-3">
                    <div class="col-3">
                        <label for="condiciones-pago">Condiciones de Pago:</label>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="pago-adelantado">
                            <label class="form-check-label" for="pago-adelantado">
                                Adelantado
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="pago-cumpliendo-mes" checked>
                            <label class="form-check-label" for="pago-cumpliendo-mes">
                                Cumpliendo el mes
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Fila 8 -->
                <div class="row g-3 mt-3">
                    <div class="col-8"">
                        <label for="observaciones">Observaciones:</label>
                        <textarea id="observaciones" class="form-control"></textarea>
                    </div>
                </div>

                <!-- Fila 9 -->
                <div class="row g-3 mt-3">
                    <div class="col-4"">
                        <label for="Instalador">Instalador:</label>
                        <input id="Instalador" class="form-control"></input>
                    </div>
                    <div class="col-3"">
                        <label for="Fechains">Fecha:</label>
                        <input id="Fechains" class="form-control"></input>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>

<?php require_once "../footer.php"; ?>
</body>

</html>