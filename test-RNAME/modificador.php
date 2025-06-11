<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interfaz de Búsqueda</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-light">
    <div class="container mt-5">
        <h1 class="mb-4 text-center">Interfaz de Búsqueda</h1>

        <div class="mb-4">
            <label for="nombrePersona" class="form-label">Nombre de la Persona:</label>
            <div class="input-group">
                <input type="text" id="nombrePersona" class="form-control" placeholder="Ingrese el nombre de la persona">
                <button class="btn btn-primary" onclick="buscarPersona()">Buscar Persona</button>
            </div>
        </div>

        <div class="mb-4">
            <label for="nombrePaquete" class="form-label">Nombre del Paquete:</label>
            <div class="input-group">
                <input type="text" id="nombrePaquete" class="form-control" placeholder="Ingrese el nombre del paquete">
                <button class="btn btn-success" onclick="buscarPaquete()">Buscar Paquete</button>
            </div>
        </div>

        <div class="mb-4">
            <label for="nombrePersonaClienteCambio" class="form-label">Nombre de la Persona/Cliente para Cambio:</label>
            <div class="input-group">
                <input type="text" id="nombrePersonaClienteCambio" class="form-control" placeholder="Ingrese el nombre de la persona">
                <button class="btn btn-primary" onclick="buscarClienteCambio()">Buscar Persona</button>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
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

            <div class="col-md-6">
                <h2 class="mb-3">Seleccionar Paquetes</h2>
                <table class="table table-bordered table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th>Seleccionar</th>
                            <th>ID</th>
                        </tr>
                    </thead>
                    <tbody id="tablaPaquetes">
                        <!-- Resultados con checkbox -->
                    </tbody>
                </table>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-md-12">
                <h2 class="mb-3">Clientes/Personas</h2>
                <table class="table table-bordered table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th>ID Cliente Persona</th>
                            <th>Nombre Cliente Persona</th>
                        </tr>
                    </thead>
                    <tbody id="tbPersonaCliente">
                        <!-- Resultados dinámicos de clientes/personas -->
                    </tbody>
                </table>
            </div>
        </div>

        <div class="mt-4 p-3 bg-dark text-white" id="resultadoSeleccionado">
            <strong>Seleccionados:</strong> <span id="datosSeleccionados">Debe seleccionar una persona y un paquete.</span>
        </div>

        <div class="mt-3">
            <textarea id="sqlResult" class="form-control" rows="3" readonly></textarea>
        </div>
        <div class="mt-3">
            <strong>Cliente/Persona Seleccionado:</strong> <span id="datosClientePersonaSeleccionado">Debe seleccionar un cliente/persona.</span>
        </div>
        <div class="mt-3">
            <textarea id="sqlClientePersonaResult" class="form-control" rows="2" readonly></textarea>
        </div>
    </div>

    <script>
        let personaSeleccionada = null;
        let paqueteSeleccionado = null;
        let clientePersonaSeleccionado = null;

        async function buscarClienteCambio() {
            const nombreInput = document.getElementById('nombrePersonaClienteCambio');
            if (nombreInput.value.trim() === '') {
                alert('Por favor ingrese un nombre para buscar.');
                return;
            }

            try {
                const response = await fetch(`./modeloControlador.php?operacion=buscarPersonaCliente&nombre=${nombreInput.value}`);
                const data = await response.json();

                if (data.error) {
                    alert(data.error);
                    return;
                }

                renderizarClientes(data);
            } catch (error) {
                console.error('Error en la búsqueda de persona:', error);
                alert('Hubo un error al realizar la búsqueda de la persona.');
            }
        }

        async function buscarPersona() {
            const nombreInput = document.getElementById('nombrePersona');
            if (nombreInput.value.trim() === '') {
                alert('Por favor ingrese un nombre para buscar.');
                return;
            }

            try {
                const response = await fetch(`./modeloControlador.php?operacion=buscarPersonaPaquete&nombre=${nombreInput.value}`);
                const data = await response.json();

                if (data.error) {
                    alert(data.error);
                    return;
                }

                renderizarPersonas(data);
            } catch (error) {
                console.error('Error en la búsqueda de persona:', error);
                alert('Hubo un error al realizar la búsqueda de la persona.');
            }
        }

        async function buscarPaquete() {
            let nombrePaqueteInput = document.getElementById('nombrePaquete');
            // Normalizar: quitar dobles espacios y eliminar guiones
            nombrePaqueteInput.value = nombrePaqueteInput.value.replace(/-+/g, '').replace(/\s{2,}/g, ' ').trim();
            if (nombrePaqueteInput.value.trim() === '') {
                alert('Por favor ingrese un nombre de paquete para buscar.');
                return;
            }

            try {
                const response = await fetch(`./modeloControlador.php?operacion=buscarPaquete&nombre=${nombrePaqueteInput.value}`);
                const data = await response.json();

                if (data.error) {
                    alert(data.error);
                    return;
                }

                renderizarPaquetes(data);
            } catch (error) {
                console.error('Error en la búsqueda del paquete:', error);
                alert('Hubo un error al realizar la búsqueda del paquete.');
            }
        }

        function renderizarPersonas(personas) {
            const tablaPersonas = document.getElementById('tablaPersonas');
            tablaPersonas.innerHTML = ''; // Limpiar los resultados anteriores

            if (personas.length === 0) {
                tablaPersonas.innerHTML = '<tr><td colspan="4" class="text-center">No se encontraron personas.</td></tr>';
                return;
            }

            personas.forEach(persona => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', persona.id_contrato);
                row.setAttribute('data-nombre', persona.paquete);

                // Si ficha_instalacion no es null, resalta la fila y agrega un check verde
                let check = '';
                if (persona.ficha_instalacion !== null && persona.ficha_instalacion !== undefined && persona.ficha_instalacion !== '') {
                    row.classList.add('table-success');
                    console.log('Ficha de instalación encontrada:', persona.ficha_instalacion);
                    check = '<span style="color:green;font-size:1.2em;">&#10003;</span> ';
                }

                row.innerHTML = `
            <td>${persona.id_contrato}</td>
            <td>${check}${persona.paquete}</td>
            <td>${persona.nombre_completo}</td>
            <td>${persona.direccion_servicio}</td>
        `;
                row.addEventListener('click', () => seleccionarPersona(row));
                tablaPersonas.appendChild(row);
            });
        }

        function renderizarPaquetes(paquetes) {
            const tablaPaquetes = document.getElementById('tablaPaquetes');
            tablaPaquetes.innerHTML = '';

            if (paquetes.length === 0) {
                tablaPaquetes.innerHTML = '<tr><td colspan="3" class="text-center">No se encontraron paquetes.</td></tr>';
                return;
            }

            paquetes.forEach((paquete) => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', paquete.id_paquete);
                row.setAttribute('data-nombre', paquete.paquete);
                row.innerHTML = `
                    <td>${paquete.paquete}</td>
                    <td>${paquete.id_paquete}</td>
                `;
                row.addEventListener('click', () => seleccionarPaquete(row));
                tablaPaquetes.appendChild(row);
            });
        }
        
        function renderizarClientes(personasClientes) {
            const tbPersonaCliente = document.getElementById('tbPersonaCliente');
            tbPersonaCliente.innerHTML = '';

            if (personasClientes.length === 0) {
                tbPersonaCliente.innerHTML = '<tr><td colspan="2" class="text-center">No se encontraron a estos clientes.</td></tr>';
                return;
            }

            personasClientes.forEach((cliente) => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', cliente.id_cliente);
                row.setAttribute('data-nombre', cliente.nombre_completo);
                row.innerHTML = `
                    <td>${cliente.id_cliente}</td>
                    <td>${cliente.nombre_completo}</td>
                `;
                row.addEventListener('click', () => seleccionarClientePersona(row));
                tbPersonaCliente.appendChild(row);
            });
        }

        function seleccionarPersona(row) {
            if (personaSeleccionada) {
                personaSeleccionada.classList.remove('table-success');
            }

            personaSeleccionada = row;
            personaSeleccionada.classList.add('table-success');

            actualizarSeleccionados();
            actualizarClientePersonaSeleccionado(); // Actualiza el SQL de cliente/persona si ya hay uno seleccionado
        }

        function seleccionarPaquete(row) {
            if (paqueteSeleccionado) {
                paqueteSeleccionado.classList.remove('table-success');
            }

            paqueteSeleccionado = row;
            paqueteSeleccionado.classList.add('table-success');

            actualizarSeleccionados();
        }

        function seleccionarClientePersona(row) {
            if (clientePersonaSeleccionado) {
                clientePersonaSeleccionado.classList.remove('table-success');
            }
            clientePersonaSeleccionado = row;
            clientePersonaSeleccionado.classList.add('table-success');

            actualizarClientePersonaSeleccionado();
        }

        function actualizarSeleccionados() {
            const resultado = document.getElementById('datosSeleccionados');
            const textarea = document.getElementById('sqlResult');

            if (!personaSeleccionada || !paqueteSeleccionado) {
                resultado.textContent = 'Debe seleccionar una persona y un paquete.';
                textarea.value = '';
                return;
            }

            const idPersona = personaSeleccionada.getAttribute('data-id');
            const nombrePersona = personaSeleccionada.getAttribute('data-nombre');
            const idPaquete = paqueteSeleccionado.getAttribute('data-id');
            const nombrePaquete = paqueteSeleccionado.getAttribute('data-nombre');

            const sql = `UPDATE tb_contratos SET id_paquete = "${idPaquete}" WHERE id_contrato = ${idPersona};`;

            resultado.textContent = `Persona: [${idPersona} - ${nombrePersona}] | Paquete: [${idPaquete} - ${nombrePaquete}]`;
            textarea.value = sql;
        }

        function actualizarClientePersonaSeleccionado() {
            const resultado = document.getElementById('datosClientePersonaSeleccionado');
            const textarea = document.getElementById('sqlClientePersonaResult');

            if (!personaSeleccionada || !clientePersonaSeleccionado) {
                resultado.textContent = 'Debe seleccionar un cliente/persona.';
                textarea.value = '';
                return;
            }

            const idPersona = personaSeleccionada.getAttribute('data-id');
            const idClientePersona = clientePersonaSeleccionado.getAttribute('data-id');
            const nombreClientePersona = clientePersonaSeleccionado.getAttribute('data-nombre');

            resultado.textContent = `Cliente/Persona: [${idClientePersona} - ${nombreClientePersona}]`;
            textarea.value = `UPDATE tb_contratos SET id_cliente = "${idClientePersona}" WHERE id_contrato = ${idPersona};`;
        }
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>