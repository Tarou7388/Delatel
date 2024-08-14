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
                <div class="row g-3">
                    <div class="col">
                        <div class="form-group">
                            <label for="slcAntenas">Antenas :</label>
                            <select id="slcAntenas" class="form-control">
                                <option value="">Seleccione un equipo</option>
                                <option value="1">Equipo 1</option>
                                <option value="2">Equipo 2</option>
                                <option value="3">Equipo 3</option>
                            </select>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="slcRouter">Router :</label>
                            <select id="slcRouter" class="form-control">
                                <option value="">Seleccione un equipo</option>
                                <option value="1">Equipo 1</option>
                                <option value="2">Equipo 2</option>
                                <option value="3">Equipo 3</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-3">
                        <label for="slcfrecuencia">Frecuencia:</label>
                        <select id="slcfrecuencia" class="form-control">
                            <option value="">Seleccione un equipo</option>
                            <option value="1">Equipo 1</option>
                            <option value="2">Equipo 2</option>
                            <option value="3">Equipo 3</option>
                        </select>
                    </div>
                    <div class="col-3">
                        <label for="slcBase">Base:</label>
                        <select id="slcBase" class="form-control ">
                            <option value="">Seleccione un equipo</option>
                            <option value="1">base 1</option>
                            <option value="2">base 2</option>
                            <option value="3">base 3</option>
                        </select>
                    </div>
                    <div class="col-3">
                        <label for="slcSubBase">Sub-Base:</label>
                        <select id="slcSubBase" class="form-control">
                            <option value="">Seleccione un equipo</option>
                            <option value="1">subbase 1</option>
                            <option value="2">subbase 2</option>
                            <option value="3">subbase 3</option>
                        </select>
                    </div>
                    <div class="col-3">
                        <label for="txtsignalStrength">Signal Strength:</label>
                        <input type="text" id="txtSignalStrength" class="form-control">
                    </div>
                    <div class="col-3">
                        <label for="noiseFloor">Noise Floor:</label>
                        <input type="text" id="txtNoiseFloor" class="form-control">
                    </div>
                    <div class="col-3">
                        <label for="transmiTccq">Transmit CCQ:</label>
                        <input type="text" id="txtTransmiTccq" class="form-control">
                    </div>
                    <div class="col-3">
                        <label for="txrxRate">TX/RX Rate:</label>
                        <input type="text" id="txtTxrxRate" class="form-control">
                    </div>
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
                    <label for="txtWan">WAN:</label>
                    <input type="text" id="txtWan" class="form-control">
                </div>
                <div class="col">
                    <label for="txtMascara">Máscara:</label>
                    <input type="text" id="txtMascara" class="form-control">
                </div>
                <div class="col">
                    <label for="txtPuertaEnlace">Puerta de Enlace:</label>
                    <input type="text" id="txtPuertaEnlace" class="form-control">
                </div>
                <div class="col">
                    <label for="txtDns1">DNS 1:</label>
                    <input type="text" id="txtDns1" class="form-control">
                </div>
                <div class="col">
                    <label for="txtDns2">DNS 2:</label>
                    <input type="text" id="txtDns2" class="form-control">
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
                    <input type="text" id="txtLan" class="form-control">
                </div>
                <div class="col">
                    <label for="acceso">Acceso:</label>
                    <input type="text" id="txtAcceso" class="form-control">
                </div>
                <div class="col">
                    <label for="ssid">SSID:</label>
                    <input type="text" id="txtSsid" class="form-control">
                </div>
                <div class="col">
                    <label for="seguridad">Seguridad:</label>
                    <input type="text" id="txtSeguridad" class="form-control">
                </div>
                <div class="col">
                    <label for="otros">Otros:</label>
                    <input type="text" id="txtOtros" class="form-control">
                </div>
            </div>
        </div>
    </div>
    <!-- Cuarto Card -->
    <div class="row g-3 mt-3">
        <div class="col-4">
            <label for="instalador">Instalador:</label>
            <input id="txtInstalador" class="form-control"></input>
        </div>
        <div class="col-3">
            <label for="fechains">Fecha:</label>
            <input id="txtFechains" class="form-control"></input>
        </div>
    </div>

    <div class="text-end mt-4">
        <button type="submit" id="btnRegistrar" class="btn btn-primary ">Registrar</button>
        <button type="reset" id="btnCancelar" class="btn btn-secondary ">Cancelar</button>
    </div>

    <?php require_once "../footer.php"; ?>
    </body>

    </html>