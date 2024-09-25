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

  (async()=>{
    const response = await fetch(`${config.HOST}controllers/Contactabilidad.controllers.php?operacion=getPersonas`);
    const data = await response.json();
    const tbody = document.querySelector("#listarPersonasContactabilidad tbody");
    data.forEach((personas)=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `
      <td class="text-center">${personas.id_contactabilidad}</td>
      <td class="text-center">${personas.nombre_contacto}</td>
      <td class="text-center">${personas.telefono}</td>
      <td class="text-center">${personas.fecha_hora_contacto}</td>
      <td class="text-center">${personas.direccion_servicio}</td>
      <td>
        <button class="btn btn-sm btn-primary text-center">Detalles</button>
      </td>
      `;
      tbody.appendChild(tr);
    });
    var tabla = await new DataTable("#listarPersonasContactabilidad",{
      lenguage:{
        url: `${config.HOST}Json/es-Es.json`
      },
      columnDefs:[
        {width:"5%",targets:0},
        {width:"15%",targets:1},
        {width:"10",targets:2},
        {width:"30",targets:3},
        {width:"30",targets:4},
        {width:"10",targets:5},
      ]
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