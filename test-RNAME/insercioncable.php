<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buscar e Insertar Datos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .json-box {
            background: #222;
            color: #fff;
            padding: 1rem;
            border-radius: 8px;
            min-height: 200px;
            cursor: pointer;
            font-family: monospace;
            transition: box-shadow 0.2s;
        }

        .json-box.copied {
            box-shadow: 0 0 10px #28a745;
        }

        .form-section {
            margin-bottom: 1.5rem;
            padding: 1rem;
            border-radius: 8px;
            background: #f8f9fa;
        }

        .form-section-title {
            font-weight: bold;
            margin-bottom: 1rem;
            color: #0d6efd;
        }
        .is-invalid {
            border-color: #dc3545 !important;
        }
        .invalid-feedback {
            display: block;
        }
    </style>
</head>

<body>
    <div class="container py-5">
        <div class="row mb-4">
            <div class="mb-4">
                <label for="nombrePersona" class="form-label">Nombre de la Persona:</label>
                <div class="input-group">
                    <input type="text" id="nombrePersona" class="form-control" placeholder="Ingrese el nombre de la persona">
                    <button class="btn btn-primary" onclick="buscarPersona()">Buscar Persona</button>
                </div>
                <div id="nombrePersonaFeedback" class="invalid-feedback"></div>
            </div>
        </div>
        <div class="row">
            <!-- Formulario y JSON Box a la izquierda -->
            <div class="col-md-7">
                <form id="inputsForm" class="row g-3" autocomplete="off" onsubmit="return false;">
                    <!-- Datos del Plan -->
                    <div class="form-section col-12">
                        <div class="form-section-title">Datos del Plan</div>
                        <div class="row g-3">
                            <div class="col-12 col-md-6">
                                <label for="plan" class="form-label">Plan</label>
                                <input type="text" class="form-control" id="plan" placeholder="Plan" disabled>
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="periodo" class="form-label">Periodo <span class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="periodo" placeholder="Periodo" required>
                                <div class="invalid-feedback" id="periodoFeedback"></div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="pagoinstalacion" class="form-label">Pago Instalación <span class="text-danger">*</span></label>
                                <input type="number" class="form-control" id="pagoinstalacion" placeholder="Pago Instalación" min="0" required>
                                <div class="invalid-feedback" id="pagoinstalacionFeedback"></div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="potencia" class="form-label">Potencia <span class="text-danger">*</span></label>
                                <input type="number" class="form-control" id="potencia" placeholder="Potencia" min="0" required>
                                <div class="invalid-feedback" id="potenciaFeedback"></div>
                            </div>
                        </div>
                    </div>
                    <!-- Datos del Cableado -->
                    <div class="form-section col-12">
                        <div class="form-section-title">Datos del Cableado</div>
                        <div class="row g-3">
                            <div class="col-12 col-md-6">
                                <label for="metrosadicionales" class="form-label">Metros Adicionales <span class="text-danger">*</span></label>
                                <input type="number" class="form-control" id="metrosadicionales" placeholder="Metros Adicionales" min="0" required>
                                <div class="invalid-feedback" id="metrosadicionalesFeedback"></div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="numeroconector" class="form-label">Número de Conector <span class="text-danger">*</span></label>
                                <input type="number" class="form-control" id="numeroconector" placeholder="Número Conector" min="0" required>
                                <div class="invalid-feedback" id="numeroconectorFeedback"></div>
                            </div>
                            <!-- Triplexor cargador select -->
                            <div class="col-12 col-md-6">
                                <label for="triplexorCargador" class="form-label">¿Triplexor con cargador?</label>
                                <select class="form-select" id="triplexorCargador">
                                    <option value="false" selected>No</option>
                                    <option value="true">Sí</option>
                                </select>
                            </div>
                            <!-- Splitter cantidad y tipo -->
                            <div class="col-12 col-md-6">
                                <label for="splitterCantidad" class="form-label">Cantidad de Splitter <span class="text-danger">*</span></label>
                                <input type="number" class="form-control" id="splitterCantidad" min="0" value="0" required>
                                <div class="invalid-feedback" id="splitterCantidadFeedback"></div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label for="splitterTipo" class="form-label">Tipo de Splitter</label>
                                <select class="form-select" id="splitterTipo">
                                    <option value="1x3" selected>1x3</option>
                                    <option value="1x2">1x2</option>
                                    <option value="1x4">1x4</option>
                                    <option value="1x8">1x8</option>
                                </select>
                            </div>
                            <!-- Detalles -->
                            <div class="col-12">
                                <label for="detalle" class="form-label">Detalles</label>
                                <input type="text" class="form-control" id="detalle" placeholder="Detalles adicionales">
                            </div>
                        </div>
                    </div>
                </form>
                <!-- JSON Box debajo del formulario -->
                <div class="mt-4">
                    <div class="json-box" id="jsonBox" title="Haz click para copiar"></div>
                </div>
            </div>
            <!-- Tabla de personas a la derecha -->
            <div class="col-md-5">
                <h2 class="mb-3">Resultados de Personas</h2>
                <table class="table table-bordered table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Nombre Persona</th>
                            <th>Direcciones</th>
                        </tr>
                    </thead>
                    <tbody id="tablaPersonas">
                        <!-- Resultados dinámicos -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <script>
        let personaSeleccionada = null;
        let idContrato = null;

        // Validación de campos
        function validarCampos() {
            let valido = true;

            // Limpiar feedbacks
            [
                'periodo', 'pagoinstalacion', 'potencia',
                'metrosadicionales', 'numeroconector', 'splitterCantidad'
            ].forEach(id => {
                document.getElementById(id).classList.remove('is-invalid');
                document.getElementById(id + 'Feedback').textContent = '';
            });

            // Validar periodo
            const periodo = document.getElementById('periodo');
            if (!periodo.value) {
                periodo.classList.add('is-invalid');
                document.getElementById('periodoFeedback').textContent = 'Debe seleccionar una fecha de periodo.';
                valido = false;
            }

            // Validar pagoinstalacion
            const pagoinstalacion = document.getElementById('pagoinstalacion');
            if (pagoinstalacion.value === '' || isNaN(pagoinstalacion.value) || Number(pagoinstalacion.value) < 0) {
                pagoinstalacion.classList.add('is-invalid');
                document.getElementById('pagoinstalacionFeedback').textContent = 'Ingrese un valor válido (mayor o igual a 0).';
                valido = false;
            }

            // Validar potencia
            const potencia = document.getElementById('potencia');
            if (potencia.value === '' || isNaN(potencia.value) || Number(potencia.value) === 0) {
                potencia.classList.add('is-invalid');
                document.getElementById('potenciaFeedback').textContent = 'Ingrese un valor distinto de 0 (puede ser negativo o positivo).';
                valido = false;
            }

            // Validar metrosadicionales
            const metrosadicionales = document.getElementById('metrosadicionales');
            if (metrosadicionales.value === '' || isNaN(metrosadicionales.value) || Number(metrosadicionales.value) < 0) {
                metrosadicionales.classList.add('is-invalid');
                document.getElementById('metrosadicionalesFeedback').textContent = 'Ingrese un valor válido (mayor o igual a 0).';
                valido = false;
            }

            // Validar numeroconector
            const numeroconector = document.getElementById('numeroconector');
            if (numeroconector.value === '' || isNaN(numeroconector.value) || Number(numeroconector.value) < 0) {
                numeroconector.classList.add('is-invalid');
                document.getElementById('numeroconectorFeedback').textContent = 'Ingrese un valor válido (mayor o igual a 0).';
                valido = false;
            }

            // Validar splitterCantidad
            const splitterCantidad = document.getElementById('splitterCantidad');
            if (splitterCantidad.value === '' || isNaN(splitterCantidad.value) || Number(splitterCantidad.value) < 0) {
                splitterCantidad.classList.add('is-invalid');
                document.getElementById('splitterCantidadFeedback').textContent = 'Ingrese un valor válido (mayor o igual a 0).';
                valido = false;
            }

            // Validar selección de persona
            if (!idContrato) {
                document.getElementById('plan').classList.add('is-invalid');
                valido = false;
            } else {
                document.getElementById('plan').classList.remove('is-invalid');
            }

            return valido;
        }

        function updateJsonBox() {
            // Validar antes de mostrar el SQL
            if (!validarCampos()) {
                document.getElementById('jsonBox').textContent = 'Por favor complete todos los campos obligatorios correctamente y seleccione una persona.';
                return;
            }

            // Obtener valores de los nuevos campos
            const triplexorCargador = document.getElementById('triplexorCargador').value;
            const splitterCantidad = Number(document.getElementById('splitterCantidad').value) || 0;
            const splitterTipo = document.getElementById('splitterTipo').value;
            const detalleValor = document.getElementById('detalle').value.trim();

            const data = {
                cable: {
                    plan: document.getElementById('plan').value,
                    periodo: document.getElementById('periodo').value,
                    pagoinstalacion: Number(document.getElementById('pagoinstalacion').value) || 0,
                    potencia: Number(document.getElementById('potencia').value) || 0,
                    triplexor: {
                        requerido: splitterCantidad > 0 ? "true" : "false",
                        cargador: triplexorCargador
                    },
                    conector: {
                        numeroconector: Number(document.getElementById('numeroconector').value) || 0,
                        precio: "1.50"
                    },
                    splitter: [{
                        cantidad: splitterCantidad,
                        tipo: splitterTipo
                    }],
                    cable: {
                        metrosadicionales: Number(document.getElementById('metrosadicionales').value) || 0,
                        preciometro: "1.30"
                    },
                    sintonizadores: []
                },
                costo: {
                    nap: {
                        gpon: -18,
                        catv: -18
                    },
                    casa: {
                        gpon: -19,
                        catv: -19
                    },
                    cablecosto: {
                        numerosintotizadores: 0,
                        costoalquilersintotizador: 0,
                        costocable: 0,
                        costoconector: "0",
                        cantidadcable: Number(document.getElementById('metrosadicionales').value) || 0,
                        preciocable: "1.30",
                        precioconector: "1.50",
                        cantidadconector: Number(document.getElementById('numeroconector').value) || 0,
                        detalle: detalleValor !== "" ? detalleValor : "Se conecto a 1 Tv directo"
                    }
                },
                idcaja: 0,
                puerto: 0
            };
            document.getElementById('jsonBox').textContent = 'UPDATE tb_contratos SET ficha_instalacion = ' + JSON.stringify(data) + ' WHERE id_contrato = ' + (idContrato || 'NULL') + ';';
        }

        document.querySelectorAll('#inputsForm input, #inputsForm select').forEach(input => {
            input.addEventListener('input', updateJsonBox);
            input.addEventListener('change', updateJsonBox);
        });

        document.getElementById('jsonBox').addEventListener('click', function() {
            const jsonBox = this;
            if (jsonBox.textContent.startsWith('UPDATE')) {
                navigator.clipboard.writeText(jsonBox.textContent).then(() => {
                    jsonBox.classList.add('copied');
                    setTimeout(() => jsonBox.classList.remove('copied'), 800);
                });
            }
        });

        function renderizarPersonas(personas) {
            const tablaPersonas = document.getElementById('tablaPersonas');
            tablaPersonas.innerHTML = '';
            if (personas.length === 0) {
                tablaPersonas.innerHTML = '<tr><td colspan="4" class="text-center">No se encontraron personas.</td></tr>';
                return;
            }
            personas.forEach(persona => {
                const row = document.createElement('tr');
                row.setAttribute('data-idcontrato', persona.id_contrato);
                row.setAttribute('data-nombre', persona.paquete);
                row.setAttribute('data-precio', persona.precio);
                row.innerHTML = `
                    <td>${persona.id_contrato}</td>
                    <td>${persona.paquete}</td>
                    <td>${persona.nombre_completo}</td>
                    <td>${persona.direccion_servicio}</td>
                `;
                row.addEventListener('click', () => seleccionarPersona(row));
                tablaPersonas.appendChild(row);
            });
        }

        function seleccionarPersona(row) {
            if (personaSeleccionada) {
                personaSeleccionada.classList.remove('table-success');
            }

            personaSeleccionada = row;
            personaSeleccionada.classList.add('table-success');

            actualizarSeleccionados();
        }

        function actualizarSeleccionados() {
            if (!personaSeleccionada) return;
            const nombrePaquete = personaSeleccionada.getAttribute('data-nombre');
            const paquetePrecio = personaSeleccionada.getAttribute('data-precio');
            idContrato = personaSeleccionada.getAttribute('data-idcontrato');
            document.getElementById('plan').value = nombrePaquete;
            document.getElementById('pagoinstalacion').value = paquetePrecio;

            updateJsonBox();
        }

        async function buscarPersona() {
            const nombreInput = document.getElementById('nombrePersona');
            const feedback = document.getElementById('nombrePersonaFeedback');
            feedback.textContent = '';
            nombreInput.classList.remove('is-invalid');
            if (nombreInput.value.trim() === '') {
                feedback.textContent = 'Por favor ingrese un nombre para buscar.';
                nombreInput.classList.add('is-invalid');
                return;
            }
            try {
                const response = await fetch(`./modeloControlador.php?operacion=buscarPersonaPaquete&nombre=${encodeURIComponent(nombreInput.value)}`);
                const data = await response.json();
                if (data.error) {
                    feedback.textContent = data.error;
                    nombreInput.classList.add('is-invalid');
                    return;
                }
                renderizarPersonas(data);
            } catch (error) {
                feedback.textContent = 'Hubo un error al realizar la búsqueda de la persona.';
                nombreInput.classList.add('is-invalid');
            }
        }

        // Inicializar el JSON box al cargar
        updateJsonBox();
    </script>
</body>

</html>