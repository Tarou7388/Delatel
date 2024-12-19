import config from "../env.js";

/**
 * Realiza una solicitud para obtener la lista de servicios.
 *
 * @async
 * @function fetchServicios
 * @returns {Promise<Object>} Una promesa que resuelve con los datos de los servicios en formato JSON.
 * @throws {Error} Lanza un error si la solicitud de red falla.
 */
export async function fetchServicios() {
  const response = await fetch(
    `${config.HOST}app/controllers/Servicio.controllers.php?operacion=listarServicio`
  );
  return await response.json();
}

/**
 * Realiza una solicitud HTTP GET a la URL proporcionada y devuelve los datos en formato JSON.
 *
 * @async
 * @function fetchPaquetes
 * @param {string} url - La URL a la que se realizará la solicitud.
 * @returns {Promise<Object>} Una promesa que se resuelve con los datos en formato JSON.
 */
export async function fetchPaquetes(url) {
  const response = await fetch(url);
  return await response.json();
}

/**
 * Actualiza un elemento <select> con una lista de paquetes filtrados.
 *
 * @param {string} selector - El selector CSS del elemento <select> que se va a actualizar.
 * @param {Array} paquetesFiltrados - Un array de objetos que representan los paquetes filtrados.
 * @param {number} paquetesFiltrados[].id_paquete - El ID del paquete.
 * @param {string} paquetesFiltrados[].paquete - El nombre del paquete.
 * @param {number} paquetesFiltrados[].precio - El precio del paquete.
 * @returns {Promise<void>} Una promesa que se resuelve cuando el <select> ha sido actualizado.
 */
export async function actualizarSelectPaquetes(selector, paquetesFiltrados) {
  const slcPaquetes = document.querySelector(selector);
  slcPaquetes.innerHTML = '<option value="" disabled selected>Seleccione un paquete</option>';

  if (paquetesFiltrados.length === 0) {
    slcPaquetes.innerHTML += '<option value="" disabled>No hay paquetes disponibles</option>';
  } else {
    paquetesFiltrados.forEach(({ id_paquete, paquete, precio }) => {
      const option = document.createElement("option");
      option.value = id_paquete;
      option.textContent = paquete;
      option.setAttribute("data-precio", precio);
      slcPaquetes.appendChild(option);
    });
  }
  slcPaquetes.disabled = false;
}

/**
 * Carga paquetes genéricos y actualiza un selector con los paquetes filtrados.
 *
 * @param {number} idServicio - El ID del servicio para buscar paquetes.
 * @param {string} selector - El selector del elemento HTML donde se actualizarán los paquetes.
 * @returns {Promise<void>} Una promesa que se resuelve cuando los paquetes se han cargado y el selector se ha actualizado.
 */
export async function cargarPaquetesGenerico(idServicio, selector) {
  const dataPaquetes = await fetchPaquetes(
    `${config.HOST}app/controllers/Paquete.controllers.php?operacion=buscarPaquetePorIdServicio&idServicio=${idServicio}`
  );
  const paquetesFiltrados = dataPaquetes.filter(paquete => {
    const servicios = JSON.parse(paquete.id_servicio).id_servicio;
    return servicios.length === 1 && !paquete.inactive_at;
  });
  actualizarSelectPaquetes(selector, paquetesFiltrados);
}

/**
 * Carga paquetes múltiples genéricos y actualiza un selector con los paquetes filtrados.
 *
 * @param {string} tipo - El tipo de paquete a filtrar (por ejemplo, "duos").
 * @param {string} selector - El selector del elemento HTML donde se actualizarán los paquetes.
 * @returns {Promise<void>} - Una promesa que se resuelve cuando los paquetes se han cargado y el selector se ha actualizado.
 */
export async function cargarPaquetesMultiplesGenerico(tipo, selector) {
  const dataPaquetes = await fetchPaquetes(
    `${config.HOST}app/controllers/Paquete.controllers.php?operacion=listarPaquetes`
  );
  const paquetesFiltrados = dataPaquetes.filter(paquete => {
    const servicios = JSON.parse(paquete.id_servicio).id_servicio;
    return tipo === "duos" && servicios.length === 2 && !paquete.inactive_at;
  });
  actualizarSelectPaquetes(selector, paquetesFiltrados);
}

/**
 * Carga los paquetes en un selector basado en el servicio seleccionado.
 *
 * @param {string} selectorServicio - El selector CSS del elemento que contiene el servicio seleccionado.
 * @param {string} selectorPaquete - El selector CSS del elemento donde se cargarán los paquetes.
 * @returns {Promise<void>} Una promesa que se resuelve cuando los paquetes se han cargado.
 */
export async function cargarSelectPaquetesGenerico(selectorServicio, selectorPaquete) {
  const idServicioSeleccionado = document.querySelector(selectorServicio).value;
  if (idServicioSeleccionado === "duos") {
    await cargarPaquetesMultiplesGenerico(idServicioSeleccionado, selectorPaquete);
  } else {
    await cargarPaquetesGenerico(idServicioSeleccionado, selectorPaquete);
  }
}

/**
 * Carga los servicios genéricos en un elemento select y asigna un callback al evento change.
 *
 * @param {string} selector - El selector del elemento select donde se cargarán los servicios.
 * @param {Function} callback - La función que se ejecutará cuando el valor del select cambie.
 * @returns {Promise<void>} - Una promesa que se resuelve cuando los servicios se han cargado y el evento change se ha asignado.
 * @throws {Error} - Lanza un error si ocurre un problema al cargar los servicios.
 */
export async function cargarServiciosGenerico(selector, callback) {
  try {
    const servicios = await fetchServicios();
    const slcTipoServicio = document.querySelector(selector);
    slcTipoServicio.innerHTML = '<option value="" disabled selected>Seleccione</option>';

    const serviciosActivos = servicios.filter(servicio => !servicio.inactive_at);
    if (serviciosActivos.length === 0) {
      slcTipoServicio.innerHTML += '<option value="" disabled>No hay servicios disponibles</option>';
    } else {
      serviciosActivos.forEach(({ id_servicio, tipo_servicio, servicio }) => {
        slcTipoServicio.innerHTML += `<option value="${id_servicio}">${tipo_servicio} (${servicio})</option>`;
      });
      slcTipoServicio.innerHTML += '<option value="duos">FIBRA + CABLE (GPON)</option>';
    }

    slcTipoServicio.addEventListener("change", callback);
  } catch (error) {
    console.error("Error al cargar servicios:", error);
  }
}

/**
 * Carga los tipos de servicio en un elemento select y selecciona el servicio especificado.
 *
 * @param {string} idServicioSeleccionado - El ID del servicio que debe ser seleccionado en el elemento select.
 * @returns {Promise<void>} Una promesa que se resuelve cuando los tipos de servicio se han cargado y el servicio seleccionado ha sido establecido.
 * @throws {Error} Lanza un error si ocurre un problema al cargar los tipos de servicio.
 */
export async function cargarTipoServicioActualizar(idServicioSeleccionado) {
  try {
    const servicios = await fetchServicios();
    const slcTipoServicioActualizar = document.getElementById("slcTipoServicioActualizar");
    slcTipoServicioActualizar.innerHTML = '<option value="0" disabled selected>Seleccione</option>';

    const opcionesAdicionales = [{ id_servicio: 'duos', tipo_servicio: 'FIBRA + CABLE (GPON)' }];
    [...opcionesAdicionales, ...servicios].forEach(({ id_servicio, tipo_servicio }) => {
      const option = document.createElement("option");
      option.value = id_servicio;
      option.textContent = tipo_servicio;
      slcTipoServicioActualizar.appendChild(option);
    });

    slcTipoServicioActualizar.value = idServicioSeleccionado;
    $('#slcTipoServicioActualizar').trigger('change');
  } catch (error) {
    console.error("Error al cargar los tipos de servicio:", error);
  }
}

/**
 * Carga los paquetes disponibles para actualizar en un elemento select y establece el precio del paquete seleccionado.
 *
 * @param {number} idServicio - El ID del servicio para buscar los paquetes asociados.
 * @param {number} idPaqueteSeleccionado - El ID del paquete que debe ser seleccionado por defecto.
 * @returns {Promise<void>} Una promesa que se resuelve cuando los paquetes han sido cargados y el precio ha sido establecido.
 */
export async function cargarPaquetesActualizar(idServicio, idPaqueteSeleccionado) {
  const dataPaquetes = await fetchPaquetes(
    `${config.HOST}app/controllers/Paquete.controllers.php?operacion=buscarPaquetePorIdServicio&idServicio=${idServicio}`
  );
  const slcPaquetes = document.getElementById("slcPaquetesActualizar");
  slcPaquetes.innerHTML = '<option value="" disabled selected>Seleccione un paquete</option>';

  const paquetesFiltrados = dataPaquetes.filter(paquete => {
    const servicios = JSON.parse(paquete.id_servicio).id_servicio;
    return servicios.length === 1 && !paquete.inactive_at;
  });

  if (paquetesFiltrados.length === 0) {
    slcPaquetes.appendChild(new Option("No hay paquetes disponibles", "", true, true));
  } else {
    paquetesFiltrados.forEach(({ id_paquete, paquete, precio }) => {
      const option = (new Option(paquete, id_paquete));
      option.setAttribute("data-precio", precio);
      slcPaquetes.appendChild(option);
    });
  }

  slcPaquetes.value = idPaqueteSeleccionado;
  const paqueteSeleccionado = paquetesFiltrados.find(p => p.id_paquete == idPaqueteSeleccionado);
  document.getElementById("txtPrecioActualizar").value = paqueteSeleccionado?.precio || '0';
}

/**
 * Carga y actualiza la lista de paquetes en un elemento select y actualiza el precio del paquete seleccionado.
 *
 * @param {string} tipo - El tipo de paquetes a filtrar (por ejemplo, "duos").
 * @param {string} idPaqueteSeleccionado - El ID del paquete que debe ser seleccionado por defecto.
 * @returns {Promise<void>} - Una promesa que se resuelve cuando los paquetes se han cargado y actualizado.
 */
export async function cargarPaquetesMultiplesActualizar(tipo, idPaqueteSeleccionado) {
  const dataPaquetes = await fetchPaquetes(
    `${config.HOST}app/controllers/Paquete.controllers.php?operacion=listarPaquetes`
  );
  const slcPaquetes = document.getElementById("slcPaquetesActualizar");
  slcPaquetes.innerHTML = '<option value="" disabled selected>Seleccione un paquete</option>';

  const paquetesFiltrados = tipo === "duos"
    ? dataPaquetes.filter(paquete => JSON.parse(paquete.id_servicio).id_servicio.length === 2 && !paquete.inactive_at)
    : [];

  if (paquetesFiltrados.length === 0) {
    slcPaquetes.appendChild(new Option("No hay paquetes disponibles", "", true, true));
  } else {
    paquetesFiltrados.forEach(({ id_paquete, paquete, precio }) => {
      const option = new Option(paquete, id_paquete);
      option.setAttribute("data-precio", precio);
      slcPaquetes.appendChild(option);
    });
  }

  slcPaquetes.value = idPaqueteSeleccionado;

  const paqueteSeleccionado = paquetesFiltrados.find(p => p.id_paquete == idPaqueteSeleccionado);
  document.getElementById("txtPrecioActualizar").value = paqueteSeleccionado?.precio || '0';
}

// Agregar eventos para actualizar los selectores cuando se activan, desactivan, agregan o actualizan servicios
document.addEventListener("servicioActivado", () => cargarServiciosGenerico("#slcTipoServicio", () => {}));
document.addEventListener("servicioDesactivado", () => cargarServiciosGenerico("#slcTipoServicio", () => {}));
document.addEventListener("servicioAgregado", () => cargarServiciosGenerico("#slcTipoServicio", () => {}));
document.addEventListener("servicioActualizado", () => cargarServiciosGenerico("#slcTipoServicio", () => {}));