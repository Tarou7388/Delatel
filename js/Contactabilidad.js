import config from '../env.js';

window.addEventListener('DOMContentLoaded', function () {
  const slcPlanes = document.querySelector("#slcPlanes");
  const txtPrecio = document.querySelector("#txtPrecioContactabilidad");

  (async () => {
    const respuesta = await fetch(
      `${config.HOST}controllers/Contactabilidad.controllers.php?operacion=getPlanes`
    );
    const data = await respuesta.json();

    data.forEach((paquete) => {
      const option = document.createElement("option");
      const id = paquete.id + "-" + paquete.tipo_paquete + "-" + paquete.precio;
      option.value = id;
      option.textContent = paquete.nombre;
      slcPlanes.appendChild(option);
    });
  })();

  slcPlanes.addEventListener("change", function () {
    const selectedValue = slcPlanes.value;
    if (selectedValue) {
      const [id, tipo_paquete, precio] = selectedValue.split("-");
      txtPrecio.value = precio;
    } else {
      txtPrecio.value = "";
    }
  });
});
