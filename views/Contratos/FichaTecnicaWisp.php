<?php require_once "../../header.php"; ?>

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
                            <div class="form-floating">
                                <select id="slcAntenas" class="form-control" required>
                                    <option value="">Seleccione un equipo</option>
                                    <option value="1">Equipo 1</option>
                                    <option value="2">Equipo 2</option>
                                    <option value="3">Equipo 3</option>
                                </select>
                                <label for="slcAntenas">Antenas :</label>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <div class="form-floating">
                                <select id="slcRouter" class="form-control" required>
                                    <option value="">Seleccione un equipo</option>
                                    <option value="1">Equipo 1</option>
                                    <option value="2">Equipo 2</option>
                                    <option value="3">Equipo 3</option>
                                </select>
                                <label for="slcRouter">Router :</label>
                            </div>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-floating">
                            <select id="slcfrecuencia" class="form-control" required>
                                <option value="">Seleccione un equipo</option>
                                <option value="1">Equipo 1</option>
                                <option value="2">Equipo 2</option>
                                <option value="3">Equipo 3</option>
                            </select>
                            <label for="slcfrecuencia">Frecuencia:</label>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-floating">
                            <select id="slcBase" class="form-control" required>
                                <option value="">Seleccione un equipo</option>
                                <option value="1">base 1</option>
                                <option value="2">base 2</option>
                                <option value="3">base 3</option>
                            </select>
                            <label for="slcBase">Base:</label>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-floating">
                            <select id="slcSubBase" class="form-control" required>
                                <option value="">Seleccione un equipo</option>
                                <option value="1">subbase 1</option>
                                <option value="2">subbase 2</option>
                                <option value="3">subbase 3</option>
                            </select>
                            <label for="slcSubBase">Sub-Base:</label>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-floating">
                            <input type="text" id="txtSignalStrength" class="form-control" placeholder="asd" required>
                            <label for="txtSignalStrength">Signal Strength:</label>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-floating">
                            <input type="text" id="txtNoiseFloor" class="form-control" placeholder="asda" required>
                            <label for="txtNoiseFloor">Noise Floor:</label>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-floating">
                            <input type="text" id="txtTransmiTccq" class="form-control" placeholder="asd" required>
                            <label for="txtTransmiTccq">Transmit CCQ:</label>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="form-floating">
                            <input type="text" id="txtTxrxRate" class="form-control" placeholder="adas" required>
                            <label for="txtTxrxRate">TX/RX Rate:</label>
                        </div>
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
                    <div class="form-floating">
                        <input type="text" id="txtWan" class="form-control" placeholder="asa" required>
                        <label for="txtWan">WAN:</label>
                    </div>
                </div>
                <div class="col">
                    <div class="form-floating">
                        <input type="text" id="txtMascara" class="form-control" placeholder="asda" required>
                        <label for="txtMascara">Máscara:</label>
                    </div>
                </div>
                <div class="col">
                    <div class="form-floating">
                        <input type="text" id="txtPuertaEnlace" class="form-control" placeholder="asda" required>
                        <label for="txtPuertaEnlace">Puerta de Enlace:</label>
                    </div>
                </div>
                <div class="col">
                    <div class="form-floating">
                        <input type="text" id="txtDns1" class="form-control" placeholder="asdad" required>
                        <label for="txtDns1">DNS 1:</label>
                    </div>
                </div>
                <div class="col">
                    <div class="form-floating">
                        <input type="text" id="txtDns2" class="form-control" placeholder="asdad">
                        <label for="txtDns2">DNS 2:</label>
                    </div>
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
                    <div class="form-floating">
                        <input type="text" id="txtLan" class="form-control" placeholder="asdsad" required>
                        <label for="txtLan">LAN:</label>
                    </div>
                </div>
                <div class="col">
                    <div class="form-floating">
                        <input type="text" id="txtAcceso" class="form-control" placeholder="asdads" required>
                        <label for="txtAcceso">Acceso:</label>
                    </div>
                </div>
                <div class="col">
                    <div class="form-floating">
                        <input type="text" id="txtSsid" class="form-control" placeholder="asda" required>
                        <label for="txtSsid">SSID:</label>
                    </div>
                </div>
                <div class="col">
                    <div class="form-floating">
                        <input type="text" id="txtSeguridad" class="form-control" placeholder="asda" required>
                        <label for="txtSeguridad">Seguridad:</label>
                    </div>
                </div>
                <div class="col">
                    <div class="form-floating">
                        <input type="text" id="txtOtros" class="form-control" placeholder="asad">
                        <label for="txtOtros">Otros:</label>
                    </div>
                </div>
            </div>
            <div class="row g-3 mt-3">
                <div class="col-4">
                    <div class="form-floating">
                        <input id="txtInstalador" class="form-control" placeholder="asdads" required>
                        <label for="txtInstalador">Instalador:</label>
                    </div>
                </div>
                <div class="col-3">
                    <div class="form-floating">
                        <input id="txtFechains" class="form-control" placeholder="asda" required>
                        <label for="txtFechains">Fecha:</label>
                    </div>
                </div>
            </div>

            <div class="text-end mt-4">
                <button type="submit" id="btnRegistrar" class="btn btn-primary">Registrar</button>
                <button type="reset" id="btnCancelar" class="btn btn-secondary">Cancelar</button>
            </div>
        </div>
    </div>

    <?php require_once "../../footer.php"; ?>
</div>
<script src="../../js/FichaTecnicaWisp.js" type="module"></script>