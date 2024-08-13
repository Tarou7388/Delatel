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
                            <label for="Antenas">Antenas :</label>
                            <select id="Antenas" class="form-control">
                                <option value="">Seleccione un equipo</option>
                                <option value="1">Equipo 1</option>
                                <option value="2">Equipo 2</option>
                                <option value="3">Equipo 3</option>
                            </select>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label for="Router">Router :</label>
                            <select id="Router" class="form-control">
                                <option value="">Seleccione un equipo</option>
                                <option value="1">Equipo 1</option>
                                <option value="2">Equipo 2</option>
                                <option value="3">Equipo 3</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-3">
                        <label for="frecuencia">Frecuencia:</label>
                        <select id="frecuencia" class="form-control">
                            <option value="">Seleccione un equipo</option>
                            <option value="1">Equipo 1</option>
                            <option value="2">Equipo 2</option>
                            <option value="3">Equipo 3</option>
                        </select>
                    </div>
                    <div class="col-3">
                        <label for="base">Base:</label>
                        <select id="base" class="form-control ">
                            <option value="">Seleccione un equipo</option>
                            <option value="1">base 1</option>
                            <option value="2">base 2</option>
                            <option value="3">base 3</option>
                        </select>
                    </div>
                    <div class="col-3">
                        <label for="subbase">Sub-Base:</label>
                        <select id="subbase" class="form-control">
                            <option value="">Seleccione un equipo</option>
                            <option value="1">subbase 1</option>
                            <option value="2">subbase 2</option>
                            <option value="3">subbase 3</option>
                        </select>
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
        <div class="row g-3 mt-3">
            <div class="col-4">
                <label for=" Instalador">Instalador:</label>
                <input id="Instalador" class="form-control"></input>
            </div>
            <div class="col-3">
                <label for=" Fechains">Fecha:</label>
                <input id="Fechains" class="form-control"></input>
            </div>
        </div>

    </div>

    <?php require_once "../footer.php"; ?>
    </body>

    </html>